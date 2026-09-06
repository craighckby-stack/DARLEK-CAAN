# Auto-Test Runner Architecture

## Executive Summary
The **Auto-Test Runner** functions as the primary **Coherence Gate** for the DARLEK CANN v3.0 system. It ensures system stability by enforcing rigorous static analysis, security checks, and architectural validation on all automated code mutations prior to integration.

---

## Table of Contents
1. [Execution Workflow](#execution-workflow)
2. [Module Integration](#module-integration)

---

## Execution Workflow

| Step | Phase | Description |
| :--- | :--- | :--- |
| **1** | **Ingestion** | Accepts `proposedCode` and `originalCode` payloads for evaluation. |
| **2** | **Diagnostic Suite** | Executes comprehensive, regex-based static analysis checks. |
| **3** | **Gatekeeping** | Evaluates outcomes; any `high`-severity failure triggers immediate mutation rejection. |
| **4** | **Telemetry** | Records execution results and performance metrics to the central evolution dashboard. |

---

## Module Integration

The Auto-Test Runner is invoked directly by the `MutationEngine` upon the completion of every generation cycle.