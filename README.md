# Bootstrap 6 — Complete Local Documentation

Offline, plain‑text reference for **Bootstrap 6.0.0-alpha.1**.
Every page of the official docs converted to readable text with the
explanations intact — not just code snippets.

> **New to Bootstrap?** Open `Bootstrap 6 Snippets/00 Beginner's Guide.txt`
> first. It assumes zero knowledge and walks you through the grid,
> breakpoints, prefixes and class naming.

## What's inside

Every page follows the same pattern:

```
Header              What it is, and whether it needs JS
WHAT IT DOES        One paragraph in plain English
HOW TO USE IT       Category-specific recipe
READING GUIDE       What the `backticks` mean
ON THIS PAGE        Table of contents
JAVASCRIPT SETUP    (JS components only) exact init code
Body                Explanation first, then class tables and code
```

Code blocks are complete and copy‑pasteable. Class tables list every class
and the CSS it generates.

### Folders (in docs order)

| Path | Contents |
| --- | --- |
| `Bootstrap 6 Snippets/Getting Started/` | Install, approach, accessibility, browsers, CSS variables, JS |
| `Bootstrap 6 Snippets/Guides/` | Quickstart, npm, Webpack, Parcel, Vite, Contribute, Migration |
| `Bootstrap 6 Snippets/Customize/` | Sass, options, colors, theme, color modes, components, transitions, RTL, optimize |
| `Bootstrap 6 Snippets/Layout/` | Breakpoints, containers, grid, columns, gutters, utilities, z-index, CSS grid |
| `Bootstrap 6 Snippets/Content/` | Reboot, typography, images, tables, prose |
| `Bootstrap 6 Snippets/Components/` | 29 components: accordion, alert, avatar, badge, breadcrumb, button, button group, card, carousel, close button, collapse, dialog, drawer, list group, menu, nav, navbar, nav overflow, pagination, placeholder, popover, progress, scrollspy, spinner, stepper, tab, toasts, toggler, tooltip |
| `Bootstrap 6 Snippets/Forms/` | 17 pages: controls, checks, range, input group, chips, combobox, datepicker, OTP input, password strength, layout, validation |
| `Bootstrap 6 Snippets/Helpers/` | Focus ring, hover lift, icon link, position, stacks, stretched link, text truncation, vertical rule, visually hidden |
| `Bootstrap 6 Snippets/Utilities/` | 48 pages: margin, padding, flex, grid, colors, background, border, display, gap, typography utilities, and every other utility |

Plus:

- `00 Beginner's Guide.txt` — zero‑knowledge intro, grid, prefixes, gotchas
- `00 Quick Start.txt` — minimal CDN page
- `00 JS Cheat Sheet.txt` — every constructor + which need manual init
- `INDEX.txt` — all 139 pages
- `README.txt` — how to read, Bootstrap 6 differences

## JavaScript components

Most components are CSS‑only. The 21 that need the bundle carry a
`JAVASCRIPT SETUP` block near the top telling you exactly what to do:

- **Data API (no manual init):** Alert, Carousel, Collapse, Dialog, Drawer,
  Menu, Scrollspy, Tab, Toggler, Range, Chips, Datepicker, OTP Input,
  Password Strength, Combobox, Nav, Navbar
- **Manual init required:** Tooltip, Popover, Toast, Nav Overflow
- **No own plugin:** Nav (uses Menu), Navbar (uses Drawer + Menu)

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js"></script>
```

## Bootstrap 6 vs 5 (the parts that trip people up)

- Breakpoint prefix is **first**: `md:navbar-expand`, `md:col-6`
  (not `navbar-expand-md`, `col-md-6`)
- Numbered theme tokens: `bg-1`, `bg-2`, `fg-2`, `theme-primary`
- Button styles: `btn-solid`, `btn-outline`, `btn-subtle`, `btn-icon`
- Modals are native `<dialog>`; offcanvas is now **Drawer**
- Accordion uses native `<details>/<summary>` (no JS)
- Color modes: `<html data-bs-theme="auto|light|dark">`

## Rebuilding the library

```bash
node _tools/refresh-bootstrap-6-docs.mjs
```

Fetches every official page and rewrites the `.txt` files. Requires Node.js 18+.

## Scope

Everything from the official docs: Getting Started, Guides, Customize,
Layout, Content, Components, Forms, Helpers, Utilities.
Only the demos gallery (`/examples/*`) is omitted — those pages are
step‑by‑step tutorials, not reference material.

Legacy `bootstrap.5.3.txt` (Bootstrap 5.3 notes) is kept at the repo root
for comparison — it predates this project and is not maintained.

Licensed under the same terms as Bootstrap (MIT). Documentation content
attributed to the Bootstrap authors.
