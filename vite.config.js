import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// =============================================================================
// Vite config
//
// In dev, requests to /api/* are proxied to the local backend so the browser
// never has to deal with CORS while you're iterating. In production, set
// VITE_API_URL to your deployed backend's base URL (see .env.example) and
// the app talks to it directly — no proxy involved.
// =============================================================================
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
