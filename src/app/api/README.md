# API Gateway Documentation

> **Executive Summary:** Primary ingress gateway for the DARLEK CANN v3.0 system (OMEGA-Emergent architecture), providing real-time diagnostics and agent orchestration hooks.

## Quick Navigation
- [API Endpoints](#api-endpoints)
- [Integration Requirements](#integration-requirements)

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api` | Retrieves system health, performance metrics, and node status. |
| `POST` | `/api` | Submits agent-orchestration payloads for swarm synchronization. |

## Integration Requirements

Engineered for seamless interfacing with the `Darlek Caan` and `Darlek Caan` repositories.

* **Required Header:** `X-Agent-Context` must be included in all incoming requests to guarantee proper routing.