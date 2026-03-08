import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Replace this with your actual backend URL
const BACKEND_URL = process.env.VITE_API_URL || "http://127.0.0.1:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",               // required for Render
    port: parseInt(process.env.PORT) || 5173,
    allowedHosts: [
      "tech-insight-frontend.onrender.com",  // Render frontend URL
    ],
    proxy: {
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",                 // default output folder
  },
});
