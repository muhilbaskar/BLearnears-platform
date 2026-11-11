// MERGE this into your existing vite.config.js (keep your own plugins).
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
