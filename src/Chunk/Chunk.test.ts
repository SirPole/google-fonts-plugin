import * as webpack from 'webpack'
import webpackConfig from '../__mocks__/webpack.config'
import Chunk from './Chunk'
import Options from '../Options/Options'

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
  expect(Chunk.hash(new Options())).toEqual(
    '4a7ecb98ff160a5514ddf0bb3b0fb044fdc7d0d7'
  )
})
