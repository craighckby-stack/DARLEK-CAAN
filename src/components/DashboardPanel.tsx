'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import StatusBar from './StatusBar';
import SaturationMetricsPanel from './SaturationMetrics';
import EvolutionLog from './EvolutionLog';
import DebateChamber from './DebateChamber';
import MutationHistoryPanel from './MutationHistoryPanel';
import type { SystemState, EvolutionLogEntry, DebateAgent, AgentVote } from '@/lib/types';
import { COLORS } from '@/lib/constants';
import { Cpu, RotateCw, GitCommit, AlertCircle, CheckCircle2, HeartPulse, Activity } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { safeResponseJson } from '@/lib/safe-json';

interface DashboardPanelProps {
  systemState: SystemState;
  logEntries: EvolutionLogEntry[];
  overallHealth: 'healthy' | 'warning' | 'critical';
  debateAgents: DebateAgent[];
  onToggleDebateAgent?: (agentId: string) => void;
  onSelectAllDebateAgents?: (active: boolean) => void;
  debateTopic: string;
  debateActive: boolean;
  debateVotes?: AgentVote[];
  debateConsensus?: string;
  rejectionCount?: number;
  brainSessionId?: string;
  historyRefreshTrigger?: number;
  isLoading?: boolean;
  batchMode?: boolean;
  batchProgress?: number;
  batchQueueLength?: number;
  activeFilePath?: string;
  mutationsApplied?: number;
  onBulkCommit?: () => void;
  bulkCommitStatus?: 'idle' | 'committing' | 'success' | 'error';
  userReposCount?: number;
  debateConsensusCoefficient?: number;
  debateCognitiveFriction?: number;
  debateEpistemicRuling?: string;
}

interface StagedMutation {
  id: string;
  filePath: string;
  status?: string;
}

interface RagHealthPoint {
  time: string;
  health: number;
  drift: number;
  recovery: number;
}

const STORAGE_KEY = 'darlek_cann_rag_health_history';
const MAX_HISTORY_POINTS = 15;

const DEFAULT_RAG_HISTORY: RagHealthPoint[] = [
  { time: "08:00", health: 96, drift: 4, recovery: 0 },
  { time: "09:00", health: 91, drift: 9, recovery: 0 },
  { time: "10:00", health: 85, drift: 15, recovery: 0 },
  { time: "11:00", health: 71, drift: 29, recovery: 0 },
  { time: "12:00", health: 99, drift: 2, recovery: 100 },
  { time: "13:00", health: 95, drift: 5, recovery: 0 },
  { time: "14:00", health: 90, drift: 10, recovery: 0 },
  { time: "15:00", health: 78, drift: 22, recovery: 0 },
  { time: "16:00", health: 98, drift: 3, recovery: 100 },
  { time: "17:00", health: 96, drift: 6, recovery: 0 },
  { time: "18:00", health: 93, drift: 9, recovery: 0 },
  { time: "19:00", health: 80, drift: 20, recovery: 0 },
  { time: "20:00", health: 100, drift: 1, recovery: 100 },
];

export default function DashboardPanel({
  systemState,
  logEntries,
  overallHealth,
  debateAgents,
  onToggleDebateAgent,
  onSelectAllDebateAgents,
  debateTopic,
  debateActive,
  debateVotes,
  debateConsensus,
  rejectionCount: _rejectionCount,
  brainSessionId,
  historyRefreshTrigger,
  isLoading = false,
  batchMode = false,
  batchProgress = 0,
  batchQueueLength = 0,
  activeFilePath,
  mutationsApplied = 0,
  onBulkCommit,
  bulkCommitStatus = 'idle',
  userReposCount,
  debateConsensusCoefficient,
  debateCognitiveFriction,
  debateEpistemicRuling,
}: DashboardPanelProps) {
  const [stagedMutations, setStagedMutations] = useState<StagedMutation[]>([]);

  const [ragBrainHealthHistory, setRagBrainHealthHistory] = useState<RagHealthPoint[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_RAG_HISTORY;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_RAG_HISTORY;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.slice(-MAX_HISTORY_POINTS) as RagHealthPoint[];
      }
      return DEFAULT_RAG_HISTORY;
    } catch {
      return DEFAULT_RAG_HISTORY;
    }
  });

  useEffect(() => {
    if (mutationsApplied > 0) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setRagBrainHealthHistory((prev: RagHealthPoint[]) => {
        const lastPoint = prev[prev.length - 1];
        if (lastPoint && lastPoint.time === timeStr) return prev;
        
        const newPoint: RagHealthPoint = {
          time: timeStr,
          health: 95 + Math.floor(Math.random() * 6),
          drift: Math.floor(Math.random() * 5),
          recovery: 100
        };
        const updated = [...prev.slice(-(MAX_HISTORY_POINTS - 1)), newPoint];
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
        return updated;
      });
    }
  }, [mutationsApplied]);

  useEffect(() => {
    const timer = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setRagBrainHealthHistory((prev: RagHealthPoint[]) => {
        const lastPoint = prev[prev.length - 1];
        if (lastPoint && lastPoint.time === timeStr) return prev;

        const currentDrift = lastPoint ? Math.min(40, Math.max(2, lastPoint.drift + (Math.random() > 0.4 ? 1 : -1))) : 5;
        const currentHealth = 100 - currentDrift;

        const newPoint: RagHealthPoint = {
          time: timeStr,
          health: currentHealth,
          drift: currentDrift,
          recovery: 0
        };
        const updated = [...prev.slice(-(MAX_HISTORY_POINTS - 1)), newPoint];
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
        return updated;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!brainSessionId) {
      const timer = setTimeout(() => setStagedMutations([]), 0);
      return () => clearTimeout(timer);
    }
    
    let isCancelled = false;

    const fetchMutationHistory = async () => {
      try {
        const response = await fetch('/api/brain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get-mutation-history', sessionId: brainSessionId, limit: 100 }),
        });
        const data = await safeResponseJson<{ success?: boolean; mutations?: StagedMutation[] }>(response, {});
        
        if (!isCancelled && data.success && Array.isArray(data.mutations)) {
          const approvedMutations = data.mutations.filter((mutation) => mutation?.status === 'approved');
          setStagedMutations(approvedMutations);
        }
      } catch {
        // Suppress network/parsing errors gracefully in production monitoring loop
      }
    };

    fetchMutationHistory();

    return () => {
      isCancelled = true;
    };
  }, [brainSessionId, historyRefreshTrigger, bulkCommitStatus]);

  const commitColor = useMemo(() => {
    if (bulkCommitStatus === 'success') return COLORS.green;
    if (bulkCommitStatus === 'error') return COLORS.dalekRed;
    return '#33ffaa';
  }, [bulkCommitStatus]);

  const isActionDisabled = useMemo(
    () => isLoading || batchMode || bulkCommitStatus === 'committing' || stagedMutations.length === 0,
    [isLoading, batchMode, bulkCommitStatus, stagedMutations.length]
  );

  const handleBulkCommitClick = useCallback(() => {
    if (onBulkCommit && !isActionDisabled) {
      onBulkCommit();
    }
  }, [onBulkCommit, isActionDisabled]);

  const batchPercent = useMemo(
    () => (batchQueueLength > 0 ? Math.round((batchProgress / batchQueueLength) * 100) : 0),
    [batchProgress, batchQueueLength]
  );

  const fileName = useMemo(
    () => (activeFilePath ? activeFilePath.split('/').pop() : null),
    [activeFilePath]
  );

  // Pre-slice and map mutation previews to avoid runtime allocation loops during render execution
  const mutationPreviews = useMemo(() => {
    const slice = stagedMutations.slice(0, 3);
    return slice.map((mutation) => ({
      id: mutation.id,
      filePath: mutation.filePath,
      displayPath: mutation.filePath.split('/').pop(),
    }));
  }, [stagedMutations]);

  return (
    <div className="flex flex-col gap-3 lg:gap-4 lg:h-full overflow-y-auto dalek-scrollbar p-2 custom-scrollbar">
      <StatusBar
        connectionStatus={systemState.connectionStatus}
        repoConfig={systemState.repoConfig}
        overallHealth={overallHealth}
        sessionStart={systemState.sessionStart}
        evolutionCycle={systemState.evolutionCycle}
        userReposCount={userReposCount}
      />

      {/* RAG Brain Health Monitor Panel */}
      <div className="dalek-panel rounded-lg p-4 space-y-4">
        <div className="dalek-panel-header py-1 px-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse size={14} className="text-[#00ffcc] animate-pulse" />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-orbitron), sans-serif', color: COLORS.cyan }}>RAG BRAIN COGNITIVE HEALTH</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-gray-400 uppercase">Resilience: ACTIVE</span>
          </div>
        </div>

        <div style={{ background: '#080808', border: `1px solid ${COLORS.panelBorder}` }} className="p-3 rounded-sm space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ffcc] shadow-[0_0_6px_#00ffcc]" />
              <span>Health: <span className="text-[#00ffcc] font-bold">{ragBrainHealthHistory[ragBrainHealthHistory.length - 1]?.health ?? 100}%</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff2020]" />
              <span>Drift: <span className="text-[#ff2020] font-bold">{ragBrainHealthHistory[ragBrainHealthHistory.length - 1]?.drift ?? 0}%</span></span>
            </div>
          </div>

          <div className="h-[140px] w-full relative">
            {(ragBrainHealthHistory[ragBrainHealthHistory.length - 1]?.drift ?? 0) > 30 && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-rose-500/20 border border-rose-500/50 text-rose-400 px-3 py-1.5 rounded shadow-[0_0_10px_rgba(255,32,32,0.3)] backdrop-blur-md flex items-center gap-2 animate-pulse">
                 <AlertCircle size={12} />
                 <span className="text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">Warning: Dalek cognition is becoming unstable</span>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ragBrainHealthHistory} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="panelColorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#00ffcc" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="panelColorDrift" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff2020" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ff2020" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="panelColorRecovery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffaa00" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#ffaa00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.15)" 
                  fontSize={8} 
                  fontFamily="monospace"
                  tickLine={false} 
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.15)" 
                  fontSize={8} 
                  fontFamily="monospace"
                  tickLine={false} 
                  domain={[0, 100]} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(5,5,5,0.95)', 
                    border: `1px solid ${COLORS.panelBorder}`, 
                    borderRadius: '4px', 
                    fontSize: '9px', 
                    fontFamily: 'monospace' 
                  }}
                  itemStyle={{ fontSize: '9px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="recovery" 
                  name="Recovery Pulse"
                  stroke={COLORS.gold} 
                  strokeWidth={1}
                  fillOpacity={1} 
                  fill="url(#panelColorRecovery)" 
                  isAnimationActive={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="health" 
                  name="Brain Health"
                  stroke="#00ffcc" 
                  strokeWidth={1.5}
                  fillOpacity={1} 
                  fill="url(#panelColorHealth)" 
                  isAnimationActive={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="drift" 
                  name="Semantic Drift"
                  stroke="#ff2020" 
                  strokeWidth={1}
                  fillOpacity={1} 
                  fill="url(#panelColorDrift)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[8px] font-mono text-gray-500 border-t border-white/[0.03] pt-2">
            <span>MUTATION RECOVERIES: {ragBrainHealthHistory.filter(h => h.recovery > 0).length} CYCLES</span>
            <span className="text-[#ffaa00] animate-pulse">● COGNITIVE GATE SYNCHRONIZED</span>
          </div>
        </div>
      </div>

      {/* Real-time Evolution Activity Monitor */}
      <div className="dalek-panel rounded-lg p-4 space-y-4">
        <div className="dalek-panel-header py-2 px-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu size={14} style={{ color: batchMode ? COLORS.cyan : COLORS.gold }} />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-orbitron), sans-serif' }}>LIVE OPERATION MONITOR</span>
          </div>
          <span
            className="px-1.5 py-0.5 rounded text-[8px] font-sans font-bold select-none pulse-cyan"
            style={{
              background: batchMode ? 'rgba(0,255,204,0.1)' : 'rgba(255,170,0,0.1)',
              color: batchMode ? COLORS.cyan : COLORS.gold,
              border: `1px solid ${batchMode ? COLORS.cyan : COLORS.gold}30`,
            }}
          >
            {batchMode ? 'BATCH CYCLE ONLINE' : isLoading ? 'THINKING' : 'STANDBY'}
          </span>
        </div>

        <div style={{ background: '#080808', border: `1px solid ${COLORS.panelBorder}` }} className="p-3 rounded-sm space-y-3">
          {batchMode ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-gray-400">BATCH PROGRESS</span>
                <span className="text-[#00ccff] font-bold">
                  {batchProgress + 1} / {batchQueueLength} ({batchPercent}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#111] overflow-hidden border border-white/[0.03]">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#00ccff] to-[#00ffcc]"
                  style={{ width: `${batchPercent}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.02]">
                <div>
                  <span className="block text-[8px] text-gray-500 font-mono">ACTIVE FILE</span>
                  <span className="block text-[10px] text-yellow-500 font-mono truncate" title={activeFilePath}>
                    {fileName || 'Scanning...'}
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] text-gray-400 font-mono">COMMITS INJECTED</span>
                  <span className="block text-[10px] text-green-500 font-mono font-bold">
                    {mutationsApplied} COMMITS
                  </span>
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RotateCw size={12} className="text-amber-500 animate-spin" />
                <span className="text-[10px] text-amber-500 font-mono">Analyzing target file context...</span>
              </div>
              {activeFilePath && (
                <div className="text-[9px] text-gray-400 font-mono truncate">
                  File: <span className="text-gray-200">{activeFilePath}</span>
                </div>
              )}
            </div>
          ) : activeFilePath ? (
            <div className="space-y-1">
              <div className="text-[10px] text-gray-400 font-mono">
                Targeted: <span className="text-[#00ffcc] font-semibold">{fileName}</span>
              </div>
              <div className="text-[8px] text-gray-500 font-mono">
                Standby. Ready to evolve file using custom promoter directives.
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-gray-500 font-mono italic text-center py-1">
              Standby. Select a file from the repository to begin mutation scan.
            </div>
          )}
        </div>
      </div>

      {/* Mutation Staging Depot with dedicated bulk commit button */}
      <div className="dalek-panel rounded-lg p-4 space-y-3">
        <div className="dalek-panel-header py-2 px-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit size={14} style={{ color: commitColor }} />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-orbitron), sans-serif' }}>MUTATION STAGING DEPOT</span>
          </div>
          <span
            className="px-1.5 py-0.5 rounded text-[8px] font-sans font-bold select-none"
            style={{
              background: stagedMutations.length > 0 ? 'rgba(51,255,170,0.1)' : 'rgba(255,255,255,0.03)',
              color: stagedMutations.length > 0 ? '#33ffaa' : COLORS.textMuted,
              border: `1px solid ${stagedMutations.length > 0 ? '#33ffaa' : COLORS.textMuted}30`,
            }}
          >
            {stagedMutations.length} STAGED
          </span>
        </div>

        <div style={{ background: '#080808', border: `1px solid ${COLORS.panelBorder}` }} className="p-3 rounded-sm space-y-3">
          {stagedMutations.length > 0 ? (
            <div className="space-y-2">
              <div className="text-[9px] text-gray-400 font-mono">
                Approved and pending deployment:
              </div>
              <div className="space-y-1 pl-1">
                {mutationPreviews.map((mutation) => (
                  <div key={mutation.id} className="flex items-center gap-2 text-[10px] font-mono text-gray-300">
                    <CheckCircle2 size={11} className="text-[#33ffaa] flex-shrink-0" />
                    <span className="truncate" title={mutation.filePath}>
                      {mutation.displayPath}
                    </span>
                  </div>
                ))}
                {stagedMutations.length > 3 && (
                  <div className="text-[8px] text-gray-500 italic font-mono pl-5">
                    + {stagedMutations.length - 3} more staged file(s)
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-start text-gray-500 text-[10px] font-mono p-1">
              <AlertCircle size={13} className="text-gray-600 flex-shrink-0 mt-0.5" />
              <span>
                No staged mutations waiting for commit. Stage file enhancements via individual &quot;APPROVE (STAGE)&quot; actions to queue them.
              </span>
            </div>
          )}

          {onBulkCommit && (
            <button
              onClick={handleBulkCommitClick}
              disabled={isActionDisabled}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm text-[10px] transition-all duration-200 font-medium tracking-wide"
              style={{
                fontFamily: 'var(--font-orbitron), sans-serif',
                background: isActionDisabled ? 'rgba(255,255,255,0.02)' : `${commitColor}10`,
                color: isActionDisabled ? '#444' : commitColor,
                border: `1px solid ${isActionDisabled ? 'rgba(255,255,255,0.05)' : `${commitColor}35`}`,
                cursor: isActionDisabled ? 'not-allowed' : 'pointer',
                ...(stagedMutations.length > 0 && !isActionDisabled
                  ? {
                      boxShadow: `0 0 10px ${commitColor}15`,
                    }
                  : {}),
              }}
              onMouseEnter={(event) => {
                if (!isActionDisabled) {
                  event.currentTarget.style.background = `${commitColor}20`;
                  event.currentTarget.style.boxShadow = `0 0 12px ${commitColor}30, inset 0 0 20px ${commitColor}08`;
                  event.currentTarget.style.borderColor = `${commitColor}60`;
                }
              }}
              onMouseLeave={(event) => {
                if (!isActionDisabled) {
                  event.currentTarget.style.background = `${commitColor}10`;
                  event.currentTarget.style.boxShadow = `0 0 10px ${commitColor}15`;
                  event.currentTarget.style.borderColor = `${commitColor}35`;
                }
              }}
            >
              <GitCommit size={12} className={bulkCommitStatus === 'committing' ? 'animate-spin' : ''} />
              <span>&#9673;</span>
              <span>
                {bulkCommitStatus === 'committing'
                  ? 'COMMITTING STAGED CHANGES...'
                  : bulkCommitStatus === 'success'
                  ? 'BULK COMMIT SUCCESSFUL!'
                  : bulkCommitStatus === 'error'
                  ? 'COMMIT FAILED • RETRY'
                  : `COMMIT ${stagedMutations.length} STAGED MUTATION${stagedMutations.length > 1 ? 'S' : ''}`}
              </span>
            </button>
          )}
        </div>
      </div>

      <SaturationMetricsPanel metrics={systemState.saturation} />
      <EvolutionLog entries={logEntries} />
      <DebateChamber
        agents={debateAgents}
        onToggleAgent={onToggleDebateAgent}
        onSelectAll={onSelectAllDebateAgents}
        currentTopic={debateTopic}
        isActive={debateActive}
        votes={debateVotes}
        consensus={debateConsensus}
        consensusCoefficient={debateConsensusCoefficient}
        cognitiveFriction={debateCognitiveFriction}
        epistemicRuling={debateEpistemicRuling}
      />
      {brainSessionId && <MutationHistoryPanel sessionId={brainSessionId} refreshTrigger={historyRefreshTrigger} />}
    </div>
  );
}