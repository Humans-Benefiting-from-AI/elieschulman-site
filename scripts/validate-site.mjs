import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

/** Resolve dist directory: argv, env, cwd/dist, or cwd if it looks like a build output. */
function resolveDistRoot() {
  const arg = process.argv[2]
  if (arg) {
    const abs = path.isAbsolute(arg) ? arg : path.join(process.cwd(), arg)
    if (!existsSync(abs)) {
      console.error(`dist directory not found: ${abs}`)
      process.exit(1)
    }
    return abs
  }
  const cwd = process.cwd()
  if (existsSync(path.join(cwd, 'index.html')) && existsSync(path.join(cwd, 'books'))) {
    return cwd
  }
  const fromRoot = path.join(projectRoot, 'dist')
  if (existsSync(fromRoot)) return fromRoot
  console.error('No dist output found. Run `npm run build` first, or pass a path: node scripts/validate-site.mjs dist')
  process.exit(1)
}

const distRoot = resolveDistRoot()
const failures = []

function rel(p) {
  return path.relative(distRoot, p) || '.'
}

function walkHtml(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walkHtml(full, acc)
    else if (name.endsWith('.html')) acc.push(full)
  }
  return acc
}

function readTeachingFrontmatter() {
  const dir = path.join(projectRoot, 'src', 'content', 'teachings')
  if (!existsSync(dir)) return []
  const entries = []
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const raw = readFileSync(path.join(dir, file), 'utf8')
    const m = raw.match(/^---\n([\s\S]*?)\n---/)
    if (!m) continue
    const yaml = m[1]
    const get = (key) => {
      const line = yaml.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
      if (!line) return undefined
      return line[1].trim().replace(/^["']|["']$/g, '')
    }
    const draft = /(?:^|\n)draft:\s*true(?:\s|$)/.test(yaml)
    entries.push({
      slug: file.replace(/\.md$/, ''),
      title: get('title') || '',
      text_epub: get('text_epub'),
      text_pdf: get('text_pdf'),
      coverImage: get('coverImage'),
      draft,
    })
  }
  return entries
}

const htmlFiles = walkHtml(distRoot)
if (htmlFiles.length === 0) {
  failures.push('no HTML files found in dist')
}

const sitemapParts = ['sitemap-index.xml', 'sitemap-0.xml']
  .map((f) => path.join(distRoot, f))
  .filter(existsSync)
  .map((f) => readFileSync(f, 'utf8'))
const sitemap = sitemapParts.join('\n')
if (!sitemap) failures.push('sitemap XML missing from dist')

const requiredSnippets = ['<title>', 'name="description"', 'rel="canonical"', '<main', 'Skip to main content']

const htmlByFile = new Map()
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8')
  htmlByFile.set(file, html)
  const isReader = file.includes(`${path.sep}read${path.sep}`)
  const label = rel(file)

  const titleMatch = html.match(/<title>([^<]*)<\/title>/i)
  if (!titleMatch || !titleMatch[1].trim()) {
    failures.push(`${label} has empty or missing <title>`)
  }

  for (const required of requiredSnippets) {
    if (isReader && (required === '<main' || required === 'Skip to main content' || required === 'rel="canonical"')) continue
    if (!html.includes(required)) failures.push(`${label} is missing ${required}`)
  }

  const canonical = html.match(/rel="canonical"\s+href="([^"]+)"/i)?.[1]
  if (canonical && sitemap && !isReader) {
    if (!sitemap.includes(`<loc>${canonical}</loc>`) && !sitemap.includes(`<loc>${canonical.replace(/\/$/, '')}</loc>`)) {
      failures.push(`sitemap is missing ${canonical}`)
    }
  }

  for (const match of html.matchAll(/href="(\/[^"#?]*)(?:#[^"]*)?"/g)) {
    const href = match[1]
    if (href.startsWith('//')) continue
    const assetExt = path.extname(href).toLowerCase()
    if (['.pdf', '.css', '.epub', '.jpg', '.jpeg', '.png', '.svg', '.webp', '.mp3', '.mp4'].includes(assetExt)) {
      const assetPath = path.join(distRoot, href.slice(1))
      if (!existsSync(assetPath)) failures.push(`${label} links to missing ${href}`)
    } else {
      const target =
        href === '/'
          ? path.join(distRoot, 'index.html')
          : path.join(distRoot, href.slice(1).replace(/\/$/, ''), 'index.html')
      if (!existsSync(target)) failures.push(`${label} links to missing ${href}`)
    }
  }

  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(block[1])
    } catch {
      failures.push(`${label} contains invalid JSON-LD`)
    }
  }
}

// Teachings ↔ assets ↔ reader routes
const teachings = readTeachingFrontmatter().filter((t) => !t.draft)
for (const t of teachings) {
  if (!t.title.trim()) failures.push(`teaching ${t.slug} has empty title`)

  for (const field of ['text_epub', 'text_pdf', 'coverImage']) {
    const url = t[field]
    if (!url || !url.startsWith('/')) continue
    const filePath = path.join(distRoot, url.slice(1))
    const pub = path.join(projectRoot, 'public', url.slice(1))
    if (!existsSync(filePath) && !existsSync(pub)) {
      failures.push(`teaching ${t.slug} ${field} missing file ${url}`)
    }
  }

  if (t.text_epub) {
    const reader = path.join(distRoot, 'read', t.slug, 'index.html')
    if (!existsSync(reader)) {
      failures.push(`teaching ${t.slug} has text_epub but no /read/${t.slug}/ page`)
    }
    const bookPage = path.join(distRoot, 'books', t.slug, 'index.html')
    if (!existsSync(bookPage)) {
      failures.push(`teaching ${t.slug} missing /books/${t.slug}/ page`)
    }
  }
}

const sampleHtml = [...htmlByFile.values()].join('\n')
for (const prohibited of ['captureForm', 'Check your inbox', 'Send Me the Book', 'Free ebook']) {
  if (sampleHtml.includes(prohibited)) failures.push(`prohibited text remains: ${prohibited}`)
}
// localStorage is allowed in the EPUB reader; ban it only outside /read/
for (const [file, html] of htmlByFile) {
  if (file.includes(`${path.sep}read${path.sep}`)) continue
  if (html.includes('localStorage')) {
    failures.push(`${rel(file)} contains localStorage outside reader`)
  }
}

if (failures.length) {
  console.error(failures.map((x) => `- ${x}`).join('\n'))
  process.exit(1)
}
console.log(`Static site validation passed (${htmlFiles.length} HTML files, ${teachings.length} teachings).`)
