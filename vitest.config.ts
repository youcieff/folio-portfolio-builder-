import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pure Node environment — core has zero React/DOM deps
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/core/**"],
    },
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
});
