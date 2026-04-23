## Frontend Testing Strategy
**Date:** `2026-04-19`
**Status:** `Accepted`

---

### Context
To ensure the long-term reliability of the frontend, we need an automated testing strategy.

### Decision
Adopt a **Testing Library** focused approach, prioritizing **Integration Tests** over unit tests for components.

Tools:
- **Runner:** Vitest (fast, native Vite integration).
- **DOM Testing:** React Testing Library.
- **API Mocking:** MSW (Mock Service Worker) to intercept network requests during tests, ensuring we test the real integration logic without a live backend.

Strategy:
1.  **Critical Paths:** Test the Login flow and the Contact Creation flow (including the ZIP code auto-complete).
2.  **User Perspective:** Tests will interact with the DOM as a user would (clicking buttons, typing), not testing internal component state.

### Consequences
- Tests are more resilient to refactors.
- High confidence in the "happy path" of the application.
- MSW allows us to simulate edge cases (API timeouts, 500 errors) easily.
