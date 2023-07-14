import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

process.env.PUBLIC_BUILD_TIME = new Date().toISOString();
process.env.PUBLIC_AWS_REGION = process.env.AWS_REGION;
process.env.PUBLIC_MAP_NAME = process.env.MAP_NAME;
process.env.PUBLIC_MAP_API_KEY = process.env.MAP_API_KEY;
process.env.PUBLIC_PLACES_INDEX_NAME = process.env.PLACES_INDEX_NAME;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: `${(process.env.BASE_URL ?? "").replace(/\/+$/, "")}/`,
  preview: {
    host: "localhost",
    port: 8080,
  },
  server: {
    host: "localhost",
    port: 8080,
  },
  build: {
    outDir: "./build",
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  envPrefix: "PUBLIC_",
});
