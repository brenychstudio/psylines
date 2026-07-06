import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

export default defineConfig({
  output: "server",
  devToolbar: {
    enabled: false,
  },

  integrations: [react()],

  vite: {
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
