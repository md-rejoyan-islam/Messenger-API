import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import * as tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,ts,mjs,cjs,mts,cts}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
    },
  },
  ...tseslint.configs.recommended,
]);
