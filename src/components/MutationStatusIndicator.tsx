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
};

const BASE_CONTAINER_CLASS = 'flex items-center gap-1 px-2 py-1 rounded bg-black border border-white/10';
const BASE_DOT_CLASS = 'w-2 h-2 rounded-full';
const LABEL_CLASS = 'text-[8px] uppercase tracking-widest text-white select-none';

export const MutationStatusIndicator: React.FC<MutationStatusIndicatorProps> = memo(({
  status,
  className,
}) => {
  const config = MUTATION_STATUS_CONFIGURATIONS[status] ?? MUTATION_STATUS_CONFIGURATIONS.stable;
  
  const containerClassName = className 
    ? `${BASE_CONTAINER_CLASS} ${className}` 
    : BASE_CONTAINER_CLASS;

  const dotClassName = `${BASE_DOT_CLASS} ${config.dotClassName}`;

  return (
    <div 
      className={containerClassName}
      role="status"
      aria-label={`Mutation status: ${status}`}
    >
      <div className={dotClassName} aria-hidden="true" />
      <span className={LABEL_CLASS}>
        {config.label}
      </span>
    </div>
  );
});

MutationStatusIndicator.displayName = 'MutationStatusIndicator';