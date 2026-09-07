import { NextRequest, NextResponse } from 'next/server';
import ts from 'typescript';

interface ValidateRequestBody {
  code?: unknown;
  filePath?: unknown;
}

interface DiagnosticItem {
  line: number;
  column: number;
  message: string;
  code: number;
  severity: 'warning' | 'error';
  snippet: string;
}

interface SuccessResponse {
  valid: boolean;
  diagnostics: DiagnosticItem[];
}

interface ErrorResponse {
  error: string;
}

const DEFAULT_FILE_NAME = 'source.tsx';
const SUPPORTED_TS_EXT = /\.(ts|tsx)$/i;
const SUPPORTED_JS_EXT = /\.(js|jsx|mjs|cjs)$/i;

/**
 * Determines the appropriate TypeScript ScriptKind based on file extension.
 */
function getScriptKind(fileName: string): ts.ScriptKind {
  if (fileName.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (fileName.endsWith('.jsx')) return ts.ScriptKind.JSX;
  if (fileName.endsWith('.js') || fileName.endsWith('.mjs') || fileName.endsWith('.cjs')) {
    return ts.ScriptKind.JS;
  }
  return ts.ScriptKind.TS;
}

export async function POST(req: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    let body: ValidateRequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
    }

    const { code, filePath } = body;

    if (typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Source code is required.' }, { status: 400 });
    }

    const fileName = typeof filePath === 'string' && filePath.trim() ? filePath.trim() : DEFAULT_FILE_NAME;
    const isTs = SUPPORTED_TS_EXT.test(fileName);
    const isJs = SUPPORTED_JS_EXT.test(fileName);

    if (!isTs && !isJs) {
      return NextResponse.json({ valid: true, diagnostics: [] });
    }

    const isJsx = fileName.endsWith('.tsx') || fileName.endsWith('.jsx');
    const scriptKind = getScriptKind(fileName);

    const sourceFile = ts.createSourceFile(
      fileName,
      code,
      ts.ScriptTarget.Latest,
      true,
      scriptKind
    );

    const parseDiagnostics: readonly ts.Diagnostic[] = 
      (sourceFile as unknown as { parseDiagnostics?: readonly ts.Diagnostic[] }).parseDiagnostics ?? [];

    const compilerOptions: ts.CompilerOptions = {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      noEmit: true,
    };

    if (isJsx) {
      compilerOptions.jsx = ts.JsxEmit.ReactJSX;
    }

    const transpileResult = ts.transpileModule(code, {
      compilerOptions,
      reportDiagnostics: true,
      fileName,
    });

    const allDiagnostics = [...parseDiagnostics, ...(transpileResult.diagnostics ?? [])];
    const uniqueDiags = new Map<string, DiagnosticItem>();
    
    // Split lines safely utilizing optimized carriage return handling
    const lines = code.split(/\r?\n/);

    for (const diag of allDiagnostics) {
      // Skip compiler options configuration errors not related to user source code (5052, 6046)
      if (diag.code === 5052 || diag.code === 6046) {
        continue;
      }

      const start = diag.start ?? 0;
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(start);
      const msgText = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
      const key = `${line}:${character}:${diag.code}:${msgText}`;

      if (!uniqueDiags.has(key)) {
        const lineText = lines[line] ?? '';
        uniqueDiags.set(key, {
          line: line + 1,
          column: character + 1,
          message: msgText,
          code: diag.code,
          severity: diag.category === ts.DiagnosticCategory.Warning ? 'warning' : 'error',
          snippet: lineText.trim(),
        });
      }
    }

    const diagnostics = Array.from(uniqueDiags.values());
    const hasErrors = diagnostics.some((d) => d.severity === 'error');

    return NextResponse.json({
      valid: !hasErrors,
      diagnostics,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to validate source code.';
    console.error('Validation route error:', err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}