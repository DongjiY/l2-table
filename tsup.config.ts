import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'iife'],
  dts: true,
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  globalName: 'L2Table',
})

