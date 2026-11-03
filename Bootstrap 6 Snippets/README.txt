========================================================================
BOOTSTRAP 6.0 - LOCAL COMPONENT SNIPPETS
========================================================================

What this is
------------
Every component and form page from the Bootstrap 6 docs, saved offline as
plain .txt files with copy-pasteable code. No more hunting through the site
or opening "view source" to grab an example.

Docs version : 6.0.0-alpha.1
Source       : https://getbootstrap.com/docs/6.0/
Files        : 46 pages, 702 code examples
Refreshed    : 2026-11-03


Folder layout
-------------
  INDEX.txt              List of every file + example counts
  00 Quick Start.txt     Minimal HTML page wired up to Bootstrap 6
  00 JS Cheat Sheet.txt  Every constructor + which ones need manual init
  Components\            29 component pages (navbar, card, dialog, ...)
  Forms\                 17 form pages (controls, checks, datepicker, ...)


How to read a snippet file
--------------------------
Each file follows the same shape:

  - Header: component name, docs URL, whether a JS plugin is required
  - The official short description
  - CONTENTS: every section in the file, with example numbers
  - One block per example:

      ------------------------------------------------------------------
      SECTION NAME
      Example 7  |  HTML
      ------------------------------------------------------------------
      Note: short explanation copied from the docs

      <the actual code, indented exactly as in the docs>

The language tag (HTML / JS / CSS / SCSS) tells you what kind of code the
block is. HTML blocks are ready to paste into a page. JS blocks are
initialisation code for that plugin (if any).


Using the snippets
------------------
1. Start from "00 Quick Start.txt" for a ready HTML shell.
2. Copy the markup you need into the <body>.
3. If the file header says "Requires JavaScript plugin: yes", read the
   JAVASCRIPT SETUP block at the top of that file. The Quick Start file
   already loads the bundle.


JavaScript components
---------------------
Every file that needs JavaScript starts with a JAVASCRIPT SETUP block.
It tells you which of these applies:

  - Data API only: including the bundle is enough. The markup below it
    (data-bs-toggle / data-bs-dismiss / data-bs-spy / data-bs-chips ...)
    is picked up automatically.
  - Manual init required: you must create an instance yourself. This is
    the case for Tooltip, Popover, Toast and Nav Overflow.
  - No own plugin: Nav, Navbar and Combobox have no constructor. They use
    the Drawer/Menu plugins or the data API.

Each block also shows the constructor call and how to get an existing
instance back with getOrCreateInstance().


Bootstrap 6 conventions used throughout the docs
------------------------------------------------
These are easy to trip over if you are coming from Bootstrap 5:

  - Responsive prefixes come BEFORE the class name:
        v5: navbar-expand-md       v6: md:navbar-expand
  - Theme colours are numbered tokens, not only colour names:
        bg-1, bg-2, fg-2, theme-primary, theme-secondary
  - Buttons use new style classes: btn-solid, btn-outline, btn-icon
  - Modals are built on the native <dialog> element (Components\12 Dialog)
  - Offcanvas is replaced by the drawer component (Components\13 Drawer)
  - The mobile navbar uses a <dialog class="drawer"> internally
  - Accordion uses native <details>/<summary> elements (no JS needed)
  - Colour modes: <html data-bs-theme="auto|light|dark">

The markup in these files is exactly what the Bootstrap docs render, so it
is the safest reference for alpha.1.


Refreshing this folder
----------------------
The scraper lives at ..\_tools\refresh-bootstrap-6-docs.mjs

    node _tools/refresh-bootstrap-6-docs.mjs

Run it from the project root. It re-downloads every page and overwrites the
.txt files, so local edits to the snippets will be lost.


Scope
-----
Included: all Components pages, all Forms pages.
Not included: Layout, Content, Helpers, Utilities, Customize, Getting
started. Ask if you want those added.
