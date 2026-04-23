# ADR 0006: Component-Driven UI & UX Patterns

## Status
Accepted

## Context
A contact management system requires a balance between scanning lists quickly and performing focused data entry. The initial design used standard cards and modals, which felt disconnected and cluttered.

## Decision
Adopt a **Drawer-based CRUD** and **Expandable List Items** pattern for a more professional and streamlined user experience.

### 1. Drawer for Creation/Edition
Instead of standard modals, we use a Side Drawer (right-aligned).
- **Focus:** Isolates the form workspace without losing the context of the contact list.
- **Vertical Flow:** Better suited for form layouts, especially on mobile and tall desktop monitors.
- **Transition:** Uses CSS `@keyframes` for a smooth `translateX` entrance.

### 2. Expandable Contact Cards (Dropdown)
To maintain a clean dashboard, full contact details are hidden by default.
- **Summary View:** Shows Name, Email, Phone, and a Location Badge.
- **Detailed View:** Expands on click to reveal full address details (Street, Neighborhood, ZIP).
- **Interaction:** Uses `e.stopPropagation()` on action buttons (Edit/Delete) to prevent accidental expansion.

### 3. Visual Identity (Design System)
- **Typography:** Inter/Sans-serif font stack for readability.
- **Colors:** Deep blue (`#2563eb`) for primary actions, neutral grays for structure, and subtle blurs for overlays.
- **Feedback:** "Skeleton-like" loading states and custom toast notifications for background operations.

## Consequences
- **UX Improvement:** Users can manage contacts without page reloads or intrusive popups.
- **Complexity:** Requires careful state management (`expandedId`) and CSS animation handling.
- **Maintenance:** Highly modular; styling changes in `.module.css` are scoped and safe.
