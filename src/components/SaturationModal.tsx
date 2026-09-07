'use client';

/**
 * DARLEK CAAN ARCHITECTURAL COMPONENT
 * File: src/components/SaturationModal.tsx
 * Role: Saturation alert modal handling 0-diff architectural equilibrium and rotation blacklist.
 */

import React from 'react';
import { ShieldAlert, Ban, RotateCcw, X, FileCode, AlertCircle, Cpu } from 'lucide-react';
import { SaturationAlert } from '@/lib/types';
import { COLORS } from '@/lib/constants';

interface SaturationModalProps {
  alert: SaturationAlert | null;
  onClose: () => void;
  onAddToBlacklist: (path: string) => void;
  onKeepInRotation: () => void;
}

export const SaturationModal: React.FC<SaturationModalProps> = ({
  alert,
  onClose,
  onAddToBlacklist,
  onKeepInRotation,
}) => {
  if (!alert) return null;

  return (
    <div
      id="saturation-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="saturation-modal"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0a0202] border border-red-900/60 rounded-xl w-full max-w-xl shadow-[0_0_50px_rgba(255,0,51,0.25)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-950/80 bg-[#050000]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2 font-mono">
                NEURAL SATURATION REACHED
              </h2>
              <p className="text-[10px] text-gray-400 font-mono">
                Dalek Caan Cognitive Engine • Peak Equilibrium Detected
              </p>
            </div>
          </div>
          <button
            id="btn-close-saturation"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto font-sans">
          {/* Target File Badge */}
          <div className="p-3 bg-black/60 border border-red-950/60 rounded-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs font-mono font-bold text-cyan-300 truncate">
                {alert.path}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold shrink-0">
              0 Diffs (No-Op)
            </span>
          </div>

          {/* Explanation Banner */}
          <div className="p-3.5 bg-[#120303] border border-red-900/30 rounded-lg space-y-2 text-xs text-gray-300 leading-relaxed font-mono">
            <div className="flex items-start gap-2 text-gray-200">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                The cognitive engine analyzed this target file and determined that it already achieves maximum architectural efficiency according to current directives.
                <strong className="text-white ml-1">No modifications were produced.</strong>
              </span>
            </div>
            <p className="text-[10px] text-gray-400 pl-6">
              The commit was automatically intercepted and skipped to prevent redundant empty git commits and conserve API token quota.
            </p>
          </div>

          {/* Decision Prompt */}
          <div className="pt-1">
            <label className="text-[10px] font-bold text-gray-200 font-mono uppercase tracking-wider block mb-1">
              Blacklist Decision:
            </label>
            <p className="text-xs text-gray-400">
              Would you like to add <span className="text-cyan-300 font-mono font-semibold">{alert.path}</span> to the engine blacklist so subsequent autonomous passes skip it?
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-red-950/80 bg-[#050000] flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            id="btn-keep-rotation"
            type="button"
            onClick={onKeepInRotation}
            className="w-full sm:w-auto px-4 py-2 rounded border border-gray-800 bg-neutral-900 hover:bg-neutral-800 text-gray-300 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span>Keep in Rotation</span>
          </button>
          <button
            id="btn-add-blacklist"
            type="button"
            onClick={() => onAddToBlacklist(alert.path)}
            className="w-full sm:w-auto px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Add to Blacklist & Skip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
