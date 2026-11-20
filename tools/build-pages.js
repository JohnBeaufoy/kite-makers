// Build the GitHub Pages copies of the games: docs/index.html (Kite Makers) and docs/flat-tops/index.html (Flat-tops).
// The same job as build-pages.py, for machines with Node and no Python; both give byte-identical output.
//
// Each game file is written for claude.ai artifacts, which add the document skeleton when published. A plain web host
// needs that skeleton in the file, so this wraps the page in one with the same viewport and reset.
//
// Run from anywhere:  node tools/build-pages.js
const fs = require('fs'), path = require('path');

const root = path.resolve(__dirname, '..');
const PAGES = [['kite-makers.html', 'docs/index.html'], ['flat-tops.html', 'docs/flat-tops/index.html']];

const head = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>
:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
body{margin:0;font:14px system-ui,sans-serif}
img{max-width:100%}
[hidden]{display:none!important}
</style>
`;

for (const [src, dst] of PAGES) {
  // read as Python does: universal newlines, so a Windows checkout (CRLF) builds the same as any other
  let page = fs.readFileSync(path.join(root, src), 'utf8').replace(/\r\n?/g, '\n');
  page = page.replace('<meta charset="utf-8">\n', '');
  // The title, font links and stylesheet belong in <head>; the markup and script in <body>.
  const split = page.indexOf('</style>') + '</style>'.length;
  const out = path.join(root, dst);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, head + page.slice(0, split) + '\n</head>\n<body>' + page.slice(split) + '\n</body>\n</html>\n', 'utf8');
  console.log('wrote ' + path.relative(root, out).split(path.sep).join('/'));
}
fs.writeFileSync(path.join(root, 'docs', '.nojekyll'), '');
