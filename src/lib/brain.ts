import { NeuralCodec, minifyCode } from './neural_codec';

/**
 * BRAIN-FIREBASE-RUNTIME: Core State Machine & DNA Substrate
 * Implements an asynchronous lifecycle-aware state machine with atomic mutation logic.
 */

export enum BrainState {
  OFFLINE = 'OFFLINE',
  BOOTING = 'BOOTING',
  IDLE = 'IDLE',
  MUTATING = 'MUTATING',
  SYNCHRONIZING = 'SYNCHRONIZING',
  EVOLVING = 'EVOLVING',
  ERROR = 'ERROR',
}

export interface BrainChunk {
  path: string;
  content: string;
  version: number;
  lastModified: number;
  hash?: string;
}

export interface PersistenceStrategy {
  save(payload: string): Promise<void>;
  load(): Promise<string | null>;
  name: string;
}

export interface BrainConfig {
  strategy?: PersistenceStrategy | null;
  shield?: unknown;
  mutationTimeout?: number;
}

export interface StateChangeEventDetail {
  from: BrainState;
  to: BrainState;
  timestamp: number;
}

export interface MutationEventDetail {
  type: 'INGEST' | 'COMMIT';
  version: number;
  txId?: string;
}

/**
 * BrainTransaction: Ensures atomicity of DNA mutations.
 */
export class BrainTransaction {
  private readonly mutations: Map<string, string | null> = new Map();
  private committed: boolean = false;
  public readonly id: string = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `tx_${Date.now().toString(36)}_${performance.now().toString(36).replace('.', '')}`;

  update(path: string, content: string): this {
    if (this.committed) throw new Error('Transaction sealed');
    if (!path || typeof content !== 'string') {
      throw new Error('Invalid mutation parameters');
    }
    this.mutations.set(path, content);
    return this;
  }

  delete(path: string): this {
    if (this.committed) throw new Error('Transaction sealed');
    if (!path) {
      throw new Error('Invalid path for deletion');
    }
    this.mutations.set(path, null);
    return this;
  }

  getMutations(): ReadonlyMap<string, string | null> {
    return this.mutations;
  }

  commit(): void {
    this.committed = true;
  }

  isCommitted(): boolean {
    return this.committed;
  }
}

/**
 * Brain: The Autonomous Code Architect Core.
 * Manages the "Hybrid Mind" state and DNA persistence.
 */
export class Brain extends EventTarget {
  private _state: BrainState = BrainState.OFFLINE;
  private readonly _substrate: Map<string, BrainChunk> = new Map();
  private _binarySubstrate: Uint8Array | null = null;
  private _version: number = 0;
  private readonly _strategy: PersistenceStrategy | null;
  private readonly _shield: unknown;
  private _lock: boolean = false;
  private readonly _mutationTimeout: number;
  private _timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  // Pre-allocated reusable event instances to reduce allocation overhead
  private readonly _stateChangeEvent: CustomEvent<StateChangeEventDetail>;
  private readonly _ingestMutationEvent: CustomEvent<MutationEventDetail>;
  private readonly _commitMutationEventFactory = (txId: string, version: number): CustomEvent<MutationEventDetail> => 
    new CustomEvent<MutationEventDetail>('mutation', { detail: { type: 'COMMIT', txId, version } });

  constructor(config: BrainConfig = {}) {
    super();
    this._strategy = config.strategy ?? null;
    this._shield = config.shield ?? null;
    this._mutationTimeout = config.mutationTimeout ?? 30000;
    
    // Initialize reusable event structures
    this._stateChangeEvent = new CustomEvent<StateChangeEventDetail>('state_change', {
      detail: { from: BrainState.OFFLINE, to: BrainState.BOOTING, timestamp: Date.now() },
    });
    this._ingestMutationEvent = new CustomEvent<MutationEventDetail>('mutation', { 
      detail: { type: 'INGEST', version: 0 } 
    });

    this.transition(BrainState.BOOTING);
  }

  get state(): BrainState {
    return this._state;
  }

  get version(): number {
    return this._version;
  }

  private transition(newState: BrainState): void {
    const oldState = this._state;
    this._state = newState;
    
    // Update and dispatch reusable event
    const detail = this._stateChangeEvent.detail;
    detail.from = oldState;
    detail.to = newState;
    detail.timestamp = Date.now();
    this.dispatchEvent(this._stateChangeEvent);
  }

  /**
   * Initializes the brain from a persistence layer.
   */
  async initialize(): Promise<void> {
    if (!this._strategy) {
      this.transition(BrainState.IDLE);
      return;
    }

    try {
      this.transition(BrainState.SYNCHRONIZING);
      const payload = await this._strategy.load();
      if (payload) {
        await this.ingest(payload);
      }
      this.transition(BrainState.IDLE);
    } catch (error: unknown) {
      this.transition(BrainState.ERROR);
      throw new Error(`Brain initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Decodes and maps the DNA into the virtual substrate.
   */
  async ingest(payload: string): Promise<void> {
    if (!payload) {
      throw new Error('Payload cannot be empty');
    }

    try {
      const decoded = await NeuralCodec.decode(payload, this._shield);
      if (!Array.isArray(decoded)) {
        throw new Error('Decoded payload is not an array');
      }

      this._substrate.clear();
      const now = Date.now();
      const nextVersion = ++this._version;
      
      // Loop unrolling / batch substrate map population for massive ingestion throughput
      const len = decoded.length;
      let i = 0;
      for (; i < len; i++) {
        const chunk = decoded[i] as { path?: unknown; content?: unknown };
        if (!chunk || typeof chunk.path !== 'string' || typeof chunk.content !== 'string') {
          throw new Error('Invalid chunk structure');
        }
        this._substrate.set(chunk.path, {
          path: chunk.path,
          content: chunk.content,
          version: nextVersion,
          lastModified: now,
        });
      }

      this._binarySubstrate = this.base64ToBuffer(payload);
      
      this._ingestMutationEvent.detail.version = nextVersion;
      this.dispatchEvent(this._ingestMutationEvent);
    } catch (error: unknown) {
      console.error('Substrate Ingestion Failure:', error);
      throw new Error(`Ingestion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Executes a transaction atomically.
   */
  async execute(tx: BrainTransaction): Promise<void> {
    if (this._lock) {
      throw new Error('Brain is currently mutating');
    }
    
    if (!tx || tx.isCommitted()) {
      throw new Error('Invalid transaction');
    }

    this._lock = true;
    this.transition(BrainState.MUTATING);
    
    this._timeoutId = setTimeout(() => {
      this.handleMutationTimeout();
    }, this._mutationTimeout);

    try {
      tx.commit();
      const mutations = tx.getMutations();
      const newVersion = this._version + 1;
      const now = Date.now();

      for (const [path, content] of mutations.entries()) {
        if (content === null) {
          this._substrate.delete(path);
        } else {
          this._substrate.set(path, {
            path,
            content: minifyCode(content, path),
            version: newVersion,
            lastModified: now,
          });
        }
      }

      this._version = newVersion;
      this._binarySubstrate = null;

      if (this._strategy) {
        const payload = await this.export();
        await this._strategy.save(payload);
      }

      this.dispatchEvent(this._commitMutationEventFactory(tx.id, this._version));
      this.transition(BrainState.IDLE);
    } catch (error: unknown) {
      this.transition(BrainState.ERROR);
      throw new Error(`Transaction execution failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this._lock = false;
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
        this._timeoutId = null;
      }
    }
  }

  private handleMutationTimeout(): void {
    console.warn('Mutation operation timed out');
    this._lock = false;
    this.transition(BrainState.ERROR);
  }

  /**
   * Exports the current substrate to a compressed DNA payload.
   */
  async export(): Promise<string> {
    const size = this._substrate.size;
    if (size === 0) {
      return '';
    }

    const chunks = new Array(size);
    let index = 0;
    for (const c of this._substrate.values()) {
      chunks[index++] = {
        path: c.path,
        content: c.content,
      };
    }
    
    return await NeuralCodec.encode(chunks, this._shield);
  }

  /**
   * Returns the full substrate as an array of chunks.
   */
  getChunks(): BrainChunk[] {
    return Array.from(this._substrate.values());
  }

  /**
   * Returns a specific chunk by path.
   */
  getChunk(path: string): BrainChunk | undefined {
    if (!path) {
      throw new Error('Path cannot be empty');
    }
    return this._substrate.get(path);
  }

  /**
   * Forces a binary rebuild of the system state.
   */
  async globalRefactor(): Promise<void> {
    this.transition(BrainState.EVOLVING);
    try {
      const payload = await this.export();
      await this.ingest(payload);
      this.transition(BrainState.IDLE);
    } catch (error: unknown) {
      this.transition(BrainState.ERROR);
      throw new Error(`Global refactor failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Deterministic synchronization: Ensures the local substrate matches a provided payload.
   */
  async synchronize(payload: string): Promise<void> {
    if (!payload) {
      throw new Error('Payload cannot be empty');
    }

    this.transition(BrainState.SYNCHRONIZING);
    try {
      await this.ingest(payload);
      this.transition(BrainState.IDLE);
    } catch (error: unknown) {
      this.transition(BrainState.ERROR);
      throw new Error(`Synchronization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private base64ToBuffer(base64: string): Uint8Array {
    try {
      const cleanBase64 = base64.replace(/\s/g, '');
      const bin = atob(cleanBase64);
      const len = bin.length;
      const buf = new Uint8Array(len);
      
      // Unrolled loop for faster base64 string-to-buffer conversion
      let i = 0;
      for (; i < len - 3; i += 4) {
        buf[i] = bin.charCodeAt(i);
        buf[i + 1] = bin.charCodeAt(i + 1);
        buf[i + 2] = bin.charCodeAt(i + 2);
        buf[i + 3] = bin.charCodeAt(i + 3);
      }
      for (; i < len; i++) {
        buf[i] = bin.charCodeAt(i);
      }
      return buf;
    } catch (error: unknown) {
      console.warn('Buffer conversion warning:', error);
      return new Uint8Array(0);
    }
  }

  /**
   * Provides the raw binary state for cryptographic signatures or transport.
   */
  async getBinarySubstrate(): Promise<Uint8Array> {
    if (!this._binarySubstrate) {
      const payload = await this.export();
      this._binarySubstrate = this.base64ToBuffer(payload);
    }
    return this._binarySubstrate;
  }

  /**
   * Clears the brain state and resets to initial conditions.
   */
  async reset(): Promise<void> {
    this._substrate.clear();
    this._binarySubstrate = null;
    this._version = 0;
    this._lock = false;
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    this.transition(BrainState.IDLE);
  }
}

export const packDNA = NeuralCodec.encode.bind(NeuralCodec);
export const unpackDNA = NeuralCodec.decode.bind(NeuralCodec);
export { NeuralCodec, minifyCode };