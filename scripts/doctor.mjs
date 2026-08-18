import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const issues = []
const notes = []

function listMd(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter((f) => f.endsWith('.md'))
}

function parseFm(filePath) {
  const raw = readFileSync(filePath, 'utf8')
  const m = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return { raw, data: {} }
  const yaml = m[1]
  const data = {}
  for (const line of yaml.split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!kv) continue
    let v = kv[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    if (v === 'true') v = true
    else if (v === 'false') v = false
    else if (/^-?\d+(\.\d+)?$/.test(v)) v = Number(v)
    data[kv[1]] = v
  }
  return { raw, data }
}

const teachingsDir = path.join(root, 'src', 'content', 'teachings')
const publicBooks = path.join(root, 'public', 'books')
const dist = path.join(root, 'dist')

const teachingFiles = listMd(teachingsDir)
const slugs = teachingFiles.map((f) => f.replace(/\.md$/, ''))

notes.push(`Teachings in collection: ${slugs.join(', ') || '(none)'}`)

const assetDirs = existsSync(publicBooks)
  ? readdirSync(publicBooks).filter((n) => statSync(path.join(publicBooks, n)).isDirectory())
  : []

for (const dir of assetDirs) {
  if (!slugs.includes(dir)) {
    issues.push(`public/books/${dir}/ has no matching src/content/teachings/${dir}.md`)
  }
}

for (const slug of slugs) {
  const fm = parseFm(path.join(teachingsDir, `${slug}.md`))
  const d = fm.data
  if (!d.title) issues.push(`${slug}: missing title`)
  if (d.draft === true) {
    notes.push(`${slug}: draft=true (excluded from publish indexes)`)
    continue
  }

  const bookDir = path.join(publicBooks, slug)
  if (!existsSync(bookDir)) {
    issues.push(`${slug}: missing public/books/${slug}/`)
  }

  for (const field of ['text_epub', 'text_pdf', 'coverImage', 'audio_only']) {
    const url = d[field]
    if (!url || typeof url !== 'string') continue
    if (!url.startsWith('/')) {
      issues.push(`${slug}: ${field} should be a root-relative path, got ${url}`)
      continue
    }
    const filePath = path.join(root, 'public', url.slice(1))
    if (!existsSync(filePath)) issues.push(`${slug}: ${field} file missing at public${url}`)
  }

  if (d.text_epub) {
    // Expected reader route after build
    if (existsSync(dist)) {
      const reader = path.join(dist, 'read', slug, 'index.html')
      if (!existsSync(reader)) {
        issues.push(`${slug}: has text_epub but dist/read/${slug}/ missing — run npm run build`)
      }
      const page = path.join(dist, 'books', slug, 'index.html')
      if (!existsSync(page)) {
        issues.push(`${slug}: dist/books/${slug}/ missing — run npm run build`)
      }
    } else {
      notes.push(`${slug}: dist/ not built yet; skip route checks (npm run build)`)
    }
  }

  if (!d.section) notes.push(`${slug}: section not set (defaults to ebook)`)
}

// Orphan dist check is optional
if (existsSync(dist)) {
  notes.push('dist/ present — route checks enabled')
}

console.log('Doctor report')
console.log('=============')
for (const n of notes) console.log(`note: ${n}`)
if (issues.length) {
  console.log('\nIssues:')
  for (const i of issues) console.log(`- ${i}`)
  process.exit(1)
}
console.log('\nAll checks passed.')
