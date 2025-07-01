import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(async () => {
  return {
    root: __dirname,
    plugins: [react(), runtimeErrorOverlay()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@shared": path.resolve(__dirname, "../shared"),
        "@assets": path.resolve(__dirname, "../attached_assets"),
      },
    },
    build: {
      outDir: path.resolve(__dirname, "../dist/public"),
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/api": {
          target: "http://localhost:5051",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
