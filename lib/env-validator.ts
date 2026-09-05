/**
 * ARCHITECTURAL ENVIRONMENT VALIDATOR ENGINE
 * Role: Validates, sanitizes, and provides typed access to environment variables.
 * Integration: Interfaced by diagnostic engine, sandbox orchestrator, and model router.
 * Siphoned from: craighckby-stack/DARLEK-CAAN-Cognitive-Engine (Tessera Enterprise)
 */

export type EnvironmentType = 'development' | 'production' | 'test';
export type SandboxIsolationLevel = 'strict' | 'permissive' | 'zero-leak';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface SystemEnvironmentConfig {
  readonly NODE_ENV: EnvironmentType;
  readonly DATABASE_URL: string;
  readonly GEMINI_API_KEY: string;
  readonly OPENAI_API_KEY?: string;
  readonly ANTHROPIC_API_KEY?: string;
  readonly DEEPSEEK_API_KEY?: string;
  readonly OLLAMA_BASE_URL: string;
  readonly MEMORY_DIR: string;
  readonly CONSENSUS_WEIGHT_THRESHOLD: number;
  readonly SANDBOX_ISOLATION_LEVEL: SandboxIsolationLevel;
  readonly DIAGNOSTICS_ENABLED: boolean;
  readonly LOG_LEVEL: LogLevel;
  readonly PORT: number;
}

const ALLOWED_NODE_ENVS = ['development', 'production', 'test'] as const;
const ALLOWED_SANDBOX_LEVELS = ['strict', 'permissive', 'zero-leak'] as const;
const ALLOWED_LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;

export class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private readonly config: SystemEnvironmentConfig;

  private constructor() {
    this.config = Object.freeze(this.validate());
  }

  public static getInstance(): EnvironmentValidator {
    EnvironmentValidator.instance ??= new EnvironmentValidator();
    return EnvironmentValidator.instance;
  }

  public get<K extends keyof SystemEnvironmentConfig>(key: K): SystemEnvironmentConfig[K] {
    return this.config[key];
  }

  public getAll(): Readonly<SystemEnvironmentConfig> {
    return this.config;
  }

  private validateEnum<T extends string>(
    value: string | undefined,
    fallback: T,
    allowedValues: readonly T[],
    configName: string
  ): T {
    const resolvedValue = (value ?? fallback) as T;
    if (!allowedValues.includes(resolvedValue)) {
      throw new Error(
        `Invalid ${configName} configuration: "${resolvedValue}". Allowed values: ${allowedValues.join(', ')}.`
      );
    }
    return resolvedValue;
  }

  private validate(): SystemEnvironmentConfig {
    const nodeEnv = this.validateEnum(
      process.env.NODE_ENV,
      'development',
      ALLOWED_NODE_ENVS,
      'NODE_ENV'
    );

    const sandboxIsolation = this.validateEnum(
      process.env.SANDBOX_ISOLATION_LEVEL,
      'zero-leak',
      ALLOWED_SANDBOX_LEVELS,
      'SANDBOX_ISOLATION_LEVEL'
    );

    const logLevel = this.validateEnum(
      process.env.LOG_LEVEL,
      'info',
      ALLOWED_LOG_LEVELS,
      'LOG_LEVEL'
    );

    const parsedConsensus = process.env.CONSENSUS_WEIGHT_THRESHOLD !== undefined
      ? Number(process.env.CONSENSUS_WEIGHT_THRESHOLD)
      : NaN;
    const consensusWeight = Number.isNaN(parsedConsensus) ? 0.75 : parsedConsensus;

    const parsedPort = process.env.PORT !== undefined
      ? Number.parseInt(process.env.PORT, 10)
      : NaN;
    const port = Number.isNaN(parsedPort) ? 3000 : parsedPort;

    return {
      NODE_ENV: nodeEnv,
      DATABASE_URL: process.env.DATABASE_URL ?? 'file:./dev.db',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
      OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
      MEMORY_DIR: process.env.MEMORY_DIR ?? './memory',
      CONSENSUS_WEIGHT_THRESHOLD: consensusWeight,
      SANDBOX_ISOLATION_LEVEL: sandboxIsolation,
      DIAGNOSTICS_ENABLED: process.env.DIAGNOSTICS_ENABLED !== 'false',
      LOG_LEVEL: logLevel,
      PORT: port,
    };
  }
}

export const envConfig = EnvironmentValidator.getInstance();