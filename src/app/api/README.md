# API Gateway Documentation

> **Executive Summary:** Primary ingress gateway for the DARLEK CANN v3.0 system (OMEGA-Emergent architecture), providing real-time diagnostics and agent orchestration hooks.

## Quick Navigation
- [API Endpoints](#api-endpoints)
- [Integration Requirements](#integration)

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api` | System health, performance metrics, and node status. |
| `POST` | `/api` | Agent-orchestration payloads for swarm synchronization. |

## Integration

Engineered for seamless interface with the `sovereign-kernel` and `unitary-core` repositories. 

* **Required Header:** `X-Agent-Context` must be included in all incoming requests to guarantee proper routing.