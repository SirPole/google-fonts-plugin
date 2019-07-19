import Cache from './Cache'
import Plugin from '../Plugin/Plugin'
import { resolve } from 'path'

jest.mock('fs')

test('Should load from cache if exists', (): void => {
  expect(Cache.get('keep', 'utf8')).toBe('asdf')
})

test("Should not load from cache, when file doesn't exist", (): void => {
  expect(Cache.get('lose', 'utf8')).toBe('')
})

test('Should generate cache key', (): void => {
  expect(Cache.key('asdf', 'woff2')).toBe('woff2-3da541559918a808c2402bba5012f6c60b27661c')
})

test('Should save to cache', (): void => {
  expect(Cache.save('asdf', '', 'utf8')).toEqual({
    file: resolve(process.cwd(), 'node_modules', '.cache', Plugin.getPluginName(), 'asdf'),
    content: ''
  })
})
