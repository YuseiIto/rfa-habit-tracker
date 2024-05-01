import esbuild from 'esbuild';

esbuild.build({
  bundle: true,
  entryPoints: ['./src/main.ts'],
  outdir: './dist',
  platform: 'node',
  format: 'cjs',
}).then(() => {
  console.log('Build successful');
})
