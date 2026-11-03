/**
 * Bootstrap 6 docs -> local, copy-pasteable text snippets.
 *
 * Every page of the official documentation is rendered as a plain-text
 * reference: explanations, class tables, lists, and all code blocks.
 * Pages that rely on JavaScript start with a JAVASCRIPT SETUP block.
 *
 * Usage:  node _tools/refresh-bootstrap-6-docs.mjs
 * Output: ./Bootstrap 6 Snippets/
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { renderPage } from './render-page.mjs'

const BASE = 'https://getbootstrap.com/docs/6.0'
const OUT = join(process.cwd(), 'Bootstrap 6 Snippets')

// ------------------------------------------------------------------ pages
// Ordered as they appear in the docs sidebar.

const SECTIONS = [
  {
    folder: 'Getting Started', path: 'getting-started', pages: [
      ['install', 'Install'],
      ['approach', 'Approach'],
      ['accessibility', 'Accessibility'],
      ['browsers-devices', 'Browsers and Devices'],
      ['css-variables', 'CSS Variables'],
      ['javascript', 'JavaScript'],
    ],
  },
  {
    folder: 'Guides', path: 'guides', pages: [
      ['quickstart', 'Quickstart'],
      ['npm', 'npm'],
      ['webpack', 'Webpack'],
      ['parcel', 'Parcel'],
      ['vite', 'Vite'],
      ['contribute', 'Contribute'],
      ['migration', 'Migration'],
    ],
  },
  {
    folder: 'Customize', path: 'customize', pages: [
      ['overview', 'Customize'],
      ['sass', 'Sass'],
      ['options', 'Options'],
      ['color', 'Color'],
      ['theme', 'Theme'],
      ['color-modes', 'Color Modes'],
      ['components', 'Components'],
      ['transitions', 'Transitions'],
      ['rtl', 'RTL'],
      ['optimize', 'Optimize'],
    ],
  },
  {
    folder: 'Layout', path: 'layout', pages: [
      ['breakpoints', 'Breakpoints'],
      ['containers', 'Containers'],
      ['grid', 'Grid System'],
      ['columns', 'Columns'],
      ['gutters', 'Gutters'],
      ['utilities', 'Utilities for Layout'],
      ['z-index', 'Z-Index'],
      ['css-grid', 'CSS Grid'],
    ],
  },
  {
    folder: 'Content', path: 'content', pages: [
      ['reboot', 'Reboot'],
      ['typography', 'Typography'],
      ['images', 'Images'],
      ['tables', 'Tables'],
      ['prose', 'Prose'],
    ],
  },
  {
    folder: 'Components', path: 'components', pages: [
      ['accordion', 'Accordion'],
      ['alert', 'Alert'],
      ['avatar', 'Avatar'],
      ['badge', 'Badge'],
      ['breadcrumb', 'Breadcrumb'],
      ['button', 'Button'],
      ['button-group', 'Button Group'],
      ['card', 'Card'],
      ['carousel', 'Carousel'],
      ['close-button', 'Close Button'],
      ['collapse', 'Collapse'],
      ['dialog', 'Dialog'],
      ['drawer', 'Drawer'],
      ['list-group', 'List Group'],
      ['menu', 'Menu'],
      ['nav', 'Nav'],
      ['navbar', 'Navbar'],
      ['nav-overflow', 'Nav Overflow'],
      ['pagination', 'Pagination'],
      ['placeholder', 'Placeholder'],
      ['popover', 'Popover'],
      ['progress', 'Progress'],
      ['scrollspy', 'Scrollspy'],
      ['spinner', 'Spinner'],
      ['stepper', 'Stepper'],
      ['tab', 'Tab'],
      ['toasts', 'Toasts'],
      ['toggler', 'Toggler'],
      ['tooltip', 'Tooltip'],
    ],
  },
  {
    folder: 'Forms', path: 'forms', pages: [
      ['overview', 'Forms Overview'],
      ['field', 'Field'],
      ['form-control', 'Form Control'],
      ['checkbox', 'Checkbox'],
      ['radio', 'Radio'],
      ['switch', 'Switch'],
      ['range', 'Range'],
      ['input-group', 'Input Group'],
      ['floating-labels', 'Floating Labels'],
      ['form-adorn', 'Form Adorn'],
      ['chips', 'Chips'],
      ['combobox', 'Combobox'],
      ['datepicker', 'Datepicker'],
      ['otp-input', 'OTP Input'],
      ['password-strength', 'Password Strength'],
      ['layout', 'Layout'],
      ['validation', 'Validation'],
    ],
  },
  {
    folder: 'Helpers', path: 'helpers', pages: [
      ['focus-ring', 'Focus Ring'],
      ['hover-lift', 'Hover Lift'],
      ['icon-link', 'Icon Link'],
      ['position', 'Position'],
      ['stacks', 'Stacks'],
      ['stretched-link', 'Stretched Link'],
      ['text-truncation', 'Text Truncation'],
      ['vertical-rule', 'Vertical Rule'],
      ['visually-hidden', 'Visually Hidden'],
    ],
  },
  {
    folder: 'Utilities', path: 'utilities', pages: [
      ['api', 'Utilities API'],
      ['align-content', 'Align Content'],
      ['align-items', 'Align Items'],
      ['align-self', 'Align Self'],
      ['aspect-ratio', 'Aspect Ratio'],
      ['background', 'Background'],
      ['border', 'Border'],
      ['border-color', 'Border Color'],
      ['border-radius', 'Border Radius'],
      ['colors', 'Colors'],
      ['color-scheme', 'Color Scheme'],
      ['container-queries', 'Container Queries'],
      ['display', 'Display'],
      ['divide', 'Divide'],
      ['flex', 'Flex'],
      ['float', 'Float'],
      ['font-family', 'Font Family'],
      ['font-size', 'Font Size'],
      ['font-style', 'Font Style'],
      ['font-weight', 'Font Weight'],
      ['gap', 'Gap'],
      ['grid', 'Grid'],
      ['height', 'Height'],
      ['justify-content', 'Justify Content'],
      ['justify-items', 'Justify Items'],
      ['line-height', 'Line Height'],
      ['link', 'Link'],
      ['margin', 'Margin'],
      ['motion', 'Motion'],
      ['object-fit', 'Object Fit'],
      ['opacity', 'Opacity'],
      ['overflow', 'Overflow'],
      ['padding', 'Padding'],
      ['place-items', 'Place Items'],
      ['pointer-events', 'Pointer Events'],
      ['position', 'Position'],
      ['shadows', 'Shadows'],
      ['space', 'Space'],
      ['text-alignment', 'Text Alignment'],
      ['text-decoration', 'Text Decoration'],
      ['text-transform', 'Text Transform'],
      ['text-wrapping', 'Text Wrapping'],
      ['theme', 'Theme'],
      ['user-select', 'User Select'],
      ['vertical-align', 'Vertical Align'],
      ['visibility', 'Visibility'],
      ['width', 'Width'],
      ['z-index', 'Z-Index'],
    ],
  },
]

// -------------------------------------------------------- javaScript setup

const JS_SETUP = {
  Alert: {
    mode: 'The data API wires up `data-bs-dismiss="alert"` automatically. The constructor is only needed if you want to drive an alert from JavaScript.',
    auto: ['<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'],
    manual: "const alert = new bootstrap.Alert('#myAlert')",
    reuse: "const alert = bootstrap.Alert.getOrCreateInstance('#myAlert')",
  },
  Carousel: {
    mode: 'The data API initialises carousels and their controls. Add `data-bs-autoplay="true"` to start cycling on page load.',
    auto: [
      '<div id="myCarousel" class="carousel slide" data-bs-autoplay="true">',
      '  <div class="carousel-inner">...</div>',
      '  <button type="button" data-bs-target="#myCarousel" data-bs-slide="next">Next</button>',
      '</div>',
    ],
    manual: "const carousel = new bootstrap.Carousel('#myCarousel')",
    reuse: "const carousel = bootstrap.Carousel.getOrCreateInstance('#myCarousel')",
  },
  Collapse: {
    mode: 'The data API initialises collapsibles from the trigger attributes below.',
    auto: [
      '<button type="button" data-bs-toggle="collapse" data-bs-target="#myCollapse">Toggle</button>',
      '<div class="collapse" id="myCollapse">...</div>',
    ],
    manual: "const collapse = new bootstrap.Collapse('#myCollapse')",
    reuse: "const collapse = bootstrap.Collapse.getOrCreateInstance('#myCollapse')",
  },
  Dialog: {
    mode: 'The data API opens dialogs from `data-bs-toggle="dialog"`. A dialog is a native `<dialog>` element.',
    auto: [
      '<button type="button" data-bs-toggle="dialog" data-bs-target="#myDialog">Open dialog</button>',
      '',
      '<dialog class="dialog" id="myDialog">',
      '  ...',
      '</dialog>',
    ],
    manual: "const dialog = new bootstrap.Dialog('#myDialog')\ndialog.show()",
    reuse: "const dialog = bootstrap.Dialog.getOrCreateInstance('#myDialog')",
  },
  Drawer: {
    mode: 'The data API opens drawers from `data-bs-toggle="drawer"`. A drawer is a native `<dialog>` element.',
    auto: [
      '<button type="button" data-bs-toggle="drawer" data-bs-target="#myDrawer">Open drawer</button>',
      '',
      '<dialog class="drawer drawer-end" id="myDrawer">',
      '  ...',
      '</dialog>',
    ],
    manual: "const drawer = new bootstrap.Drawer('#myDrawer')\ndrawer.show()",
    reuse: "const drawer = bootstrap.Drawer.getOrCreateInstance('#myDrawer')",
  },
  Menu: {
    mode: 'The data API initialises menus from the trigger. `data-bs-toggle="menu"` is required on the trigger whether you use the data API or JavaScript.',
    auto: [
      '<button type="button" data-bs-toggle="menu" aria-expanded="false">Menu</button>',
      '<div class="menu">',
      '  <a class="menu-item" href="#">Action</a>',
      '</div>',
    ],
    manualLabel: 'Manual initialisation (pass the trigger, not the menu):',
    manual: "const menu = new bootstrap.Menu('#myMenuToggle')",
    reuse: "const menu = bootstrap.Menu.getOrCreateInstance('#myMenuToggle')",
  },
  Nav: {
    mode: 'There is no `bootstrap.Nav` plugin. Navs are CSS; the menus inside them are powered by the Menu plugin, which the data API initialises automatically.',
    auto: [
      '<button class="nav-link" type="button" data-bs-toggle="menu" aria-expanded="false">Menu</button>',
      '<div class="menu">...</div>',
    ],
    manualLabel: 'Manual initialisation of a nav menu:',
    manual: "const menu = new bootstrap.Menu('#myNavMenuToggle')",
  },
  Navbar: {
    mode: 'There is no `bootstrap.Navbar` plugin. A v6 navbar is CSS plus the Drawer (mobile menu) and Menu (dropdowns) plugins. The data API initialises both automatically.',
    auto: [
      '<button class="btn-icon navbar-toggler" type="button"',
      '        data-bs-toggle="drawer" data-bs-target="#navbarDrawer"',
      '        aria-controls="navbarDrawer" aria-expanded="false"',
      '        aria-label="Toggle navigation">',
      '  <span class="navbar-toggler-icon" aria-hidden="true"></span>',
      '</button>',
      '',
      '<dialog class="drawer drawer-end" id="navbarDrawer">',
      '  ...',
      '</dialog>',
    ],
    manualLabel: 'Manual control of the navbar drawer:',
    manual: "const drawer = new bootstrap.Drawer('#navbarDrawer')\ndrawer.show()",
  },
  'Nav Overflow': {
    mode: 'This component has no data API. Create it yourself and pass the wrapper element, not the nav.',
    manual: "const navOverflow = new bootstrap.NavOverflow(wrapperElement, {\n  moreText: 'More',\n  threshold: 2\n})",
  },
  Popover: {
    mode: 'Popovers are NOT initialised by the data API. Create an instance yourself, or use the delegated form below.',
    markup: [
      '<button type="button" data-bs-toggle="popover" data-bs-title="Popover title"',
      '        data-bs-content="And here is some amazing content.">',
      '  Click to toggle popover',
      '</button>',
    ],
    manual: "// one popover\nconst popover = new bootstrap.Popover('#myPopover')\n\n// or every popover on the page\nconst popovers = [...document.querySelectorAll('[data-bs-toggle=\"popover\"]')]\n  .map(el => new bootstrap.Popover(el))",
    reuse: "const popover = bootstrap.Popover.getOrCreateInstance('#myPopover')",
  },
  Scrollspy: {
    mode: 'The data API initialises scrollspy from `data-bs-spy="scroll"`.',
    auto: ['<body data-bs-spy="scroll" data-bs-target="#myNav" tabindex="0">'],
    manual: "const scrollSpy = new bootstrap.ScrollSpy(document.body, {\n  target: '#myNav'\n})",
    reuse: "const scrollSpy = bootstrap.ScrollSpy.getOrCreateInstance(document.body)",
  },
  Tab: {
    mode: 'The data API initialises tabs from `data-bs-toggle="tab"`.',
    auto: [
      '<button class="nav-link active" data-bs-toggle="tab" data-bs-target="#home" type="button">Home</button>',
      '<div class="tab-content">',
      '  <div class="tab-pane active" id="home">...</div>',
      '</div>',
    ],
    manualLabel: 'Manual initialisation (pass the trigger element, not the wrapper):',
    manual: "const triggerEl = document.querySelector('#myTab button[data-bs-target=\"#profile\"]')\nbootstrap.Tab.getOrCreateInstance(triggerEl).show()",
  },
  Toasts: {
    mode: 'Toasts are NOT initialised by the data API. Create an instance and call `show()`.',
    markup: [
      '<div class="toast" id="myToast" role="alert" aria-live="assertive" aria-atomic="true">',
      '  <div class="toast-header">',
      '    <strong class="me-auto">Bootstrap</strong>',
      '    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>',
      '  </div>',
      '  <div class="toast-body">Hello, world! This is a toast message.</div>',
      '</div>',
    ],
    manual: "const toast = new bootstrap.Toast('#myToast')\ntoast.show()",
    reuse: "const toast = bootstrap.Toast.getOrCreateInstance('#myToast')",
  },
  Toggler: {
    mode: 'The data API initialises togglers from the attributes below. Manual control is rarely needed.',
    auto: [
      '<button type="button" class="btn-solid theme-primary"',
      '        data-bs-toggle="toggler"',
      '        data-bs-value="bg-2"',
      '        data-bs-attribute="class">',
      '  Toggle class',
      '</button>',
    ],
    manual: "const toggler = new bootstrap.Toggler('#myToggler')",
    reuse: "const toggler = bootstrap.Toggler.getOrCreateInstance('#myToggler')",
  },
  Tooltip: {
    mode: 'Tooltips are NOT initialised by the data API. Create an instance yourself, or initialise one delegated instance on a parent.',
    markup: [
      '<button type="button" data-bs-toggle="tooltip" data-bs-title="Tooltip text">',
      '  Hover me',
      '</button>',
    ],
    manual: "// one tooltip\nconst tooltip = new bootstrap.Tooltip('#myTooltip')\n\n// or every tooltip on the page\nconst tooltips = [...document.querySelectorAll('[data-bs-toggle=\"tooltip\"]')]\n  .map(el => new bootstrap.Tooltip(el))\n\n// or delegated (also works for elements added later)\nnew bootstrap.Tooltip(document.body, { selector: '[data-bs-toggle=\"tooltip\"]' })",
    reuse: "const tooltip = bootstrap.Tooltip.getOrCreateInstance('#myTooltip')",
  },
  Range: {
    mode: 'The data API initialises the value bubble from `data-bs-bubble`. The constructor is available when you need options.',
    auto: [
      '<div class="form-range" data-bs-bubble>',
      '  <input type="range" class="form-range-input" min="0" max="100" value="40">',
      '</div>',
    ],
    manual: "const range = new bootstrap.Range(element, {\n  bubble: true,\n  formatter: value => value + '%'\n})",
    reuse: "const range = bootstrap.Range.getOrCreateInstance(element)",
  },
  Chips: {
    mode: 'The data API initialises chip inputs from `data-bs-chips`. Options can be passed as data attributes.',
    auto: [
      '<div class="chip-input theme-primary" data-bs-chips data-bs-separator=",">',
      '  <input type="text" class="form-ghost" placeholder="Add tags...">',
      '</div>',
    ],
    manual: "const chips = new bootstrap.Chips(chipInputElement, {\n  separator: ',',\n  maxChips: 5\n})",
    reuse: "const chips = bootstrap.Chips.getOrCreateInstance(chipInputElement)",
  },
  Combobox: {
    mode: 'The docs do not expose a `bootstrap.Combobox` constructor. The data API drives the component entirely; including the bundle is all the JavaScript you need.',
    auto: [
      '<button class="form-control combobox-toggle" type="button"',
      '        data-bs-toggle="combobox"',
      '        data-bs-name="country">',
      '  <span class="combobox-value">Select an option</span>',
      '</button>',
      '<div class="menu">',
      '  <button class="menu-item" type="button" data-bs-value="us">United States</button>',
      '</div>',
    ],
  },
  Datepicker: {
    mode: 'The data API initialises datepickers from `data-bs-toggle="datepicker"`.',
    auto: ['<input type="text" class="form-control" data-bs-toggle="datepicker">'],
    manual: "const datepicker = new bootstrap.Datepicker(datepickerEl, {\n  selectionMode: 'single',\n  firstWeekday: 1\n})",
    reuse: "const datepicker = bootstrap.Datepicker.getOrCreateInstance(datepickerEl)",
  },
  'OTP Input': {
    mode: 'The data API initialises OTP inputs from `data-bs-otp` on a container wrapping a single `<input>`.',
    auto: [
      '<div class="otp" data-bs-otp>',
      '  <input type="text" class="otp-input" maxlength="6" aria-label="Verification code">',
      '</div>',
    ],
    manual: "const otpInput = new bootstrap.OtpInput(otpElement)",
    reuse: "const otpInput = bootstrap.OtpInput.getOrCreateInstance(otpElement)",
  },
  'Password Strength': {
    mode: 'The data API initialises strength meters from `data-bs-strength`. It looks for a password input in the same parent container.',
    auto: [
      '<div>',
      '  <input type="password" class="form-control" id="myPassword">',
      '  <div class="strength" data-bs-strength>',
      '    <div class="strength-segment"></div>',
      '    <div class="strength-segment"></div>',
      '    <div class="strength-segment"></div>',
      '    <div class="strength-segment"></div>',
      '  </div>',
      '</div>',
    ],
    manual: "const strength = new bootstrap.Strength(element, {\n  input: '#myPassword',\n  minLength: 10\n})",
    reuse: "const strength = bootstrap.Strength.getOrCreateInstance(element)",
  },
}

// --------------------------------------------------------------- helpers

function sanitizeFilename (name) {
  return name.replace(/[<>:"/\\|?*]/g, '-').replace(/\s+/g, ' ').trim()
}

async function fetchPage (slug, path) {
  const url = `${BASE}/${path}/${slug}`
  const res = await fetch(url, {
    headers: { 'user-agent': 'bootstrap-local-docs/2.0' },
  })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return { url, html: await res.text() }
}

function requiresJs (html) {
  const start = html.indexOf('<main')
  if (start === -1) return false
  return html.slice(start, start + 8000).includes('filetype-js')
}

function renderJsSetup (setup) {
  const out = []
  out.push('------------------------------------------------------------------------')
  out.push('JAVASCRIPT SETUP  (read this first)')
  out.push('------------------------------------------------------------------------')
  out.push('Include the bundle once per page, before </body>:')
  out.push('')
  out.push('  <script src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js"></script>')
  out.push('')
  out.push(setup.mode)

  if (setup.auto) {
    out.push('')
    out.push('Automatic (data API):')
    out.push('')
    out.push(...setup.auto)
  }

  if (setup.markup) {
    out.push('')
    out.push('Trigger markup:')
    out.push('')
    out.push(...setup.markup)
  }

  if (setup.manual) {
    out.push('')
    out.push(setup.manualLabel || 'Manual initialisation:')
    out.push('')
    out.push(setup.manual)
  }

  if (setup.reuse) {
    out.push('')
    out.push('Reuse an existing instance:')
    out.push('')
    out.push(setup.reuse)
  }

  return out
}

// ------------------------------------------------------------------ main

async function buildSection (section) {
  const dir = join(OUT, section.folder)
  await mkdir(dir, { recursive: true })
  const entries = []

  for (let i = 0; i < section.pages.length; i += 4) {
    const batch = section.pages.slice(i, i + 4)
    const results = await Promise.allSettled(batch.map(([slug]) => fetchPage(slug, section.path)))

    for (let j = 0; j < batch.length; j++) {
      const [slug, fallbackTitle] = batch[j]
      const res = results[j]
      const num = String(i + j + 1).padStart(2, '0')
      const file = `${num} ${sanitizeFilename(fallbackTitle)}.txt`

      if (res.status === 'rejected') {
        console.error(`  FAILED  ${section.folder}/${slug}: ${res.reason.message}`)
        entries.push({ file: `${section.folder}/${file}`, title: fallbackTitle, ok: false })
        continue
      }

      const html = res.value.html
      const js = requiresJs(html)
      const setup = js && JS_SETUP[fallbackTitle] ? renderJsSetup(JS_SETUP[fallbackTitle]) : null
      const content = renderPage(html, {
        title: fallbackTitle,
        url: res.value.url,
        category: section.folder,
        requiresJs: js,
        setup,
      })

      await writeFile(join(dir, file), content, 'utf8')
      entries.push({ file: `${section.folder}/${file}`, title: fallbackTitle, ok: true })
      console.log(`  ok  ${section.folder}/${file}`)
    }
  }

  return entries
}

await mkdir(OUT, { recursive: true })

const index = []
const failed = []
for (const section of SECTIONS) {
  console.log(`Building ${section.folder}...`)
  index.push(...await buildSection(section))
}
for (const entry of index) if (!entry.ok) failed.push(entry.file)

// ------------------------------------------------------------------ index

const bar = '='.repeat(72)
const thin = '-'.repeat(72)
const indexLines = []
indexLines.push(bar)
indexLines.push('BOOTSTRAP 6.0 - COMPLETE LOCAL DOCUMENTATION')
indexLines.push(bar)
indexLines.push('')
indexLines.push('Every page of the official Bootstrap 6 documentation, converted to')
indexLines.push('plain text with explanations, class tables and copy-pasteable code.')
indexLines.push('')
indexLines.push(`Docs version: 6.0.0-alpha.1  |  Pages: ${index.length}  |  Generated: ${new Date().toISOString().slice(0, 10)}`)
indexLines.push('')

let sectionPath = ''
for (const entry of index) {
  const folder = entry.file.split('/')[0]
  if (folder !== sectionPath) {
    sectionPath = folder
    indexLines.push('')
    indexLines.push(`--- ${folder.toUpperCase()} ${'-'.repeat(Math.max(2, 60 - folder.length))}`)
  }
  indexLines.push(`  ${entry.file.padEnd(40)} ${entry.ok ? 'ok' : 'FAILED'}`)
}
indexLines.push('')
indexLines.push(bar)
await writeFile(join(OUT, 'INDEX.txt'), indexLines.join('\n') + '\n', 'utf8')

// ------------------------------------------------------------- beginner guide

const guide = `========================================================================
BOOTSTRAP 6.0 - BEGINNER'S GUIDE
========================================================================
How to read this library and how Bootstrap works, from zero.
========================================================================

WHAT BOOTSTRAP IS
-----------------
Bootstrap is a set of ready-made CSS classes and JavaScript plugins.
Instead of writing CSS yourself, you add classes to HTML and Bootstrap
styles things for you: buttons, navbars, grids, forms, colors, spacing.

It is mobile-first: the default classes style every screen size, and
breakpoint prefixes change styles at specific widths.


THE FASTEST WAY TO USE IT
-------------------------
1. Start with "00 Quick Start.txt" in this folder.
2. Save the HTML and open it in your browser. You have a working page.
3. Copy snippets from this library into the <body>.

That's it. No build step required.


HOW A BOOTSTRAP PAGE IS BUILT
-----------------------------
Every Bootstrap page needs three things:

  1. The CSS file (in <head>):
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css" rel="stylesheet">

  2. Your HTML (components, grids, utilities) inside <body>.

  3. The JS bundle (before </body>), only if you use interactive
     components (navbar drawer, dialogs, toasts, tooltips, ...):
     <script src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js"></script>

You do NOT need a build tool to follow this library.


THE THREE BUILDING BLOCKS
-------------------------
1. CONTAINER - centers your content and pads it on the sides.
   <div class="container"> ... </div>

2. ROW - a horizontal grid row.
   <div class="row"> ... </div>

3. COLUMN - one of 12 columns per row.
   <div class="row">
     <div class="col-8">Main content</div>
     <div class="col-4">Sidebar</div>
   </div>

The grid is the #1 thing beginners struggle with. See Layout/03 Grid System.txt
for every option and Layout/01 Breakpoints.txt for the screen sizes.


BREAKPOINTS (AND THE V6 PREFIX RULE)
------------------------------------
Bootstrap has six screen sizes:

   xs  <576px     sm  ≥576px     md  ≥768px
   lg  ≥1024px    xl  ≥1280px    2xl ≥1536px

In Bootstrap 6 the prefix goes FIRST:

   v5: navbar-expand-md     →     v6: md:navbar-expand
   v5: col-md-6             →     v6: md:col-6

If you write the old v5 order, nothing happens. This is the most common
mistake when copying old snippets from the internet.


SPACING AND SIZING SCALES
--------------------------
Spacing classes use these steps (spacing is in rem):

   0        = 0
   1        = 0.25rem
   2        = 0.375rem
   3        = 0.5rem
   4        = 0.75rem
   5        = 1rem
   6        = 1.25rem
   7        = 1.5rem
   8        = 1.75rem
   9        = 2rem
   10       = 2.25rem
   11       = 2.5rem
   12       = 3rem

   Same idea for font sizes (fs-*), gap (gap-*), width/height (w-*, h-*),
   borders (border, border-*) and more.


CLASS NAMES DECODED
-------------------
Almost every Bootstrap class follows {place}-{amount}:

   m-3     margin on ALL sides
   mt-3    margin TOP
   mb-3    margin BOTTOM
   ms-3    margin INLINE START (left in English)
   me-3    margin INLINE END   (right in English)
   mx-3    margin left and right
   my-3    margin top and bottom

   p-*     same, for padding
   d-flex  display: flex
   justify-content-between / -center / -start / -end
   align-items-center / -start / -end
   gap-3   gap between flex/grid children
   text-center / start / end
   fs-lg   font size large; fs-sm small; fs-3xl extra large


THE SIX THINGS TO COPY FIRST
----------------------------
  1. 00 Quick Start.txt             a page skeleton
  2. Layout/03 Grid System.txt     the 12-column grid
  3. Layout/02 Containers.txt      page width and centering
  4. Content/02 Typography.txt     headings, paragraphs, lists
  5. Components/17 Navbar.txt      the navbar every site copies
  6. Components/06 Button.txt      buttons and button variants


INTERACTIVE COMPONENTS NEED JS
-------------------------------
Some components work automatically once the bundle is loaded
(navbar drawer, menu, tabs, collapse, alerts).

Others require you to initialise them yourself:

   Tooltip, Popover, Toast, Nav Overflow

Open the component's .txt file and read the "JAVASCRIPT SETUP" block; it
tells you exactly which kind yours is, with working code.


COLOURS
-------
Semantic theme tokens (these adapt between light/dark mode):

   theme-primary    brand/action colour
   theme-secondary  secondary actions
   theme-success    success states
   theme-warning    warnings
   theme-danger     errors

   bg-1, bg-2, ...  neutral surfaces (numbered)
   fg-2, fg-3, ...  text colours (numbered)

   btn-solid, btn-outline, btn-subtle, btn-icon   button styles
   data-bs-theme="auto|light|dark"                 color modes


HOW TO READ A .txt FILE
-----------------------
  1. Header: what the component is, and whether it needs JS.
  2. WHAT IT DOES / HOW TO USE IT in plain English.
  3. ON THIS PAGE: a table of contents for the file.
  4. The rest: explanation first, then code, tables and examples.
  5. Code blocks are complete and ready to paste into your page.


COMMON MISTAKES
---------------
  - Forgetting the JS bundle (navbar toggle and menus won't open).
  - Using v5 class order (col-md-6) instead of v6 (md:col-6).
  - Copying "hidden" v5 classes that no longer exist.
  - Using utility classes without Bootstrap CSS loaded.
  - Closing tags incorrectly - Bootstrap components are strict HTML.
  - Adding BOTH .container and .container-fluid (pick one).


FINDING THINGS FAST
-------------------
  INDEX.txt          everything, by section
  00 JS Cheat Sheet.txt   constructors and init recipes
  Each folder is numbered in docs order, so you can read them in sequence.

Have fun. Bootstrap rewards copying - steal from the examples guilt free.
`
await writeFile(join(OUT, "00 Beginner's Guide.txt"), guide, 'utf8')

// ------------------------------------------------------------- README file

const totalPages = index.length
const readme = `========================================================================
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
Pages        : ${totalPages}
Generated    : ${new Date().toISOString().slice(0, 10)}


Start here
----------
  00 Beginner's Guide.txt    start from zero: what Bootstrap is,
                             the grid, prefixes, breakpoints, examples
  00 Quick Start.txt         minimal CDN page to copy
  00 JS Cheat Sheet.txt      every constructor + init recipe


Doc sections (in docs order)
----------------------------
  Getting Started\\            ${'install, approach, accessibility, browsers, css variables, javascript'}
  Guides\\                     quickstart, npm, webpack, parcel, vite, contribute, migration
  Customize\\                  sass, options, color, theme, color-modes, components, transitions, rtl, optimize
  Layout\\                     breakpoints, containers, grid, columns, gutters, utilities, z-index, css-grid
  Content\\                   reboot, typography, images, tables, prose
  Components\\                29 components (accordion ... tooltip)
  Forms\\                     17 form pages
  Helpers\\                   focus-ring, hover-lift, icon-link, position, stacks, stretched-link,
                            text-truncation, vertical-rule, visually-hidden
  Utilities\\                 48 utility pages (api, margin, padding, flex, colors, ...)


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
`
await writeFile(join(OUT, 'README.txt'), readme, 'utf8')

console.log(`\nDone. ${index.length} pages + 5 root files written to ${OUT}`)
if (failed.length) {
  console.log('FAILED pages:')
  for (const f of failed) console.log('  ' + f)
  process.exitCode = 1
}
