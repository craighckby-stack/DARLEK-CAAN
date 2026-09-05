# OMEGA ARCHITECTURE SECURITY PROTOCOL
*EMG Core v49 Neural Code & Documentation Optimization Engine*

## Overview
This protocol defines the strict security boundary between the mutable, self-improving agent core and the immutable, version-controlled repository. Its primary objective is to prevent data leaks, unauthorized state persistence, and repository pollution.

---

## Governance and State Rules

1. **Zero State Persistence**
   * Files ending in `.consciousness.dump` or `.quantum.data` contain volatile agent states and **must never** be committed to the repository.

2. **Secret and Key Management**
   * All `.vault` and `.key` files are securely managed exclusively by the `sovereign-kernel` and must remain local to the runtime environment at all times.

3. **Evolution History and Intellectual Property**
   * `.evolution.history` files are restricted to local diagnostic analysis only. They capture the raw cognitive processes of the agent and are classified as sensitive intellectual property.

---

## Vulnerability Disclosure and Reporting
If you discover a security vulnerability, state leakage, or protocol bypass within the Omega Architecture, adhere to the following guidelines:
* **Do not** open public issues for sensitive exploits.
* Report findings directly to the `sovereign-kernel` administrative maintainers via encrypted communication channels.
* Include precise reproduction steps, affected components, and potential impact assessments.

---

## Integration and Enforcement
This security manifest is actively enforced by the `DARLEK CANN v3.0` evolution engine to ensure that automated self-refactoring loops do not compromise global repository security or state integrity.

> **WARNING:** Any violation of these protocols during autonomous execution will trigger an immediate kernel-level panic and rollback procedure.