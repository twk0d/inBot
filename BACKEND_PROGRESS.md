# Backend Progress Tracker - in-bot

## Status: Completed ✅

### Implementation
- [x] Architectural documentation (ADRs 0000-0014)
- [x] Project setup (NestJS, Prisma 7, PostgreSQL)
- [x] Layered Architecture (Web, Application, Domain, Infrastructure)
- [x] CQRS Pattern with `@nestjs/cqrs`
- [x] Stateful JWT Authentication
- [x] Resilient ViaCEP Gateway (Cache, Circuit Breaker, Retry)
- [x] Global Error Handling & Observability (Pino, Terminus)
- [x] Dockerization (Dockerfile & docker-compose.yml)
- [x] Verified build and compilation

### Bug Fixes & Refinements
- [x] Improved ViaCEP error handling: Correctly distinguishes between non-existent CEP (404) and service unavailability (503), preventing erroneous circuit breaker triggers.

### ADRs
- 0000-recording-architecture-decisions
- 0001-contact-registration-with-zip-code-lookup
- 0002-application-architecture
- 0003-choosing-nestjs-as-backend-framework
- 0004-input-data-validation
- 0005-environment-variable-management
- 0006-api-security-cors-helmet-and-input-sanitization
- 0007-orm-for-database-access
- 0008-stateful-jwt-authentication
- 0009-stateful-rate-limiting-with-prisma
- 0010-viacep-resilience-strategy
- 0011-observability-logs-metrics-and-traces
- 0012-error-handling-and-api-error-contract
- 0013-backend-testing-strategy
- 0014-cqrs-in-application-layer
