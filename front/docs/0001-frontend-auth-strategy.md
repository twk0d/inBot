## Frontend Authentication Strategy
**Date:** `2026-04-19`
**Status:** `Accepted`

---

### Context
The application needs to handle stateful JWT authentication provided by the backend. We need to decide how to store the token and protect routes.

### Decision
Use **Context API** to manage the global auth state and **localStorage** for persisting the JWT access token (considering this is a Pleno-level MVP).

Implementation details:
- An `AuthContext` will provide `user`, `login`, `logout`, and `isAuthenticated` states.
- Axios interceptors will be used to attach the `Authorization: Bearer <token>` header to every request.
- Interceptors will also handle `401 Unauthorized` responses by clearing the local state and redirecting to login.
- **Protected Routes** will be implemented using a wrapper component that checks authentication before rendering children.

### Consequences
- Centralized auth logic makes it easy to update user data across the UI.
- LocalStorage persistence allows the user to stay logged in after page refreshes.
- Interceptors ensure consistent token management without manual logic in every service call.
