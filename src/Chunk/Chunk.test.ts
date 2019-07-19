import * as webpack from 'webpack'
import Chunk from './Chunk'
import Options from '../Options/Options'

const webpackConfig: webpack.Configuration = {
  entry: './entry.js',
  output: {
    path: '/dist',
    filename: 'bundle.js'
  }
}

test('Should create chunk hash from options', (): void => {
  const compiler = webpack(webpackConfig)
  const compilation = compiler.createCompilation()
  const chunkName = new Options().chunkName
  const chunk = new Chunk(compilation, chunkName)
  chunk.create()
  expect(typeof compilation.namedChunks.get(chunkName)).toBe('object')
  expect(compilation.namedChunks.get(chunkName).name).toBe(chunkName)
})

test('Should create chunk hash from options', (): void => {
  expect(Chunk.hash(new Options({}, false).get())).toEqual('bf21a9e8fbc5a3846fb05b4fa0859e0917b2202f')
})
