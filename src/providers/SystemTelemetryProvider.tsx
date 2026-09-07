"use client";

import React, { createContext, useContext, useMemo, type JSX, type ReactNode } from "react";

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
const DEFAULT_TELEMETRY_STATE: SystemTelemetryContextType = Object.freeze({
  status: "active",
  node: "omega-core",
});

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
TelemetryContext.displayName = "TelemetryContext";

/**
 * React Context Provider component for exposing system telemetry data to the component tree.
 */
export const SystemTelemetryProvider = ({
  children,
}: SystemTelemetryProviderProps): JSX.Element => {
  const value = useMemo(() => DEFAULT_TELEMETRY_STATE, []);

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
};

SystemTelemetryProvider.displayName = "SystemTelemetryProvider";

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