## UI Component Architecture
**Date:** `2026-04-19`
**Status:** `Accepted`

---

### Context
A consistent UI is vital for a professional application. We need a strategy to build reusable components that are accessible, maintainable, and decoupled from business logic.

### Decision
Adopt a **Component-Driven Development (CDD)** approach with a focus on **Headless Patterns** where applicable.

Key Implementation Details:
1.  **Base Components (UI/):** Atomic components like `Button`, `Input`, `Modal`, `Toast` will be "dumb" components, styled with CSS Modules and accepting standard HTML attributes.
2.  **Composition Pattern:** Prefer `children` over complex props to avoid component bloat.
3.  **Accessibility (a11y):** Use semantic HTML and ARIA labels. For complex components (Modals/Dropdowns), leverage **Radix UI** (Headless) to ensure accessibility without sacrificing design freedom.
4.  **Theming:** Use **CSS Variables** defined at the `:root` for colors, spacing, and typography to ensure easy updates and consistent branding.

### Consequences
- High reusability across different features.
- Easier testing of UI in isolation.
- Future-proof: switching the "look" only requires changing CSS variables.
