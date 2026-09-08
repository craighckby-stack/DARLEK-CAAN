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
