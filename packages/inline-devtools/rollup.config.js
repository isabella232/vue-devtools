import VuePlugin from 'rollup-plugin-vue'

export default [
  {
    input: './src/inline-devtools.js',
    output: {
      file: 'build/inline-devtools-rollup.js',
      format: 'esm',
    },
    plugins: [VuePlugin()],
    external: ['vue'],
  },
]