"use client";

import React, { createContext, useContext, type JSX, type ReactNode } from "react";

/**
 * Represents the core telemetry metadata and operational context.
 */
export interface SystemTelemetryContextType {
  readonly status: "active";
  readonly node: "omega-core";
}

/**
 * Component props for supplying children to the telemetry provider.
 */
export interface SystemTelemetryProviderProps {
  readonly children: ReactNode;
}

/**
 * Immutable default telemetry state configuration.
 */
const DEFAULT_TELEMETRY_STATE: SystemTelemetryContextType = {
  status: "active",
  node: "omega-core",
} as const;

/**
 * Internal helper to safely trigger client-side telemetry initialization logging.
 */
const logTelemetryInitialization = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    console.info("[DARLEK-CANN] System Telemetry Initialized: Quantum-Ready");
  } catch (error: unknown) {
    console.error("[DARLEK-CANN] Telemetry Initialization Error:", error);
  }
};

// Perform immediate safe client-side telemetry initialization log
logTelemetryInitialization();

const TelemetryContext = createContext<SystemTelemetryContextType | undefined>(undefined);

/**
 * React Context Provider component for exposing system telemetry data to the component tree.
 */
export const SystemTelemetryProvider = ({
  children,
}: SystemTelemetryProviderProps): JSX.Element => (
  <TelemetryContext.Provider value={DEFAULT_TELEMETRY_STATE}>
    {children}
  </TelemetryContext.Provider>
);

/**
 * Custom React hook for accessing current system telemetry context with dynamic error handling.
 */
export const useTelemetry = (): SystemTelemetryContextType => {
  const context = useContext(TelemetryContext);

  if (context === undefined) {
    throw new Error("useTelemetry must be used within a SystemTelemetryProvider");
  }

  return context;
};