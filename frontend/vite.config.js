import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",      // needed for Docker to expose the port
    port: 5173,
    proxy: {
      // in dev, any request to /api gets forwarded to the backend container
      // this means no CORS issues during development
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});