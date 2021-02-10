const path = require('path')
const { createConfig } = require('@vue-devtools/build-tools')

module.exports = createConfig({
  entry: {
    'inlineDevtools': './src/inline-devtools.js',
    'backend': './src/backend.js'
  },
  // entry: './src/tester.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    library: 'inlineDevtools',
    libraryTarget: 'window',
  },
})
