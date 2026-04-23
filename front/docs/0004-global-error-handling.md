## Global Error Handling & Feedback
**Date:** `2026-04-19`
**Status:** `Accepted`

---

### Context
Users need to know when something goes wrong (e.g., ViaCEP is down, token expired, validation failed). Manual error handling in every component leads to inconsistency.

### Decision
Implement a centralized **Error Interceptor** and a **Global Toast System**.

Implementation Plan:
1.  **Axios Interceptor:** Intercept all non-2xx responses.
2.  **Mapping:** Map backend error codes (from ADR 0012) to user-friendly messages.
3.  **Toasts:** Use `react-hot-toast` to trigger non-blocking notifications for API errors.
4.  **Form Feedback:** `react-hook-form` will catch `422 Unprocessable Entity` errors and map them back to specific input fields using the `details` field from our API contract.

### Consequences
- Consistent user experience during failures.
- Drastically reduced boilerplate in components.
- Error logic is decoupled from the UI.
