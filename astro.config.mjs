import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

const isBuildCommand =
  process.argv.includes('build') ||
  process.env.npm_lifecycle_event === 'build';

export default defineConfig({
  output: "server",
  devToolbar: {
    enabled: false,
  },

  integrations: [react()],

  vite: {
    // Development and production optimize different React JSX runtimes.
    // Separate caches prevent a build from replacing jsxDEV under a live dev server.
    cacheDir: isBuildCommand
      ? 'node_modules/.vite-artist-stage-build'
      : 'node_modules/.vite-artist-stage-dev',
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: [
          "**/.tmp/**",
          "**/screenshots/**",
          "**/test-results/**",
          "**/dist/**",
          "**/.chrome*/**",
          "**/.codex-chrome*/**",
          "**/public/generated/**",
        ],
      },
    },
    optimizeDeps: {
      exclude: [
        "@react-three/fiber",
        "@react-three/drei",
        "three",
        "three/examples/jsm/webxr/VRButton.js",
        "three/examples/jsm/webxr/XRControllerModelFactory.js",
      ],
    },
  },

  adapter: node({
    mode: "standalone",
  }),
});
