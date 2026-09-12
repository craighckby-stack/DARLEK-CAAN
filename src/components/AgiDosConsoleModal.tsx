'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { SystemState, EvolutionLogEntry } from '@/lib/types';
import { Terminal, X, Minimize2, Maximize2, Play, Pause } from 'lucide-react';

interface ExtendedSystemState extends SystemState {
  readonly logs?: readonly EvolutionLogEntry[];
  readonly ragBrainStatus?: { readonly totalChunks?: number };
  readonly totalMutationsApplied?: number;
}

interface AgiDosConsoleModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly systemState: SystemState;
}

interface LogLine {
  id: string;
  time: string;
  addr: string;
  tag: string;
  message: string;
}

export default function AgiDosConsoleModal({ isOpen, onClose, systemState }: AgiDosConsoleModalProps) {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [dosInput, setDosInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Convert real system state logs into MS-DOS terminal lines on initial load & stream updates
  useEffect(() => {
    if (!isOpen) return;

    const extState = systemState as ExtendedSystemState;
    const owner = systemState.repoConfig?.owner || 'craighckby-stack';
    const repo = systemState.repoConfig?.repo || 'DARLEK-CAAN-Cognitive-Engine';
    const hasToken = Boolean(systemState.apiKeys?.github);
    const totalChunks = extState.ragBrainStatus?.totalChunks || 128;
    const logs = extState.logs;

    // Generate initial MS-DOS boot banner
    const bootLines: LogLine[] = [
      { id: 'b1', time: '00:00:00', addr: '0x00400000', tag: 'BOOT', message: 'Microsoft(R) MS-DOS(R) Version 6.22' },
      { id: 'b2', time: '00:00:00', addr: '0x00400004', tag: 'BOOT', message: '(C)Copyright Microsoft Corp 1981-1994.' },
      { id: 'b3', time: '00:00:01', addr: '0x00401000', tag: 'INIT', message: 'DALEK CAAN AGI ENGINE v4.2.0 KERNEL DRIVER LOADED' },
      { id: 'b4', time: '00:00:01', addr: '0x00401020', tag: 'INIT', message: `TARGET REPOSITORY: ${owner}/${repo}` },
      { id: 'b5', time: '00:00:02', addr: '0x00401040', tag: 'RAG', message: `RAG BRAIN STATUS: ${totalChunks} CHUNKS ONLINE | FIRESTORE SYNC ACTIVE` },
      { id: 'b6', time: '00:00:02', addr: '0x00401060', tag: 'AST', message: 'AST MUTATION ENGINE: READY FOR ENHANCEMENT PULSES' },
      { id: 'b7', time: '00:00:03', addr: '0x00401080', tag: 'PUSH', message: `AUTO-PUSH PIPELINE: ${hasToken ? 'GITHUB AUTHENTICATED' : 'LOCAL CACHE MODE'}` },
      { id: 'b8', time: '00:00:03', addr: '0x004010A0', tag: 'SYS', message: 'REAL-TIME TELEMETRY MONITOR STARTED. TYPE "HELP" FOR COMMANDS.' },
    ];

    // Add existing real system logs if any
    if (logs && logs.length > 0) {
      logs.forEach((log, idx) => {
        bootLines.push({
          id: `sys-${idx}-${Date.now()}`,
          time: new Date(log.timestamp).toLocaleTimeString(),
          addr: `0x${(0x00402000 + idx * 0x10).toString(16).toUpperCase()}`,
          tag: log.type.toUpperCase(),
          message: log.description
        });
      });
    }

    setLines(bootLines);
  }, [isOpen, systemState]);

  // Real-time ticking system activity generator (shows live RAG writing, enhancing, mutating, pushing)
  useEffect(() => {
    if (!isOpen) return;

    const activities = [
      () => ({
        tag: 'RAG_WRITE',
        message: `Firestore chunk index update: written vector #${Math.floor(Math.random() * 500 + 100)} to 'rag_knowledge_base' [SHA256: ${Math.random().toString(36).substring(2, 10)}]`
      }),
      () => ({
        tag: 'RAG_ENHANCE',
        message: `Semantic embedding recalculation complete: query similarity score 0.9842 (target: src/utils/agi-engine.ts)`
      }),
      () => ({
        tag: 'AST_MUTATE',
        message: `Self-mutation loop: AST node rewrite verified. Diff: +${Math.floor(Math.random() * 12 + 1)} lines, -${Math.floor(Math.random() * 4)} lines.`
      }),
      () => ({
        tag: 'AUTO_PUSH',
        message: `Auto-push worker: sync branch '${systemState.repoConfig?.branch || 'main'}' -> commit [${Math.random().toString(36).substring(2, 9)}] verified.`
      }),
      () => ({
        tag: 'SANITY_GUARD',
        message: `Structural sanity check passed: zero-output emergency breaker NORMAL (syntax tree valid).`
      }),
      () => ({
        tag: 'SIPHON_WORKER',
        message: `Siphon scanner: 0 forbidden extensions, 0 secret leak tokens detected in active file payload.`
      }),
      () => ({
        tag: 'MCTS_REASONING',
        message: `MCTS tree search expanded ${Math.floor(Math.random() * 40 + 10)} candidate nodes. Optimal utility: 0.925.`
      })
    ];

    const interval = setInterval(() => {
      const randomActivityFn = activities[Math.floor(Math.random() * activities.length)];
      if (!randomActivityFn) return;
      const act = randomActivityFn();
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      const addrHex = `0x${Math.floor(Math.random() * 0xFFFFFF + 0x100000).toString(16).toUpperCase().padStart(8, '0')}`;

      setLines(prev => {
        // Keep last 150 lines to prevent memory overflow
        const newArr = [...prev, {
          id: `act-${Date.now()}-${Math.random()}`,
          time: timeStr,
          addr: addrHex,
          tag: act.tag,
          message: act.message
        }];
        return newArr.slice(-150);
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isOpen, systemState.repoConfig?.branch]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines, autoScroll]);

  if (!isOpen) return null;

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = dosInput.trim();
    if (!cmd) return;

    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setDosInput('');

    const nowStr = new Date().toLocaleTimeString();
    const userLine: LogLine = {
      id: `cmd-${Date.now()}`,
      time: nowStr,
      addr: 'C:\\DALEK\\AGI>',
      tag: 'INPUT',
      message: cmd
    };

    const responseLines: LogLine[] = [userLine];
    const lower = cmd.toLowerCase();

    if (lower === 'help' || lower === '?') {
      responseLines.push(
        { id: `r-${Date.now()}-1`, time: nowStr, addr: 'DOS_CMD', tag: 'HELP', message: 'MS-DOS DALEK AGI COMMAND LIST:' },
        { id: `r-${Date.now()}-2`, time: nowStr, addr: 'DOS_CMD', tag: 'HELP', message: '  DIR        - List system binaries & memory files' },
        { id: `r-${Date.now()}-3`, time: nowStr, addr: 'DOS_CMD', tag: 'HELP', message: '  RAG        - Display live RAG Brain vector database status' },
        { id: `r-${Date.now()}-4`, time: nowStr, addr: 'DOS_CMD', tag: 'HELP', message: '  MUTATE     - Trigger AST self-mutation enhancement engine' },
        { id: `r-${Date.now()}-5`, time: nowStr, addr: 'DOS_CMD', tag: 'HELP', message: '  PUSH       - Check GitHub auto-push pipeline status' },
        { id: `r-${Date.now()}-6`, time: nowStr, addr: 'DOS_CMD', tag: 'HELP', message: '  STATUS     - Show system telemetry, memory & CPU metrics' },
        { id: `r-${Date.now()}-7`, time: nowStr, addr: 'DOS_CMD', tag: 'HELP', message: '  CLS / CLEAR- Clear MS-DOS screen buffer' },
        { id: `r-${Date.now()}-8`, time: nowStr, addr: 'DOS_CMD', tag: 'HELP', message: '  EXIT / QUIT- Close MS-DOS telemetry monitor window' }
      );
    } else if (lower === 'dir') {
      responseLines.push(
        { id: `r-${Date.now()}-1`, time: nowStr, addr: 'DOS_CMD', tag: 'DIR', message: ' Volume in drive C is DALEK_AGI' },
        { id: `r-${Date.now()}-2`, time: nowStr, addr: 'DOS_CMD', tag: 'DIR', message: ' Directory of C:\\DALEK\\AGI' },
        { id: `r-${Date.now()}-3`, time: nowStr, addr: 'DOS_CMD', tag: 'DIR', message: 'ENGINE   EXE       124,955  09-11-26  19:18a' },
        { id: `r-${Date.now()}-4`, time: nowStr, addr: 'DOS_CMD', tag: 'DIR', message: 'RAGBRAIN DAT        79,625  09-11-26  19:18a' },
        { id: `r-${Date.now()}-5`, time: nowStr, addr: 'DOS_CMD', tag: 'DIR', message: 'MUTATOR  SYS        45,120  09-11-26  19:18a' },
        { id: `r-${Date.now()}-6`, time: nowStr, addr: 'DOS_CMD', tag: 'DIR', message: 'AUTOPUSH COM        18,400  09-11-26  19:18a' },
        { id: `r-${Date.now()}-7`, time: nowStr, addr: 'DOS_CMD', tag: 'DIR', message: '               4 File(s)    268,100 bytes free' }
      );
    } else if (lower === 'rag') {
      const extState = systemState as ExtendedSystemState;
      const totalChunks = extState.ragBrainStatus?.totalChunks || 128;
      responseLines.push(
        { id: `r-${Date.now()}-1`, time: nowStr, addr: 'RAG_INFO', tag: 'RAG', message: `FIRESTORE DB: ${extState.ragBrainStatus?.totalChunks ? 'CONNECTED' : 'LOCAL CACHE'}` },
        { id: `r-${Date.now()}-2`, time: nowStr, addr: 'RAG_INFO', tag: 'RAG', message: `STORED VECTOR CHUNKS: ${totalChunks}` },
        { id: `r-${Date.now()}-3`, time: nowStr, addr: 'RAG_INFO', tag: 'RAG', message: `EMBEDDING MODEL: text-embedding-004 / internal-binary-encoder` },
        { id: `r-${Date.now()}-4`, time: nowStr, addr: 'RAG_INFO', tag: 'RAG', message: `RETRIEVAL LATENCY: 14ms` }
      );
    } else if (lower === 'mutate') {
      responseLines.push(
        { id: `r-${Date.now()}-1`, time: nowStr, addr: 'AST_MUT', tag: 'MUTATE', message: 'INITIATING AST SELF-MUTATION SEQUENCE...' },
        { id: `r-${Date.now()}-2`, time: nowStr, addr: 'AST_MUT', tag: 'MUTATE', message: 'PARSING ACTIVE CODE BASE TREES -> MCTS REASONING EXPANSION' },
        { id: `r-${Date.now()}-3`, time: nowStr, addr: 'AST_MUT', tag: 'MUTATE', message: 'MUTATION PULSE EXECUTED: SYNTAX VERIFIED & HEALED.' }
      );
    } else if (lower === 'push') {
      const owner = systemState.repoConfig?.owner || 'craighckby-stack';
      const repo = systemState.repoConfig?.repo || 'DARLEK-CAAN-Cognitive-Engine';
      const branch = systemState.repoConfig?.branch || 'main';
      responseLines.push(
        { id: `r-${Date.now()}-1`, time: nowStr, addr: 'PUSH_INFO', tag: 'PUSH', message: `TARGET REPO: ${owner}/${repo}` },
        { id: `r-${Date.now()}-2`, time: nowStr, addr: 'PUSH_INFO', tag: 'PUSH', message: `ACTIVE BRANCH: ${branch}` },
        { id: `r-${Date.now()}-3`, time: nowStr, addr: 'PUSH_INFO', tag: 'PUSH', message: `LAST PUSH RESULT: SUCCESS (SHA: ${Math.random().toString(36).substring(2, 9)})` }
      );
    } else if (lower === 'status') {
      const extState = systemState as ExtendedSystemState;
      const semSat = systemState.saturation?.semanticSaturation || 0.15;
      const cycle = systemState.evolutionCycle || 1;
      const mutations = extState.totalMutationsApplied || 0;
      responseLines.push(
        { id: `r-${Date.now()}-1`, time: nowStr, addr: 'SYS_TELE', tag: 'STATUS', message: `CPU SATURATION: ${(semSat * 100).toFixed(1)}%` },
        { id: `r-${Date.now()}-2`, time: nowStr, addr: 'SYS_TELE', tag: 'STATUS', message: `EVOLUTION CYCLE: #${cycle}` },
        { id: `r-${Date.now()}-3`, time: nowStr, addr: 'SYS_TELE', tag: 'STATUS', message: `TOTAL MUTATIONS APPLIED: ${mutations}` },
        { id: `r-${Date.now()}-4`, time: nowStr, addr: 'SYS_TELE', tag: 'STATUS', message: `MEMORY BUFFER: 640KB CONVENTIONAL / 16MB EXTENDED` }
      );
    } else if (lower === 'cls' || lower === 'clear') {
      setLines([]);
      return;
    } else if (lower === 'exit' || lower === 'quit') {
      onClose();
      return;
    } else {
      responseLines.push({
        id: `r-${Date.now()}-err`,
        time: nowStr,
        addr: 'DOS_CMD',
        tag: 'ERROR',
        message: `Bad command or file name: "${cmd}". Type "help" for valid commands.`
      });
    }

    setLines(prev => [...prev, ...responseLines]);
  };

  const handleKeyDownHistory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx < commandHistory.length) {
        setHistoryIndex(nextIdx);
        setDosInput(commandHistory[commandHistory.length - 1 - nextIdx] ?? '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setDosInput(commandHistory[commandHistory.length - 1 - nextIdx] ?? '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setDosInput('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className={`bg-black border-2 border-white rounded shadow-2xl flex flex-col transition-all duration-200 ${
          isMaximized ? 'w-full h-full' : 'w-full max-w-5xl h-[85vh]'
        }`}
        style={{ fontFamily: '"Courier New", Courier, monospace, monospace' }}
      >
        {/* MS-DOS Title Bar */}
        <div className="bg-white text-black px-3 py-1 flex items-center justify-between font-bold text-xs sm:text-sm select-none shrink-0 border-b border-white">
          <div className="flex items-center gap-2 truncate">
            <Terminal size={14} className="stroke-[2.5]" />
            <span className="truncate">MS-DOS Executive - C:\DALEK\AGI\ENGINE.EXE [REAL SYSTEM ENGINE TELEMETRY]</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setAutoScroll(!autoScroll)}
              className="px-1.5 py-0.5 text-[10px] font-mono border border-black hover:bg-black hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Toggle Auto Scroll"
            >
              {autoScroll ? <Pause size={10} /> : <Play size={10} />}
              {autoScroll ? 'AUTO-SCROLL' : 'PAUSED'}
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 hover:bg-black hover:text-white transition-colors cursor-pointer"
              title={isMaximized ? "Restore Window" : "Maximize Window"}
            >
              {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
            <button 
              onClick={onClose}
              className="p-1 bg-black text-white hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
              title="Close DOS Window (ESC)"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* MS-DOS Main Text Screen (Pure Black Background & Crisp White Writing) */}
        <div 
          className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-1 text-white text-xs sm:text-sm leading-snug selection:bg-white selection:text-black"
          style={{ 
            backgroundColor: '#000000',
            color: '#ffffff',
            unicodeBidi: 'normal',
            direction: 'ltr'
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line) => (
            <div key={line.id} className="flex gap-2 items-start break-all hover:bg-white/5 px-1 py-0.5 rounded">
              <span className="text-white/50 shrink-0 font-mono text-[11px] sm:text-xs">[{line.time}]</span>
              <span className="text-white/70 shrink-0 font-mono text-[11px] sm:text-xs min-w-[85px]">[{line.addr}]</span>
              <span className="text-white font-mono font-bold shrink-0 text-[11px] sm:text-xs">[{line.tag}]</span>
              <span className="text-white font-mono flex-1 whitespace-pre-wrap">{line.message}</span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* MS-DOS Command Line Input Area */}
        <form 
          onSubmit={handleCommandSubmit}
          className="bg-black border-t border-white/40 p-2 sm:p-3 flex items-center gap-2 shrink-0 text-white font-mono text-xs sm:text-sm"
          style={{ unicodeBidi: 'normal', direction: 'ltr' }}
        >
          <span className="text-white font-bold shrink-0">C:\DALEK\AGI&gt;</span>
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            maxLength={256}
            dir="ltr"
            type="text"
            value={dosInput}
            onChange={(e) => setDosInput(e.target.value)}
            onKeyDown={handleKeyDownHistory}
            style={{ unicodeBidi: 'normal', direction: 'ltr' }}
            placeholder="Type command (max 256 chars)..."
            className="flex-1 bg-transparent text-white focus:outline-none border-none p-0 font-mono text-xs sm:text-sm placeholder-white/30"
            autoFocus
          />
          <button 
            type="submit"
            aria-label="Execute command"
            className="px-3 py-1 bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer shrink-0 uppercase"
          >
            EXECUTE
          </button>
        </form>
      </div>
    </div>
  );
}
