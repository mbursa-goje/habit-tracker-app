import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    coverage: {
      include: ["src/lib/**/*.ts"],
      provider: "v8",
      thresholds: {
        lines: 80,
      },
    },
  },
});
