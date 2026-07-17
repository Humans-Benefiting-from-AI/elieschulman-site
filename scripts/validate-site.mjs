import { existsSync, readFileSync } from 'node:fs'

const pages = ['index.html', 'writing/index.html', 'writing/emes-translation-not-truth/index.html']
const failures = []
const sitemap = readFileSync('sitemap.xml', 'utf8')
for (const file of pages) {
  const html = readFileSync(file, 'utf8')
  for (const required of ['<title>', 'name="description"', 'rel="canonical"', '<main', 'Skip to main content']) {
    if (!html.includes(required)) failures.push(`${file} is missing ${required}`)
  }
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1]
  if (canonical && !sitemap.includes(`<loc>${canonical}</loc>`)) failures.push(`sitemap is missing ${canonical}`)
  for (const match of html.matchAll(/href="(\/[^"#?]*)(?:#[^"]*)?"/g)) {
    const href = match[1]
    if (href.endsWith('.pdf') || href.endsWith('.css')) {
      if (!existsSync(href.slice(1))) failures.push(`${file} links to missing ${href}`)
    } else {
      const target = href === '/' ? 'index.html' : `${href.slice(1).replace(/\/$/, '')}/index.html`
      if (!existsSync(target)) failures.push(`${file} links to missing ${href}`)
    }
  }
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(block[1]) } catch { failures.push(`${file} contains invalid JSON-LD`) }
  }
}
const all = pages.map((file) => readFileSync(file, 'utf8')).join('\n')
for (const prohibited of ['captureForm', 'localStorage', 'Check your inbox', 'Send Me the Book', 'Free ebook']) {
  if (all.includes(prohibited)) failures.push(`prohibited text remains: ${prohibited}`)
}
if (failures.length) { console.error(failures.map((x) => `- ${x}`).join('\n')); process.exit(1) }
console.log('Static site validation passed.')
