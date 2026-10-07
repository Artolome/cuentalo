#!/usr/bin/env node
/* Mini servidor estático para probar cuentalo.html en el navegador (solo desarrollo).
   node test/serve.js [puerto]  → http://127.0.0.1:4173/cuentalo.html */
const http = require('http');
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const PUERTO = +(process.argv[2] || process.env.PORT || 4173);
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8' };
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let f = path.normalize(path.join(RAIZ, url === '/' ? '/cuentalo.html' : url));
  if (!f.startsWith(RAIZ)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('404 ' + url); }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(PUERTO, '127.0.0.1', () => console.log(`http://127.0.0.1:${PUERTO}/cuentalo.html`));
