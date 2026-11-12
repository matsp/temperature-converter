'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

function stagedEntries(deployYml) {
  const m = deployYml.match(/cp -r (.+?) _site\//);
  return m ? m[1].trim().split(/\s+/) : [];
}

function assetRefs(html, css) {
  const refs = [];
  for (const m of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) refs.push(m[1]);
  for (const m of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/g)) refs.push(m[2]);
  return refs;
}

function isRelative(ref) {
  return !(ref.startsWith('/') || /^[a-z][a-z0-9+.-]*:/i.test(ref));
}

function smokePaths(deployYml) {
  const m = deployYml.match(/for f in (.+?); do/);
  if (!m) return [];
  return m[1].trim().split(/\s+/).map((w) => w.replace(/^"(.*)"$/, '$1'));
}

test('stagedEntries reads the cp line', () => {
  assert.deepEqual(stagedEntries('  mkdir _site\n  cp -r index.html fonts _site/\n'), ['index.html', 'fonts']);
});
test('stagedEntries without a cp line', () => {
  assert.deepEqual(stagedEntries('steps: []'), []);
});
test('assetRefs reads html and css', () => {
  const html = '<link rel="stylesheet" href="styles.css"><script src="app.js"></script>';
  const css = 'src: url("fonts/a.ttf") format("truetype"); x: url(b.png)';
  assert.deepEqual(assetRefs(html, css), ['styles.css', 'app.js', 'fonts/a.ttf', 'b.png']);
});
test('isRelative accepts relative refs', () => {
  for (const r of ['styles.css', 'fonts/a.ttf', './app.js']) assert.equal(isRelative(r), true, r);
});
test('isRelative rejects absolute refs', () => {
  for (const r of ['/styles.css', '//cdn.example/x.css', 'https://fonts.googleapis.com/css', 'data:font/ttf;base64,AA']) {
    assert.equal(isRelative(r), false, r);
  }
});
test('smokePaths reads the for list', () => {
  assert.deepEqual(smokePaths('for f in "" app.js fonts/a.ttf; do'), ['', 'app.js', 'fonts/a.ttf']);
});

const deployYml = read('.github/workflows/deploy.yml');
const ciYml = read('.github/workflows/ci.yml');
const html = read('index.html');
const css = read('styles.css');

test('deploy publishes exactly the page files', () => {
  assert.deepEqual(stagedEntries(deployYml).sort(),
    ['app.js', 'converter.js', 'display.js', 'fonts', 'index.html', 'styles.css']);
});
test('page assets are relative', () => {
  for (const r of assetRefs(html, css)) assert.ok(isRelative(r), `absolute asset reference: ${r}`);
});
test('page assets are published', () => {
  const staged = stagedEntries(deployYml);
  for (const r of assetRefs(html, css)) {
    assert.ok(fs.existsSync(path.join(ROOT, r)) && staged.includes(path.normalize(r).split(path.sep)[0]),
      `not published: ${r}`);
  }
});
test('smoke check covers every published file', () => {
  const smoke = smokePaths(deployYml);
  const files = ['converter.js', 'display.js', 'app.js', 'styles.css',
    ...fs.readdirSync(path.join(ROOT, 'fonts')).map((n) => `fonts/${n}`)];
  assert.ok(smoke.includes(''), 'not smoke-checked: (page root)');
  for (const f of files) assert.ok(smoke.includes(f), `not smoke-checked: ${f}`);
});
test('deploy runs only after green CI on main', () => {
  for (const snip of ['workflows: [CI]', 'branches: [main]',
    "github.event.workflow_run.conclusion == 'success'", "github.event.workflow_run.event == 'push'",
    'ref: ${{ github.event.workflow_run.head_sha', 'timeout-minutes: 10', 'actions/deploy-pages@v4']) {
    assert.ok(deployYml.includes(snip), `deploy.yml lacks: ${snip}`);
  }
});
test('ci fails fast', () => {
  for (const snip of ['name: CI', 'timeout-minutes: 10', '--test-timeout=10000']) {
    assert.ok(ciYml.includes(snip), `ci.yml lacks: ${snip}`);
  }
});
