# 🚀 DARLEK CAAN — Autonomous Cognitive Engine & Code Base Evolution Center
### Google AI Studio & Cloud Run Implementation Guide

[![Live App](https://img.shields.io/badge/Live_App-Open_Application-00FF88?style=for-the-badge&logo=googlecloud)](https://ais-dev-amubz4v3czr3772fnvrcru-483535245139.asia-southeast1.run.app)
[![Repository](https://img.shields.io/badge/Repository-craighckby--stack%2FDARLEK--CAAN--Cognitive--Engine-blue?style=for-the-badge&logo=github)](https://github.com/craighckby-stack/DARLEK-CAAN-Cognitive-Engine)
[![License](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-red?style=for-the-badge)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

---

## 📖 Executive Summary & System Overview

**DARLEK CAAN** is an autonomous AI cognitive engine and repository orchestration platform engineered for continuous code analysis, AST-level refactoring, multi-agent dialectic debates, and automated safe back-mutation pipelines.

This document serves as the **authoritative implementation and deployment manual** for Google AI Studio (`ai.studio/build`), Google Cloud Run, and Google Cloud container environments.

### Core Architectural Pillars

1. **🏛️ Multi-Agent Dialectic Debate Chamber**:
   - Evaluates proposed code mutations across five specialized agent personas (Orchestrator, Critic, Synthesizer, Alignment Overseer, Mutator).
   - Computes real-time consensus scores, risk indices, and approval vectors before code staging.

2. **🔄 Closed-Loop AST Back-Mutation Pipeline**:
   - Parses target codebase assets into Abstract Syntax Trees (AST).
   - Uses Monte Carlo Tree Search (MCTS) expansion for structural refactoring candidate selection.
   - Enforces a strict **Structural Sanity Guard** (0-byte rejection, syntax verification, circular-theory detection) to eliminate code corruption.

3. **🧠 RAG Brain Vector Store**:
   - Semantic code search and retrieval engine using Google's `text-embedding-004` model.
   - Persistent memory graph indexing functions, dependencies, and cognitive evolutionary cycles.

4. **📟 MS-DOS Real-Time Telemetry Screen (`C:\DALEK\SYS`)**:
   - Hardware-faithful terminal emulator streaming live system telemetry, RAG vector writes, AST diffs, and auto-push commit hashes.

---

## 🛠️ Google AI Studio Implementation & Build Guide

### 1. Target Runtime Environment

| Parameter | Specification | Purpose / Rule |
| :--- | :--- | :--- |
| **Ingress Port** | `3000` | Hardcoded reverse-proxy ingress required by Google AI Studio container architecture. |
| **Host Binding** | `0.0.0.0` | Required for internal container routing. |
| **Runtime** | Node.js 20+ | Native TypeScript type-stripping and ESM runtime compatibility. |
| **Frontend Framework** | React 18.2 + Vite 5.x | High-performance client-side rendering with Tailwind CSS. |
| **Styling & Icons** | Tailwind CSS + Lucide Icons | Utility-first responsive design; zero external font/CSS-in-JS dependencies. |
| **Animation Core** | `motion/react` | Hardware-accelerated UI transition loops. |

---

### 2. Project Architecture & Directory Layout

```
/
├── .env.example                       # Documented environment variable schema
├── metadata.json                      # AI Studio application capabilities & metadata
├── index.html                         # SPA entry point with dark-mode security headers
├── package.json                       # Dependencies, build scripts, and engine directives
├── vite.config.ts                     # Vite bundle configuration and path aliases (@/*)
├── eslint.config.mjs                  # Flat ESLint configuration with TypeScript support
├── src/
│   ├── main.tsx                       # Primary React DOM mount and entry point
│   ├── App.tsx                        # Conceptual exploration & story state explorer
│   ├── index.css                      # Tailwind base directives and design tokens
│   ├── components/
│   │   ├── MainPage.tsx               # Primary Darlek Caan cockpit & orchestration center
│   │   ├── ChatPanel.tsx              # Operator command input & synthetic voice feedback
│   │   ├── DashboardPanel.tsx         # Real-time metrics, telemetry graphs, and staging depot
│   │   ├── AgentOrchestra.tsx         # Multi-agent debate visualization & voting matrix
│   │   ├── MutationDiffView.tsx       # Side-by-side AST mutation diff inspect and review
│   │   ├── DosConsoleModal.tsx        # Retro MS-DOS C:\DALEK\SYS real-time terminal & telemetry console
│   │   ├── NeuralSimulator.tsx        # High-dimensional state space visualizer
│   │   └── ui/                        # Radix UI primitives with Tailwind styling
│   ├── hooks/                         # Custom React hooks (useSystemState, useToast, etc.)
│   ├── lib/                           # Core utilities (API client, sanitizer, types, constants)
│   └── utils/                         # Code engines, AST parsers, and safety tripwires
```

---

### 3. Step-by-Step Build & Setup Process

#### Step A: Environment Variable Declaration
Declare required secrets in `.env.example` (or configure via the AI Studio Settings menu):

```bash
# Target repository orchestration credentials
GITHUB_TOKEN=
NEXT_PUBLIC_GITHUB_REPO_OWNER=
NEXT_PUBLIC_GITHUB_REPO_NAME=

# Google Cloud & Gemini API Key
GEMINI_API_KEY=

# Optional Persistent Vector Store
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

#### Step B: Install Base Dependencies
Dependencies are pre-cached in container environments. If installing manually:

```bash
npm install
```

Core dependencies verified:
- `@radix-ui/react-*` primitives for accessible UI modals, dialogs, and tooltips.
- `motion` for fluid interface animations.
- `lucide-react` for system status icons.
- `recharts` for telemetry throughput and qualia index charting.
- `tailwindcss` and `tailwind-merge` for design system consistency.

#### Step C: Build Verification & Compilation
Run the validation suite to ensure complete type safety and zero syntax errors:

```bash
# 1. Validate syntax and linting
npm run lint

# 2. Execute production Vite build
npm run build
```

The build outputs optimized static assets to `dist/` ready for Cloud Run container hosting.

#### Step D: Starting the Development Server
Launch the development server bound to `0.0.0.0:3000`:

```bash
npm run dev
```

---

## 💬 Command Interface & Operator Directives

You can control the autonomous engine directly from the chat interface:

| Command | Aliases | Description |
| :--- | :--- | :--- |
| `help` | `commands` | Displays the operational manual and active directives. |
| `dos` | `monitor`, `telemetry`, `msdos` | Opens the **MS-DOS Real-Time Telemetry Monitor** screen (`C:\DALEK\SYS`). |
| `scan` | — | Scans the target GitHub repository for code assets and AST candidates. |
| `1`, `2`, `3`... | — | Selects a specific file index from the scanned inventory to mutate. |
| `propose` | — | Triggers Multi-Agent Debate Chamber & proposes AST mutation on selected file. |
| `approve` | `exterminate` | Atomically commits and auto-pushes staged mutation to GitHub. |
| `reject` | `cancel` | Discards current proposal and records negative feedback memory. |
| `batch` | — | Executes automated evolutionary loop across multiple target files. |
| `status` | — | Displays live telemetry, memory allocation, and saturation indices. |
| `reboot` | `reset` | Initiates clean system reboot, purging volatile logs and cache. |
| `clear` | — | Clears operator chat history. |

---

## 🔄 The Closed-Loop Back-Mutation Pipeline

```
┌─────────────────┐       ┌─────────────────┐       ┌───────────────────┐
│ Target File     │ ────> │ MCTS Candidate  │ ────> │ Structural Sanity │
│ Selection       │       │ Expansion (AST) │       │ Guard Check       │
└─────────────────┘       └─────────────────┘       └───────────────────┘
                                                              │
                                                              ▼
┌─────────────────┐       ┌─────────────────┐       ┌───────────────────┐
│ Target GitHub   │ <──── │ Auto-Push Sync  │ <──── │ Coherence Gate    │
│ Repository      │       │ Pipeline        │       │ & Multi-Agent     │
└─────────────────┘       └─────────────────┘       └───────────────────┘
```

1. **AST Node Parsing & MCTS Candidate Expansion**:
   - The engine parses source code into an Abstract Syntax Tree (AST).
   - Monte Carlo Tree Search expands candidate refactoring nodes to optimize performance and readability.

2. **Structural Sanity Guard & Zero-Byte Circuit Breaker**:
   - Before code reaches staging, the **Sanity Guard** validates syntax validity.
   - If zero-byte output or syntax regression is detected, the emergency circuit breaker triggers instantly, logging the anomaly and halting corruption.

3. **Coherence Gate & Multi-Agent Consensus**:
   - Candidate mutations pass through the **Coherence Gate**, checking cross-file compatibility and safety parameters.
   - Requires positive consensus margin across debate agents before staging.

4. **Auto-Push Synchronization**:
   - Upon approval, the **Auto-Push Worker** commits the changeset with verification SHA hashes directly to the target GitHub repository branch.

---

## 🔒 Security Architecture & Safeguards

* **Siphon Sanitization**: Automatically scrubs secrets, tokens, and PII before passing context to LLM debate agents.
* **Bounded Context Limits**: Maximum payload size guards to prevent memory overflow.
* **Audit Trail**: Every mutation proposal, consensus vote, and rejected diff is recorded with timestamped telemetry.
* **Zero-Leak Memory Persistence**: Clean lifecycle teardowns on component unmounts.

---

## 📄 License & Attribution

Distributed under **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.  
Copyright (c) 2026 **Craighckby**. All rights reserved.
