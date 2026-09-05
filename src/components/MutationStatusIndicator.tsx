import React, { memo } from 'react';

export type MutationStatus = 'pending' | 'evolving' | 'stable';

export interface MutationStatusIndicatorProps {
  readonly status: MutationStatus;
  readonly className?: string;
}

interface StatusConfiguration {
  readonly dotClassName: string;
  readonly label: string;
}

const MUTATION_STATUS_CONFIGURATIONS: Record<MutationStatus, StatusConfiguration> = {
  pending: {
    dotClassName: 'bg-yellow-500',
    label: 'pending',
  },
  evolving: {
    dotClassName: 'animate-pulse bg-cyan-500',
    label: 'evolving',
  },
  stable: {
    dotClassName: 'bg-green-500',
    label: 'stable',
  },
} as const;

export const MutationStatusIndicator: React.FC<MutationStatusIndicatorProps> = memo(({
  status,
  className = '',
}) => {
  const currentStatusConfig = MUTATION_STATUS_CONFIGURATIONS[status] ?? MUTATION_STATUS_CONFIGURATIONS.stable;

  return (
    <div 
      className={`flex items-center gap-1 px-2 py-1 rounded bg-black border border-white/10 ${className}`}
      role="status"
      aria-label={`Mutation status: ${status}`}
    >
      <div 
        className={`w-2 h-2 rounded-full ${currentStatusConfig.dotClassName}`} 
        aria-hidden="true" 
      />
      <span className="text-[8px] uppercase tracking-widest text-white select-none">
        {currentStatusConfig.label}
      </span>
    </div>
  );
});

MutationStatusIndicator.displayName = 'MutationStatusIndicator';