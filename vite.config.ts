import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ command }) => ({
  plugins: [react(), cloudflare()],
  server:
    command === "serve"
      ? {
          port: 23600,
        }
      : undefined,
}));
