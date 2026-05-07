import {defineConfig} from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    server: 'src/server/index.ts',
  },
  minify: false,
  clean: true,
  shims: true,
  outDir: 'dist',
  format: 'esm',
  sourcemap: true,
  dts: true,
  target: false,
})
