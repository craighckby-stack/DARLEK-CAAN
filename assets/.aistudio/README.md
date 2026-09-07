# AI Studio Configuration & Governance

## Overview
This directory serves as the control plane for the **DARLEK CANN v3.0** evolution engine. It manages environment-specific configurations, agent state persistence, and security policies across the repository.

---

## Architectural Blueprints
- **State Management**: Agent memory dumps are isolated in `*.memory.json` to prevent state corruption during continuous integration and deployment (CI/CD) cycles.
- **Security**: Sensitive environment variables and cryptographic keys are strictly ignored via `.gitignore` to maintain compliance with `psr-governance` standards.
- **Integration**: This studio configuration is designed to interface seamlessly with `darlek-cann-v3` and `unitary-core` for multi-dimensional codebase analysis.

---

## Operational Workflow
1. **Initialization**: Ensure `.env.example` is populated with the required schema configuration.
2. **Execution**: Run agent simulations utilizing the local `assets/.aistudio` execution context.
3. **Cleanup**: Execute the cleanup script via the package manager:
   ```json
   {
     "scripts": {
       "clean:artifacts": "rimraf assets/.aistudio/temp/*.buffer"
     }
   }
   ```

---

## System Enhancements & Changelog

### Stability & Repository Routing
- **Initialization Fix**: Resolved undefined `currentStep` crashes occurring during engine initialization sequences.
- **Repository Target Update**: Updated default GitHub repository targets to `Darlek-Caan-vs-Jesus-Chess` on the `main` branch to prevent 404 tree scanning errors.

### Context & Siphon Expansion
- **Global Repository Siphon**: Integrated an automated siphon mechanism to fetch elite reference architectures from Microsoft, IBM, DeepMind, Firebase, Google, and Vercel alongside user repositories, significantly augmenting the evolution engine's contextual awareness.
- **Zero-Truncation Mandate**: Fixed an over-pruning issue where the evolution engine aggressively truncated code; implemented a strict zero-truncation policy and expanded input buffers to 35,000 characters.

### AI Pipeline Integration
- **Mutation History Integration**: Connected the Database Mutation History directly to the *Propose and Debate* AI pipelines. The system now retrieves the most recent applied mutations via `sessionId` and injects them into the enhancer context, enabling continuous learning from prior modifications.
- **Architectural Header Mandate**: Added a mandatory header requirement to the AI evolution loop. The system dynamically injects and maintains descriptive architectural header comments at the top of every mutated file to preserve logical context for future enhancement cycles.
- **Architectural Genesis Pass**: Engineered a dedicated genesis pass where the system dedicates its exact first evolution cycle (`evolutionCycle === 1`) exclusively to generating structural JSDoc headers across the codebase without altering underlying logic, priming subsequent cycles for deep-enhancement operations.