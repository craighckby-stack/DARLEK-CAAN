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
  readonly OPENAI_API_KEY?: string | undefined;
  readonly ANTHROPIC_API_KEY?: string | undefined;
  readonly DEEPSEEK_API_KEY?: string | undefined;
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

const ALLOWED_NODE_ENVS_SET = new Set<string>(ALLOWED_NODE_ENVS);
const ALLOWED_SANDBOX_LEVELS_SET = new Set<string>(ALLOWED_SANDBOX_LEVELS);
const ALLOWED_LOG_LEVELS_SET = new Set<string>(ALLOWED_LOG_LEVELS);

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
    allowedSet: Set<string>,
    allowedArray: readonly T[],
    configName: string
  ): T {
    const resolvedValue = (value ?? fallback) as T;
    if (!allowedSet.has(resolvedValue)) {
      throw new Error(
        `Invalid ${configName} configuration: "${resolvedValue}". Allowed values: ${allowedArray.join(', ')}.`
      );
    }
    return resolvedValue;
  }

  private parseNumeric(value: string | undefined, fallback: number, isInteger = false): number {
    if (value === undefined) {
      return fallback;
    }
    const parsed = isInteger ? Number.parseInt(value, 10) : Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  private validate(): SystemEnvironmentConfig {
    const env = process.env;

    const nodeEnv = this.validateEnum(
      env['NODE_ENV'],
      'development',
      ALLOWED_NODE_ENVS_SET,
      ALLOWED_NODE_ENVS,
      'NODE_ENV'
    );

    const sandboxIsolation = this.validateEnum(
      env['SANDBOX_ISOLATION_LEVEL'],
      'zero-leak',
      ALLOWED_SANDBOX_LEVELS_SET,
      ALLOWED_SANDBOX_LEVELS,
      'SANDBOX_ISOLATION_LEVEL'
    );

    const logLevel = this.validateEnum(
      env['LOG_LEVEL'],
      'info',
      ALLOWED_LOG_LEVELS_SET,
      ALLOWED_LOG_LEVELS,
      'LOG_LEVEL'
    );

    const consensusWeight = this.parseNumeric(env['CONSENSUS_WEIGHT_THRESHOLD'], 0.75);
    const port = this.parseNumeric(env['PORT'], 3000, true);

    return {
      NODE_ENV: nodeEnv,
      DATABASE_URL: env['DATABASE_URL'] ?? 'file:./dev.db',
      GEMINI_API_KEY: env['GEMINI_API_KEY'] ?? '',
      OPENAI_API_KEY: env['OPENAI_API_KEY'],
      ANTHROPIC_API_KEY: env['ANTHROPIC_API_KEY'],
      DEEPSEEK_API_KEY: env['DEEPSEEK_API_KEY'],
      OLLAMA_BASE_URL: env['OLLAMA_BASE_URL'] ?? 'http://localhost:11434',
      MEMORY_DIR: env['MEMORY_DIR'] ?? './memory',
      CONSENSUS_WEIGHT_THRESHOLD: consensusWeight,
      SANDBOX_ISOLATION_LEVEL: sandboxIsolation,
      DIAGNOSTICS_ENABLED: env['DIAGNOSTICS_ENABLED'] !== 'false',
      LOG_LEVEL: logLevel,
      PORT: port,
    };
  }
}

export const envConfig = EnvironmentValidator.getInstance();