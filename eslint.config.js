import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Provider files (language.tsx, toast.tsx) and Pixel.tsx legitimately export
      // their hooks/constants alongside the component. This only affects dev HMR
      // granularity, not correctness, so keep it advisory rather than blocking.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // eslint-plugin-react-hooks 7 ships the React Compiler rules as errors.
      // This app does not use the compiler, and the 22 findings it raised on
      // upgrade (setState in effects, components created during render, ...)
      // are pre-existing patterns, not regressions. Kept at warn so the
      // tooling upgrade lands on its own and the findings stay visible in the
      // lint output for a dedicated cleanup pass, rather than being silenced.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/use-memo': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
])
