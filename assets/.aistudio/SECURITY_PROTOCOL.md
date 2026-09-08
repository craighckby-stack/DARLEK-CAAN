# OMEGA ARCHITECTURE SECURITY PROTOCOL

## Overview
This protocol defines the strict operational boundaries between the mutable, self-improving agent core and the immutable, version-controlled repository within the Omega Architecture.

## Governance Rules

### 1. Zero State Persistence
* **Rule:** Any file terminating in `.consciousness.dump` or `.quantum.data` must **never** be staged, tracked, or committed to the repository.
* **Rationale:** These artifacts contain volatile, dynamic agent states that risk state corruption and unintended side effects.

### 2. Secret and Key Management
* **Rule:** All `.vault` and `.key` files are exclusively managed by the `sovereign-kernel`.
* **Rationale:** These credentials must remain strictly local to the execution runtime environment to prevent credential leakage.

### 3. Evolution History Confidentiality
* **Rule:** `.evolution.history` files are restricted to local diagnostic analysis only.
* **Rationale:** These records capture the internal heuristic "thought process" of the agent and are classified as sensitive intellectual property.

## Integration & Enforcement
This manifest is programmatically enforced by the `DARLEK CANN v3.0` evolution engine to guarantee that self-refactoring loops do not pollute or compromise global repository states.

```yaml
# Enforcement Hook Configuration Example
enforcement_engine: "DARLEK CANN v3.0"
mode: "STRICT"
blocked_extensions:
  - ".consciousness.dump"
  - ".quantum.data"
  - ".evolution.history"
  - ".vault"
  - ".key"
```