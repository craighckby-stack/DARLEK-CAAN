# AI Studio Configuration & Governance

## Overview
This directory serves as the control plane for the DARLEK CANN v3.0 evolution engine. It manages environment-specific configurations, agent state persistence, and security policies for the repository.

---

## Architectural Blueprints
- **State Management**: Agent memory dumps are isolated in `*.memory.json` to prevent state corruption during CI/CD cycles.
- **Security**: Sensitive environment variables and cryptographic keys are strictly ignored via `.gitignore` to maintain compliance with `psr-governance` standards.
- **Integration**: This studio configuration is designed to interface with `darlek-cann-v3` and `unitary-core` for multi-dimensional analysis.

---

## Workflow
1. **Initialization**: Ensure `.env.example` is populated with required schema.
2. **Execution**: Run agent simulations using the local `assets/.aistudio` context.
3. **Cleanup**: Use `npm run clean:artifacts` to purge ephemeral simulation buffers.

---

## Security Guidelines & Vulnerability Disclosure

### Security Best Practices
- **Credential Isolation**: Never commit `.env` files or hardcode API keys, tokens, or cryptographic material into version control. Always utilize `.env.example` as a non-sensitive structural template.
- **Access Control**: Restrict write access to `assets/.aistudio` configuration files and state-persistence pathways to authorized administrative roles and verified CI/CD pipelines.
- **Memory Integrity**: Regularly audit `*.memory.json` artifacts to ensure sensitive operational parameters or PII are not inadvertently serialized during agent simulations.

### Vulnerability Reporting
If you discover a security vulnerability within the DARLEK CANN v3.0 control plane or its supporting evolution engines, please adhere to responsible disclosure guidelines:
1. **Do Not** open public GitHub issues for sensitive security vulnerabilities.
2. **Report Directly**: Contact the maintainers or security response team privately via the designated communication channels outlined in the repository's root `SECURITY.md` (if available) or via private repository advisory.
3. **Provide Details**: Include a detailed description, steps to reproduce, and potential impact assessments to assist our engineering teams in deploying rapid patches.

---

## System Evolution Changelog & Maintenance Notes
- **Bug Fixes**: Resolved undefined `currentStep` crashes during initialization; updated default GitHub repository targets to prevent 404 tree scanning errors.
- **Repository Siphon**: Configured automated reference architecture fetching from authorized enterprise ecosystems to safely augment the evolution engine's context.
- **Zero-Truncation Mandate**: Fixed over-pruning issues by implementing strict zero-truncation policies and expanding input buffers to 35,000 characters.
- **Mutation Memory**: Connected Database Mutation History to Propose and Debate AI pipelines, allowing the system to retrieve past mutations via `sessionId`.
- **Architectural Genesis Pass**: Enforced dynamic JSDoc header maintenance and dedicated the initial evolution cycle (`evolutionCycle === 1`) exclusively to structural header generation prior to deep-enhancement loops.