import Options from './Options'

test('Can initialize with default options', (): void => {
  const options = new Options()
  expect(options.get()).toEqual(new Options('', false).get())
})

test('Can overwrite default options object', (): void => {
  const options = new Options(
    {
      fonts: [],
      formats: [],
      chunkName: '',
      encode: false,
      fontDisplay: '',
      cache: false,
      filename: ''
    },
    false
  )
  expect(options.get()).toEqual({
    fonts: [],
    formats: [],
    chunkName: '',
    encode: false,
    fontDisplay: '',
    cache: false,
    filename: ''
  })
})

test('Can load configuration from json file', (): void => {
  const options = new Options('src/__mocks__/options.json', false)
  expect(options.get()).toEqual({
    fonts: [],
    formats: [],
    chunkName: '',
    encode: false,
    fontDisplay: '',
    cache: false,
    filename: ''
  })
})

test('Can load nested configuration from json file', (): void => {
  const options = new Options('src/__mocks__/optionsNested.json', false)
  expect(options.get()).toEqual({
    fonts: [],
    formats: [],
    chunkName: '',
    encode: false,
    fontDisplay: '',
    cache: false,
    filename: ''
  })
})

test('Can load nested configuration from json file while not being the first', (): void => {
  const options = new Options('src/__mocks__/optionsNestedButNotFirst.json', false)
  expect(options.get()).toEqual({
    fonts: [],
    formats: [],
    chunkName: '',
    encode: false,
    fontDisplay: '',
    cache: false,
    filename: ''
  })
})

test("Will fallback to default options if it's not present in json file", (): void => {
  const options = new Options('src/__mocks__/optionsMissing.json', false)
  expect(options.get()).toEqual(new Options('', false).get())
})
