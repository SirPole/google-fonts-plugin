'use strict'

const { resolve } = require('path')
const Cache = require('../../src/Cache')

jest.mock('fs')

test('Should save to cache', () => {
  expect(Cache.save('asdf', '', 'utf8')).toEqual({
    file: resolve(process.cwd(), 'node_modules', '.cache', Cache.pluginName, 'asdf'),
    content: ''
  })
})
