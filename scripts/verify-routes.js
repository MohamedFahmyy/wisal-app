import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const testUrls = [
  '/',
  '/demos',
  '/features',
  '/packages',
  '/faq',
  '/invite/mohamed-salma',
  '/invite/karim-hagar',
  '/invite/omar-eman',
  '/invite/youssef-laila',
  '/invite/salma-omar',
  '/invite/ahmed-nour',
  '/invite/nour-birthday',
  '/invite/adam-jana',
  '/invite/seif-malak',
  '/invite/hana-karim',
  '/invite/malek-nour',
  '/invite/yara-graduation'
];

console.log('[Audit] Verifying static generated files on disk:');
let missingFiles = 0;
for (const route of testUrls) {
  if (route === '/') {
    const exists = fs.existsSync('dist/index.html');
    console.log(`  dist/index.html: ${exists ? 'EXISTS (OK)' : 'MISSING'}`);
    if (!exists) missingFiles++;
    continue;
  }
  const subPath = route.startsWith('/') ? route.slice(1) : route;
  const dirIndex = `dist/${subPath}/index.html`;
  const cleanHtml = `dist/${subPath}.html`;
  const existsDir = fs.existsSync(dirIndex);
  const existsClean = fs.existsSync(cleanHtml);
  console.log(`  ${subPath} -> dir/index.html: ${existsDir ? 'OK' : 'MISSING'} | file.html: ${existsClean ? 'OK' : 'MISSING'}`);
  if (!existsDir || !existsClean) missingFiles++;
}

if (missingFiles > 0) {
  console.error(`[Audit] Failed: ${missingFiles} expected static route files are missing!`);
  process.exit(1);
} else {
  console.log('\n[Audit] SUCCESS: All 17 static routes have dual static HTML entrypoints (dir/index.html & clean.html)!');
}

// Check sample metadata
const sampleContent = fs.readFileSync('dist/invite/mohamed-salma.html', 'utf8');
const ogTitleMatch = sampleContent.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/);
const ogDescMatch = sampleContent.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/);
const ogImgMatch = sampleContent.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/);

console.log('\n[Audit] Sample Metadata for mohamed-salma:');
console.log('  og:title:', ogTitleMatch ? ogTitleMatch[1] : 'NOT FOUND');
console.log('  og:description:', ogDescMatch ? ogDescMatch[1] : 'NOT FOUND');
console.log('  og:image:', ogImgMatch ? ogImgMatch[1] : 'NOT FOUND');
