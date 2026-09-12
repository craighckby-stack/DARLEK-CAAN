# Neural Engine Post-Mortems

## System Overview & Constraint Mechanics

> **Executive

### ❌ [2026-09-12] compare.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 8, Col 11: 'interface' declarations can only be used in TypeScript files.
Line 16, Col 11: 'interface' declarations can only be used in TypeScript files.
Line 25, Col 11: 'interface' declarations can only be used in TypeScript files.
Line 32, Col 18: 'interface' declarations can only be used in TypeScript files.
Line 41, Col 41: Type annotations can only be used in TypeScript files.
Line 41, Col 50: Type annotations can only be used in TypeScript files.
Line 61, Col 47: Type annotations can only be used in TypeScript files.
Line 61, Col 56: Type annotations can only be used in TypeScript files.
Line 67, Col 18: Type annotations can only be used in TypeScript files.
Line 69, Col 16: Type annotations can only be used in TypeScript files.
Line 72, Col 24: Non-null assertions can only be used in TypeScript files.
Line 114, Col 10: Type annotations can only be used in TypeScript files.
Line 115, Col 9: Type annotations can only be used in TypeScript files.
Line 116, Col 11: Type annotations can only be used in TypeScript files.
Line 117, Col 8: The '?' modifier can only be used in TypeScript files.
Line 117, Col 11: Type annotations can only be used in TypeScript files.
Line 118, Col 4: Type annotations can only be used in TypeScript files.
Line 120, Col 18: Type annotations can only be used in TypeScript files.
Line 148, Col 48: Type assertion expressions can only be used in TypeScript files.
Line 154, Col 24: Type annotations can only be used in TypeScript files.
Line 178, Col 55: Type annotations can only be used in TypeScript files.
Line 178, Col 77: Type annotations can only be used in TypeScript files.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on compare.js.

### ❌ [2026-09-12] .next_dev/types/app/api/brain/route.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 35, Col 12: Property declaration is missing its type annotation.
[OUTPUT_LIKELY_TRUNCATED] The output is < 80% of original length and syntactically invalid. The model likely hit its output token limit.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on .next_dev/types/app/api/brain/route.ts.

### ❌ [2026-09-12] compare.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 8, Col 11: 'interface' declarations can only be used in TypeScript files.
Line 16, Col 11: 'interface' declarations can only be used in TypeScript files.
Line 25, Col 11: 'interface' declarations can only be used in TypeScript files.
Line 32, Col 18: 'interface' declarations can only be used in TypeScript files.
Line 41, Col 41: Type annotations can only be used in TypeScript files.
Line 41, Col 50: Type annotations can only be used in TypeScript files.
Line 61, Col 47: Type annotations can only be used in TypeScript files.
Line 61, Col 56: Type annotations can only be used in TypeScript files.
Line 67, Col 18: Type annotations can only be used in TypeScript files.
Line 69, Col 16: Type annotations can only be used in TypeScript files.
Line 72, Col 24: Non-null assertions can only be used in TypeScript files.
Line 114, Col 10: Type annotations can only be used in TypeScript files.
Line 115, Col 9: Type annotations can only be used in TypeScript files.
Line 116, Col 11: Type annotations can only be used in TypeScript files.
Line 117, Col 8: The '?' modifier can only be used in TypeScript files.
Line 117, Col 11: Type annotations can only be used in TypeScript files.
Line 118, Col 4: Type annotations can only be used in TypeScript files.
Line 120, Col 18: Type annotations can only be used in TypeScript files.
Line 148, Col 48: Type assertion expressions can only be used in TypeScript files.
Line 154, Col 24: Type annotations can only be used in TypeScript files.
Line 178, Col 55: Type annotations can only be used in TypeScript files.
Line 178, Col 77: Type annotations can only be used in TypeScript files.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on compare.js.

### ❌ [2026-09-12] fix_propose.js `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 54, Col 2: Expression expected.
Line 54, Col 1: Decorators are not valid here.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on fix_propose.js.

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

### ❌ [2026-09-12] src/app/api/github/create-repo/route.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 1, Col 1: Source code is completely empty.
[OUTPUT_LIKELY_TRUNCATED] The output is < 80% of original length and syntactically invalid. The model likely hit its output token limit.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/app/api/github/create-repo/route.ts.

### ❌ [2026-09-12] src/components/FolderScanner.tsx `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 179, Col 8: Property declaration is missing its type annotation.
Line 192, Col 8: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/components/FolderScanner.tsx.

### ❌ [2026-09-12] src/components/ui/button.tsx `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 19, Col 8: Property declaration is missing its type annotation.
Line 21, Col 12: Property declaration is missing its type annotation.
Line 23, Col 8: Property declaration is missing its type annotation.
Line 25, Col 10: Property declaration is missing its type annotation.
Line 27, Col 6: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/components/ui/button.tsx.

### ❌ [2026-09-12] src/components/ui/sidebar.tsx `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 481, Col 8: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/components/ui/sidebar.tsx.

### ❌ [2026-09-12] src/hooks/use-toast.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 36, Col 13: Type alias declaration is missing a type definition after '='.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/hooks/use-toast.ts.

### ❌ [2026-09-12] src/lib/api-client.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 87, Col 2: Expression expected.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/lib/api-client.ts.

### ❌ [2026-09-12] src/lib/msDosEngine.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 330, Col 8: Property declaration is missing its type annotation.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/lib/msDosEngine.ts.

### ❌ [2026-09-12] src/lib/validator.ts `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 70, Col 38: '}' expected.
[OUTPUT_LIKELY_TRUNCATED] The output is < 80% of original length and syntactically invalid. The model likely hit its output token limit.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on src/lib/validator.ts.

### ❌ [2026-09-12] update_agents.sh `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 2, Col 8: Unclosed single-quote string literal.
Line 22, Col 3: Unclosed single-quote string literal.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on update_agents.sh.

### ❌ [2026-09-12] update_prompts.sh `source: mutation-cycle`
**Symptom:** AST / TypeScript Compiler Validation Rejected
**EVIDENCE (Machine-Copied Fact):**
```
Line 16, Col 1303: Unclosed single-quote string literal.
```
**CONSTRAINT (Model Generalization):** Never repeat code patterns that produce this compiler/linter error on update_prompts.sh.
