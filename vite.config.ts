import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import ssrHotReload from "vite-plugin-ssr-hot-reload";
import build from "@hono/vite-build/cloudflare-workers";

export default defineConfig(({ command, isSsrBuild }) => {
  if (command === "serve") {
    // Development mode
    return {
      plugins: [ssrHotReload(), cloudflare()],
      server: {
        port: 23600,
      },
    };
  }
  // Production mode
  if (!isSsrBuild) {
    return {
      build: {
        rollupOptions: {
          input: ["./src/style.css"],
          output: {
            assetFileNames: "assets/[name].[ext]",
          },
        },
      },
    };
  }
  return {
    plugins: [build({ outputDir: "dist-server" })],
  };
});
