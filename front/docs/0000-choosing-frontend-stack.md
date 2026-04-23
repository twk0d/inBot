## Choosing Frontend Stack
**Date:** `2026-04-19`
**Status:** `Accepted`

---

### Context
It is necessary to choose a framework and tools to build a responsive and performant frontend for the contact management system. The application needs to handle authentication, complex forms, and real-time ZIP code lookups.

Options considered: Next.js (SSR), Plain React with Vite, and Vue.js.

### Decision
Adopt **React 18** with **Vite** as the build tool.

Key technical choices:
- **Language:** TypeScript (Strict)
- **State Management:** **TanStack Query (React Query)** for server state and **Context API** for global UI/Auth state.
- **Form Management:** **React Hook Form** with **Zod** for validation (sharing schemas with backend).
- **Styling:** **CSS Modules** for scoped, maintainable styles without the overhead of a large framework.
- **Routing:** **React Router Dom v6**.

### Consequences
- Vite provides a fast development experience and optimized build.
- TanStack Query simplifies data fetching, caching, and loading states.
- Sharing Zod schemas ensures end-to-end type safety and consistent validation rules.
- CSS Modules provide the best balance between scoped styling and standard CSS knowledge.
