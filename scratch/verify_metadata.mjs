import fs from 'node:fs';

const checkFiles = [
  'dist/index.html',
  'dist/guests/index.html',
  'dist/links/index.html',
  'dist/card/index.html',
  'dist/mazen-farida/index.html',
  'dist/invite/mohamed-salma/index.html',
  'dist/invite/karim-hagar/index.html',
  'dist/invite/adam-jana/index.html'
];

console.log('--- Inspecting Open Graph and Title Metadata in dist/ ---');
checkFiles.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const ogTitleMatch = content.match(/<meta property=["']og:title["'] content=["'](.*?)["']/);
    const ogImageMatch = content.match(/<meta property=["']og:image["'] content=["'](.*?)["']/);
    const ogDescMatch = content.match(/<meta property=["']og:description["'] content=["'](.*?)["']/);
    console.log(`[FILE] ${f}`);
    console.log(`  Title:    ${titleMatch ? titleMatch[1] : 'NOT FOUND'}`);
    console.log(`  OG Title: ${ogTitleMatch ? ogTitleMatch[1] : 'NOT FOUND'}`);
    console.log(`  OG Image: ${ogImageMatch ? ogImageMatch[1].slice(0, 60) + '...' : 'NOT FOUND'}`);
    console.log(`  OG Desc:  ${ogDescMatch ? ogDescMatch[1].slice(0, 70) + '...' : 'NOT FOUND'}`);
  } else {
    console.log(`[FILE] ${f} MISSING!`);
  }
});
