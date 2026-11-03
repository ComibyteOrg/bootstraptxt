/**
 * Turns a Bootstrap docs HTML page into a readable plain-text reference.
 *
 * The docs render live examples + syntax-highlighted code panels + prose +
 * class tables. This module keeps the prose, lists, tables and code, and
 * throws away the live demo markup, navigation chrome and icons.
 */

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr', 'path', 'circle', 'rect', 'line',
  'polyline', 'polygon', 'ellipse', 'use', 'stop',
])

const SKIP_TAGS = new Set([
  'script', 'style', 'svg', 'button', 'nav', 'aside', 'footer', 'header',
  'template', 'iframe', 'noscript',
])

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'",
  hellip: '…', mdash: '—', ndash: '–', rarr: '→', larr: '←', copy: '©',
}

export function decodeEntities (str) {
  return String(str)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => safeChar(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => safeChar(Number(dec)))
    .replace(/&([a-zA-Z#0-9]+);/g, (m, name) => (name in NAMED ? NAMED[name] : m))
}

function safeChar (code) {
  try { return String.fromCodePoint(code) } catch { return '' }
}

function parseAttrs (raw) {
  const attrs = {}
  const re = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  let m
  while ((m = re.exec(raw))) {
    const name = m[1].toLowerCase()
    const value = m[2] ?? m[3] ?? m[4] ?? ''
    attrs[name] = decodeEntities(value)
  }
  return attrs
}

export function parseHtml (html) {
  const root = { type: 'root', name: '#root', attrs: {}, children: [] }
  const stack = [root]
  const tokenRe = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!DOCTYPE[^>]*>|<\/?([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^'">])*?)(\/?)>/gi
  let last = 0
  let m

  const pushText = text => {
    if (!text) return
    stack[stack.length - 1].children.push({ type: 'text', text })
  }

  while ((m = tokenRe.exec(html))) {
    pushText(html.slice(last, m.index))
    last = tokenRe.lastIndex

    if (m[0].startsWith('<!')) continue
    const raw = m[0]
    const closing = raw.startsWith('</')
    const name = (m[1] || '').toLowerCase()
    if (!name) continue

    if (closing) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].name === name) { stack.length = i; break }
      }
      continue
    }

    const node = { type: 'element', name, attrs: parseAttrs(m[2] || ''), children: [] }
    stack[stack.length - 1].children.push(node)

    const selfClosing = m[3] === '/' || /\/\s*>$/.test(raw)
    if (!VOID.has(name) && !selfClosing) stack.push(node)
  }

  pushText(html.slice(last))
  return root
}

// ------------------------------------------------------------------ text

function textContent (node) {
  if (node.type === 'text') return node.text
  if (!node.children) return ''
  return node.children.map(textContent).join('')
}

function collapse (str) {
  return decodeEntities(str).replace(/\s+/g, ' ').trim()
}

/** Inline text for paragraphs, headings, table cells. */
export function inline (node) {
  if (node.type === 'text') return decodeEntities(node.text)
  if (!node.children) return ''

  const { name, attrs } = node
  if (SKIP_TAGS.has(name)) return ''
  if ((attrs.class || '').includes('anchor-link')) return ''

  if (name === 'code' || name === 'kbd' || name === 'samp') {
    const text = collapse(textContent(node))
    return text ? `\`${text}\`` : ''
  }
  if (name === 'br') return ' '
  if (name === 'img') return attrs.alt ? `[${attrs.alt}]` : ''
  if (name === 'a') {
    const text = node.children.map(inline).join('')
    return collapse(text) || attrs.href || ''
  }

  return node.children.map(inline).join('')
}

function wrap (text, width = 78, firstPrefix = '', nextPrefix = '') {
  const words = collapse(text).split(' ').filter(Boolean)
  if (!words.length) return ''
  const lines = []
  let line = firstPrefix

  for (const word of words) {
    if (line.length + word.length + (line === firstPrefix ? 0 : 1) > width && line !== firstPrefix) {
      lines.push(line)
      line = nextPrefix + word
    } else {
      line += (line === firstPrefix || line === nextPrefix ? '' : ' ') + word
    }
  }
  lines.push(line)
  return lines.join('\n')
}

function indentBlock (text, prefix) {
  return text.split('\n').map(line => (line ? prefix + line : '')).join('\n')
}

// ------------------------------------------------------------------ blocks

function findFirst (node, predicate) {
  if (node.type !== 'element' && node.type !== 'root') return null
  if (predicate(node)) return node
  for (const child of node.children || []) {
    const hit = findFirst(child, predicate)
    if (hit) return hit
  }
  return null
}

function findAll (node, predicate, out = []) {
  if (node.type === 'element' && predicate(node)) out.push(node)
  for (const child of node.children || []) findAll(child, predicate, out)
  return out
}

function hasClass (node, name) {
  return node.attrs && (node.attrs.class || '').split(/\s+/).includes(name)
}

function classText (node) {
  return (node.attrs && node.attrs.class) || ''
}

function preText (pre) {
  // Shiki emits one <span class="line"> per source line; using those gives
  // the exact code, without the indentation of the surrounding <pre> markup.
  const lines = findAll(pre, n => hasClass(n, 'line'))
  let s
  if (lines.length) {
    s = lines.map(line => textContent(line).replace(/\r/g, '')).join('\n')
  } else {
    s = textContent(pre).replace(/\r/g, '')
  }

  s = decodeEntities(s)
  s = s
    .split('\n')
    .map(line => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/^\n+/, '')
    .replace(/\n+$/, '')
    .replace(/\n{3,}/g, '\n\n')
  return s
}

const LANG_BY_EXT = {
  scss: 'SCSS', sass: 'SASS', css: 'CSS', js: 'JS', mjs: 'JS', cjs: 'JS',
  ts: 'TS', html: 'HTML', json: 'JSON', md: 'MD', bash: 'BASH', sh: 'BASH',
}

function inferLanguage (code) {
  if (/^\s*[.#@&][\w-]+[\s\S]*?\{/m.test(code) && /--bs-[\w-]+\s*:/.test(code)) return 'CSS'
  if (/^\s*(?:import\s|export\s|const\s|let\s|var\s|document\.|new\s)/m.test(code)) return 'JS'
  if (/^\s*[\w.-]+\s*\{[\s\S]*?:/m.test(code)) return 'CSS'
  if (!/[<{]/.test(code)) return 'BASH'
  return 'HTML'
}

function detectSnippetLanguage (snippet, code, pre) {
  const toolbar = findFirst(snippet, n => hasClass(n, 'highlight-toolbar'))
  if (toolbar) {
    const raw = collapse(textContent(toolbar))
    const badge = raw.match(/\b(HTML|CSS|SCSS|SASS|JS|JAVASCRIPT|BASH|SHELL|JSON|TS|TYPESCRIPT)\b/i)
    if (badge) {
      const label = badge[1].toUpperCase()
      return { JAVASCRIPT: 'JS', TYPESCRIPT: 'TS', SHELL: 'BASH' }[label] || label
    }
    const href = findFirst(toolbar, n => n.name === 'a' && n.attrs.href)
    if (href) {
      const ext = href.attrs.href.split('.').pop().toLowerCase()
      if (LANG_BY_EXT[ext]) return LANG_BY_EXT[ext]
    }
  }

  // Tabbed panels (npm/pnpm/Yarn/...): label from the active tab.
  if (pre) {
    const pres = findAll(snippet, n => n.name === 'pre')
    const tabs = findAll(snippet, n => hasClass(n, 'code-tab-btn'))
    const contents = findAll(snippet, n => hasClass(n, 'code-tab-content'))
    const index = pres.indexOf(pre)
    if (index !== -1 && contents.length === pres.length && tabs.length >= contents.length) {
      const tab = collapse(textContent(tabs[index] || tabs[0]))
      if (/^(npm|pnpm|yarn|bun|gem|bundle|composer|pip|pipx|nuget|dotnet|brew|choco|winget|scoop|apt|apk|npx|npx-cli)$/i.test(tab)) {
        return 'BASH'
      }
      if (tab) return tab.toUpperCase()
    }
  }

  return inferLanguage(code)
}

function renderSnippet (snippet) {
  const pres = findAll(snippet, n => n.name === 'pre')
  if (!pres.length) return ''

  return pres.map(pre => {
    const code = preText(pre)
    if (!code) return ''
    const lang = detectSnippetLanguage(snippet, code, pre)
    return `Example code (${lang}):\n\n${code}`
  }).filter(Boolean).join('\n\n')
}

function renderCallout (node) {
  const cls = classText(node)
  const label = cls.includes('warning') ? 'WARNING' : cls.includes('danger') ? 'IMPORTANT' : 'NOTE'
  const body = renderChildren(node).trim()
  if (!body) return ''
  return `${label}:\n${indentBlock(body, '  ')}`
}

function renderList (node, depth = 0) {
  const ordered = node.name === 'ol'
  const items = (node.children || []).filter(c => c.type === 'element' && c.name === 'li')
  const out = []
  let n = 1

  for (const li of items) {
    const nested = (li.children || []).filter(c =>
      c.type === 'element' && (c.name === 'ul' || c.name === 'ol'))
    const flat = { type: 'element', name: 'span', attrs: {}, children: (li.children || []).filter(c => !nested.includes(c)) }
    const text = collapse(inline(flat))

    const marker = ordered ? `${n++}.` : '-'
    const pad = '  '.repeat(depth)
    const firstPrefix = `${pad}${marker} `
    const nextPrefix = ' '.repeat(firstPrefix.length)
    if (text) out.push(wrap(text, 78, firstPrefix, nextPrefix))
    for (const sub of nested) out.push(renderList(sub, depth + 1))
  }

  return out.join('\n')
}

function tableRows (table) {
  const trs = findAll(table, n => n.name === 'tr')
  return trs.map(tr => {
    const cells = (tr.children || []).filter(c => c.type === 'element' && (c.name === 'th' || c.name === 'td'))
    return cells.flatMap(c => {
      const span = Math.max(1, Number(c.attrs.colspan) || 1)
      return Array(span).fill(collapse(inline(c)))
    })
  }).filter(row => row.length)
}

function renderTable (table) {
  const rows = tableRows(table)
  if (!rows.length) return ''

  const cols = Math.max(...rows.map(r => r.length))
  const isHeader = findAll(table, n => n.name === 'thead').length > 0
  const widths = []
  for (let i = 0; i < cols; i++) {
    widths[i] = Math.max(...rows.map(r => (r[i] || '').length), 4)
  }

  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + (cols - 1) * 2

  // Wide tables read better as records than as squashed columns.
  if (cols > 7 || totalWidth > 124) {
    const titles = isHeader ? rows[0].slice(1) : rows[0].map((_, i) => `Column ${i + 2}`)
    const body = isHeader ? rows.slice(1) : rows
    return body.map((row, index) => {
      const name = row[0] || `Row ${index + 1}`
      const lines = [name]
      for (let i = 1; i < row.length; i++) {
        const title = titles[i - 1] || `Column ${i}`
        lines.push(`  ${title}: ${row[i]}`)
      }
      return lines.join('\n')
    }).join('\n\n')
  }

  const lineFor = row => row.map((cell, i) => (cell || '').padEnd(widths[i])).join('  ').trimEnd()
  const sep = widths.map(w => '-'.repeat(w)).join('  ')
  const head = rows[0]
  const body = isHeader ? rows.slice(1) : rows

  if (isHeader) return [lineFor(head), sep, ...body.map(lineFor)].join('\n')
  return body.map(lineFor).join('\n')
}

function renderCode (pre) {
  const code = preText(pre)
  if (!code) return ''
  return `Example code (${inferLanguage(code)}):\n\n${code}`
}

function sectionBar (node, char) {
  const text = collapse(inline(node)).toUpperCase()
  const bar = char.repeat(72)
  return `${bar}\n${text}\n${bar}`
}

function renderBlock (node) {
  if (node.type === 'text') {
    const text = collapse(node.text)
    return text
  }
  if (node.type !== 'element') return ''

  const { name, attrs } = node
  const cls = classText(node)

  if (SKIP_TAGS.has(name)) return ''
  if (hasClass(node, 'anchor-link')) return ''
  if (attrs.id === 'TableOfContents') return ''
  if (hasClass(node, 'bd-toc')) return ''
  if (hasClass(node, 'bd-toc-toggle')) return ''
  if (hasClass(node, 'bd-sidebar')) return ''
  if (hasClass(node, 'bd-intro')) return ''
  if (cls.includes('bd-intro')) return ''
  if (cls.includes('bd-example') && !cls.includes('bd-code-snippet')) return ''

  switch (name) {
    case 'h1':
      return ''
    case 'h2':
      return sectionBar(node, '=')
    case 'h3':
      return sectionBar(node, '-')
    case 'h4': {
      const text = collapse(inline(node)).toUpperCase()
      return text ? `${text}:` : ''
    }
    case 'p': {
      const text = collapse(inline(node))
      return text ? wrap(text) : ''
    }
    case 'ul':
    case 'ol':
      return renderList(node)
    case 'blockquote':
      return indentBlock(renderChildren(node), '> ')
    case 'table':
      return renderTable(node)
    case 'pre':
      return renderCode(node)
    case 'hr':
      return '-'.repeat(72)
    case 'div':
    case 'section':
    case 'article':
    case 'main':
      if (cls.includes('bd-code-snippet')) return renderSnippet(node)
      if (cls.includes('bd-callout')) return renderCallout(node)
      return renderChildren(node)
    default:
      return renderChildren(node)
  }
}

function renderChildren (node) {
  const parts = []
  for (const child of node.children || []) {
    const text = renderBlock(child)
    if (text && text.trim()) parts.push(text.trim())
  }
  return parts.join('\n\n')
}

// ------------------------------------------------------------------- page

export function extractMain (html) {
  const start = html.indexOf('<main')
  const end = html.lastIndexOf('</main>')
  if (start === -1 || end === -1) return html
  return html.slice(start, end + '</main>'.length)
}

export function pageTitle (root) {
  const h1 = findFirst(root, n => n.name === 'h1')
  return h1 ? collapse(inline(h1)) : ''
}

export function pageIntro (root) {
  const sub = findFirst(root, n => hasClass(n, 'bd-subtitle'))
  return sub ? collapse(inline(sub)) : ''
}

function collectHeadings (root) {
  const out = []
  const walk = node => {
    if (node.type === 'element' && (node.name === 'h2' || node.name === 'h3')) {
      out.push({ level: Number(node.name[1]), text: collapse(inline(node)) })
    }
    for (const child of node.children || []) walk(child)
  }
  walk(root)
  return out
}

const HOW_TO = {
  'Getting Started': 'These pages walk you through getting Bootstrap into a project and how to think about it. Read them top to bottom the first time; they build on each other.',
  Guides: 'Recipes for wiring Bootstrap into your build tool. Each guide starts from a bare project and ends with a working page, so you can copy the setup exactly.',
  Customize: 'Every page here shows how to change Bootstrap itself: Sass variables, CSS custom properties, and compile-time options. You only need this section if you are comfortable with Sass; otherwise the defaults just work.',
  Layout: 'Bootstrap is mobile-first. Base classes apply at every screen size; a breakpoint prefix applies a class from that size up. In v6 the prefix comes first: `md:col-6` (not `col-md-6`).',
  Content: 'These classes style normal HTML elements. Add them to the matching tag (headings, paragraphs, tables, images). Most content styles need no JavaScript.',
  Helpers: 'Add the helper class to the element you want to affect. Helpers are small, single-purpose classes that do one job.',
  Utilities: 'Utility classes follow `{property}-{value}` and can be added to any element. Add a breakpoint prefix to apply one only from that size up: `md:m-3`. Values in `{braces}` are placeholders.',
  Components: 'Components are the ready-made pieces of a page (navbar, card, dialog, ...). Most are CSS-driven; the ones that need JavaScript carry a JAVASCRIPT SETUP block near the top.',
  Forms: 'Form controls, inputs, and the form layout system. Most are plain HTML + CSS; the interactive ones (datepicker, combobox, ...) come with a JAVASCRIPT SETUP block.',
}

export function renderPage (html, { title, url, category, requiresJs, setup }) {
  let clean = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')

  const main = extractMain(clean)
  const root = parseHtml(main)
  const pageName = pageTitle(root) || title
  const intro = pageIntro(root)
  const headings = collectHeadings(root)

  const bar = '='.repeat(72)
  const out = []

  out.push(bar)
  out.push(pageName.toUpperCase())
  out.push(`Bootstrap 6.0  |  ${category} reference`)
  out.push(`Source: ${url}`)
  if (requiresJs) out.push('Requires JavaScript plugin: yes  (see JAVASCRIPT SETUP below)')
  out.push(bar)
  out.push('')

  if (intro) {
    out.push('WHAT IT DOES')
    out.push(wrap(collapse(intro)))
    out.push('')
  }

  if (HOW_TO[category]) {
    out.push('HOW TO USE IT')
    out.push(wrap(HOW_TO[category]))
    out.push('')
  }

  out.push('READING GUIDE')
  out.push(wrap('`code` marks a class name, attribute, or value you type into your HTML. Code blocks are complete and ready to paste into a page that loads Bootstrap 6. Indentation inside code is meaningful. New to Bootstrap? Read "00 Beginner\'s Guide.txt" first.'))
  out.push('')

  if (headings.length) {
    out.push('ON THIS PAGE')
    for (const h of headings) {
      out.push(`${h.level === 2 ? '  ' : '     '}${h.level === 2 ? '' : '- '}${h.text}`)
    }
    out.push('')
  }

  if (setup && setup.length) {
    out.push(...setup)
    out.push('')
  }

  const body = renderChildren(root).trim()
  if (body) out.push(body)

  out.push('')
  out.push(bar)
  out.push('END OF FILE')
  out.push(bar)
  return out.join('\n') + '\n'
}
