'use strict'

import Options from '../../src/Options'

test('Can initialize with default options', () => {
  const options = new Options()
  expect(options.get()).toEqual(Options.defaultOptions)
})

test('Can overwrite default options object', () => {
  const options = new Options({
    fonts: [],
    formats: [],
    formatAgents: {},
    chunkName: '',
    encode: false,
    fontDisplay: '',
    cache: false,
    filename: ''
  })
  expect(options.get()).toEqual({
    fonts: [],
    formats: [],
    formatAgents: {},
    chunkName: '',
    encode: false,
    fontDisplay: '',
    cache: false,
    filename: ''
  })
})

test('Can load configuration from json file', () => {
  const options = new Options('__mocks__/options.json')
  expect(options.get()).toEqual({
    fonts: [],
    formats: [],
    formatAgents: {},
    chunkName: '',
    encode: false,
    fontDisplay: '',
    cache: false,
    filename: ''
  })
})

test('Can load nested configuration from json file', () => {
  const options = new Options('__mocks__/optionsNested.json')
  expect(options.get()).toEqual({
    fonts: [],
    formats: [],
    formatAgents: {},
    chunkName: '',
    encode: false,
    fontDisplay: '',
    cache: false,
    filename: ''
  })
})

test('Can load nested configuration from json file while not being the first', () => {
  const options = new Options('__mocks__/optionsNestedButNotFirst.json')
  expect(options.get()).toEqual({
    fonts: [],
    formats: [],
    formatAgents: {},
    chunkName: '',
    encode: false,
    fontDisplay: '',
    cache: false,
    filename: ''
  })
})

test('Will fallback to default options if it\'s not present in json file', () => {
  const options = new Options('__mocks__/optionsMissing.json')
  expect(options.get()).toEqual(Options.defaultOptions)
})

test('Can load configuration from neon file', () => {
  const options = new Options('__mocks__/options.neon')
  expect(options.get()).toEqual({
    fonts: {},
    formats: {},
    formatAgents: {},
    chunkName: '',
    encode: false,
    fontDisplay: '',
    cache: false,
    filename: ''
  })
})

test('Can load configuration from nested neon file', () => {
  const options = new Options('__mocks__/optionsNested.neon')
  expect(options.get()).toEqual({
    fonts: {},
    formats: {},
    formatAgents: {},
    chunkName: '',
    encode: false,
    fontDisplay: '',
    cache: false,
    filename: ''
  })
})

test('Can load nested configuration from json file while not being the first', () => {
  const options = new Options('__mocks__/optionsNestedButNotFirst.neon')
  expect(options.get()).toEqual({
    fonts: {},
    formats: {},
    formatAgents: {},
    chunkName: '',
    encode: false,
    fontDisplay: '',
    cache: false,
    filename: ''
  })
})

test('Will fallback to default options if it\'s not present in neon file', () => {
  const options = new Options('__mocks__/optionsMissing.neon')
  expect(options.get()).toEqual(Options.defaultOptions)
})
