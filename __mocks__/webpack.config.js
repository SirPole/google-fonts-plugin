const { resolve } = require('path')

module.exports = {
  mode: 'production',
  target: 'web',
  bail: true,
  cache: false,
  devtool: false,
  entry: resolve(__dirname, 'entry.js'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  }
}
