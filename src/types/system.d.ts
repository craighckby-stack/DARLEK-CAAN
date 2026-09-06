export const enum SystemMode {
  Development = 'development',
  Production = 'production',
  Staging = 'staging'
}

export interface SystemConfig {
  readonly version: string;
  readonly mode: SystemMode;
  readonly debug: boolean;
}

export interface AgentOrchestratorProps {
  readonly orchestratorId: string;
  readonly priority: number;
}

export type DeepReadonly<T> = T extends Function | Date | RegExp | Map<unknown, unknown> | Set<unknown>
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;