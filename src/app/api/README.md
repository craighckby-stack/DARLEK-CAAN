# API Gateway Documentation

## Overview

This module functions as the primary ingress gateway for the DARLEK CANN v3.0 system. Built upon the OMEGA-Emergent architecture, it delivers real-time system diagnostics and dedicated agent orchestration hooks.

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api` | Returns system health, performance metrics, and node status. |
| `POST` | `/api` | Accepts agent-orchestration payloads for swarm synchronization. |

## Integration

This system is engineered to interface seamlessly with the `sovereign-kernel` and `unitary-core` repositories. To guarantee proper request routing, ensure all incoming requests include the required `X-Agent-Context` header.