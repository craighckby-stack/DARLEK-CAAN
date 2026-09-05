import React, { memo, useMemo } from 'react';

export type DalekStatus = 'connected' | 'offline' | (string & {});

export interface DalekStatusIndicatorProps {
  readonly status: DalekStatus;
  readonly className?: string;
}

interface StatusConfiguration {
  readonly text: string;
  readonly className: string;
}

const KNOWN_STATUS_CONFIGS: Record<'connected' | 'offline', StatusConfiguration> = {
  connected: {
    text: '● SECURE',
    className: 'text-green-500',
  },
  offline: {
    text: '○ OFFLINE',
    className: 'text-red-500',
  },
} as const;

const BASE_INDICATOR_CLASSES = 'text-[10px] uppercase tracking-widest';

export const DalekStatusIndicator: React.FC<DalekStatusIndicatorProps> = memo(({ 
  status, 
  className = '' 
}) => {
  const statusConfig = useMemo<StatusConfiguration>(() => {
    if (status === 'connected') return KNOWN_STATUS_CONFIGS.connected;
    if (status === 'offline') return KNOWN_STATUS_CONFIGS.offline;
    
    return {
      text: `○ ${status.toUpperCase()}`,
      className: 'text-yellow-500',
    };
  }, [status]);

  const combinedClassName = useMemo(() => {
    return `${BASE_INDICATOR_CLASSES} ${statusConfig.className} ${className}`.trim();
  }, [statusConfig.className, className]);

  return (
    <div 
      className={combinedClassName}
      role="status"
      aria-live="polite"
      aria-label={`Dalek status: ${status}`}
    >
      {statusConfig.text}
    </div>
  );
});

DalekStatusIndicator.displayName = 'DalekStatusIndicator';