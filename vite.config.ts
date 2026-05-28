import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { readFileSync } from 'node:fs'

// Pull the app version straight from package.json at config-evaluation
// time so the renderer bundle has a compile-time constant — no IPC, no
// runtime fetch.
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the production bundle's <script src> works under file://
  // when loaded by the packaged Electron app. Without this the renderer is
  // blank in the packaged .exe (assets 404 against file:///).
  base: "./",
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
