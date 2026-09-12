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
