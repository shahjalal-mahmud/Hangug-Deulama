import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // The data-loading pattern (fetch on mount → setState) is the
      // canonical way to bootstrap a view from a remote API. Disabling
      // this rule lets us keep the codebase readable without sprinkling
      // inline disables across every fetch-on-mount effect.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])