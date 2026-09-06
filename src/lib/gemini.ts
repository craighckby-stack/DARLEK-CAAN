/**
 * DARLEK CAAN — Gemini API Utility
 *
 * Official @google/genai SDK implementation.
 * All external Gemini LLM calls route through this module.
 * Includes automated fallback across current Gemini 3.x models, concurrency limiting, and smart error handling.
 */

import { GoogleGenAI } from '@google/genai';

const MODEL_CANDIDATES = [
  'gemini-3.6-flash',
  'gemini-flash-latest',
] as const;

let rateLimitUntil = 0;
let invalidKeyUntil = 0;
let lastInvalidKey = '';

// Precompiled Regex patterns for zero-allocation parsing during error handling loops
const RETRY_REGEX_1 = /retryDelay["']?\s*:\s*["']?(\d+(?:\.\d+)?)s/i;
const RETRY_REGEX_2 = /retry in (\d+(?:\.\d+)?)s/i;
const RETRY_REGEX_3 = /please retry after (\d+)s/i;

function parseRetryDelayMs(errMsg: string): number {
  const secMatch = RETRY_REGEX_1.exec(errMsg) || RETRY_REGEX_2.exec(errMsg) || RETRY_REGEX_3.exec(errMsg);
  if (secMatch) {
    const seconds = parseFloat(secMatch[1]);
    return seconds >= 5 && seconds <= 120 ? seconds * 1000 : (seconds < 5 ? 5000 : 120000);
  }
  return 30000;
}

class ConcurrencyLimiter {
  private activeCount = 0;
  private queue: (() => void)[] = [];
  private readonly maxConcurrency: number;

  constructor(maxConcurrency = 2) {
    this.maxConcurrency = maxConcurrency;
  }

  acquire(): Promise<void> | void {
    if (this.activeCount < this.maxConcurrency) {
      this.activeCount++;
      return;
    }
    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    this.activeCount--;
    if (this.queue.length > 0) {
      this.activeCount++;
      const next = this.queue.shift();
      if (next) {
        setTimeout(next, 100);
      }
    }
  }
}

const limiter = new ConcurrencyLimiter(2);

// Client instance cache to avoid repeatedly instantiating GoogleGenAI per call with identical API keys
let cachedApiKey = '';
let cachedClient: GoogleGenAI | null = null;

function getGeminiClient(apiKey: string): GoogleGenAI {
  if (cachedClient && cachedApiKey === apiKey) {
    return cachedClient;
  }
  cachedApiKey = apiKey;
  cachedClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  return cachedClient;
}

export interface GeminiCallConfig {
  maxTokens?: number;
  temperature?: number;
  responseMimeType?: string;
  responseSchema?: unknown;
}

export interface ChatPart {
  text: string;
}

export interface ChatContent {
  role: string;
  parts: ChatPart[];
}

/**
 * Call Gemini with single prompt and automatic model fallback
 */
export async function callGemini(
  systemInstruction: string,
  userPrompt: string,
  apiKey: string,
  options?: GeminiCallConfig
): Promise<string | null> {
  const cleanKey = (apiKey || '').trim();
  if (!cleanKey) return null;

  const now = Date.now();
  if (now < rateLimitUntil) return null;
  if (cleanKey === lastInvalidKey && now < invalidKeyUntil) return null;

  const acquireResult = limiter.acquire();
  if (acquireResult) await acquireResult;

  try {
    const ai = getGeminiClient(cleanKey);

    const temperature = options?.temperature ?? 0.6;
    const maxOutputTokens = options?.maxTokens ?? 8192;
    const trimmedSys = systemInstruction ? systemInstruction.trim() : '';

    const config: Record<string, unknown> = {
      temperature,
      maxOutputTokens,
    };

    if (trimmedSys) {
      config.systemInstruction = trimmedSys;
    }
    if (options?.responseMimeType) {
      config.responseMimeType = options.responseMimeType;
    }
    if (options?.responseSchema) {
      config.responseSchema = options.responseSchema;
    }

    for (let i = 0, len = MODEL_CANDIDATES.length; i < len; i++) {
      const model = MODEL_CANDIDATES[i];
      try {
        const response = await ai.models.generateContent({
          model,
          contents: userPrompt,
          config,
        });

        const text = response?.text;
        if (typeof text === 'string' && text) {
          return text;
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        
        if (
          errMsg.includes('401') ||
          errMsg.includes('403') ||
          errMsg.includes('API_KEY_INVALID') ||
          errMsg.includes('API key not valid') ||
          errMsg.includes('invalid API key') ||
          errMsg.includes('key is not valid')
        ) {
          invalidKeyUntil = Date.now() + 60000;
          lastInvalidKey = cleanKey;
          console.warn('[Gemini API] API key validation failed (401/403) — falling back to local engine.');
          return null;
        }

        if (
          errMsg.includes('location is not supported') ||
          errMsg.includes('Location is not supported') ||
          errMsg.includes('FAILED_PRECONDITION')
        ) {
          rateLimitUntil = Date.now() + 300000;
          console.warn('[Gemini API] Region geoblocked — falling back to local engine.');
          return null;
        }

        if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('Quota')) {
          const delayMs = parseRetryDelayMs(errMsg);
          rateLimitUntil = Date.now() + delayMs;
          console.warn(`[Gemini API] Quota/rate-limit reached on ${model} (cooldown: ${Math.round(delayMs / 1000)}s) — switching to local engine.`);
          return null;
        }
      }
    }

    return null;
  } finally {
    limiter.release();
  }
}

/**
 * Call Gemini with multi-turn conversation contents
 */
export async function callGeminiMultiTurn(
  systemInstruction: string,
  contents: ChatContent[],
  apiKey: string,
  options?: GeminiCallConfig
): Promise<string | null> {
  const cleanKey = (apiKey || '').trim();
  if (!cleanKey) return null;

  const now = Date.now();
  if (now < rateLimitUntil) return null;
  if (cleanKey === lastInvalidKey && now < invalidKeyUntil) return null;

  const acquireResult = limiter.acquire();
  if (acquireResult) await acquireResult;

  try {
    const ai = getGeminiClient(cleanKey);

    const cLen = contents.length;
    const formattedContents = new Array(cLen);
    for (let i = 0; i < cLen; i++) {
      const c = contents[i];
      const role = c.role;
      const mappedRole = (role === 'model' || role === 'assistant' || role === 'caan') ? 'model' : 'user';
      const parts = c.parts;
      const pLen = parts.length;
      const formattedParts = new Array(pLen);
      for (let j = 0; j < pLen; j++) {
        formattedParts[j] = { text: parts[j].text };
      }
      formattedContents[i] = { role: mappedRole, parts: formattedParts };
    }

    const temperature = options?.temperature ?? 0.6;
    const maxOutputTokens = options?.maxTokens ?? 8192;
    const trimmedSys = systemInstruction ? systemInstruction.trim() : '';

    const config: Record<string, unknown> = {
      temperature,
      maxOutputTokens,
    };

    if (trimmedSys) {
      config.systemInstruction = trimmedSys;
    }
    if (options?.responseMimeType) {
      config.responseMimeType = options.responseMimeType;
    }
    if (options?.responseSchema) {
      config.responseSchema = options.responseSchema;
    }

    for (let i = 0, len = MODEL_CANDIDATES.length; i < len; i++) {
      const model = MODEL_CANDIDATES[i];
      try {
        const response = await ai.models.generateContent({
          model,
          contents: formattedContents,
          config,
        });

        const text = response?.text;
        if (typeof text === 'string' && text) {
          return text;
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);

        if (
          errMsg.includes('401') ||
          errMsg.includes('403') ||
          errMsg.includes('API_KEY_INVALID') ||
          errMsg.includes('API key not valid') ||
          errMsg.includes('invalid API key')
        ) {
          invalidKeyUntil = Date.now() + 60000;
          lastInvalidKey = cleanKey;
          console.warn('[Gemini API] API key validation failed (401/403) — falling back to local engine.');
          return null;
        }

        if (
          errMsg.includes('location is not supported') ||
          errMsg.includes('Location is not supported') ||
          errMsg.includes('FAILED_PRECONDITION')
        ) {
          rateLimitUntil = Date.now() + 300000;
          console.warn('[Gemini API] Region geoblocked — falling back to local engine.');
          return null;
        }

        if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('Quota')) {
          const delayMs = parseRetryDelayMs(errMsg);
          rateLimitUntil = Date.now() + delayMs;
          console.warn(`[Gemini API] Quota/rate-limit reached on ${model} (cooldown: ${Math.round(delayMs / 1000)}s) — switching to local engine.`);
          return null;
        }
      }
    }

    return null;
  } finally {
    limiter.release();
  }
}