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

const ALLOWED_NODE_ENVS: readonly EnvironmentType[] = ['development', 'production', 'test'];
const ALLOWED_SANDBOX_LEVELS: readonly SandboxIsolationLevel[] = ['strict', 'permissive', 'zero-leak'];
const ALLOWED_LOG_LEVELS: readonly LogLevel[] = ['debug', 'info', 'warn', 'error'];

export class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private readonly config: SystemEnvironmentConfig;

  private constructor() {
    this.config = Object.freeze(this.validate());
  }

  public static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  public get<K extends keyof SystemEnvironmentConfig>(key: K): SystemEnvironmentConfig[K] {
    return this.config[key];
  }

  public getAll(): Readonly<SystemEnvironmentConfig> {
    return this.config;
  }

  private validate(): SystemEnvironmentConfig {
    const nodeEnv = (process.env.NODE_ENV ?? 'development') as EnvironmentType;
    if (!ALLOWED_NODE_ENVS.includes(nodeEnv)) {
      throw new Error(`Invalid NODE_ENV configuration: "${nodeEnv}". Allowed values: ${ALLOWED_NODE_ENVS.join(', ')}.`);
    }

    const sandboxIsolation = (process.env.SANDBOX_ISOLATION_LEVEL ?? 'zero-leak') as SandboxIsolationLevel;
    if (!ALLOWED_SANDBOX_LEVELS.includes(sandboxIsolation)) {
      throw new Error(`Invalid SANDBOX_ISOLATION_LEVEL configuration: "${sandboxIsolation}". Allowed values: ${ALLOWED_SANDBOX_LEVELS.join(', ')}.`);
    }

    const logLevel = (process.env.LOG_LEVEL ?? 'info') as LogLevel;
    if (!ALLOWED_LOG_LEVELS.includes(logLevel)) {
      throw new Error(`Invalid LOG_LEVEL configuration: "${logLevel}". Allowed values: ${ALLOWED_LOG_LEVELS.join(', ')}.`);
    }

    const rawConsensus = process.env.CONSENSUS_WEIGHT_THRESHOLD;
    const parsedConsensus = rawConsensus !== undefined ? Number(rawConsensus) : 0.75;
    const consensusWeight = Number.isNaN(parsedConsensus) ? 0.75 : parsedConsensus;

    const rawPort = process.env.PORT;
    const parsedPort = rawPort !== undefined ? Number.parseInt(rawPort, 10) : 3000;
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