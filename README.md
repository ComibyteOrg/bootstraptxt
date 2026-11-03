# Bootstrap 6 Component Text Library

Offline, copy-pasteable reference for **Bootstrap 6.0.0-alpha.1**.

Every component and form page from the official docs is saved as a plain
`.txt` file with the exact markup, notes, and JavaScript setup. No need to
open the website just to grab a snippet.

## Contents

| Path | What it is |
| --- | --- |
| `Bootstrap 6 Snippets/Components/` | 29 component pages: accordion, alert, avatar, badge, breadcrumb, button, button group, card, carousel, close button, collapse, dialog, drawer, list group, menu, nav, navbar, nav overflow, pagination, placeholder, popover, progress, scrollspy, spinner, stepper, tab, toasts, toggler, tooltip |
| `Bootstrap 6 Snippets/Forms/` | 17 form pages: overview, field, form control, checkbox, radio, switch, range, input group, floating labels, form adorn, chips, combobox, datepicker, OTP input, password strength, layout, validation |
| `Bootstrap 6 Snippets/00 Quick Start.txt` | Minimal HTML page wired to the v6 CDN |
| `Bootstrap 6 Snippets/00 JS Cheat Sheet.txt` | Every constructor, plus which components need manual init |
| `Bootstrap 6 Snippets/INDEX.txt` | Full file list with example counts |
| `Bootstrap 6 Snippets/README.txt` | How to read the snippets and what changed in v6 |
| `_tools/refresh-bootstrap-6-docs.mjs` | Scraper that rebuilds the whole library |
| `bootstrap.5.3.txt` | Existing Bootstrap 5.3 reference (kept as-is) |

## What each snippet file looks like

```
========================================================================
NAVBAR
Bootstrap 6.0  |  Local component reference
Source: https://getbootstrap.com/docs/6.0/components/navbar
========================================================================

Create flexible, responsive navigation bars...

CONTENTS
   1. Example  (example 1)
   2. Supported content > Brand > Text  (example 2)
   ...

------------------------------------------------------------------------
JAVASCRIPT SETUP  (read this first)
------------------------------------------------------------------------
...

------------------------------------------------------------------------
SUPPORTED CONTENT > BRAND > TEXT
Example 2  |  HTML
------------------------------------------------------------------------
Note: Add your text within an element with the `.navbar-brand` class.

<nav class="navbar bg-1 fg-2">
  ...
</nav>
```

## JavaScript

21 components ship a `JAVASCRIPT SETUP` block:

- **Auto-initialised by the data API:** Alert, Carousel, Collapse, Dialog,
  Drawer, Menu, Scrollspy, Tab, Toggler, Range, Chips, Datepicker,
  OTP Input, Password Strength, Combobox, Nav, Navbar.
- **Manual initialisation required:** Tooltip, Popover, Toast, Nav Overflow.
- **No own plugin:** Nav (uses Menu), Navbar (uses Drawer + Menu),
  Combobox (data API only).

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js"></script>
```

## Bootstrap 6 differences worth knowing

- Responsive prefixes come **before** the class: `md:navbar-expand`
  (not `navbar-expand-md`).
- Numbered theme tokens: `bg-1`, `fg-2`, `theme-primary`, `theme-secondary`.
- Button styles: `btn-solid`, `btn-outline`, `btn-subtle`, `btn-icon`.
- Modals use the native `<dialog>` element; offcanvas is now **Drawer**.
- Accordion uses native `<details>` / `<summary>` — no JavaScript.
- Colour modes: `<html data-bs-theme="auto|light|dark">`.

## Refresh the library

```bash
node _tools/refresh-bootstrap-6-docs.mjs
```

The script downloads every page again and rewrites the `.txt` files.

## Scope

Included: all **Components** and **Forms** pages.
Not included: Layout, Content, Helpers, Utilities, Customize, Getting started.
