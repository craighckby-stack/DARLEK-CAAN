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

const KNOWN_STATUS_CONFIGS: Readonly<Record<'connected' | 'offline', StatusConfiguration>> = {
  connected: {
    text: '● SECURE',
    className: 'text-green-500',
  },
  offline: {
    text: '○ OFFLINE',
    className: 'text-red-500',
  },
};

const BASE_INDICATOR_CLASSES = 'text-[10px] uppercase tracking-widest';

const resolveStatusConfiguration = (status: DalekStatus): StatusConfiguration => {
  if (status === 'connected' || status === 'offline') {
    return KNOWN_STATUS_CONFIGS[status];
  }

  const safeStatus = typeof status === 'string' && status.length > 0 ? status : 'UNKNOWN';

  return {
    text: `○ ${safeStatus.toUpperCase()}`,
    className: 'text-yellow-500',
  };
};

export const DalekStatusIndicator: React.FC<DalekStatusIndicatorProps> = memo(({ 
  status, 
  className = '' 
}) => {
  const { text, className: statusClassName } = useMemo(
    () => resolveStatusConfiguration(status), 
    [status]
  );
  
  const combinedClassName = useMemo(
    () => [BASE_INDICATOR_CLASSES, statusClassName, className].filter(Boolean).join(' '),
    [statusClassName, className]
  );

  return (
    <div 
      className={combinedClassName}
      role="status"
      aria-live="polite"
      aria-label={`Dalek status: ${status}`}
    >
      {text}
    </div>
  );
});

DalekStatusIndicator.displayName = 'DalekStatusIndicator';