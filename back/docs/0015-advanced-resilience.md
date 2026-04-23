# ADR 0015: Advanced Resilience & External API Error Contract

## Status
Accepted

## Context
Integrating with public APIs like ViaCEP introduces instability. Standard error handling often treats "Address Not Found" as a system failure, which can trigger circuit breakers erroneously and confuse the user.

## Decision
Refine the error contract between the ViaCEP Adapter and the Application layer to distinguish between **User Errors** and **System Failures**.

### 1. Error Categorization
- **User Errors (404):** CEP not found or malformed input. These return `null` from the gateway and throw a `NotFoundException` at the application level.
- **System Failures (503):** API downtime, timeouts, or network errors. These trigger the **Circuit Breaker** and return a `ServiceUnavailableException`.

### 2. Implementation details
- **Circuit Breaker (Opossum):** Wrapped around the `fetchFromViaCep` call but configured to *propagate* 404/400 errors without incrementing the failure counter.
- **Cache-First Strategy:** All successful lookups are cached in Redis/Memory for 24 hours to minimize external dependencies.

### 3. Resilience Layers
1. **Retry:** Axios-retry handles transient network flickers (3 attempts with exponential delay).
2. **Circuit Breaker:** Protects the local process from hanging on a dead external service.
3. **Fallback:** Graceful message returned to the UI if the service is truly down.

## Consequences
- **Accuracy:** The system no longer reports "service unavailable" when a user simply types a wrong CEP.
- **Stability:** The backend is protected against cascading failures.
