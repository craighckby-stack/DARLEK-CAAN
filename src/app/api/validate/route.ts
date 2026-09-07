import { NextRequest, NextResponse } from 'next/server';
import ts from 'typescript';

export async function POST(req: NextRequest) {
  try {
    const { code, filePath } = await req.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Source code is required.' }, { status: 400 });
    }

    const fileName = filePath || 'source.tsx';
    const isTs = /\.(ts|tsx)$/i.test(fileName);
    const isJs = /\.(js|jsx|mjs|cjs)$/i.test(fileName);

    if (!isTs && !isJs) {
      return NextResponse.json({ valid: true, diagnostics: [] });
    }

    const isJsx = fileName.endsWith('.tsx') || fileName.endsWith('.jsx');
    const scriptKind = fileName.endsWith('.tsx')
      ? ts.ScriptKind.TSX
      : fileName.endsWith('.jsx')
      ? ts.ScriptKind.JSX
      : fileName.endsWith('.js')
      ? ts.ScriptKind.JS
      : ts.ScriptKind.TS;

    const sourceFile = ts.createSourceFile(
      fileName,
      code,
      ts.ScriptTarget.Latest,
      true,
      scriptKind
    );

    const parseDiagnostics: readonly ts.Diagnostic[] = (sourceFile as any).parseDiagnostics || [];

    // Compiler options for emission diagnostics (JSX only for JSX files)
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

    const allDiagnostics = [...parseDiagnostics, ...(transpileResult.diagnostics || [])];
    const uniqueDiags = new Map<string, any>();
    const lines = code.split('\n');

    for (const diag of allDiagnostics) {
      // Skip compiler options configuration errors not related to user source code
      if (diag.code === 5052 || diag.code === 6046) {
        continue;
      }

      const start = diag.start ?? 0;
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(start);
      const msgText = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
      const key = `${line}:${character}:${diag.code}:${msgText}`;

      if (!uniqueDiags.has(key)) {
        const lineText = lines[line] || '';
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
  } catch (err: any) {
    console.error('Validation route error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to validate source code.' }, { status: 500 });
  }
}
