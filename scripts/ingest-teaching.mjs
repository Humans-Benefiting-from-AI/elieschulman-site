import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const SECTIONS = new Set(['ebook', 'weekly-torah', 'knowing-project']);

function printUsage() {
  console.error(`Usage: npm run ingest -- <path/to/folder> [options]

Options:
  --section <ebook|weekly-torah|knowing-project>   (default: ebook)
  --slug <slug>                                    (default: folder name)
  --order <number>
  --draft                                          mark as draft
  --featured
  --force                                          overwrite existing content file
  --dry-run                                        print actions without writing
`);
}

function parseArgs(argv) {
  const args = {
    sourceDir: null,
    section: 'ebook',
    slug: null,
    order: undefined,
    draft: false,
    featured: false,
    force: false,
    dryRun: false,
  };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--section') args.section = argv[++i];
    else if (a === '--slug') args.slug = argv[++i];
    else if (a === '--order') args.order = Number(argv[++i]);
    else if (a === '--draft') args.draft = true;
    else if (a === '--featured') args.featured = true;
    else if (a === '--force') args.force = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a.startsWith('-')) {
      console.error(`Unknown option: ${a}`);
      printUsage();
      process.exit(1);
    } else positional.push(a);
  }
  args.sourceDir = positional[0] || null;
  return args;
}

function normalizeSlug(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function yamlEscape(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function extractYamlFrontmatter(mdContent, frontmatter) {
  const match = mdContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    const yamlString = match[1];
    const body = match[2].trim();
    const titleMatch = yamlString.match(/title:\s*"?([^"\n]+)"?/);
    if (titleMatch) frontmatter.title = titleMatch[1];
    const descMatch = yamlString.match(/description:\s*"?([^"\n]+)"?/);
    if (descMatch) frontmatter.description = descMatch[1];
    return body;
  }
  return mdContent.trim();
}

const args = parseArgs(process.argv.slice(2));
if (!args.sourceDir || !fs.existsSync(args.sourceDir)) {
  printUsage();
  process.exit(1);
}
if (!SECTIONS.has(args.section)) {
  console.error(`Invalid --section. Expected one of: ${[...SECTIONS].join(', ')}`);
  process.exit(1);
}

const slug = normalizeSlug(args.slug || path.basename(path.resolve(args.sourceDir)));
if (!slug) {
  console.error('Could not derive a valid slug.');
  process.exit(1);
}

const publicMediaDir = path.join(projectRoot, 'public', 'books', slug);
const contentFilePath = path.join(projectRoot, 'src', 'content', 'teachings', `${slug}.md`);

if (fs.existsSync(contentFilePath) && !args.force) {
  console.error(`Content already exists: ${contentFilePath}\nRe-run with --force to overwrite.`);
  process.exit(1);
}

const files = fs.readdirSync(args.sourceDir);

const backLinkDefault =
  args.section === 'weekly-torah' ? '/weekly-torah/' : '/books/';

const frontmatter = {
  title: slug,
  description: '',
  eyebrow:
    args.section === 'weekly-torah'
      ? 'Weekly Torah Portion'
      : args.section === 'knowing-project'
        ? 'The Knowing Project'
        : 'eBook',
  lede: '',
  author: 'Elie Schulman',
  section: args.section,
  draft: args.draft,
  featured: args.featured,
  back_link: backLinkDefault,
};
if (Number.isFinite(args.order)) frontmatter.order = args.order;

let bodyContent = '';
let customStyle = '';

const htmlFile = files.find((f) => f.endsWith('.html'));
if (htmlFile) {
  const htmlContent = fs.readFileSync(path.join(args.sourceDir, htmlFile), 'utf-8');

  const titleMatch =
    htmlContent.match(/<title>(.*?) — Elie Schulman<\/title>/) ||
    htmlContent.match(/<title>(.*?)<\/title>/);
  if (titleMatch) frontmatter.title = titleMatch[1].replace(/&nbsp;/g, ' ');

  const descMatch = htmlContent.match(/<meta name="description" content="(.*?)">/);
  if (descMatch) frontmatter.description = descMatch[1];

  const eyebrowMatch = htmlContent.match(/<p class="eyebrow">(.*?)<\/p>/);
  if (eyebrowMatch) frontmatter.eyebrow = eyebrowMatch[1];

  const ledeMatch = htmlContent.match(/<p class="lede">([\s\S]*?)<\/p>/);
  if (ledeMatch) frontmatter.lede = ledeMatch[1].trim().replace(/\n/g, ' ');

  const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) customStyle = `<style>\n${styleMatch[1]}\n</style>\n\n`;

  const layoutMatch =
    htmlContent.match(/<div class="bk-layout">([\s\S]*?)<\/div>\s*<\/Layout>/) ||
    htmlContent.match(/<div class="bk-layout">([\s\S]*?)<\/main>/) ||
    htmlContent.match(/<main id="main-content">([\s\S]*?)<\/main>/);

  if (layoutMatch) {
    let content = layoutMatch[1];
    content = content.replace(/<header class="page-header">[\s\S]*?<\/header>/, '');
    content = content.replace(/<div class="book-card">[\s\S]*?<\/div>\s*<\/div>/, '');
    content = content.replace(/<section class="bg-cream">/, '');
    content = content.replace(/<\/section>/, '');
    content = content.replace(/<div class="section-inner">/, '');
    content = content.replace(/<a class="back-link"[\s\S]*?<\/a>/, '');
    bodyContent = content.trim();
  }
} else {
  const mdFile = files.find((f) => f.endsWith('.md'));
  if (mdFile) {
    const mdContent = fs.readFileSync(path.join(args.sourceDir, mdFile), 'utf-8');
    bodyContent = extractYamlFrontmatter(mdContent, frontmatter);
  }
}

if (!args.dryRun) {
  fs.mkdirSync(publicMediaDir, { recursive: true });
}

function copyAsset(sourcePath, destName) {
  const destPath = path.join(publicMediaDir, destName);
  if (args.dryRun) {
    console.log(`[dry-run] copy ${sourcePath} -> ${destPath}`);
    return `/books/${slug}/${destName}`;
  }
  fs.copyFileSync(sourcePath, destPath);
  return `/books/${slug}/${destName}`;
}

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const sourcePath = path.join(args.sourceDir, file);

  if (ext === '.epub') {
    frontmatter.text_epub = copyAsset(sourcePath, `${slug}.epub`);
  } else if (ext === '.pdf') {
    frontmatter.text_pdf = copyAsset(sourcePath, `${slug}.pdf`);
  } else if (['.mp3', '.wav', '.m4a'].includes(ext)) {
    frontmatter.audio_only = copyAsset(sourcePath, `${slug}${ext}`);
  } else if (['.mp4', '.mov'].includes(ext)) {
    frontmatter.video_face = copyAsset(sourcePath, `${slug}${ext}`);
  } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    if (file.toLowerCase().includes('cover') || !frontmatter.coverImage) {
      const coverName = `cover${ext === '.jpeg' ? '.jpg' : ext}`;
      frontmatter.coverImage = copyAsset(sourcePath, coverName);
    }
  }
}

if (!frontmatter.title) {
  console.error('Missing required frontmatter: title');
  process.exit(1);
}
if (!frontmatter.description) {
  frontmatter.description = `${frontmatter.title} by Elie Schulman.`;
  console.warn(`Filled description fallback for ${slug}.`);
}

const yamlLines = ['---'];
yamlLines.push(`title: "${yamlEscape(frontmatter.title)}"`);
yamlLines.push(`description: "${yamlEscape(frontmatter.description)}"`);
if (frontmatter.eyebrow) yamlLines.push(`eyebrow: "${yamlEscape(frontmatter.eyebrow)}"`);
if (frontmatter.lede) yamlLines.push(`lede: "${yamlEscape(frontmatter.lede)}"`);
yamlLines.push(`author: "${yamlEscape(frontmatter.author)}"`);
yamlLines.push(`section: ${frontmatter.section}`);
yamlLines.push(`draft: ${frontmatter.draft ? 'true' : 'false'}`);
yamlLines.push(`featured: ${frontmatter.featured ? 'true' : 'false'}`);
if (frontmatter.order !== undefined) yamlLines.push(`order: ${frontmatter.order}`);
yamlLines.push(`back_link: "${frontmatter.back_link}"`);
if (frontmatter.coverImage) yamlLines.push(`coverImage: "${frontmatter.coverImage}"`);
if (frontmatter.text_epub) yamlLines.push(`text_epub: "${frontmatter.text_epub}"`);
if (frontmatter.text_pdf) yamlLines.push(`text_pdf: "${frontmatter.text_pdf}"`);
if (frontmatter.audio_only) yamlLines.push(`audio_only: "${frontmatter.audio_only}"`);
if (frontmatter.video_face) yamlLines.push(`video_face: "${frontmatter.video_face}"`);
yamlLines.push('---');

const finalFileContent = yamlLines.join('\n') + '\n\n' + customStyle + bodyContent;

if (args.dryRun) {
  console.log('[dry-run] would write', contentFilePath);
  console.log(finalFileContent.slice(0, 800));
} else {
  fs.mkdirSync(path.dirname(contentFilePath), { recursive: true });
  fs.writeFileSync(contentFilePath, finalFileContent);
}

console.log(`✅ ${args.dryRun ? 'Dry-run for' : 'Ingested'} teaching '${slug}'`);
console.log(`📁 Assets: public/books/${slug}/`);
console.log(`📄 Content: src/content/teachings/${slug}.md`);
console.log(`🏷  section=${frontmatter.section} draft=${frontmatter.draft}`);
if (frontmatter.text_epub) {
  console.log(`📖 Reader route will be: /read/${slug}/ (after build)`);
}
console.log(`
Next steps:
  1. Review frontmatter in src/content/teachings/${slug}.md
  2. npm run doctor
  3. npm run build && npm run check
`);
