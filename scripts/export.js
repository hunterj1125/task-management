const fs = require('fs');
const path = require('path');

function walk(dir, cb) { const items = fs.readdirSync(dir, { withFileTypes: true }); for (const it of items) { const p = path.join(dir, it.name); if (it.isDirectory()) walk(p, cb); else cb(p); } }

function postProcessOut(outDir, repoName) { if (!repoName) return; const from = '/_next/'; const to = `/${repoName}/_next/`; const exts = ['.html', '.js', '.css', '.json']; walk(outDir, (file) => { if (!exts.includes(path.extname(file))) return; try { let txt = fs.readFileSync(file, 'utf8'); if (txt.indexOf(from) !== -1) { txt = txt.split(from).join(to); fs.writeFileSync(file, txt, 'utf8'); } } catch (e) {} }); }

const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : (() => { try { const pkg = require(path.join(process.cwd(),'package.json')); return pkg.name } catch { return '' } })();
const outDir = path.join(process.cwd(), 'out');
if (fs.existsSync(outDir)) { console.log('Post-processing out for repo:', repoName); postProcessOut(outDir, repoName); } else { console.log('No out directory found; nothing to post-process.'); }

module.exports = { postProcessOut };
