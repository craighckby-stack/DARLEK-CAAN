# API Gateway Documentation

> **Executive Summary:** Primary ingress gateway for the DARLEK CANN v3.0 system (OMEGA-Emergent architecture), providing real-time diagnostics and agent orchestration hooks.

---

## Quick Navigation
- [API Endpoints](#api-endpoints)
- [Integration Requirements](#integration-requirements)

---

## API Endpoints

The API gateway exposes core system telemetry and agent synchronization capabilities via standardized HTTP methods.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api` | Retrieves system health, performance metrics, and node status. |
| `POST` | `/api` | Submits agent-orchestration payloads for swarm synchronization. |

### Example Request (`POST /api`)

```json
{
  "context": "omega-sync",
  "swarmId": "darlek-cann-v3",
  "payload": {
    "action": "initialize_node",
    "priority": 1
  }
}
```

---

## Integration Requirements

Engineered for seamless interfacing with the `Darlek Caan` and `Darlek Caan` repositories.

* **Required Header:** `X-Agent-Context` must be included in all incoming requests to guarantee proper routing.

### Implementation Example

```bash
curl -X POST https://api.internal.darlek/api \
  -H "Content-Type: application/json" \
  -H "X-Agent-Context: OMEGA-NODE-01" \
  -d '{"context": "omega-sync", "swarmId": "darlek-cann-v3"}'
```