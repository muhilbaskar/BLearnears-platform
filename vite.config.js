import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

// ---------------------------------------------------------------------------
// Pre-compression (Brotli + gzip) of the production build  [NEW]
// - `vite build` now also writes file.js.br / file.js.gz / file.css.br ... next to the originals
//   (nginx gzip_static / brotli_static, Cloudflare, S3+CDN etc. can serve them directly;
//   hosts that compress on their own simply ignore them).
// - `vite preview` serves those files with Content-Encoding, so a local Lighthouse run
//   sees the same compressed transfer sizes a real host sends. Plain `vite preview` sends
//   everything RAW with "Cache-Control: no-cache", which inflates FCP/LCP/Speed Index.
// - No new npm dependency (Node's built-in zlib). Does not touch images or video.
// ---------------------------------------------------------------------------
const COMPRESSIBLE = /\.(?:js|mjs|css|html|svg|json|webmanifest|txt|xml)$/i;
const MIME = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function precompress() {
  let outDir = "";
  let isBuild = false;
  return {
    name: "precompress-and-serve-encodings",
    configResolved(cfg) {
      isBuild = cfg.command === "build";
      outDir = path.resolve(cfg.root, cfg.build.outDir);
    },
    closeBundle() {
      if (!isBuild || !fs.existsSync(outDir)) return;
      for (const file of walk(outDir)) {
        if (!COMPRESSIBLE.test(file)) continue;
        const buf = fs.readFileSync(file);
        if (buf.length < 1024) continue;
        const br = zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } });
        const gz = zlib.gzipSync(buf, { level: 9 });
        if (br.length < buf.length) fs.writeFileSync(`${file}.br`, br);
        if (gz.length < buf.length) fs.writeFileSync(`${file}.gz`, gz);
      }
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();
        let pathname;
        try {
          pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
        } catch {
          return next();
        }
        if (pathname.endsWith("/")) pathname += "index.html";
        const file = path.join(outDir, pathname);
        if (!file.startsWith(outDir + path.sep) || !COMPRESSIBLE.test(file)) return next();
        const accept = String(req.headers["accept-encoding"] || "");
        let enc = null;
        if (/\bbr\b/.test(accept) && fs.existsSync(`${file}.br`)) enc = ["br", ".br"];
        else if (/\bgzip\b/.test(accept) && fs.existsSync(`${file}.gz`)) enc = ["gzip", ".gz"];
        if (!enc) return next();
        const packed = `${file}${enc[1]}`;
        res.statusCode = 200;
        res.setHeader("Content-Type", MIME[path.extname(file).toLowerCase()] || "application/octet-stream");
        res.setHeader("Content-Encoding", enc[0]);
        res.setHeader("Content-Length", fs.statSync(packed).size);
        res.setHeader("Vary", "Accept-Encoding");
        res.setHeader(
          "Cache-Control",
          pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache",
        );
        if (req.method === "HEAD") return res.end();
        fs.createReadStream(packed).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), precompress()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
    reportCompressedSize: false, // faster builds (sizes are still printed by the host)
    modulePreload: { polyfill: false }, // every browser that runs es2020 modules supports modulepreload
    assetsInlineLimit: 4096, // tiny SVG icons inline, fewer requests
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) return "react";
          if (id.includes("node_modules/framer-motion") || id.includes("node_modules/motion-dom") || id.includes("node_modules/motion-utils")) return "motion";
          if (id.includes("node_modules/react-router") || id.includes("node_modules/@remix-run")) return "router";
          // three / react-globe.gl stay in their own lazy chunk automatically
        },
      },
    },
  },
});