import React, { memo } from 'react';

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

export const DalekStatusIndicator: React.FC<DalekStatusIndicatorProps> = memo(({ 
  status, 
  className = '' 
}) => {
  let text: string;
  let statusClassName: string;

  if (status === 'connected') {
    text = KNOWN_STATUS_CONFIGS.connected.text;
    statusClassName = KNOWN_STATUS_CONFIGS.connected.className;
  } else if (status === 'offline') {
    text = KNOWN_STATUS_CONFIGS.offline.text;
    statusClassName = KNOWN_STATUS_CONFIGS.offline.className;
  } else {
    text = `○ ${status.toUpperCase()}`;
    statusClassName = 'text-yellow-500';
  }

  const combinedClassName = className 
    ? `${BASE_INDICATOR_CLASSES} ${statusClassName} ${className}` 
    : `${BASE_INDICATOR_CLASSES} ${statusClassName}`;

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