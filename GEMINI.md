# Project Context Maintenance
To ensure continuity between sessions, two progress tracking files must be maintained and updated after each major task:
- `BACKEND_PROGRESS.md`: Tracking all backend-related tasks, ADRs, and implementation status.
- `FRONTEND_PROGRESS.md`: Tracking all frontend-related tasks, ADRs, and implementation status.
These files serve as the definitive record of completed work and current objectives.

# Project Overview

**Name:** in-bot
**Purpose:** Fullstack Contact Registration system with automatic address lookup.
**Stack:**
- **Backend:** NestJS, Prisma 7, PostgreSQL, JWT Stateful.
- **Frontend:** React 18, Vite, TypeScript, TanStack Query, CSS Modules.
- **Deployment:** Docker Compose (Fullstack).

# Architecture

## Backend
Layered architecture: web → application → domain → infrastructure. Organizes business logic via CQRS.

## Frontend
Modular, feature-based architecture.
1.  **Server State:** Managed by TanStack Query for efficient fetching/caching.
2.  **UI State:** Context API for global concerns (Auth, Theme).
3.  **Forms:** React Hook Form + Zod (sharing backend schemas).
4.  **Security:** Protected Routes and Axios Interceptors for JWT management.

# Current Project Structure

## /back
Full implementation completed (API, DB, Resilient Gateway, Auth, Observability).

## /front (Planned)
- `pages/`: Login, Register, Contacts (List/Create/Edit).
- `services/`: API adapters.
- `hooks/`: `useAuth`, `useContacts`, `useAddressLookup`.

---

# Backend Status: Completed ✅
All 10 steps of the backend roadmap are implemented and verified.

# Frontend Roadmap: Professional Implementation 🚀

1.  **Project Initialization & Tooling:**
    - Setup Vite + React + TS.
    - Configure ESLint, Prettier, and Husky for git hooks (lint-staged).
    - Initialize Vitest and React Testing Library.

2.  **Core Infrastructure (The Engine):**
    - **API Client:** Axios instance with interceptors for JWT and Global Error Handling.
    - **Server State:** TanStack Query setup with a global `QueryClient`.
    - **Routing:** React Router setup with `ProtectedRoute` and `PublicRoute` wrappers.

3.  **Authentication & Session (ADR 1001):**
    - `AuthContext` with persistent storage (localStorage) and auto-login logic.
    - Login/Register pages with Zod validation.

4.  **UI Library & Design System (ADR 1003):**
    - Define CSS Variables (Colors, Typography).
    - Build "Atomic" components: `Button`, `Input`, `Card`, `Toast`.
    - Setup `react-hot-toast`.

5.  **Feature: Contact Management:**
    - **Contact List:** Implementation with search, filtering, and pagination support.
    - **Contact Form (ADR 1002):** Complex logic for ZIP code auto-complete, field locking, and validation.
    - **CRUD Operations:** Integrated with TanStack Query for cache invalidation.

6.  **Quality Assurance (ADR 1005):**
    - MSW setup for API mocking.
    - Integration tests for Authentication and Contact Creation flows.

7.  **Final Polish & Delivery:**
    - Performance audit (Lighthouse).
    - Responsive design refinement.
    - Docker integration (Frontend + Nginx).

# Key Technical Decisions
- **Shared Validation:** Zod schemas are shared between front and back (ADR 0004/1000).
- **Stateful JWT:** Token lifecycle managed by Backend and synced via Frontend Interceptors (ADR 0008/1001).
- **ViaCEP Resilience:** Frontend benefits from backend's Circuit Breaker/Cache (ADR 0010/1002).
