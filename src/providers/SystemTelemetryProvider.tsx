"use client";

import React, { createContext, useContext, type JSX, type ReactNode } from 'react';

export interface SystemTelemetryContextType {
  readonly status: 'active';
  readonly node: 'omega-core';
}

const TELEMETRY_VALUE: SystemTelemetryContextType = {
  status: 'active',
  node: 'omega-core',
};

const TelemetryContext = createContext<SystemTelemetryContextType | undefined>(undefined);

export interface SystemTelemetryProviderProps {
  readonly children: ReactNode;
}

if (typeof window !== 'undefined') {
  try {
    console.info("[DARLEK-CANN] System Telemetry Initialized: Quantum-Ready");
  } catch (error: unknown) {
    console.error("[DARLEK-CANN] Telemetry Initialization Error:", error);
  }
}

export const SystemTelemetryProvider = ({ children }: SystemTelemetryProviderProps): JSX.Element => (
  <TelemetryContext.Provider value={TELEMETRY_VALUE}>
    {children}
  </TelemetryContext.Provider>
);

export const useTelemetry = (): SystemTelemetryContextType => {
  const context = useContext(TelemetryContext);
  if (context === undefined) {
    throw new Error('useTelemetry must be used within a SystemTelemetryProvider');
  }
  return context;
};