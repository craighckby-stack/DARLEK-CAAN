# Neural Engine Post-Mortems

## Auto-Generated Lessons & Negative Constraints

### ❌ [2026-09-08] .next_dev/server/vendor-chunks/@radix-ui.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 1, Col 9: Expression expected.
Line 24, Col 21825: Unterminated string literal.
Line 1, Col 1: Decorators are not valid here.
Line 1, Col 2: Decorators are not valid here.
Line 1, Col 3: Decorators are not valid here.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on .next_dev/server/vendor-chunks/@radix-ui.js.

### ❌ [2026-09-08] .next_dev/server/vendor-chunks/@swc.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 204, Col 1: ')' expected.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on .next_dev/server/vendor-chunks/@swc.js.

### ❌ [2026-09-08] .next_dev/server/vendor-chunks/@swc.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 211, Col 1: ')' expected.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on .next_dev/server/vendor-chunks/@swc.js.

### ❌ [2026-09-08] .next_dev/server/vendor-chunks/@radix-ui.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 1, Col 9: Expression expected.
Line 31, Col 19908: Unterminated string literal.
Line 1, Col 1: Decorators are not valid here.
Line 1, Col 2: Decorators are not valid here.
Line 1, Col 3: Decorators are not valid here.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on .next_dev/server/vendor-chunks/@radix-ui.js.

### ❌ [2026-09-08] .next_dev/server/vendor-chunks/class-variance-authority.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 1, Col 9: Expression expected.
Line 163, Col 4: Expression expected.
Line 1, Col 1: Decorators are not valid here.
Line 1, Col 2: Decorators are not valid here.
Line 1, Col 3: Decorators are not valid here.
Line 163, Col 1: Decorators are not valid here.
Line 163, Col 2: Decorators are not valid here.
Line 163, Col 3: Decorators are not valid here.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on .next_dev/server/vendor-chunks/class-variance-authority.js.

### ❌ [2026-09-08] .next_dev/server/vendor-chunks/tailwind-merge.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 1, Col 9: Expression expected.
Line 21, Col 28623: Unterminated string literal.
Line 1, Col 1: Decorators are not valid here.
Line 1, Col 2: Decorators are not valid here.
Line 1, Col 3: Decorators are not valid here.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on .next_dev/server/vendor-chunks/tailwind-merge.js.

### ❌ [2026-09-08] .next_dev/static/chunks/app-pages-internals.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 51, Col 1118: Unterminated string literal.
Line 1, Col 1: Decorators are not valid here.
Line 1, Col 2: Decorators are not valid here.
Line 1, Col 3: Decorators are not valid here.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on .next_dev/static/chunks/app-pages-internals.js.

### ❌ [2026-09-08] .next_dev/static/chunks/app/layout.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 18, Col 1341: ',' expected.
Line 18, Col 1385: Invalid character.
Line 20, Col 7: ',' expected.
Line 40, Col 16648: Unterminated string literal.
Line 1, Col 1: Decorators are not valid here.
Line 1, Col 2: Decorators are not valid here.
Line 1, Col 3: Decorators are not valid here.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on .next_dev/static/chunks/app/layout.js.

### ❌ [2026-09-12] firestore.rules `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 65, Col 1: Unexpected closing delimiter '}' with no matching opening pair.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on firestore.rules.

### ❌ [2026-09-12] fix3.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 97, Col 2: Expression expected.
Line 97, Col 1: Decorators are not valid here.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on fix3.js.

### ❌ [2026-09-12] fix_synthesizer.sh `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 2, Col 8: Unclosed single-quote string literal.
Line 3, Col 1179: Unclosed single-quote string literal.
Line 3, Col 1018: Unclosed opening delimiter '{'.
Line 3, Col 1017: Unclosed opening delimiter '('.
Line 3, Col 969: Unclosed opening delimiter '{'.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on fix_synthesizer.sh.

### ❌ [2026-09-12] robust_parser.js `source: mutation-cycle`
**Symptom:** Active Linter / Compiler Gate Rejection on LLM Output (Option B)
**EVIDENCE (Machine-Copied Fact):**
```
[LINT REJECT: NO_UNVERIFIABLE_SELF_PRAISE] Detected unsubstantiated self-description in commentary: "Hardened". Output must adhere to neutral, factual documentation without marketing adjectives.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on robust_parser.js.

### ❌ [2026-09-12] src/app/api/setup/test-connection/route.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 85, Col 8: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/app/api/setup/test-connection/route.ts.

### ❌ [2026-09-12] src/components/ChessBoard.tsx `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 28, Col 8: Property declaration is missing its type annotation.
Line 40, Col 8: Property declaration is missing its type annotation.
Line 257, Col 8: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/components/ChessBoard.tsx.

### ❌ [2026-09-12] src/components/FolderScanner.tsx `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 173, Col 8: Property declaration is missing its type annotation.
Line 186, Col 8: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/components/FolderScanner.tsx.

### ❌ [2026-09-12] src/lib/types.ts `source: mutation-cycle`
**Symptom:** Active Linter / Compiler Gate Rejection on LLM Output (Option B)
**EVIDENCE (Machine-Copied Fact):**
```
[LINT REJECT: NO_UNVERIFIABLE_SELF_PRAISE] Detected unsubstantiated self-description in commentary: "Highly optimized". Output must adhere to neutral, factual documentation without marketing adjectives.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/lib/types.ts.

### ❌ [2026-09-12] src/lib/validator.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 72, Col 38: '}' expected.
[OUTPUT_LIKELY_TRUNCATED] The output is < 80% of original length and syntactically invalid. The model likely hit its output token limit.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/lib/validator.ts.

### ❌ [2026-09-12] src/types/omega-core.d.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 68, Col 16: Type alias declaration is missing a type definition after '='.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/types/omega-core.d.ts.

### ❌ [2026-09-12] updateModule.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 140, Col 26: Type annotations can only be used in TypeScript files.
Line 145, Col 13: Type annotations can only be used in TypeScript files.
Line 148, Col 17: Type annotations can only be used in TypeScript files.
Line 160, Col 19: Type annotations can only be used in TypeScript files.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on updateModule.js.

### ❌ [2026-09-12] firestore.rules `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 65, Col 1: Unexpected closing delimiter '}' with no matching opening pair.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on firestore.rules.

### ❌ [2026-09-12] fix_synthesizer.sh `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 25, Col 5: Unclosed single-quote string literal.
Line 28, Col 1: Unclosed single-quote string literal.
Line 34, Col 1179: Unclosed single-quote string literal.
Line 34, Col 1018: Unclosed opening delimiter '{'.
Line 34, Col 1017: Unclosed opening delimiter '('.
Line 34, Col 969: Unclosed opening delimiter '{'.
Line 27, Col 1018: Unclosed opening delimiter '{'.
Line 27, Col 1017: Unclosed opening delimiter '('.
Line 27, Col 969: Unclosed opening delimiter '{'.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on fix_synthesizer.sh.

### ❌ [2026-09-12] src/app/api/brain/route.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 207, Col 8: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/app/api/brain/route.ts.

### ❌ [2026-09-12] src/app/api/setup/test-connection/route.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 85, Col 8: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/app/api/setup/test-connection/route.ts.

### ❌ [2026-09-12] src/components/ChessBoard.tsx `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 28, Col 8: Property declaration is missing its type annotation.
Line 40, Col 8: Property declaration is missing its type annotation.
Line 257, Col 8: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/components/ChessBoard.tsx.

### ❌ [2026-09-12] src/components/FolderScanner.tsx `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 173, Col 8: Property declaration is missing its type annotation.
Line 186, Col 8: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/components/FolderScanner.tsx.

### ❌ [2026-09-12] src/components/SnippetScanner.tsx `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 296, Col 6: Expression expected.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/components/SnippetScanner.tsx.

### ❌ [2026-09-12] src/components/ui/button.tsx `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 12, Col 8: Property declaration is missing its type annotation.
Line 14, Col 12: Property declaration is missing its type annotation.
Line 16, Col 8: Property declaration is missing its type annotation.
Line 18, Col 10: Property declaration is missing its type annotation.
Line 20, Col 6: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/components/ui/button.tsx.

### ❌ [2026-09-12] src/components/ui/sidebar.tsx `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 482, Col 8: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/components/ui/sidebar.tsx.

### ❌ [2026-09-12] src/lib/api-client.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 95, Col 2: Expression expected.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/lib/api-client.ts.

### ❌ [2026-09-12] src/lib/validator.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 74, Col 38: '}' expected.
[OUTPUT_LIKELY_TRUNCATED] The output is < 80% of original length and syntactically invalid. The model likely hit its output token limit.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/lib/validator.ts.

### ❌ [2026-09-12] src/types/omega-core.d.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 68, Col 16: Type alias declaration is missing a type definition after '='.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/types/omega-core.d.ts.
