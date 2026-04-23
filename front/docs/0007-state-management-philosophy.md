# ADR 0007: State Management Philosophy

## Status
Accepted

## Context
React applications often suffer from "state confusion," where server data (API responses) is mixed with UI state (modals open, loading spinners), leading to complex and buggy components.

## Decision
Separate **Server State** from **Client State** using specialized tools.

### 1. Server State (TanStack Query)
Managed by `@tanstack/react-query`.
- **Purpose:** Handling all data fetched from the backend.
- **Features:** Automatic caching, background refetching, and built-in loading/error states.
- **Implementation:** Custom hooks like `useAddressLookup` encapsulate the logic and cache keys.

### 2. Client State (Context API & useState)
- **Global Context:** Used for long-lived application state like `AuthContext`.
- **Local State:** Used for transient UI concerns (e.g., `expandedId` for a card or `isDrawerOpen`).

### 3. Data Synchronization (Optimistic Updates)
While not fully implemented for all fields, the architecture is ready for optimistic updates. In CRUD operations, we invalidate the `['contacts']` query key to trigger a fresh background fetch immediately after a mutation (Create/Update/Delete).

## Consequences
- **Predictability:** Developers know exactly where to find and update state.
- **Performance:** Reduced number of unnecessary re-renders and optimized network traffic through caching.
- **Code Quality:** Components are leaner, focusing on rendering rather than data fetching logic.
