import {defineConfig} from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    server: 'src/server/index.ts'
  },
  splitting: true,
  minify: false,
  clean: true,
  shims: true,
  outDir: 'dist',
  format: 'esm',
  sourcemap: true,
  dts: true
})
