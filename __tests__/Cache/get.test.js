'use strict'

const Cache = require('../../src/Cache')

jest.mock('fs')

test('Should load from cache if exists', () => {
  expect(Cache.get('keep', 'utf8')).toBe('asdf')
})

test('Should not load from cache, when file doesn\'t exist', () => {
  expect(Cache.get('lose', 'utf8')).toBe(undefined)
})
