import { resolve } from 'path'
import { Configuration } from 'webpack'

const configuration: Configuration = {
  mode: 'production',
  target: 'web',
  bail: true,
  cache: false,
  devtool: false,
  entry: resolve(__dirname, 'entry.js'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
  },
}

export default configuration
