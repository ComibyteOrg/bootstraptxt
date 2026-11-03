/**
 * Bootstrap 6 docs -> local, copy-pasteable text snippets.
 *
 * Pulls every page listed below from https://getbootstrap.com/docs/6.0/,
 * rebuilds the syntax-highlighted code panels into plain text, and writes
 * one .txt per component/forms page.
 *
 * Usage:  node _tools/refresh-bootstrap-6-docs.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const BASE = 'https://getbootstrap.com/docs/6.0'
const OUT = join(process.cwd(), 'Bootstrap 6 Snippets')

const COMPONENTS = [
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
]

// Verified against each component's "Usage" section in the v6 docs.
// mode    -> how initialisation works
// auto    -> markup that the data API picks up on its own
// markup  -> trigger markup for components that are NOT auto-initialised
// manual  -> explicit constructor call
// reuse   -> getting an existing instance back
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

const FORMS = [
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
]

// ---------------------------------------------------------------- helpers

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'",
}

function decodeEntities (str) {
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-zA-Z#0-9]+);/g, (m, name) => (name in NAMED ? NAMED[name] : m))
}

function htmlToText (html) {
  return decodeEntities(
    html
      .replace(/<code[^>]*>/gi, '`')
      .replace(/<\/code>/gi, '`')
      .replace(/<kbd[^>]*>/gi, '`')
      .replace(/<\/kbd>/gi, '`')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/\s+/g, ' ')
    .trim()
}

/** Rebuild a Shiki <pre> panel into plain text, preserving indentation. */
function preToText (inner) {
  let s = inner.replace(/\r/g, '')
  s = s.replace(/\n/g, '')                     // drop newlines *between* line spans
  s = s.replace(/<span class="line">/g, '\n')  // one span == one source line
  s = s.replace(/<[^>]+>/g, '')
  s = decodeEntities(s)
  s = s.replace(/^\n/, '')
  s = s.split('\n').map(line => line.replace(/[ \t]+$/, '')).join('\n')
  s = s.replace(/\n{3,}/g, '\n\n')
  return s.trim()
}

function sanitizeFilename (name) {
  return name.replace(/[<>:"/\\|?*]/g, '-').replace(/\s+/g, ' ').trim()
}

const LANG_BY_EXT = {
  scss: 'SCSS', sass: 'SASS', css: 'CSS',
  js: 'JS', mjs: 'JS', cjs: 'JS', ts: 'TS',
  html: 'HTML', json: 'JSON', md: 'MD', bash: 'BASH', sh: 'BASH',
}

/**
 * Language of a code panel. Panels either carry an inline badge
 * ("HTML", "JS", ...) or a link to the source file they were pulled from.
 */
function detectLanguage (body, preIndex, code) {
  const window = body.slice(Math.max(0, preIndex - 5000), preIndex)
  const toolbarAt = window.lastIndexOf('highlight-toolbar')
  const chunk = toolbarAt === -1 ? '' : window.slice(toolbarAt)

  const badge = chunk.match(/>\s*(HTML|CSS|SCSS|SASS|JS|JAVASCRIPT|BASH|SHELL|JSON|TS|TYPESCRIPT)\s*</i)
  if (badge) {
    const label = badge[1].toUpperCase()
    return { JAVASCRIPT: 'JS', TYPESCRIPT: 'TS', SHELL: 'BASH' }[label] || label
  }

  const href = chunk.match(/href="([^"]+\.[a-z0-9]{2,5})"/i)
  if (href) {
    const ext = href[1].split('.').pop().toLowerCase()
    if (LANG_BY_EXT[ext]) return LANG_BY_EXT[ext]
  }

  if (/^\s*[.#@&][\w-]+[\s\S]*?\{/m.test(code) && /--bs-[\w-]+\s*:/.test(code)) return 'CSS'
  if (/^\s*(import\s|export\s|const\s|let\s|var\s|document\.|new\s)/m.test(code)) return 'JS'
  return 'HTML'
}

async function fetchPage (slug, kind) {
  const url = `${BASE}/${kind}/${slug}`
  const res = await fetch(url, {
    headers: { 'user-agent': 'bootstrap-local-snippets/1.0' },
  })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return { url, html: await res.text() }
}

function extractTitle (main, fallback) {
  const h1 = main.match(/<h1[^>]*id="content"[^>]*>([\s\S]*?)<\/h1>/)
  if (h1) return htmlToText(h1[1])
  const anyH1 = main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
  return anyH1 ? htmlToText(anyH1[1]) : fallback
}

function extractIntro (main) {
  const sub = main.match(/<div class="bd-subtitle">([\s\S]*?)<\/div>/)
  return sub ? htmlToText(sub[1]) : ''
}

function extractBody (html) {
  const start = html.indexOf('<main')
  const end = html.lastIndexOf('</main>')
  if (start === -1 || end === -1) return html
  return html.slice(start, end)
}

/** Walk headings + code panels in document order and pair them up. */
function extractExamples (body) {
  const events = []
  const headingRe = /<h([234])\b[^>]*>([\s\S]*?)<\/h\1>/g
  const preRe = /<pre[^>]*class="astro-code[^"]*"[^>]*>([\s\S]*?)<\/pre>/g

  for (const m of body.matchAll(headingRe)) {
    events.push({ type: 'heading', level: Number(m[1]), text: htmlToText(m[2]), index: m.index, end: m.index + m[0].length })
  }
  for (const m of body.matchAll(preRe)) {
    events.push({ type: 'pre', inner: m[1], index: m.index, end: m.index + m[0].length })
  }
  events.sort((a, b) => a.index - b.index)

  const examples = []
  const stack = { 2: '', 3: '', 4: '' }
  let segmentStart = 0

  for (const ev of events) {
    if (ev.type === 'heading') {
      stack[ev.level] = ev.text
      for (let deeper = ev.level + 1; deeper <= 4; deeper++) stack[deeper] = ''
      segmentStart = ev.end
      continue
    }

    const code = preToText(ev.inner)
    if (!code) { segmentStart = ev.end; continue }

    // first paragraph in this segment = the explanatory note for the example
    const segment = body.slice(segmentStart, ev.index)
    const p = segment.match(/<p[^>]*>([\s\S]*?)<\/p>/)
    const note = p ? htmlToText(p[1]) : ''

    const path = [stack[2], stack[3], stack[4]].filter(Boolean)
    examples.push({
      section: path.length ? path.join(' > ') : 'Overview',
      note,
      lang: detectLanguage(body, ev.index, code),
      code,
    })
    segmentStart = ev.end
  }

  return examples
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

  out.push('')
  return out
}

function renderPage ({ title, intro, url, requiresJs, examples, setup }) {
  const bar = '='.repeat(72)
  const thin = '-'.repeat(72)
  const out = []

  out.push(bar)
  out.push(title.toUpperCase())
  out.push('Bootstrap 6.0  |  Local component reference')
  out.push(`Source: ${url}`)
  if (requiresJs) out.push('Requires JavaScript plugin: yes  (see JAVASCRIPT SETUP below)')
  out.push(bar)
  out.push('')
  if (intro) {
    out.push(intro)
    out.push('')
  }

  // compact contents: unique sections in document order
  const contents = []
  const seen = new Map()
  examples.forEach((ex, i) => {
    if (!seen.has(ex.section)) {
      seen.set(ex.section, contents.length)
      contents.push({ section: ex.section, examples: [i + 1] })
    } else {
      contents[seen.get(ex.section)].examples.push(i + 1)
    }
  })

  if (contents.length > 1) {
    out.push('CONTENTS')
    contents.forEach((entry, i) => {
      const nums = entry.examples.length === 1
        ? `example ${entry.examples[0]}`
        : `examples ${entry.examples.join(', ')}`
      out.push(`  ${String(i + 1).padStart(2, ' ')}. ${entry.section}  (${nums})`)
    })
    out.push('')
  }

  if (setup) out.push(...renderJsSetup(setup))

  let lastSection = ''
  examples.forEach((ex, i) => {
    out.push(thin)
    if (ex.section !== lastSection) {
      out.push(`${ex.section.toUpperCase()}`)
      lastSection = ex.section
    } else {
      out.push(`${ex.section.toUpperCase()} (cont.)`)
    }
    out.push(`Example ${i + 1}  |  ${ex.lang}`)
    out.push(thin)
    if (ex.note) {
      out.push(`Note: ${ex.note}`)
      out.push('')
    }
    out.push(ex.code)
    out.push('')
  })

  out.push(bar)
  out.push('END OF FILE')
  out.push(bar)
  return out.join('\n') + '\n'
}

// ------------------------------------------------------------------ main

async function buildSection (kind, pages, folder) {
  const dir = join(OUT, folder)
  await mkdir(dir, { recursive: true })
  const index = []

  for (let i = 0; i < pages.length; i += 4) {
    const batch = pages.slice(i, i + 4)
    const results = await Promise.allSettled(batch.map(([slug]) => fetchPage(slug, kind)))

    for (let j = 0; j < batch.length; j++) {
      const [slug, fallbackTitle] = batch[j]
      const res = results[j]
      if (res.status === 'rejected') {
        console.error(`  FAILED  ${slug}: ${res.reason.message}`)
        continue
      }

      const body = extractBody(res.value.html)
      const title = extractTitle(body, fallbackTitle) || fallbackTitle
      const intro = extractIntro(body)
      const mainAt = res.value.html.indexOf('<main')
      const requiresJs = res.value.html.slice(mainAt, mainAt + 8000).includes('filetype-js')
      const examples = extractExamples(body)

      const file = `${String(i + j + 1).padStart(2, '0')} ${sanitizeFilename(fallbackTitle)}.txt`
      const content = renderPage({
        title,
        intro,
        url: res.value.url,
        requiresJs,
        examples,
        setup: requiresJs ? JS_SETUP[fallbackTitle] : null,
      })
      await writeFile(join(dir, file), content, 'utf8')

      index.push({ file: `${folder}/${file}`, title, count: examples.length })
      console.log(`  ok  ${file}  (${examples.length} examples)`)
    }
  }

  return index
}

const index = []
await mkdir(OUT, { recursive: true })

console.log('Downloading components...')
index.push(...await buildSection('components', COMPONENTS, 'Components'))

console.log('Downloading forms...')
index.push(...await buildSection('forms', FORMS, 'Forms'))

// ------------------------------------------------------------------ index

const indexLines = []
const bar = '='.repeat(72)
indexLines.push(bar)
indexLines.push('BOOTSTRAP 6.0 - LOCAL COMPONENT SNIPPETS')
indexLines.push('='.repeat(72))
indexLines.push('')
indexLines.push('Every Bootstrap 6 component and form page, saved as plain text with')
indexLines.push('copy-pasteable, properly indented code blocks.')
indexLines.push('')
indexLines.push(`Docs version: 6.0.0-alpha.1  |  Scraped: ${new Date().toISOString().slice(0, 10)}`)
indexLines.push('')

let currentFolder = ''
for (const entry of index) {
  const folder = entry.file.split('/')[0]
  if (folder !== currentFolder) {
    currentFolder = folder
    indexLines.push('')
    indexLines.push(`--- ${folder.toUpperCase()} ${'-'.repeat(Math.max(2, 60 - folder.length))}`)
  }
  indexLines.push(`  ${entry.file.padEnd(34)} ${String(entry.count).padStart(3)} examples`)
}
indexLines.push('')
indexLines.push(bar)

await writeFile(join(OUT, 'INDEX.txt'), indexLines.join('\n') + '\n', 'utf8')

// ------------------------------------------------------------------ readme

const totalExamples = index.reduce((sum, entry) => sum + entry.count, 0)

const readme = `========================================================================
BOOTSTRAP 6.0 - LOCAL COMPONENT SNIPPETS
========================================================================

What this is
------------
Every component and form page from the Bootstrap 6 docs, saved offline as
plain .txt files with copy-pasteable code. No more hunting through the site
or opening "view source" to grab an example.

Docs version : 6.0.0-alpha.1
Source       : https://getbootstrap.com/docs/6.0/
Files        : ${index.length} pages, ${totalExamples} code examples
Refreshed    : ${new Date().toISOString().slice(0, 10)}


Folder layout
-------------
  INDEX.txt              List of every file + example counts
  00 Quick Start.txt     Minimal HTML page wired up to Bootstrap 6
  00 JS Cheat Sheet.txt  Every constructor + which ones need manual init
  Components\\            ${COMPONENTS.length} component pages (navbar, card, dialog, ...)
  Forms\\                 ${FORMS.length} form pages (controls, checks, datepicker, ...)


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
  - Modals are built on the native <dialog> element (Components\\12 Dialog)
  - Offcanvas is replaced by the drawer component (Components\\13 Drawer)
  - The mobile navbar uses a <dialog class="drawer"> internally
  - Accordion uses native <details>/<summary> elements (no JS needed)
  - Colour modes: <html data-bs-theme="auto|light|dark">

The markup in these files is exactly what the Bootstrap docs render, so it
is the safest reference for alpha.1.


Refreshing this folder
----------------------
The scraper lives at ..\\_tools\\refresh-bootstrap-6-docs.mjs

    node _tools/refresh-bootstrap-6-docs.mjs

Run it from the project root. It re-downloads every page and overwrites the
.txt files, so local edits to the snippets will be lost.


Scope
-----
Included: all Components pages, all Forms pages.
Not included: Layout, Content, Helpers, Utilities, Customize, Getting
started. Ask if you want those added.
`

await writeFile(join(OUT, 'README.txt'), readme, 'utf8')

const quickStart = `========================================================================
BOOTSTRAP 6.0 - QUICK START
========================================================================
Minimal page wired to Bootstrap 6.0.0-alpha.1 via CDN.
Docs: https://getbootstrap.com/docs/6.0/getting-started/install
========================================================================

<!doctype html>
<html lang="en" data-bs-theme="auto">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap 6 starter</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css"
      rel="stylesheet">
  </head>
  <body>
    <main class="container py-4">
      <h1>Hello, Bootstrap 6</h1>
      <button class="btn-solid theme-primary" type="button">Get started</button>
    </main>

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js">
    </script>
  </body>
</html>

========================================================================
NOTES
========================================================================
- The bundle includes Popper/Floating UI, so menus, popovers, tooltips and
  dropdown-like components work out of the box.
- Only include the JS bundle if you use interactive components. Each
  snippet file says whether its component needs JS.
- data-bs-theme accepts "auto", "light" or "dark". "auto" follows the OS.
- If you use npm instead of the CDN:

      npm install bootstrap@6.0.0-alpha.1

  then import:

      import 'bootstrap/dist/css/bootstrap.min.css'
      import 'bootstrap/dist/js/bootstrap.bundle.min.js'
`
await writeFile(join(OUT, '00 Quick Start.txt'), quickStart, 'utf8')

const cheat = `========================================================================
BOOTSTRAP 6.0 - JAVASCRIPT CHEAT SHEET
========================================================================
Load the bundle once per page, before </body>:

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js"></script>

"AUTO" means the data API creates the instance for you from attributes
like data-bs-toggle. "MANUAL" means you must create it yourself.
========================================================================

COMPONENT            AUTO?   INITIALISATION
------------------------------------------------------------------------
Alert                auto    new bootstrap.Alert(el)
Carousel             auto    new bootstrap.Carousel(el)
Collapse             auto    new bootstrap.Collapse(el)
Dialog               auto    new bootstrap.Dialog(el)
Drawer               auto    new bootstrap.Drawer(el)
Menu                 auto    new bootstrap.Menu(triggerEl)
Scrollspy            auto    new bootstrap.ScrollSpy(el, { target: '#nav' })
Tab                  auto    new bootstrap.Tab(triggerEl)
Toggler              auto    new bootstrap.Toggler(el)
Range                auto    new bootstrap.Range(el, { bubble: true })
Chips                auto    new bootstrap.Chips(el, { separator: ',' })
Datepicker           auto    new bootstrap.Datepicker(el, options)
OTP Input            auto    new bootstrap.OtpInput(el)
Password Strength    auto    new bootstrap.Strength(el, { input: '#pw' })

Popover              MANUAL  new bootstrap.Popover(el, options)
Tooltip              MANUAL  new bootstrap.Tooltip(el, options)
Toasts               MANUAL  new bootstrap.Toast(el, options)
Nav Overflow         MANUAL  new bootstrap.NavOverflow(wrapperEl, options)

Nav                  n/a     no plugin; menus use bootstrap.Menu(triggerEl)
Navbar               n/a     no plugin; uses Drawer + Menu
Combobox             auto    no constructor; data API only
Button (optional)    auto    new bootstrap.Button(el)   // toggle plugin
========================================================================

PATTERNS
------------------------------------------------------------------------
1. Data API (most components)

   <button type="button" data-bs-toggle="collapse" data-bs-target="#box">
     Toggle
   </button>

2. Manual init (Tooltip, Popover, Toast, Nav Overflow)

   const el = document.querySelector('#myThing')
   const instance = new bootstrap.Tooltip(el, { /* options */ })
   instance.show()

3. Reuse an existing instance instead of creating a second one

   const instance = bootstrap.Tooltip.getOrCreateInstance('#myThing')
   instance.hide()

4. Delegated init (Tooltip / Popover on many elements, including
   elements added to the DOM later)

   new bootstrap.Tooltip(document.body, {
     selector: '[data-bs-toggle="tooltip"]'
   })

5. Methods that show/hide return a promise

   await tooltip.show()
   // resolves when the transition ends

6. Events are namespaced: <event>.bs.<component>

   el.addEventListener('shown.bs.tooltip', () => { ... })
========================================================================

Each component file repeats its own slice of this cheat sheet at the top,
inside the JAVASCRIPT SETUP block.
`
await writeFile(join(OUT, '00 JS Cheat Sheet.txt'), cheat, 'utf8')

console.log(`\nDone. ${index.length} files + README + Quick Start written to ${OUT}`)
