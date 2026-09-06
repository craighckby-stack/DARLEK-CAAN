# AI Studio Configuration & Governance

> **Executive Summary**: This document outlines the control plane for the **DARLEK CANN v3.0** evolution engine (`assets/.aistudio/`), covering environment setup, state persistence, security guidelines, and maintenance logs.

---

## Quick Navigation
- [Architectural Blueprints](#architectural-blueprints)
- [Workflow Execution](#workflow-execution)
- [Security Guidelines & Disclosure](#security-guidelines--vulnerability-disclosure)
- [System Evolution & Changelog](#system-evolution-changelog--maintenance-notes)

---

## Architectural Blueprints

| Component | Target Mechanism | Purpose / Policy |
| :--- | :--- | :--- |
| **State Management** | `*.memory.json` isolation | Prevents state corruption during CI/CD execution cycles. |
| **Security Compliance** | `.gitignore` enforcement | Strips sensitive environment variables & keys (`psr-governance`). |
| **System Integration** | `darlek-cann-v3` & `unitary-core` | Powers multi-dimensional analysis pipelines. |

---

## Workflow

1. **Initialization**: Populate `.env.example` with the required schema.
2. **Execution**: Run agent simulations using the local `assets/.aistudio` context.
3. **Cleanup**: Execute `npm run clean:artifacts` to purge ephemeral simulation buffers.

---

## Security Guidelines & Vulnerability Disclosure

### Security Best Practices
- **Credential Isolation**: Never commit `.env` files or hardcode API keys, tokens, or cryptographic material. Utilize `.env.example` as a structural template.
- **Access Control**: Restrict write access to configuration files and state-persistence pathways to authorized administrative roles and verified CI/CD pipelines.
- **Memory Integrity**: Regularly audit `*.memory.json` artifacts to prevent inadvertent serialization of sensitive operational parameters or PII.

### Vulnerability Reporting
For security vulnerabilities within the DARLEK CANN v3.0 control plane:
1. **Private Disclosure**: **Do not** open public GitHub issues for sensitive vulnerabilities.
2. **Direct Contact**: Reach out via private repository advisory or the communication channels outlined in the root `SECURITY.md`.
3. **Documentation**: Provide clear reproduction steps and impact assessments for rapid patching.

---

## System Evolution Changelog & Maintenance Notes

- **Bug Fixes**: Resolved undefined `currentStep` initialization crashes; updated default GitHub repo targets to prevent 404 tree scanning errors.
- **Repository Siphon**: Configured automated reference architecture fetching from authorized enterprise ecosystems to augment engine context.
- **Zero-Truncation Mandate**: Resolved over-pruning via strict zero-truncation policies and expanded input buffers to 35,000 characters.
- **Mutation Memory**: Connected Database Mutation History to Propose/Debate AI pipelines for historical retrieval via `sessionId`.
- **Architectural Genesis Pass**: Enforced dynamic JSDoc header maintenance and dedicated `evolutionCycle === 1` exclusively to structural header generation.