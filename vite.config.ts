import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the production bundle's <script src> works under file://
  // when loaded by the packaged Electron app. Without this the renderer is
  // blank in the packaged .exe (assets 404 against file:///).
  base: "./",
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
