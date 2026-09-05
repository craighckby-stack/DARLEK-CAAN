import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Clock, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import type { EvolutionLogEntry } from '@/lib/types';

export interface RejectionItem {
  id?: string;
  timestamp: string | Date;
  filePath: string;
  reason: string;
}

export interface TemporalParadoxLogProps {
  logEntries?: EvolutionLogEntry[];
  rejectionMemory?: RejectionItem[];
}

export interface ParadoxEntry {
  id: string;
  time: string;
  description: string;
  type: string;
}

const STORAGE_KEYS = {
  REJECTION_MEMORY: 'darlek_cann_rejection_memory',
  LOG_ENTRIES: 'darlek_cann_log_entries',
} as const;

const MAX_PARADOX_ENTRIES = 10;
const REFRESH_INTERVAL_MS = 3000;

function formatTimeString(timestamp: unknown): string {
  if (!timestamp) return new Date().toLocaleTimeString();
  if (timestamp instanceof Date) return timestamp.toLocaleTimeString();
  if (typeof timestamp === 'string') {
    const parsedDate = new Date(timestamp);
    return Number.isNaN(parsedDate.getTime()) ? timestamp : parsedDate.toLocaleTimeString();
  }
  return String(timestamp);
}

function fetchStoredData<T>(storageKey: string): T[] {
  try {
    const savedData = localStorage.getItem(storageKey);
    if (!savedData) return [];
    const parsed = JSON.parse(savedData);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function TemporalParadoxLog({ logEntries, rejectionMemory }: TemporalParadoxLogProps) {
  const [paradoxes, setParadoxes] = useState<ParadoxEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const updateRealParadoxes = useCallback(() => {
    const collectedParadoxes: ParadoxEntry[] = [];

    const activeRejections = (rejectionMemory?.length ? rejectionMemory : fetchStoredData<RejectionItem>(STORAGE_KEYS.REJECTION_MEMORY));
    
    activeRejections.forEach((rejection, index) => {
      if (!rejection) return;
      collectedParadoxes.push({
        id: `rej-${rejection.id ?? index}`,
        time: formatTimeString(rejection.timestamp),
        description: `Mutation rejected for ${rejection.filePath ?? 'unknown'}: ${rejection.reason ?? 'No reason specified'}`,
        type: 'REJECTION',
      });
    });

    const activeLogs = (logEntries?.length ? logEntries : fetchStoredData<EvolutionLogEntry>(STORAGE_KEYS.LOG_ENTRIES));

    activeLogs.forEach((entry) => {
      if (!entry) return;
      const isCriticalType = entry.type === 'ERROR' || entry.type === 'WARNING';
      const hasCriticalKeywords = Boolean(
        entry.description && (
          entry.description.includes('REJECTED') ||
          entry.description.includes('AST') ||
          entry.description.includes('Coherence Gate')
        )
      );

      if (isCriticalType || hasCriticalKeywords) {
        collectedParadoxes.push({
          id: `log-${entry.id ?? Math.random().toString(36).substring(2, 9)}`,
          time: formatTimeString(entry.timestamp),
          description: entry.description ?? 'No description provided',
          type: entry.type ?? 'UNKNOWN',
        });
      }
    });

    setParadoxes(collectedParadoxes.slice(0, MAX_PARADOX_ENTRIES));
  }, [logEntries, rejectionMemory]);

  useEffect(() => {
    updateRealParadoxes();
    const intervalId = setInterval(updateRealParadoxes, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [updateRealParadoxes]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded();
    }
  }, [toggleExpanded]);

  const hasParadoxes = useMemo(() => paradoxes.length > 0, [paradoxes.length]);

  return (
    <div className="border border-red-900/30 bg-red-950/10 p-4 mt-6 rounded-md">
      <div 
        className="flex items-center gap-2 mb-1 cursor-pointer select-none hover:bg-red-900/10 p-1 -m-1 rounded transition-colors"
        onClick={toggleExpanded}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <AlertTriangle className="text-red-500 animate-pulse" size={16} />
        <h3 className="text-red-400 font-bold text-sm tracking-widest font-mono">
          TEMPORAL PARADOX & REJECTION LOG
        </h3>
        <span className="ml-auto text-xs text-red-500/60 flex items-center gap-1">
          <RefreshCw size={12} className={hasParadoxes ? "animate-spin" : ""} />
          {paradoxes.length} LOGIC CONFLICTS
          {isExpanded ? <ChevronDown size={14} className="ml-1" /> : <ChevronRight size={14} className="ml-1" />}
        </span>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              {!hasParadoxes ? (
                <div className="text-xs text-red-900/50 italic py-2">
                  No temporal paradoxes or coherence violations recorded in current timeline state.
                </div>
              ) : (
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {paradoxes.map((paradox) => (
                      <motion.div
                        key={paradox.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-start gap-3 text-xs font-mono p-2 bg-red-900/20 border border-red-900/30 rounded"
                      >
                        <div className="text-red-400/50 min-w-[70px] flex items-center gap-1 shrink-0">
                          <Clock size={10} />
                          {paradox.time}
                        </div>
                        <div className="text-red-300 flex-1">
                          <span className="font-bold text-red-400 mr-2">[{paradox.type}]</span>
                          {paradox.description}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}