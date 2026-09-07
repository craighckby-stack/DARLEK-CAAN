import { useState, useRef, useCallback, useEffect, startTransition, Dispatch, SetStateAction } from 'react';
import { sanitizeContent, Finding, isSkippableFile } from '@/lib/scanner';
import JSZip from 'jszip';

export interface FolderScanFileResult {
  readonly file: string;
  readonly findings: readonly Finding[];
  readonly content: string;
  readonly sanitized: string;
  readonly size: number;
}

export interface UseFolderScannerReturn {
  readonly results: readonly FolderScanFileResult[];
  readonly isScanning: boolean;
  readonly progress: number;
  readonly currentFile: string;
  readonly statusMessage: string;
  readonly filesScanned: number;
  readonly filesSkipped: number;
  readonly scanDuration: number;
  readonly scanFileList: (fileList: readonly File[]) => Promise<void>;
  readonly stopScan: () => void;
  readonly downloadSanitizedZip: () => Promise<void>;
  readonly setResults: Dispatch<SetStateAction<FolderScanFileResult[]>>;
}

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const TIMER_INTERVAL_MS = 1000;
const YIELD_INTERVAL_ITERATIONS = 40;
const BINARY_CHECK_LENGTH = 1000;

export function useFolderScanner(): UseFolderScannerReturn {
  const [results, setResults] = useState<FolderScanFileResult[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [filesScanned, setFilesScanned] = useState<number>(0);
  const [filesSkipped, setFilesSkipped] = useState<number>(0);
  const [scanDuration, setScanDuration] = useState<number>(0);

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearTimer = useCallback((): void => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isScanning) {
      timerRef.current = setInterval(() => {
        if (startTimeRef.current > 0) {
          setScanDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, TIMER_INTERVAL_MS);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isScanning, clearTimer]);

  const stopScan = useCallback((): void => {
    if (abortControllerRef.current !== null) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsScanning(false);
    setStatusMessage('Scan aborted by user.');
  }, []);

  const resetScanState = useCallback((totalFiles: number): void => {
    setIsScanning(true);
    setResults([]);
    setProgress(0);
    setFilesScanned(0);
    setFilesSkipped(0);
    setScanDuration(0);
    setStatusMessage(`Preparing ${totalFiles} files for local scanning...`);
    startTimeRef.current = Date.now();
    abortControllerRef.current = new AbortController();
  }, []);

  const processFileItem = useCallback(async (
    file: File,
    relativePath: string,
    accumulatedResults: FolderScanFileResult[]
  ): Promise<{ readonly scannedIncrement: number; readonly skippedIncrement: number; readonly hasFinding: boolean }> => {
    if (isSkippableFile(relativePath) || file.size > MAX_FILE_SIZE) {
      return { scannedIncrement: 0, skippedIncrement: 1, hasFinding: false };
    }

    try {
      const textContent = await file.text();

      if (textContent.slice(0, BINARY_CHECK_LENGTH).includes('\0')) {
        return { scannedIncrement: 0, skippedIncrement: 1, hasFinding: false };
      }

      const { sanitized, findings } = sanitizeContent(textContent);

      if (findings.length > 0) {
        accumulatedResults.push({
          file: relativePath,
          findings,
          content: textContent,
          sanitized,
          size: file.size,
        });

        startTransition(() => {
          setResults([...accumulatedResults]);
        });
      }

      return { scannedIncrement: 1, skippedIncrement: 0, hasFinding: findings.length > 0 };
    } catch (fileError) {
      console.error(`Failed to read file: ${relativePath}`, fileError);
      return { scannedIncrement: 0, skippedIncrement: 1, hasFinding: false };
    }
  }, []);

  const scanFileList = useCallback(async (fileList: readonly File[]): Promise<void> => {
    if (!Array.isArray(fileList) || fileList.length === 0) {
      setStatusMessage('No files provided for scanning.');
      return;
    }

    resetScanState(fileList.length);

    const accumulatedResults: FolderScanFileResult[] = [];
    let scannedCount = 0;
    let skippedCount = 0;
    const totalFiles = fileList.length;

    try {
      for (let index = 0; index < totalFiles; index++) {
        if (abortControllerRef.current?.signal.aborted === true) {
          break;
        }

        const file = fileList[index];
        if (!file) continue;

        const relativePath = file.webkitRelativePath || file.name;
        setCurrentFile(relativePath);

        const progressPercent = Math.round(((index + 1) / totalFiles) * 100);
        setProgress(progressPercent);

        const { scannedIncrement, skippedIncrement } = await processFileItem(
          file,
          relativePath,
          accumulatedResults
        );

        scannedCount += scannedIncrement;
        skippedCount += skippedIncrement;

        if (scannedIncrement > 0) setFilesScanned(scannedCount);
        if (skippedIncrement > 0) setFilesSkipped(skippedCount);

        if (index > 0 && index % YIELD_INTERVAL_ITERATIONS === 0) {
          await new Promise<void>((resolve) => setTimeout(resolve, 0));
        }
      }
    } catch (error) {
      console.error('Critical error during folder scan execution:', error);
      setStatusMessage('An unexpected error occurred during the scan.');
    } finally {
      setIsScanning(false);
      abortControllerRef.current = null;
      const totalFindings = accumulatedResults.reduce((acc, result) => acc + result.findings.length, 0);
      setStatusMessage(`Scan complete. Found ${totalFindings} secrets across ${accumulatedResults.length} files.`);
    }
  }, [resetScanState, processFileItem]);

  const downloadSanitizedZip = useCallback(async (): Promise<void> => {
    if (results.length === 0) return;

    try {
      const zipInstance = new JSZip();
      
      for (const result of results) {
        if (typeof result?.file === 'string' && result.file.length > 0) {
          zipInstance.file(result.file, result.sanitized);
        }
      }

      const zipBlob = await zipInstance.generateAsync({ type: 'blob' });
      const objectUrl = URL.createObjectURL(zipBlob);
      const downloadAnchor = document.createElement('a');

      downloadAnchor.href = objectUrl;
      downloadAnchor.download = `sanitized-project-${Date.now()}.zip`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Failed to generate or download sanitized ZIP archive:', error);
    }
  }, [results]);

  return {
    results,
    isScanning,
    progress,
    currentFile,
    statusMessage,
    filesScanned,
    filesSkipped,
    scanDuration,
    scanFileList,
    stopScan,
    downloadSanitizedZip,
    setResults,
  };
}