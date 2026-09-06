/**
 * @file src/lib/scanner-utils.ts
 * @module ScannerUtils
 * @description Sovereign-optimized utility functions for file path classification and scan metrics aggregation.
 */

export interface ScannableFile {
  readonly size?: number;
  readonly [key: string]: unknown;
}

export interface ScanMetrics {
  readonly count: number;
  readonly totalSize: number;
}

/**
 * Precompiled ReadonlySet of critical file extensions for $O(1)$ lookup performance.
 */
const CRITICAL_EXTENSIONS: ReadonlySet<string> = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.md',
  '.json',
  '.config',
]);

/**
 * Determines whether a given file path corresponds to a critical file type
 * based on its extension using zero-allocation string slicing.
 *
 * @param {string} path - The file path to evaluate.
 * @returns {boolean} True if the file extension is recognized as critical.
 */
export const isCriticalFile = (path: string): boolean => {
  if (typeof path !== 'string' || path.length === 0) {
    return false;
  }

  const lastDotIndex = path.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === path.length - 1) {
    return false;
  }

  return CRITICAL_EXTENSIONS.has(path.slice(lastDotIndex));
};

/**
 * Computes aggregate scan metrics for an array of scanned files with peak memory efficiency,
 * strict type safety, and defensive runtime validation using loop unrolling for maximum execution speed.
 *
 * @template T
 * @param {readonly T[]} files - Array of file objects containing an optional size property.
 * @returns {ScanMetrics} An object containing the total file count and cumulative size.
 */
export const formatScanMetrics = <T extends ScannableFile>(files: readonly T[]): ScanMetrics => {
  if (!Array.isArray(files)) {
    return { count: 0, totalSize: 0 };
  }

  let totalSize = 0;
  const count = files.length;
  let i = 0;

  // 4x Loop unrolling to maximize CPU instruction pipelining and reduce branching overhead
  const limit = count - 3;
  while (i < limit) {
    const f0 = files[i];
    const f1 = files[i + 1];
    const f2 = files[i + 2];
    const f3 = files[i + 3];

    if (f0 !== null && typeof f0 === 'object' && typeof f0.size === 'number' && f0.size > 0 && Number.isFinite(f0.size)) {
      totalSize += f0.size;
    }
    if (f1 !== null && typeof f1 === 'object' && typeof f1.size === 'number' && f1.size > 0 && Number.isFinite(f1.size)) {
      totalSize += f1.size;
    }
    if (f2 !== null && typeof f2 === 'object' && typeof f2.size === 'number' && f2.size > 0 && Number.isFinite(f2.size)) {
      totalSize += f2.size;
    }
    if (f3 !== null && typeof f3 === 'object' && typeof f3.size === 'number' && f3.size > 0 && Number.isFinite(f3.size)) {
      totalSize += f3.size;
    }

    i += 4;
  }

  // Handle remaining tail elements
  while (i < count) {
    const file = files[i];
    if (file !== null && typeof file === 'object') {
      const size = file.size;
      if (typeof size === 'number' && size > 0 && Number.isFinite(size)) {
        totalSize += size;
      }
    }
    i++;
  }

  return {
    count,
    totalSize,
  };
};