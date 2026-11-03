========================================================================
BOOTSTRAP 6.0 - COMPLETE LOCAL DOCUMENTATION
========================================================================

What this is
------------
The entire Bootstrap 6 documentation, converted to plain text with the
explanations intact - not just the code snippets. Everything you need,
offline: what each feature does, how to use it, every class table, and
ready-to-paste code.

Docs version : 6.0.0-alpha.1
Source       : https://getbootstrap.com/docs/6.0/
Pages        : 139
Generated    : 2026-11-03


Start here
----------
  00 Beginner's Guide.txt    start from zero: what Bootstrap is,
                             the grid, prefixes, breakpoints, examples
  00 Quick Start.txt         minimal CDN page to copy
  00 JS Cheat Sheet.txt      every constructor + init recipe


Doc sections (in docs order)
----------------------------
  Getting Started\            install, approach, accessibility, browsers, css variables, javascript
  Guides\                     quickstart, npm, webpack, parcel, vite, contribute, migration
  Customize\                  sass, options, color, theme, color-modes, components, transitions, rtl, optimize
  Layout\                     breakpoints, containers, grid, columns, gutters, utilities, z-index, css-grid
  Content\                   reboot, typography, images, tables, prose
  Components\                29 components (accordion ... tooltip)
  Forms\                     17 form pages
  Helpers\                   focus-ring, hover-lift, icon-link, position, stacks, stretched-link,
                            text-truncation, vertical-rule, visually-hidden
  Utilities\                 48 utility pages (api, margin, padding, flex, colors, ...)


How to read a page
------------------
  Header               What it is, and whether it needs JS
  WHAT IT DOES         One paragraph, plain English
  HOW TO USE IT        Category-specific recipe
  READING GUIDE        What the backticks mean
  ON THIS PAGE         Table of contents
  JAVASCRIPT SETUP     If the page needs the bundle: exact init code
  BODY                 Explanation first, then code and class tables

Code blocks are complete and copy-pasteable. Class tables list
every class and the CSS it generates.


Bootstrap 6 gotchas
-------------------
  - Breakpoint prefix goes FIRST: md:col-6, md:navbar-expand (not col-md-6).
  - Numbered theme tokens: bg-1, bg-2, fg-2, theme-primary ...
  - Buttons: btn-solid, btn-outline, btn-subtle, btn-icon.
  - Modals are native <dialog>; offcanvas is now Drawer.
  - Accordion uses native <details>/<summary>.
  - Colors via data-bs-theme="auto|light|dark".


Refreshing
----------
  node _tools/refresh-bootstrap-6-docs.mjs

Re-fetches every page and overwrites the .txt files.
========================================================================
