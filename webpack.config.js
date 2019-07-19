const { resolve } = require('path')
const DtsBundlePlugin = require('dts-bundle-webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const configuration = {
  mode: 'production',
  target: 'node',
  bail: true,
  cache: true,
  devtool: 'source-map',
  entry: resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DtsBundlePlugin({
      name: 'google-fonts-plugin',
      main: resolve(__dirname, 'dist', 'index.d.ts'),
      out: resolve(__dirname, 'dist', 'index.d.ts'),
      removeSource: true,
      outputAsModuleFolder: true
    })
  ]
}

module.exports = configuration
