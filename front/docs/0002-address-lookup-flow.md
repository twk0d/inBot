## Address Lookup Flow (UX/Integration)
**Date:** `2026-04-19`
**Status:** `Accepted`

---

### Context
The main feature is automatic address lookup via ZIP code (ViaCEP). We need to define how the frontend interacts with the backend to provide a smooth UX.

### Decision
Implement a **Debounced Watcher** on the ZIP code (CEP) field in the Contact Form.

Implementation:
1.  User enters CEP.
2.  Frontend validates if CEP has 8 digits (ignoring masks).
3.  Frontend calls `GET /address/cep/:cep` from our backend.
4.  While fetching, a loading indicator is shown in the address fields.
5.  On success, `street`, `neighborhood`, `city`, and `state` fields are populated and set to **read-only** (locked) to ensure consistency with official data.
6.  The user only needs to manually fill in the `number` and `observation`.

### Consequences
- Professional UX that saves user time and prevents typing errors.
- Centralizing ViaCEP logic in the backend (as per ADR 0001) is correctly utilized.
- Locked fields prevent users from accidentally changing official address data.
