# Style Migration Protocol

## Overview
This module manages the transition of UI tokens from legacy 'Zinc' palettes to the 'Glass-Emergent' design system, as defined in the `darlek-cann-v3` architecture.

## Workflow
1. **Load**: Reads `src/App.tsx`.
2. **Map**: Applies deterministic regex replacements defined in `STYLE_MAPPINGS`.
3. **Commit**: Atomic write to disk.

## Integration
This script is designed to be run as a pre-build hook in the CI/CD pipeline to ensure consistency across the `sovereign-kernel` ecosystem.

---

## Security Guidelines & Vulnerability Reporting

### Best Practice Warnings
* **Execution Environment:** Ensure this migration tool is only executed within a trusted, sandboxed CI/CD environment or secure developer workspace. Unauthorized execution against untrusted codebases may lead to unintended token modifications or arbitrary file exposure if file paths are manipulated.
* **Deterministic Replacement Risks:** Because this script applies raw regex replacements via `STYLE_MAPPINGS`, always review diffs prior to committing changes to production branches to prevent unexpected injection or corruption of sensitive string literals.

### Reporting Vulnerabilities
If you discover a security vulnerability within the `sovereign-kernel` ecosystem or this migration protocol, please follow our responsible disclosure guidelines:
* **Do Not** open public GitHub issues for security vulnerabilities.
* **Direct Reporting:** Send details securely to the core infrastructure security team via our designated private communication channels or encrypted email.
* **Inclusion Details:** Please include a detailed description, steps to reproduce, and potential impact assessments. We commit to acknowledging reports promptly and coordinating patches prior to public disclosure.