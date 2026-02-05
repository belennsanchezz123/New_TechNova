import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // 1. ESLint recommended rules (Base quality)
  js.configs.recommended,

  // 2. General project configuration
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser, // Enable variables like 'window', 'document'
        ...globals.node     // Enable variables like 'process', '__dirname'
      }
    },
    // Custom "Quality" rules (Logic, not style)
    rules: {
      "no-unused-vars": "warn", // Warn if you create variables and don't use them
      "no-console": "off",      // Allow console.log for debugging (disable in production builds)
      "eqeqeq": "error",        // Force the use of === instead of ==
      "no-var": "error",        // Prohibit var, use let/const
      "prefer-const": "warn"    // Suggest const when the variable is not reassigned
    }
  },

  // 3. Prettier (ALWAYS at the end)
  // Disables ESLint style rules so Prettier takes control
  eslintConfigPrettier
];
