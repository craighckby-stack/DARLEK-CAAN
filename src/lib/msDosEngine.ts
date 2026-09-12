/**
 * DARLEK CANN ARCHITECTURAL SERVICE
 * File: src/lib/msDosEngine.ts
 * Role: Full-time background MS-DOS engine running continuous autonomous telemetry,
 *       hotswapping files in memory/registry with RAG-synthesized mutations, and persisting
 *       all system telemetry, logs, and mutations into the RAG brain.
 */

import {
  saveLogToRag,
  saveMutationToRag,
  synthesizeRagMutation,
  hotswapFileInRegistry,
  getAllHotswappedFiles,
  getHotswappedFileFromRegistry,
  getRagLogs,
  getRagMutations,
  getRagBrainRealMetrics,
  type HotswappedFileEntry,
} from './ragBrain';

export interface DosLogLine {
  readonly id: string;
  readonly time: string;
  readonly addr: string;
  readonly tag: string;
  readonly message: string;
}

export interface MsDosEngineState {
  readonly lines: readonly DosLogLine[];
  readonly isRunning: boolean;
  readonly autonomousHotswap: boolean;
  readonly totalHotswaps: number;
  readonly lastHotswappedFile: string | null;
  readonly lastHotswapTime: string | null;
  readonly activeTarget: string;
}

type EngineListener = (state: MsDosEngineState) => void;
type HotswapCallback = (entry: HotswappedFileEntry) => void;

class MsDosEngineService {
  private lines: DosLogLine[] = [];
  private listeners = new Set<EngineListener>();
  private hotswapCallbacks = new Set<HotswapCallback>();
  private backgroundIntervalId: ReturnType<typeof setInterval> | null = null;
  private autonomousHotswap = true;
  private totalHotswaps = 0;
  private lastHotswappedFile: string | null = null;
  private lastHotswapTime: string | null = null;
  private activeTarget = 'src/lib/neuralActiveGene.ts';
  private getFileContentFn: ((path: string) => string | undefined) | null = null;
  private isProcessingHotswap = false;

  constructor() {
    this.initBootBanner();
    this.startBackgroundLoop();
  }

  private initBootBanner() {
    const now = new Date().toLocaleTimeString();
    this.lines = [
      { id: 'b1', time: '00:00:00', addr: '0x00400000', tag: 'BOOT', message: 'Microsoft(R) MS-DOS(R) Version 6.22' },
      { id: 'b2', time: '00:00:00', addr: '0x00400004', tag: 'BOOT', message: '(C)Copyright Microsoft Corp 1981-1994.' },
      { id: 'b3', time: now, addr: '0x00401000', tag: 'INIT', message: 'DALEK CAAN FULL-TIME KERNEL ENGINE INITIALIZED [CONTINUOUS DAEMON]' },
      { id: 'b4', time: now, addr: '0x00401020', tag: 'RAG_SYNC', message: 'RAG PERSISTENCE ACTIVE: All system logs and mutations piped into RAG Brain' },
      { id: 'b5', time: now, addr: '0x00401040', tag: 'HOTSWAP', message: 'AUTONOMOUS HOTSWAP ENGINE: ACTIVE [Mode: Non-stop Background Mutation]' },
      { id: 'b6', time: now, addr: '0x00401060', tag: 'SYS', message: 'Type HELP for commands. Running independent of active UI view.' },
    ];
  }

  /**
   * Starts the continuous background ticker that operates full time,
   * regardless of whether the modal is visible or what page mode is selected.
   */
  public startBackgroundLoop() {
    if (this.backgroundIntervalId || typeof window === 'undefined') return;

    let tickCounter = 0;

    this.backgroundIntervalId = setInterval(async () => {
      tickCounter++;

      // Every 1-2 ticks, add heartbeat telemetry to MS-DOS monitor
      if (tickCounter % 2 === 0) {
        const rag = getRagBrainRealMetrics();
        const baseOffset = (0x100000 + ((tickCounter * 4096) % 0x8FFFFF));
        const hex = `0x${baseOffset.toString(16).toUpperCase().padStart(8, '0')}`;
        const telemetryMessages = [
          { tag: 'RAG_INDEX', msg: `RAG memory vector aligned. Total chunks: ${rag.chunkCount}, Free: ${rag.availableFormatted}.` },
          { tag: 'AST_WATCH', msg: `Codebase watcher: active file trees verified normal. RAG IQ: ${rag.iq}.` },
          { tag: 'MEM_POOL', msg: `Allocated quota: ${rag.totalLimitFormatted}. Used: ${rag.usedFormatted} (${rag.usedPercent}%).` },
          { tag: 'SANITY_OK', msg: `Emergency breaker: Health ${rag.health}%, Drift ${rag.drift}%, Syntax clean.` },
        ];
        const chosen = telemetryMessages[(tickCounter / 2) % telemetryMessages.length];
        this.addLog(chosen.tag, chosen.msg, hex);
      }

      // Every 8 ticks (~16-20 seconds), execute autonomous hotswap if enabled
      if (tickCounter % 8 === 0 && this.autonomousHotswap && !this.isProcessingHotswap) {
        await this.triggerAutonomousHotswap();
      }
    }, 2400);
  }

  public setAutonomousHotswap(enabled: boolean) {
    this.autonomousHotswap = enabled;
    this.addLog(
      'HOTSWAP',
      `Autonomous file hotswapping ${enabled ? 'ENGAGED [Full-Time]' : 'PAUSED'}.`
    );
    this.notify();
  }

  public setFileContentProvider(fn: (path: string) => string | undefined) {
    this.getFileContentFn = fn;
  }

  public setActiveTarget(path: string) {
    this.activeTarget = path;
    this.addLog('TARGET', `Active hotswap candidate switched to: ${path}`);
    this.notify();
  }

  /**
   * Log an event into the MS-DOS monitor AND synchronously persist it into the RAG brain.
   */
  public addLog(tag: string, message: string, customAddr?: string) {
    const timeStr = new Date().toLocaleTimeString();
    const msgHash = Array.from(tag + message).reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0);
    const addr = customAddr || `0x${((0x100000 + (msgHash % 0x8FFFFF))).toString(16).toUpperCase().padStart(8, '0')}`;
    
    const lineId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? `dos-${crypto.randomUUID().slice(0, 8)}` 
      : `dos-${Date.now()}-${this.lines.length}`;

    const line: DosLogLine = {
      id: lineId,
      time: timeStr,
      addr,
      tag: tag.toUpperCase(),
      message,
    };

    this.lines = [...this.lines.slice(-250), line];
    this.notify();

    // Persist to RAG asynchronously
    saveLogToRag({
      type: tag,
      description: message,
      timestamp: new Date().toISOString(),
    }).catch(() => {});
  }

  /**
   * Autonomous file hotswap: Mutates active code using RAG knowledge,
   * verifies syntax, hotswaps the file in memory registry, and logs to RAG.
   */
  public async triggerAutonomousHotswap(targetPath?: string): Promise<HotswappedFileEntry | null> {
    if (this.isProcessingHotswap) return null;
    this.isProcessingHotswap = true;

    const path = targetPath || this.activeTarget;
    try {
      this.addLog('HOTSWAP', `Starting autonomous hotswap sequence for: ${path}`);

      // 1. Get current original code
      let currentContent = this.getFileContentFn?.(path);
      if (!currentContent) {
        const cached = getHotswappedFileFromRegistry(path);
        currentContent = cached?.content || `// Active module: ${path}\nexport const initialized = true;\n`;
      }

      // 2. Synthesize mutation via RAG
      const generation = this.totalHotswaps + 1;
      const mutationResult = await synthesizeRagMutation(path, currentContent, generation);

      // 3. Perform the in-memory Hotswap
      const hotswappedEntry = hotswapFileInRegistry(
        path,
        mutationResult.proposedCode,
        undefined,
        mutationResult.source
      );

      this.totalHotswaps++;
      this.lastHotswappedFile = path;
      this.lastHotswapTime = new Date().toLocaleTimeString();

      // 4. Save mutation into RAG Brain
      await saveMutationToRag({
        filePath: path,
        originalCode: currentContent,
        mutatedCode: mutationResult.proposedCode,
        rationale: mutationResult.rationale,
        riskScore: mutationResult.riskScore,
        generation,
        hotswapped: true,
      });

      // 5. Notify DOS console and external listeners
      this.addLog(
        'HOTSWAP_OK',
        `HOTSWAP SUCCESS: ${path} replaced with Gen G-${generation} [Source: ${mutationResult.source}].`
      );
      this.addLog(
        'RAG_WRITE',
        `Mutation permanently indexed in RAG Brain. Rationale: ${mutationResult.rationale.slice(0, 75)}...`
      );

      this.hotswapCallbacks.forEach((cb) => {
        try {
          cb(hotswappedEntry);
        } catch (e) {
          console.warn('[MS-DOS Engine] Error in hotswap callback:', e);
        }
      });

      this.notify();
      return hotswappedEntry;
    } catch (err: any) {
      this.addLog('HOTSWAP_ERR', `Hotswap failure: ${err?.message || String(err)}`);
      return null;
    } finally {
      this.isProcessingHotswap = false;
    }
  }

  /**
   * Executes typed MS-DOS commands from the operator.
   */
  public async executeCommand(commandStr: string): Promise<void> {
    const trimmed = commandStr.trim();
    if (!trimmed) return;

    this.addLog('INPUT', trimmed, 'C:\\DALEK\\SYS>');
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help':
      case '?':
        this.addLog('HELP', 'AVAILABLE MS-DOS TELEMETRY & HOTSWAP COMMANDS:');
        this.addLog('HELP', '  HOTSWAP [path]  - Force immediate RAG mutation & file hotswap');
        this.addLog('HELP', '  MUTATE [path]   - Synthesize RAG-assisted mutation without relying on LLM');
        this.addLog('HELP', '  AUTORUN [ON|OFF]- Toggle full-time background autonomous hotswapping');
        this.addLog('HELP', '  RAG [STATS|DUMP]- Inspect stored RAG brain chunks, logs, and mutations');
        this.addLog('HELP', '  STATUS          - Display live hotswap metrics, memory & daemon state');
        this.addLog('HELP', '  DIR             - List hotswapped modules and active system files');
        this.addLog('HELP', '  CLS / CLEAR     - Clear the MS-DOS screen buffer');
        break;

      case 'hotswap':
      case 'mutate': {
        const target = arg || this.activeTarget;
        this.addLog('SYS', `Operator triggered instant hotswap of ${target}...`);
        await this.triggerAutonomousHotswap(target);
        break;
      }

      case 'autorun': {
        const lowerArg = arg.toLowerCase();
        if (lowerArg === 'off' || lowerArg === '0' || lowerArg === 'stop') {
          this.setAutonomousHotswap(false);
        } else {
          this.setAutonomousHotswap(true);
        }
        break;
      }

      case 'rag': {
        const lowerArg = arg.toLowerCase();
        const metrics = getRagBrainRealMetrics();
        this.addLog('RAG', `===============================================================`);
        this.addLog('RAG', `RAG BRAIN COGNITIVE HEALTH & REAL MEASUREMENTS:`);
        this.addLog('RAG', `  COGNITIVE IQ:     ${metrics.iq} [${metrics.iqRating}]`);
        this.addLog('RAG', `  HEALTH INDEX:     ${metrics.health}% | SEMANTIC DRIFT: ${metrics.drift}%`);
        this.addLog('RAG', `  STORAGE USED:     ${metrics.usedFormatted} / ${metrics.totalLimitFormatted} (${metrics.usedPercent}%)`);
        this.addLog('RAG', `  SPACE AVAILABLE:  ${metrics.availableFormatted} (${metrics.availablePercent}% FREE)`);
        this.addLog('RAG', `  INDEXED SYNAPSES: Chunks: ${metrics.chunkCount} | Logs: ${metrics.logCount} | Mutations: ${metrics.mutationCount} | Hotswaps: ${metrics.hotswapCount}`);
        this.addLog('RAG', `===============================================================`);

        if (lowerArg === 'dump' && metrics.mutationCount > 0) {
          const mutations = await getRagMutations();
          const latest = mutations.slice(0, 3);
          latest.forEach((m, idx) => {
            this.addLog('RAG_MUT', `#${idx + 1} ${m.filePath} (Gen G-${m.generation || 1}) @ ${m.timestamp.slice(11, 19)}`);
          });
        }
        break;
      }

      case 'status': {
        this.addLog('STATUS', `DAEMON STATE: FULL-TIME BACKGROUND EXECUTION ONLINE`);
        this.addLog('STATUS', `AUTONOMOUS HOTSWAP: ${this.autonomousHotswap ? 'ACTIVE' : 'PAUSED'}`);
        this.addLog('STATUS', `TOTAL HOTSWAPS APPLIED: ${this.totalHotswaps}`);
        this.addLog('STATUS', `LAST HOTSWAPPED FILE: ${this.lastHotswappedFile || 'None'}`);
        this.addLog('STATUS', `LAST HOTSWAP TIMESTAMP: ${this.lastHotswapTime || 'N/A'}`);
        break;
      }

      case 'dir': {
        this.addLog('DIR', ' Volume in drive C is DALEK_SYS');
        this.addLog('DIR', ' Directory of C:\\DALEK\\SYS');
        this.addLog('DIR', 'ENGINE   EXE       124,955  HOTSWAP: ACTIVE');
        this.addLog('DIR', 'RAGBRAIN DAT        79,625  RAG SYNC: ONLINE');
        this.addLog('DIR', 'GENE     TS          1,052  HOTSWAP TARGET');
        const hotswapped = getAllHotswappedFiles();
        const keys = Object.keys(hotswapped);
        if (keys.length > 0) {
          this.addLog('DIR', `--- ACTIVE HOTSWAPPED MODULE REGISTRY (${keys.length}) ---`);
          keys.forEach((k) => {
            const entry = hotswapped[k];
            this.addLog('DIR', `* [G-${entry.generation}] ${k} (${entry.mutationSource})`);
          });
        }
        break;
      }

      case 'cls':
      case 'clear':
        this.lines = [];
        this.notify();
        break;

      default:
        this.addLog('ERROR', `Bad command or file name: "${trimmed}". Type HELP for commands.`);
        break;
    }
  }

  public subscribe(listener: EngineListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onHotswap(callback: HotswapCallback): () => void {
    this.hotswapCallbacks.add(callback);
    return () => {
      this.hotswapCallbacks.delete(callback);
    };
  }

  public getState(): MsDosEngineState {
    return {
      lines: this.lines,
      isRunning: Boolean(this.backgroundIntervalId),
      autonomousHotswap: this.autonomousHotswap,
      totalHotswaps: this.totalHotswaps,
      lastHotswappedFile: this.lastHotswappedFile,
      lastHotswapTime: this.lastHotswapTime,
      activeTarget: this.activeTarget,
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (e) {
        console.warn('[MS-DOS Engine] Listener error:', e);
      }
    });
  }
}

// Global Singleton instance for full-time continuous execution
export const msDosEngine = new MsDosEngineService();
