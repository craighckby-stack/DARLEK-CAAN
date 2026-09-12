/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/app/api/validate/route.ts
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

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
const SUPPORTED_TS_REGEX = /\.(ts|tsx)$/i;
const SUPPORTED_JS_REGEX = /\.(js|jsx|mjs|cjs)$/i;

/**
 * Determines the appropriate TypeScript ScriptKind based on file extension.
 */
function resolveScriptKind(fileName: string): ts.ScriptKind {
  if (fileName.endsWith('.tsx')) {
    return ts.ScriptKind.TSX;
  }
  if (fileName.endsWith('.jsx')) {
    return ts.ScriptKind.JSX;
  }
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

    const normalizedFileName = typeof filePath === 'string' && filePath.trim() ? filePath.trim() : DEFAULT_FILE_NAME;
    const isTypescriptFile = SUPPORTED_TS_REGEX.test(normalizedFileName);
    const isJavascriptFile = SUPPORTED_JS_REGEX.test(normalizedFileName);

    if (!isTypescriptFile && !isJavascriptFile) {
      return NextResponse.json({ valid: true, diagnostics: [] });
    }

    const isJsxSupported = normalizedFileName.endsWith('.tsx') || normalizedFileName.endsWith('.jsx');
    const scriptKind = resolveScriptKind(normalizedFileName);

    const sourceFile = ts.createSourceFile(
      normalizedFileName,
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

    if (isJsxSupported) {
      compilerOptions.jsx = ts.JsxEmit.ReactJSX;
    }

    const transpileResult = ts.transpileModule(code, {
      compilerOptions,
      reportDiagnostics: true,
      fileName: normalizedFileName,
    });

    const allDiagnostics = [...parseDiagnostics, ...(transpileResult.diagnostics ?? [])];
    const uniqueDiagnosticsMap = new Map<string, DiagnosticItem>();
    
    const codeLines = code.split(/\r?\n/);

    for (const diagnostic of allDiagnostics) {
      // Skip compiler options configuration errors not related to user source code (5052, 6046)
      if (diagnostic.code === 5052 || diagnostic.code === 6046) {
        continue;
      }

      const startPosition = diagnostic.start ?? 0;
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(startPosition);
      const diagnosticMessage = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      const diagnosticKey = `${line}:${character}:${diagnostic.code}:${diagnosticMessage}`;

      if (!uniqueDiagnosticsMap.has(diagnosticKey)) {
        const lineText = codeLines[line] ?? '';
        uniqueDiagnosticsMap.set(diagnosticKey, {
          line: line + 1,
          column: character + 1,
          message: diagnosticMessage,
          code: diagnostic.code,
          severity: diagnostic.category === ts.DiagnosticCategory.Warning ? 'warning' : 'error',
          snippet: lineText.trim(),
        });
      }
    }

    const diagnostics = Array.from(uniqueDiagnosticsMap.values());
    const hasErrors = diagnostics.some((diagnostic) => diagnostic.severity === 'error');

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