import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const sourceDir = process.argv[2];
if (!sourceDir || !fs.existsSync(sourceDir)) {
  console.error("Usage: npm run ingest <path/to/claude/folder>");
  process.exit(1);
}

// Get the folder name to use as the slug
const slug = path.basename(path.resolve(sourceDir));
const publicMediaDir = path.join(projectRoot, 'public', 'books', slug);
const contentFilePath = path.join(projectRoot, 'src', 'content', 'teachings', `${slug}.md`);

// Create media directory
fs.mkdirSync(publicMediaDir, { recursive: true });

const files = fs.readdirSync(sourceDir);

let frontmatter = {
  title: slug,
  description: "",
  eyebrow: "The Knowing Project",
  lede: "",
  author: "Elie Schulman"
};

let bodyContent = "";
let customStyle = "";

// Helper to extract yaml frontmatter from markdown
function extractYamlFrontmatter(mdContent) {
  const match = mdContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    const yamlString = match[1];
    bodyContent = match[2].trim();
    
    // Simple naive parsing for title and description
    const titleMatch = yamlString.match(/title:\s*"?([^"\n]+)"?/);
    if (titleMatch) frontmatter.title = titleMatch[1];
    
    const descMatch = yamlString.match(/description:\s*"?([^"\n]+)"?/);
    if (descMatch) frontmatter.description = descMatch[1];
  } else {
    bodyContent = mdContent.trim();
  }
}

// Look for an HTML file to extract metadata (since Claude often generates index.html)
const htmlFile = files.find(f => f.endsWith('.html'));
if (htmlFile) {
  const htmlContent = fs.readFileSync(path.join(sourceDir, htmlFile), 'utf-8');
  
  const titleMatch = htmlContent.match(/<title>(.*?) — Elie Schulman<\/title>/) || htmlContent.match(/<title>(.*?)<\/title>/);
  if (titleMatch) frontmatter.title = titleMatch[1].replace(/&nbsp;/g, ' ');
  
  const descMatch = htmlContent.match(/<meta name="description" content="(.*?)">/);
  if (descMatch) frontmatter.description = descMatch[1];
  
  const eyebrowMatch = htmlContent.match(/<p class="eyebrow">(.*?)<\/p>/);
  if (eyebrowMatch) frontmatter.eyebrow = eyebrowMatch[1];
  
  const ledeMatch = htmlContent.match(/<p class="lede">([\s\S]*?)<\/p>/);
  if (ledeMatch) frontmatter.lede = ledeMatch[1].trim().replace(/\n/g, ' ');

  const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) customStyle = `<style>\n${styleMatch[1]}\n</style>\n\n`;

  // Try to extract the reading pane (inside bk-layout)
  const layoutMatch = htmlContent.match(/<div class="bk-layout">([\s\S]*?)<\/div>\s*<\/Layout>/) || 
                      htmlContent.match(/<div class="bk-layout">([\s\S]*?)<\/main>/) ||
                      htmlContent.match(/<main id="main-content">([\s\S]*?)<\/main>/);
                      
  if (layoutMatch) {
     // If we caught main-content, we might need to strip the hero which is now handled by frontmatter.
     let content = layoutMatch[1];
     content = content.replace(/<header class="page-header">[\s\S]*?<\/header>/, '');
     content = content.replace(/<div class="book-card">[\s\S]*?<\/div>\s*<\/div>/, ''); // remove hardcoded book card
     content = content.replace(/<section class="bg-cream">/, '');
     content = content.replace(/<\/section>/, '');
     content = content.replace(/<div class="section-inner">/, '');
     content = content.replace(/<a class="back-link"[\s\S]*?<\/a>/, '');
     
     bodyContent = content.trim();
  }
} else {
   // Fallback: Read a markdown file if present
   const mdFile = files.find(f => f.endsWith('.md'));
   if (mdFile) {
      const mdContent = fs.readFileSync(path.join(sourceDir, mdFile), 'utf-8');
      extractYamlFrontmatter(mdContent);
   }
}

// Process assets
files.forEach(file => {
  const ext = path.extname(file).toLowerCase();
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(publicMediaDir, file);
  const publicUrl = `/books/${slug}/${file}`;

  if (['.epub'].includes(ext)) {
    fs.copyFileSync(sourcePath, destPath);
    frontmatter.text_epub = publicUrl;
  } else if (['.pdf'].includes(ext)) {
    fs.copyFileSync(sourcePath, destPath);
    frontmatter.text_pdf = publicUrl;
  } else if (['.mp3', '.wav', '.m4a'].includes(ext)) {
    fs.copyFileSync(sourcePath, destPath);
    frontmatter.audio_only = publicUrl;
  } else if (['.mp4', '.mov'].includes(ext)) {
    fs.copyFileSync(sourcePath, destPath);
    frontmatter.video_face = publicUrl; // default assumption for video
  } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    // If it's an image, assume it's the cover (especially if it has 'cover' in the name)
    if (file.toLowerCase().includes('cover') || !frontmatter.coverImage) {
      fs.copyFileSync(sourcePath, destPath);
      frontmatter.coverImage = publicUrl;
    }
  }
});

// Construct the markdown file with frontmatter
const yamlLines = ['---'];
yamlLines.push(`title: "${frontmatter.title.replace(/"/g, '\\"')}"`);
yamlLines.push(`description: "${frontmatter.description.replace(/"/g, '\\"')}"`);
yamlLines.push(`eyebrow: "${frontmatter.eyebrow.replace(/"/g, '\\"')}"`);
yamlLines.push(`lede: "${frontmatter.lede.replace(/"/g, '\\"')}"`);
yamlLines.push(`author: "${frontmatter.author}"`);
if (frontmatter.coverImage) yamlLines.push(`coverImage: "${frontmatter.coverImage}"`);
if (frontmatter.text_epub) yamlLines.push(`text_epub: "${frontmatter.text_epub}"`);
if (frontmatter.text_pdf) yamlLines.push(`text_pdf: "${frontmatter.text_pdf}"`);
if (frontmatter.audio_only) yamlLines.push(`audio_only: "${frontmatter.audio_only}"`);
if (frontmatter.video_face) yamlLines.push(`video_face: "${frontmatter.video_face}"`);
yamlLines.push('---');

const finalFileContent = yamlLines.join('\n') + '\n\n' + customStyle + bodyContent;

fs.writeFileSync(contentFilePath, finalFileContent);
console.log(`✅ Successfully ingested teaching '${slug}'`);
console.log(`📁 Assets copied to: /public/books/${slug}/`);
console.log(`📄 Content created at: /src/content/teachings/${slug}.md`);
