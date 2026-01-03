import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
// base: "/static/",
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/users": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/categorias": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/bebidas": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/images": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
