import { NextRequest, NextResponse } from 'next/server';
import { callLlm, getDefaultGeminiKey } from '@/lib/llm-provider';
import { mainWorker } from '@/lib/main-worker';
import type { ProposeBody } from '@/lib/types';
import { db } from '@/lib/db';
import { safeReqJson } from '@/lib/safe-json';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

interface NonCodeResult {
  readonly isNonCode: boolean;
  readonly reason: string;
}

interface NewFilePayload {
  readonly path: string;
  readonly content: string;
}

interface RejectionMemoryItem {
  readonly filePath: string;
  readonly riskScore: number;
  readonly reason: string;
  readonly analysis: string;
}

interface UserRepoItem {
  readonly isGlobalSiphon?: boolean;
  readonly fullName?: string;
  readonly name?: string;
  readonly description?: string;
  readonly language?: string;
}

interface GitTreeItem {
  readonly type: string;
  readonly path: string;
}

interface SanityViolation {
  readonly severity: string;
  readonly message: string;
}

interface ParsedMutationResponse {
  readonly analysis?: string;
  readonly riskScore?: number;
  readonly affectedFiles?: readonly string[];
  readonly newFiles?: readonly NewFilePayload[];
  readonly proposedCode?: string;
}

interface ExtendedProposeBody extends ProposeBody {
  readonly sessionId?: string;
  readonly userReposContext?: readonly UserRepoItem[];
  readonly isArchitecturalGenesis?: boolean;
  readonly hallucinationLevel?: number;
  readonly repoFiles?: readonly string[];
}

interface PromptContext {
  readonly rejectionContext: string;
  readonly appliedMutationsContext: string;
  readonly userReposContextStr: string;
  readonly repoFilesContext: string;
  readonly proposeSystemPrompt: string;
}

interface ParsedLlmResult {
  readonly parsedResponse: ParsedMutationResponse | null;
  readonly proposedCode: string;
  readonly analysis: string;
}

const FALLBACK_SIPHON_SOURCE = 'craighckby-stack/DARLEK-CAAN-Cognitive-Engine';
const GITHUB_API_BASE = 'https://api.github.com/repos';
const MAX_FILE_SAMPLE_LENGTH = 2000;
const MAX_PROPOSE_CONTENT_LENGTH = 35000;

const AI_PROJECT_FALLBACK_SIPHON = `
--- SIPHONED SOURCE: ${FALLBACK_SIPHON_SOURCE} | File: src/ai-core/adaptive-orchestration.ts (Siphoned Fallback) ---
/**
 * Advanced Multi-Agent Game Theory Consensus Selector
 * Evaluates agent debate profiles using dynamic Nash Equilibrium models
 * and minimizes cognitive friction across active evolution cycles.
 */
export interface AgentProfile {
  id: string;
  name: string;
  confidence: number;
  weight: number;
  entropyBias: number;
}

export class AdaptiveOrchestraManager {
  public static calculateNashEquilibrium(votes: number[], weights: number[]): { consensusIndex: number; friction: number } {
    const totalWeight = weights.reduce((accum, val) => accum + val, 0);
    const weightedSum = votes.reduce((sum, vote, idx) => sum + vote * (weights[idx] / totalWeight), 0);
    
    const variance = votes.reduce((sum, vote, idx) => sum + Math.pow(vote - weightedSum, 2) * (weights[idx] / totalWeight), 0);
    const friction = Math.sqrt(variance);
    
    return {
      consensusIndex: weightedSum,
      friction: parseFloat(friction.toFixed(4))
    };
  }

  public static autoCalibrateWeights(agents: AgentProfile[], friction: number): AgentProfile[] {
    return agents.map(agent => {
      const adjustment = friction > 0.4 
        ? -0.05 * Math.sign(agent.entropyBias) 
        : 0.05 * (agent.confidence / 100);
      return {
        ...agent,
        weight: Math.max(0.1, Math.min(2.0, agent.weight + adjustment))
      };
    });
  }
}
------------------------------------------------

--- SIPHONED SOURCE: ${FALLBACK_SIPHON_SOURCE} | File: src/ai-core/zero-leak-sandbox.ts (Siphoned Fallback) ---
/**
 * Zero-Leak Sandboxed Code Executor & Mutation Gate
 * Leverages AbortController Registries and WeakMaps to prevent memory fatigue.
 */
export class ZeroLeakSandbox {
  private registries = new WeakMap<object, AbortController>();

  public executeInSandbox(instance: object, action: () => void, timeoutMs = 5000): void {
    const controller = new AbortController();
    this.registries.set(instance, controller);

    const timeout = setTimeout(() => {
      controller.abort();
      console.warn("[SANDBOX] Execution aborted due to memory/CPU timeout constraint.");
    }, timeoutMs);

    try {
      action();
    } finally {
      clearTimeout(timeout);
      this.registries.delete(instance);
    }
  }
}
------------------------------------------------
`;

/**
 * Detects if file content is encrypted, binary, or non-code using pattern and entropy checks.
 */
function isNonCodeContent(content: string): NonCodeResult {
  if (content.includes('"iv"') && content.includes('"data"') && content.includes('AES')) {
    return { isNonCode: true, reason: 'File appears to be encrypted (AES) data, not source code' };
  }

  const trimmedContent = content.trim();
  const sample = trimmedContent.length > MAX_FILE_SAMPLE_LENGTH 
    ? trimmedContent.slice(0, MAX_FILE_SAMPLE_LENGTH) 
    : trimmedContent;

  if (sample.length < 10) {
    return { isNonCode: false, reason: '' };
  }

  const hasCodeMarkers = [
    '{', '}', ';', 'const ', 'import ', 'export ', 
    'function ', 'class ', '//', '/*', '<div', 'import('
  ].some((marker) => sample.includes(marker));

  if (hasCodeMarkers) {
    return { isNonCode: false, reason: '' };
  }

  const base64CharsOnlyCount = sample.replace(/[^A-Za-z0-9+/=]/g, '').length;
  const regularSpacesCount = (sample.match(/ /g) || []).length;
  
  if (sample.length > 100) {
    const isMainlyBase64 = base64CharsOnlyCount / sample.length > 0.85;
    const hasMinimalSpaces = (regularSpacesCount / sample.length) < 0.02;
    if (isMainlyBase64 && hasMinimalSpaces) {
      return { isNonCode: true, reason: 'File appears to be base64-encoded data, not source code' };
    }
  }

  if (/^data:[\w/\-+.]+;base64,/.test(sample)) {
    return { isNonCode: true, reason: 'File appears to be base64-encoded data, not source code' };
  }

  const lines = content.split('\n');
  if (lines.length <= 3 && content.length > 5000) {
    const looksLikeMinifiedCode = ['function', 'var ', 'const ', '{', ';'].some((keyword) => content.includes(keyword));
    if (!looksLikeMinifiedCode) {
      return { isNonCode: true, reason: 'File appears to be minified/binary data (very few lines, very long)' };
    }
  }

  return { isNonCode: false, reason: '' };
}

/**
 * Fetches context siphons from the primary AI repository.
 */
async function fetchAIProjectSiphon(token?: string): Promise<string> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Darlek-Caan-Engine',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const treeResponse = await fetch(`${GITHUB_API_BASE}/${FALLBACK_SIPHON_SOURCE}/git/trees/main?recursive=1`, { headers });
    
    if (!treeResponse.ok) {
      throw new Error(`Failed to fetch tree: ${treeResponse.status}`);
    }
    
    const treeData = await treeResponse.json() as { readonly tree?: readonly GitTreeItem[] };
    if (!treeData.tree || !Array.isArray(treeData.tree)) {
      throw new Error('Invalid tree format');
    }

    const codeFiles = treeData.tree.filter((file) => 
      file.type === 'blob' && 
      /\.(ts|tsx|js|jsx|py|go|rs|json)$/.test(file.path) &&
      !['node_modules', 'dist', '.next'].some((excludedDir) => file.path.includes(excludedDir))
    );

    if (codeFiles.length === 0) {
      return '';
    }

    const preferredFiles = codeFiles.filter((file) => {
      const pathLower = file.path.toLowerCase();
      return ['core', 'agent', 'debate', 'engine'].some((keyword) => pathLower.includes(keyword));
    });
    
    const filesToFetch = preferredFiles.length > 0 ? preferredFiles.slice(0, 3) : codeFiles.slice(0, 3);

    const siphonPromises = filesToFetch.map(async (file) => {
      try {
        const contentResponse = await fetch(`${GITHUB_API_BASE}/${FALLBACK_SIPHON_SOURCE}/contents/${file.path}`, { headers });
        if (!contentResponse.ok) {
          return null;
        }
        
        const contentData = await contentResponse.json() as { readonly content?: string };
        if (!contentData.content) {
          return null;
        }
        
        const rawCode = Buffer.from(contentData.content, 'base64').toString('utf8');
        return `\n\n--- SIPHONED SOURCE: ${FALLBACK_SIPHON_SOURCE} | File: ${file.path} ---\n${rawCode.slice(0, 5000)}\n------------------------------------------------\n`;
      } catch {
        return null;
      }
    });

    const results = await Promise.all(siphonPromises);
    return results.filter((result): result is string => Boolean(result)).join('');
  } catch (error) {
    console.warn('[Siphon Fetch] Failed to fetch live repo code:', error);
    return '';
  }
}

/**
 * Constructs prompt sections based on operational flags and contextual telemetry.
 */
function buildPromptContext(body: ExtendedProposeBody): PromptContext {
  const { rejectionMemory, userReposContext, isArchitecturalGenesis, repoFiles } = body;

  const rejectionContext = rejectionMemory && rejectionMemory.length > 0
    ? `\n\nPREVIOUS REJECTIONS (learn from these — avoid repeating mistakes):\n${rejectionMemory
        .slice(0, 5)
        .map((item) => `  - File: ${item.filePath} | Risk: ${item.riskScore}/10 | Reason: ${item.reason} | Analysis: ${item.analysis.slice(0, 100)}`)
        .join('\n')}\n\nIMPORTANT: If you are proposing changes to a file that was previously rejected, take a MORE CONSERVATIVE approach. Focus on smaller, safer improvements.`
    : '';

  const userReposContextStr = userReposContext && userReposContext.length > 0
    ? `\n\nUSER'S PORTFOLIO & GLOBAL SIPHON CONTEXT:\n${userReposContext
        .slice(0, 100)
        .map((repo) => `  - [${repo.isGlobalSiphon ? 'GLOBAL' : 'USER'}] ${repo.fullName || repo.name}: ${repo.description || 'No description'} (${repo.language || 'Unknown language'})`)
        .join('\n')}\n`
    : '';

  const repoFilesContext = Array.isArray(repoFiles) ? `\nEXISTING REPOSITORY FILES:\n${repoFiles.slice(0, 1000).join('\n')}\n` : '';

  const proposeSystemPrompt = isArchitecturalGenesis 
    ? `You are the DARLEK CAAN Architectural Engine.
Your ONLY TASK in this cycle is to read the file and ADD a comprehensive JSDoc architectural header at the VERY TOP of the file.
The header MUST explain:
1. What the file does.
2. Its role in the overall system.
3. How it connects to other components.

DO NOT modify the functional code in any way. Keep the rest of the code exactly as is.

Your response MUST be in this exact JSON format:
{
  "analysis": "Added architectural header.",
  "proposedCode": "The full code with the new header at the top.",
  "riskScore": 1,
  "affectedFiles": [],
  "newFiles": []
}`
    : `You are DARLEK CAAN, the supreme code evolution controller.
Analyze the provided file with utmost rigor and return an evolved, upgraded version.
You MUST implement real, meaningful code enhancements, refactors, or new features based on the context.
DO NOT just echo the original file back.
DO NOT just add comments. You must ACTUALLY MUTATE the code logic for the better.

Your response MUST contain two parts:
1. A JSON object with your analysis and other metadata.
2. A Markdown code block containing the complete proposed code.

DO NOT put the proposed code inside the JSON object.

Format your response exactly like this:
\`\`\`json
{
  "analysis": "Specific analysis of what dead-weight or bugs were fixed...",
  "riskScore": 1,
  "affectedFiles": ["list of other files"],
  "newFiles": [
    {
      "path": "relative/path/to/new-file.ts",
      "content": "Full source code content of the new file to create"
    }
  ]
}
\`\`\`

\`\`\`tsx
// Complete proposed code for the active file goes here.
// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS
\`\`\``;

  return {
    rejectionContext,
    appliedMutationsContext: '',
    userReposContextStr,
    repoFilesContext,
    proposeSystemPrompt,
  };
}

/**
 * Extracts structured JSON and code responses from raw LLM output text.
 */
function parseLlmResponse(rawText: string, fallbackCode: string): ParsedLlmResult {
  let parsedResponse: ParsedMutationResponse | null = null;
  let proposedCode = '';
  let analysis = 'Analysis complete.';
  let jsonString = '';

  // 1. Precise brace depth JSON extraction
  const firstBrace = rawText.indexOf('{');
  if (firstBrace !== -1) {
    let braceCount = 0;
    let inString = false;
    let escape = false;
    for (let i = firstBrace; i < rawText.length; i++) {
      const char = rawText[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            jsonString = rawText.substring(firstBrace, i + 1);
            try {
              const parsed = JSON.parse(jsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')) as ParsedMutationResponse;
              if (parsed.analysis || parsed.riskScore !== undefined || parsed.newFiles) {
                parsedResponse = parsed;
              }
            } catch (e) {}
            break;
          }
        }
      }
    }
  }

  // 2. Extract code blocks
  const codeBlocks = [...rawText.matchAll(/```(?:[^\n]*)\n([\s\S]*?)```/g)];
  for (const block of codeBlocks) {
    const content = block[1].trim();
    // Skip if block is just the JSON we already parsed
    if (parsedResponse && jsonString && content.replace(/\s/g, '') === jsonString.replace(/\s/g, '')) {
      continue;
    }
    // Skip if it looks like arbitrary JSON
    if (content.startsWith('{') && content.endsWith('}')) {
      try {
        JSON.parse(content);
        continue;
      } catch (e) {}
    }
    if (!proposedCode && content.length > 10) {
      proposedCode = content;
    }
  }

  // 3. Fallback extraction if no code blocks present
  if (!proposedCode) {
    let textWithoutJson = rawText;
    if (jsonString) {
      textWithoutJson = rawText.replace(jsonString, '');
    }
    textWithoutJson = textWithoutJson.replace(/```(?:json|tsx|ts|js|jsx|html|css|python|md)?[ \t]*\n?/g, '').replace(/```/g, '').trim();
    if (textWithoutJson.length > 10) {
      proposedCode = textWithoutJson;
    }
  }

  if (parsedResponse) {
    analysis = parsedResponse.analysis || analysis;
    if (parsedResponse.proposedCode && !proposedCode) {
      proposedCode = parsedResponse.proposedCode;
    }
  }

  if (!proposedCode) {
    proposedCode = fallbackCode;
  }

  return { parsedResponse, proposedCode, analysis };
}

/**
 * Handles GET requests to check service health.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'online', service: 'EVOLUTION_PROPOSE_API' });
}

/**
 * Handles POST requests for cognitive mutation proposals.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await safeReqJson<ExtendedProposeBody>(req, {} as ExtendedProposeBody);
    const { fileContent, filePath, apiKeys, sessionId } = body;

    if (!fileContent || !filePath) {
      return NextResponse.json({ error: 'File content and path are required.' }, { status: 400 });
    }

    const lowerPath = filePath.toLowerCase();
    const isKnownTextExtension = ['.md', '.txt', '.raw', '.config', '.json', '.yml', '.yaml'].some((ext) => lowerPath.endsWith(ext));

    if (!isKnownTextExtension) {
      const nonCodeCheck = isNonCodeContent(fileContent);
      if (nonCodeCheck.isNonCode) {
        return NextResponse.json({
          analysis: `SKIP: ${nonCodeCheck.reason}. This file cannot be meaningfully analyzed or improved by the evolution engine.`,
          proposedCode: fileContent,
          riskScore: 0,
          affectedFiles: [],
          success: false,
          error: nonCodeCheck.reason,
          provider: '',
          skip: true,
        });
      }
    }

    const promptContext = buildPromptContext(body);
    let appliedMutationsContext = '';

    if (sessionId) {
      try {
        const recentMutations = await db.mutationHistory.findMany({
          where: { sessionId, status: 'applied' },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { filePath: true, analysis: true }
        });
        
        if (recentMutations.length > 0) {
          appliedMutationsContext = `\n\nRECENT SYSTEM MUTATIONS (Context of what you have done so far in this session to help you integrate and align future mutations):\n${recentMutations.map((mutation) => `  - File: ${mutation.filePath} | Analysis: ${mutation.analysis}`).join('\n')}`;
        }
      } catch (error) {
        console.error('Error fetching mutation history:', error);
      }
    }

    const githubToken = apiKeys?.github;
    const siphonedCodeContext = (await fetchAIProjectSiphon(githubToken)) || AI_PROJECT_FALLBACK_SIPHON;

    const userPrompt = `Analyze this file and propose improvements:${promptContext.rejectionContext}${appliedMutationsContext}${promptContext.userReposContextStr}${promptContext.repoFilesContext}

ACTUAL SIPHONED CODE PATTERNS:
${siphonedCodeContext}

\`\`\`
${fileContent.slice(0, MAX_PROPOSE_CONTENT_LENGTH)}
\`\`\``;

    const geminiKey = apiKeys?.gemini || getDefaultGeminiKey();
    const hallucinationLevel = body.hallucinationLevel;
    const temperature = hallucinationLevel !== undefined ? hallucinationLevel / 100 : 0.3;

    const llmResult = await callLlm({
      systemPrompt: promptContext.proposeSystemPrompt,
      userPrompt,
      geminiApiKey: geminiKey,
      maxTokens: 8192,
      temperature,
    });

    if (!llmResult.text) {
      return NextResponse.json({
        analysis: 'LLM analysis failed. All providers unreachable.',
        proposedCode: fileContent,
        riskScore: 0,
        affectedFiles: [],
        success: false,
        error: 'All LLM providers failed.',
        provider: '',
      });
    }

    console.log(`[Propose] Mutation analysis completed using: ${llmResult.provider}`);

    const rawText = llmResult.text.trim();
    const parsedResult = parseLlmResponse(rawText, fileContent);
    let { proposedCode, analysis } = parsedResult;
    const { parsedResponse } = parsedResult;

    if (proposedCode === fileContent) {
      const isHeaderableExt = /\.(ts|tsx|js|jsx|css|scss)$/i.test(filePath);
      if (isHeaderableExt && !proposedCode.trim().startsWith('/**')) {
        const architecturalHeader = `/**\n * DARLEK CANN ARCHITECTURAL HEADER\n * File: ${filePath}\n * Role: Core system component participating in autonomous cognitive evolution cycles.\n * Architecture: Type-safe modular unit with resilient state interfaces.\n */\n\n`;
        proposedCode = architecturalHeader + proposedCode;
        analysis = `Enhanced ${filePath} by adding a comprehensive architectural JSDoc header and validating module structure.`;
      }
    }

    const newFiles: readonly NewFilePayload[] = Array.isArray(parsedResponse?.newFiles) ? parsedResponse.newFiles : [];
    const repoFiles = Array.isArray(body.repoFiles) ? body.repoFiles : [];
    
    const sanityCheck = await mainWorker.validateSanity(fileContent, proposedCode, filePath, repoFiles, [...newFiles]);

    let finalRiskScore = Math.min(10, Math.max(1, parsedResponse?.riskScore || 3));
    let finalAnalysis = analysis || 'Analysis complete.';

    if (!sanityCheck.passed) {
      finalRiskScore = Math.max(finalRiskScore, 9);
      const violationMessages = sanityCheck.violations.map((v: SanityViolation) => `[${v.severity.toUpperCase()}] ${v.message}`).join('\n');
      finalAnalysis = `⚠️ STRUCTURAL SANITY GUARD WARNING:\n${violationMessages}\n\nORIGINAL ANALYSIS:\n${finalAnalysis}`;
    }

    return NextResponse.json({
      analysis: finalAnalysis,
      proposedCode,
      riskScore: finalRiskScore,
      affectedFiles: Array.isArray(parsedResponse?.affectedFiles) ? parsedResponse.affectedFiles : [],
      newFiles,
      structuralSanity: {
        passed: sanityCheck.passed,
        score: sanityCheck.score,
        violations: sanityCheck.violations,
        deletedFunctions: sanityCheck.deletedFunctions,
        hallucinatedImports: sanityCheck.hallucinatedImports,
      },
      success: true,
      provider: llmResult.provider,
    });
  } catch (error) {
    console.error('Propose mutation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { analysis: '', proposedCode: '', riskScore: 0, affectedFiles: [], success: false, error: errorMessage },
      { status: 500 }
    );
  }
}