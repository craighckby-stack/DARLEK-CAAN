'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { COLORS } from '@/lib/constants';
import { Activity } from 'lucide-react';
import { safeResponseJson } from '@/lib/safe-json';

export interface MutationRecord {
  id: string;
  filePath: string;
  riskScore: number;
  status: 'applied' | 'rejected' | 'approved' | 'pending' | 'failed' | string;
  commitSha?: string;
  createdAt: string;
  provider?: string;
}

interface MutationApiResponse {
  success?: boolean;
  mutations?: MutationRecord[];
  error?: string;
}

interface MutationHistoryPanelProps {
  sessionId: string;
  refreshTrigger?: number;
}

// Global lookup caches to eliminate runtime string allocation and parsing overhead
const STATUS_COLOR_CACHE: Record<string, string> = {
  applied: COLORS.green,
  rejected: COLORS.dalekRed,
  failed: COLORS.dalekRed,
  approved: COLORS.cyan,
  pending: COLORS.gold,
};

const PATH_NAME_CACHE = new Map<string, string>();
const DATE_FORMAT_CACHE = new Map<string, string>();

const getStatusColor = (status: string): string => {
  return STATUS_COLOR_CACHE[status] || COLORS.textMuted;
};

const getRiskColor = (risk: number): string => {
  if (risk <= 3) return COLORS.cyan;
  if (risk <= 6) return COLORS.gold;
  return COLORS.dalekRed;
};

const getCachedFileName = (filePath: string): string => {
  if (!filePath) return 'unknown';
  let cached = PATH_NAME_CACHE.get(filePath);
  if (cached === undefined) {
    const lastSlash = filePath.lastIndexOf('/');
    cached = lastSlash !== -1 ? filePath.substring(lastSlash + 1) : filePath;
    PATH_NAME_CACHE.set(filePath, cached);
  }
  return cached;
};

const getCachedFormattedDate = (dateStr: string): string => {
  if (!dateStr) return '';
  let cached = DATE_FORMAT_CACHE.get(dateStr);
  if (cached === undefined) {
    try {
      cached = new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      cached = '';
    }
    DATE_FORMAT_CACHE.set(dateStr, cached);
  }
  return cached;
};

export default function MutationHistoryPanel({ sessionId, refreshTrigger }: MutationHistoryPanelProps) {
  const [mutations, setMutations] = useState<MutationRecord[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const fetchedRef = useRef<string | null>(null);
  const lastRefreshTriggerRef = useRef<number | undefined>(refreshTrigger);

  useEffect(() => {
    if (!sessionId) return;
    
    const hasTriggerChanged = refreshTrigger !== lastRefreshTriggerRef.current;
    if (fetchedRef.current === sessionId && !hasTriggerChanged) return;
    
    fetchedRef.current = sessionId;
    lastRefreshTriggerRef.current = refreshTrigger;

    let cancelled = false;
    
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/brain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get-mutation-history', sessionId, limit: 20 }),
        });
        const data = (await safeResponseJson(res, {})) as MutationApiResponse;
        if (!cancelled && data && data.success && Array.isArray(data.mutations)) {
          setMutations(data.mutations);
        }
      } catch {
        // Suppress network/parsing errors gracefully in production monitoring panel
      }
    };

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [sessionId, refreshTrigger]);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const stats = useMemo(() => {
    let applied = 0;
    let rejected = 0;
    let pending = 0;

    const len = mutations.length;
    for (let i = 0; i < len; i++) {
      const status = mutations[i].status;
      if (status === 'applied') applied++;
      else if (status === 'rejected' || status === 'failed') rejected++;
      else if (status === 'pending' || status === 'approved') pending++;
    }

    return { applied, rejected, pending };
  }, [mutations]);

  const displayedMutations = useMemo(() => {
    return expanded ? mutations : mutations.slice(0, 3);
  }, [mutations, expanded]);

  if (!sessionId || mutations.length === 0) return null;

  return (
    <div className="dalek-panel rounded-lg p-4 space-y-3">
      <div
        className="dalek-panel-header py-2 px-1 flex items-center justify-between cursor-pointer select-none"
        onClick={toggleExpanded}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpanded(); }}
      >
        <div className="flex items-center gap-2">
          <Activity size={14} style={{ color: COLORS.cyan }} />
          <span style={{ fontSize: '11px' }}>MUTATION HISTORY</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '8px', color: COLORS.textMuted, fontFamily: 'var(--font-orbitron), sans-serif' }}>
            {stats.applied} applied / {stats.rejected} rejected / {stats.pending} pending
          </span>
          <span style={{ fontSize: '8px', color: COLORS.textDim }}>
            {expanded ? '\u25B2' : '\u25BC'}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        {displayedMutations.map((m) => {
          const statusCol = getStatusColor(m.status);
          const fileName = getCachedFileName(m.filePath);
          const statusText = m.status ? m.status.toUpperCase().slice(0, 4) : 'UNK';
          const formattedDate = getCachedFormattedDate(m.createdAt);
          const riskColor = getRiskColor(m.riskScore);
          const commitShort = m.commitSha ? m.commitSha.slice(0, 7) : null;

          return (
            <div
              key={m.id}
              className="px-3 py-2 rounded transition-colors"
              style={{ background: '#080808', border: `1px solid ${statusCol}15` }}
            >
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontSize: '7px',
                    fontFamily: 'var(--font-orbitron), sans-serif',
                    fontWeight: 700,
                    color: statusCol,
                    letterSpacing: '0.05em',
                  }}
                >
                  {statusText}
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    color: COLORS.textDim,
                    fontFamily: 'var(--font-share-tech-mono), monospace',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={m.filePath}
                >
                  {fileName}
                </span>
                <span
                  style={{
                    fontSize: '8px',
                    color: riskColor,
                    fontWeight: 600,
                  }}
                >
                  {m.riskScore}/10
                </span>
                <span style={{ fontSize: '7px', color: '#444' }}>
                  {formattedDate}
                </span>
              </div>
              {commitShort && (
                <div style={{ fontSize: '7px', color: '#333', marginTop: '2px', paddingLeft: '2px' }}>
                  commit: {commitShort}
                  {m.provider && ` via ${m.provider}`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {mutations.length > 3 && (
        <button
          onClick={toggleExpanded}
          style={{
            fontSize: '8px',
            color: COLORS.textMuted,
            fontFamily: 'var(--font-orbitron), sans-serif',
            letterSpacing: '0.05em',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'center',
            padding: '4px',
          }}
          type="button"
        >
          {expanded ? '\u25B2 COLLAPSE' : `\u25BC SHOW ALL (${mutations.length})`}
        </button>
      )}
    </div>
  );
}