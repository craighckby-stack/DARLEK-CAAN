import { NextRequest, NextResponse } from 'next/server';
import { callLlm, getDefaultGeminiKey } from '@/lib/llm-provider';
import { safeReqJson } from '@/lib/safe-json';

export const dynamic = 'force-dynamic';

// --- Types & Interfaces ---

type IssueSeverity = 'high' | 'medium' | 'low';

interface StaticIssue {
  type: string;
  severity: IssueSeverity;
  message: string;
}

interface AnalyzeImpactBody {
  originalCode: string;
  proposedCode: string;
  filePath: string;
  riskScore: number;
  apiKeys: Record<string, string>;
}

// --- Constants ---

const MAX_CODE_LENGTH = 35000;
const LLM_MAX_TOKENS = 512;
const LLM_TEMPERATURE = 0.2;

const ARCHITECTURAL_VERIFIER_SYSTEM_PROMPT = `[ROLE] You are the automated architecture verifier for the AHI Loop. 
[TASK] Analyze the synthesized code against the target taxonomy structure.

[SCAN FOCUS]
- SCOPE VIOLATION: The code attempts to generate out-of-scope features or domains unrelated to code enhancement for this repository.
- Taxonomy violation (e.g., a UI component placed in \`00_Foundational_Knowledge\`).
- Missing \`__init__.py\` or broken local imports.
- Unresolved dependencies from deleted historical branches.

[OUTPUT FORMAT]
Programmatic string only. Keep under 150 words.
If clean, output exactly: STATUS: PASS
If broken, output exactly: STATUS: FAIL followed by a concise line-separated list of architectural breaks.`;

// --- Static Analysis Helpers ---

function extractMatches(code: string, regex: RegExp, groupIndex: number = 1): string[] {
  return [...code.matchAll(regex)].map(match => match[groupIndex]);
}

function detectStaticIssues(originalCode: string, proposedCode: string): StaticIssue[] {
  const issues: StaticIssue[] = [];

  // 1. Export Analysis
  const exportRegex = /export\s+(?:default\s+)?(?:function|class|const|let|var|type|interface|enum)\s+(\w+)/g;
  const originalExports = extractMatches(originalCode, exportRegex);
  const proposedExports = extractMatches(proposedCode, exportRegex);
  const removedExports = originalExports.filter(exp => !proposedExports.includes(exp));

  if (removedExports.length > 0) {
    issues.push({
      type: 'REMOVED_EXPORT',
      severity: 'high',
      message: `Export(s) removed: ${removedExports.join(', ')}. Other files may import these.`,
    });
  }

  // 2. Internal Definition Analysis
  const definitionRegex = /(?:function|class)\s+(\w+)/g;
  const originalFuncs = extractMatches(originalCode, definitionRegex);
  const proposedFuncs = extractMatches(proposedCode, definitionRegex);
  const removedFuncs = originalFuncs.filter(func => !proposedFuncs.includes(func) && !removedExports.includes(func));

  if (removedFuncs.length > 0) {
    issues.push({
      type: 'REMOVED_DEFINITION',
      severity: 'medium',
      message: `Function/class removed: ${removedFuncs.join(', ')}. May be referenced internally.`,
    });
  }

  // 3. Import Analysis
  const importRegex = /import\s+.*?from\s+['"](.+?)['"]/g;
  const originalImports = extractMatches(originalCode, importRegex);
  const proposedImports = extractMatches(proposedCode, importRegex);
  const newImports = proposedImports.filter(imp => !originalImports.includes(imp));
  const removedImports = originalImports.filter(imp => !proposedImports.includes(imp));

  if (removedImports.length > 0) {
    issues.push({
      type: 'REMOVED_IMPORT',
      severity: 'medium',
      message: `Import(s) removed: ${removedImports.join(', ')}. Code may use these modules.`,
    });
  }
  if (newImports.length > 0) {
    issues.push({
      type: 'NEW_IMPORT',
      severity: 'low',
      message: `New import(s): ${newImports.join(', ')}. Ensure these packages are available.`,
    });
  }

  // 4. Size Deviation Analysis
  const sizeChangeRatio = (proposedCode.length - originalCode.length) / Math.max(1, originalCode.length);
  if (Math.abs(sizeChangeRatio) > 0.5) {
    const direction = sizeChangeRatio > 0 ? 'increased' : 'decreased';
    const percentage = Math.abs(Math.round(sizeChangeRatio * 100));
    const implication = sizeChangeRatio < 0 ? 'May indicate removed functionality.' : 'May indicate added complexity.';
    issues.push({
      type: 'SIZE_CHANGE',
      severity: 'low',
      message: `File size ${direction} by ${percentage}%. ${implication}`,
    });
  }

  // 5. Technical Debt Annotations (TODO/FIXME)
  const todoRegex = /\/\/\s*(TODO|FIXME|HACK|XXX|BUG)[^\n]*/gi;
  const newTodos = extractMatches(proposedCode, todoRegex, 0);
  if (newTodos.length > 0) {
    issues.push({
      type: 'NEW_TODO',
      severity: 'low',
      message: `${newTodos.length} TODO/FIXME comment(s) found in proposed code.`,
    });
  }

  // 6. Debug Artifacts
  const debugLogRegex = /console\.(log|debug|info)\s*\(/g;
  const newConsoleLogs = extractMatches(proposedCode, debugLogRegex).length;
  const origConsoleLogs = extractMatches(originalCode, debugLogRegex).length;
  if (newConsoleLogs > origConsoleLogs) {
    issues.push({
      type: 'DEBUG_CODE',
      severity: 'low',
      message: `${newConsoleLogs - origConsoleLogs} new console.log/debug call(s) added. May be debug leftovers.`,
    });
  }

  // 7. TypeScript Type Safety Analysis
  const anyTypeRegex = /:\s*any\b/g;
  const newAnyCount = extractMatches(proposedCode, anyTypeRegex).length;
  const origAnyCount = extractMatches(originalCode, anyTypeRegex).length;
  if (newAnyCount > origAnyCount) {
    issues.push({
      type: 'TYPE_SAFETY',
      severity: 'medium',
      message: `${newAnyCount - origAnyCount} new 'any' type usage(s). Type safety reduced.`,
    });
  }

  // 8. Error Handling Robustness
  const tryCatchRegex = /try\s*\{/g;
  const origTryCatch = extractMatches(originalCode, tryCatchRegex).length;
  const propTryCatch = extractMatches(proposedCode, tryCatchRegex).length;
  if (propTryCatch < origTryCatch) {
    issues.push({
      type: 'ERROR_HANDLING',
      severity: 'high',
      message: `${origTryCatch - propTryCatch} try/catch block(s) removed. Error handling weakened.`,
    });
  }

  return issues;
}

// --- Response Builder ---

function truncateCode(code: string): string {
  if (code.length <= MAX_CODE_LENGTH) return code;
  return `${code.slice(0, MAX_CODE_LENGTH)}\n// ... [truncated]`;
}

function buildResponse(staticIssues: StaticIssue[], llmAnalysis: string, llmProvider: string) {
  const highCount = staticIssues.filter(issue => issue.severity === 'high').length;
  const mediumCount = staticIssues.filter(issue => issue.severity === 'medium').length;
  const lowCount = staticIssues.filter(issue => issue.severity === 'low').length;

  const overallRisk = highCount > 0 ? 'HIGH' : mediumCount > 2 ? 'MEDIUM' : 'LOW';
  const llmSummaryPart = llmAnalysis ? ` LLM review: ${llmProvider}.` : ' No LLM available — static analysis only.';
  const summary = `Static analysis: ${staticIssues.length} issues (${highCount} high, ${mediumCount} medium, ${lowCount} low).${llmSummaryPart}`;

  return NextResponse.json({
    success: true,
    staticIssues,
    llmAnalysis,
    llmProvider,
    totalIssues: staticIssues.length,
    highSeverity: highCount,
    mediumSeverity: mediumCount,
    lowSeverity: lowCount,
    overallRisk,
    summary,
  });
}

// --- Route Handlers ---

export async function GET() {
  return NextResponse.json({ 
    status: 'online', 
    service: 'EVOLUTION_ANALYZE_IMPACT_API' 
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await safeReqJson<AnalyzeImpactBody>(req, {} as AnalyzeImpactBody);
    const { originalCode, proposedCode, filePath, riskScore, apiKeys } = body;

    if (!originalCode || !proposedCode || !filePath) {
      return NextResponse.json(
        { error: 'originalCode, proposedCode, and filePath required.' }, 
        { status: 400 }
      );
    }

    // Phase 1: Local deterministic static analysis
    const staticIssues = detectStaticIssues(originalCode, proposedCode);

    // Phase 2: LLM-powered architectural deep inspection
    const truncatedOriginal = truncateCode(originalCode);
    const truncatedProposed = truncateCode(proposedCode);

    const userPrompt = [
      `File: ${filePath}`,
      `Risk: ${riskScore}/10`,
      '',
      'ORIGINAL:',
      '```',
      truncatedOriginal,
      '```',
      '',
      'PROPOSED:',
      '```',
      truncatedProposed,
      '```',
      '',
      'Analyze impact and coherence.'
    ].join('\n');

    const geminiKey = apiKeys?.gemini || getDefaultGeminiKey();

    const llmResult = await callLlm({
      systemPrompt: ARCHITECTURAL_VERIFIER_SYSTEM_PROMPT,
      userPrompt,
      geminiApiKey: geminiKey,
      maxTokens: LLM_MAX_TOKENS,
      temperature: LLM_TEMPERATURE,
    });

    const llmAnalysis = llmResult.text ?? '';
    const llmProvider = llmResult.provider ?? '';

    return buildResponse(staticIssues, llmAnalysis, llmProvider);
  } catch (error: unknown) {
    console.error('Analyze impact error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}