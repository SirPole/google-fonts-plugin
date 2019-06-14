'use strict'

const Cache = require('../../src/Cache')

test('Should generate cache key', () => {
  expect(Cache.key('asdf', 'woff2')).toBe('woff2-3da541559918a808c2402bba5012f6c60b27661c')
})
