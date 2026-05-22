import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  platform: 'browser',
  format: 'iife',
  target: ['es2020', 'chrome80', 'firefox75', 'safari13'],
  outfile: 'dist/widget.min.js',
})
