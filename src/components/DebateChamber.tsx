'use client';

import React, { useMemo, useCallback } from 'react';
import type { DebateAgent, AgentVote } from '@/lib/types';
import { COLORS } from '@/lib/constants';
import { Users } from 'lucide-react';

export interface DebateChamberProps {
  agents: DebateAgent[];
  onToggleAgent?: (agentId: string) => void;
  onSelectAll?: (active: boolean) => void;
  currentTopic: string;
  isActive: boolean;
  votes?: AgentVote[];
  consensus?: string;
  consensusCoefficient?: number;
  cognitiveFriction?: number;
  epistemicRuling?: string;
}

interface AgentItemProps {
  agent: DebateAgent & { vote?: AgentVote };
  isActive: boolean;
  onToggleAgent?: (agentId: string) => void;
}

const AgentItem = React.memo(function AgentItem({ agent, isActive, onToggleAgent }: AgentItemProps) {
  const handleAgentClick = useCallback(() => {
    if (!isActive && onToggleAgent) {
      onToggleAgent(agent.id);
    }
  }, [isActive, onToggleAgent, agent.id]);

  const isAgentActive = agent.status === 'active';
  const voteType = agent.vote?.vote;
  
  let voteColor = COLORS.gold;
  let voteIcon = '\u25CB';
  let voteLabel = 'ABSTAIN';

  if (voteType === 'approve') {
    voteColor = COLORS.green;
    voteIcon = '\u2713';
    voteLabel = 'APPROVE';
  } else if (voteType === 'reject') {
    voteColor = COLORS.dalekRed;
    voteIcon = '\u2717';
    voteLabel = 'REJECT';
  }

  const borderStyle = agent.vote ? `${voteColor}20` : COLORS.panelBorder;
  const cursorStyle = !isActive && onToggleAgent ? 'pointer' : 'default';

  return (
    <div
      onClick={handleAgentClick}
      className="px-3 py-2 rounded transition-colors"
      style={{
        background: '#080808',
        border: `1px solid ${borderStyle}`,
        cursor: cursorStyle,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-xs flex-shrink-0"
          style={{ color: isAgentActive ? agent.color : '#333' }}
        >
          {isAgentActive ? '\u25CF' : '\u25CB'}
        </span>
        <span
          style={{
            fontSize: '9px',
            fontFamily: 'var(--font-orbitron), sans-serif',
            letterSpacing: '0.05em',
            color: isAgentActive ? '#ccc' : '#444',
            fontWeight: isAgentActive ? 600 : 400,
          }}
        >
          {agent.name}
        </span>
        {agent.vote && (
          <>
            <span
              className="ml-auto"
              style={{
                fontSize: '8px',
                color: voteColor,
                fontFamily: 'var(--font-orbitron), sans-serif',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              {voteIcon} {voteLabel}
            </span>
            <span
              style={{
                fontSize: '8px',
                color: COLORS.textMuted,
                fontFamily: 'var(--font-orbitron), sans-serif',
              }}
            >
              {agent.vote.confidence}%
            </span>
            <span
              style={{
                fontSize: '7px',
                color: '#444',
                fontFamily: 'var(--font-share-tech-mono), monospace',
              }}
            >
              via {agent.vote.provider}
            </span>
          </>
        )}
      </div>
      {agent.vote?.reasoning && (
        <p
          style={{
            fontSize: '9px',
            color: COLORS.textDim,
            fontFamily: 'var(--font-share-tech-mono), monospace',
            marginTop: '4px',
            paddingLeft: '18px',
            lineHeight: 1.4,
          }}
        >
          &quot;{agent.vote.reasoning}&quot;
        </p>
      )}
    </div>
  );
});

export default function DebateChamber({ 
  agents, 
  onToggleAgent, 
  onSelectAll, 
  currentTopic, 
  isActive, 
  votes, 
  consensus,
  consensusCoefficient,
  cognitiveFriction,
  epistemicRuling 
}: DebateChamberProps) {
  const agentsWithVotes = useMemo(() => {
    if (!votes || votes.length === 0) {
      return agents as (DebateAgent & { vote?: AgentVote })[];
    }
    
    const voteMap = new Map<string, AgentVote>(votes.map(v => [v.agentId, v]));
    const agentCount = agents.length;
    const enrichedAgents = new Array(agentCount);
    
    for (let i = 0; i < agentCount; i++) {
      const currentAgent = agents[i];
      enrichedAgents[i] = {
        ...currentAgent,
        vote: voteMap.get(currentAgent.id)
      };
    }
    
    return enrichedAgents;
  }, [agents, votes]);

  const handleSelectAllClick = useCallback(() => {
    if (!onSelectAll) return;
    
    let hasIdleAgent = false;
    const agentCount = agents.length;
    
    for (let i = 0; i < agentCount; i++) {
      if (agents[i].status === 'idle') {
        hasIdleAgent = true;
        break;
      }
    }
    
    onSelectAll(hasIdleAgent);
  }, [onSelectAll, agents]);

  const isAllActive = useMemo(() => {
    const agentCount = agents.length;
    if (agentCount === 0) return false;
    
    for (let i = 0; i < agentCount; i++) {
      if (agents[i].status !== 'active') return false;
    }
    
    return true;
  }, [agents]);

  const consensusColor = useMemo(() => {
    if (consensus === 'APPROVE') return COLORS.green;
    if (consensus === 'REJECT') return COLORS.dalekRed;
    return COLORS.gold;
  }, [consensus]);

  const consensusCoefficientWidth = useMemo(() => {
    if (consensusCoefficient === undefined) return '0%';
    return `${Math.max(0, Math.min(100, consensusCoefficient * 100))}%`;
  }, [consensusCoefficient]);

  const consensusCoefficientPercent = useMemo(() => {
    if (consensusCoefficient === undefined) return 0;
    return Math.round(consensusCoefficient * 100);
  }, [consensusCoefficient]);

  return (
    <div className="dalek-panel rounded-lg p-4 space-y-3">
      <div className="dalek-panel-header py-2 px-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={14} style={{ color: COLORS.purple }} />
          <span style={{ fontSize: '11px' }}>DEBATE CHAMBER</span>
          {onSelectAll && !isActive && (
            <button
              onClick={handleSelectAllClick}
              type="button"
              className="ml-2 px-1.5 py-0.5 rounded text-[8px] bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors uppercase tracking-wider border border-white/10"
            >
              {isAllActive ? 'DESELECT ALL' : 'SELECT ALL'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {consensus && (
            <span
              style={{
                fontSize: '8px',
                fontFamily: 'var(--font-orbitron), sans-serif',
                letterSpacing: '0.08em',
                color: consensusColor,
                fontWeight: 700,
              }}
            >
              {consensus}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isActive ? COLORS.purple : '#333',
                boxShadow: isActive ? `0 0 4px ${COLORS.purple}` : 'none',
              }}
            />
            <span style={{ fontSize: '9px', color: isActive ? COLORS.purple : COLORS.textMuted, fontFamily: 'var(--font-orbitron), sans-serif', letterSpacing: '0.08em' }}>
              {isActive ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {agentsWithVotes.map((agent) => (
          <AgentItem
            key={agent.id}
            agent={agent}
            isActive={isActive}
            onToggleAgent={onToggleAgent}
          />
        ))}
      </div>

      {(consensusCoefficient !== undefined || cognitiveFriction !== undefined || epistemicRuling) && (
        <div 
          className="p-3 rounded-lg border border-purple-950/30 bg-[#070007]/60 space-y-2.5"
          id="epistemic-debate-metrics"
        >
          <div className="flex items-center gap-1.5 border-b border-purple-950/20 pb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span style={{ fontSize: '9px', color: COLORS.purple, fontFamily: 'var(--font-orbitron), sans-serif', fontWeight: 700, letterSpacing: '0.1em' }}>
              ✦ DIALECTICAL EQUILIBRIUM MECHANICS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {consensusCoefficient !== undefined && (
              <div className="space-y-1">
                <span className="text-[8px] text-gray-500 font-mono block">CONSENSUS RATIO</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#120512] h-1.5 rounded border border-purple-900/20 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-full transition-all duration-1000"
                      style={{ width: consensusCoefficientWidth }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-purple-400 font-bold">
                    {consensusCoefficientPercent}%
                  </span>
                </div>
              </div>
            )}

            {cognitiveFriction !== undefined && (
              <div className="space-y-1">
                <span className="text-[8px] text-gray-400 font-mono block">COGNITIVE FRICTION</span>
                <span className={`text-[9px] font-mono font-bold block ${cognitiveFriction > 0.5 ? 'text-amber-500' : 'text-[#00ffcc]'}`}>
                  {cognitiveFriction > 0.5 ? 'HIGH • DISPUTED PREMISES' : 'LOW • SWARM CONVERGENCE'}
                </span>
              </div>
            )}
          </div>

          {epistemicRuling && (
            <div className="pt-2 border-t border-purple-950/20 space-y-1">
              <span className="text-[8px] text-gray-500 font-mono block">EPISTEMOLOGICAL RULING (SYNTHESIS):</span>
              <p className="text-[9px] text-[#dacada] font-mono leading-relaxed bg-[#0d000d]/80 p-2 rounded border border-purple-950/40 italic">
                &ldquo;{epistemicRuling}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {currentTopic ? (
        <div
          className="debate-topic px-3 py-2 rounded text-center"
          style={{
            background: 'rgba(204, 0, 255, 0.03)',
            border: '1px solid rgba(204, 0, 255, 0.08)',
          }}
        >
          <span style={{ fontSize: '8px', color: COLORS.textMuted, fontFamily: 'var(--font-orbitron), sans-serif', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
            CURRENT TOPIC
          </span>
          <p style={{ fontSize: '10px', color: COLORS.purple, fontFamily: 'var(--font-share-tech-mono), monospace', lineHeight: 1.4 }}>
            {currentTopic}
          </p>
        </div>
      ) : (
        <div
          className="px-3 py-2 rounded text-center"
          style={{ background: '#060606' }}
        >
          <p style={{ fontSize: '10px', color: COLORS.textMuted }}>
            No active debate. Initiate analysis to convene the chamber.
          </p>
        </div>
      )}
    </div>
  );
}