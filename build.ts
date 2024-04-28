import esbuild from 'esbuild';

await esbuild.build({
  bundle: true,
  entryPoints: ['./src/main.ts'],
  outdir: './dist',
  platform: 'node',
  format: 'esm',
})
