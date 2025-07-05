import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    hookTimeout: 60000, // Increase hook timeout to 60 seconds
    testTimeout: 60000, // Increase test timeout to 60 seconds
  },
});
