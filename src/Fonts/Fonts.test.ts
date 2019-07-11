import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import Fonts from './Fonts'
import Options from '../Options/Options'

const mock = new AxiosMockAdapter(axios)

test('Creates request url with default settings', (): void => {
  const fonts = new Fonts()
  expect(fonts.createRequestUrls()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin,latin-ext',
  ])
})

test('Does not create request url with empty settings', (): void => {
  const options = new Options({ fonts: [] })
  const fonts = new Fonts()
  console.log(options)
  expect(fonts.createRequestUrls()).toEqual(undefined)
})

test('Does not create request strong from missing family', (): void => {
  const fonts = new Fonts(
    new Options({
      fonts: [
        {
          family: '',
        },
      ],
    })
  )
  expect(fonts.createRequestUrls()).toEqual([undefined])
})

test('Does create request url with 1 variant', (): void => {
  const fonts = new Fonts(
    new Options({
      fonts: [
        {
          family: 'Roboto',
          variants: ['400'],
        },
      ],
    })
  )
  expect(fonts.createRequestUrls()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto:400',
  ])
})

test('Does create request url with multiple variants', (): void => {
  const fonts = new Fonts(
    new Options({
      fonts: [
        {
          family: 'Roboto',
          variants: ['400', '700', '900'],
        },
      ],
    })
  )
  expect(fonts.createRequestUrls()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto:400,700,900',
  ])
})

test('Does create request url with 1 subset', (): void => {
  const fonts = new Fonts(
    new Options({
      fonts: [
        {
          family: 'Roboto',
          subsets: ['latin-ext'],
        },
      ],
    })
  )
  expect(fonts.createRequestUrls()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto&subset=latin-ext',
  ])
})

test('Does create request url with multiple subsets', (): void => {
  const fonts = new Fonts(
    new Options({
      fonts: [
        {
          family: 'Roboto',
          subsets: ['greek-ext', 'latin-ext', 'vietnamese'],
        },
      ],
    })
  )
  expect(fonts.createRequestUrls()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto&subset=greek-ext,latin-ext,vietnamese',
  ])
})

test('Does create request url with text specified and ignores subsets', (): void => {
  const fonts = new Fonts(
    new Options({
      fonts: [
        {
          family: 'Roboto',
          subsets: ['greek-ext', 'latin-ext', 'vietnamese'],
          text: 'asdf',
        },
      ],
    })
  )
  expect(fonts.createRequestUrls()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto&text=asdf',
  ])
})

test('Does create request url with text specified', (): void => {
  const fonts = new Fonts(
    new Options({
      fonts: [
        {
          family: 'Roboto',
          text: 'asdf',
        },
      ],
    })
  )
  expect(fonts.createRequestUrls()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto&text=asdf',
  ])
})

test('Does create request url without font-display with encoding enabled', (): void => {
  const fonts = new Fonts(
    new Options({
      fonts: [
        {
          family: 'Roboto',
        },
      ],
      encode: true,
      fontDisplay: 'swap',
    })
  )
  expect(fonts.createRequestUrls()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto',
  ])
})

test('Does create request url with font-display when encoding is disabled', (): void => {
  const fonts = new Fonts(
    new Options({
      fonts: [
        {
          family: 'Roboto',
        },
      ],
      encode: false,
      fontDisplay: 'swap',
    })
  )
  expect(fonts.createRequestUrls()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto&display=swap',
  ])
})

test('Does create request url with custom font-display when encoding is disabled', (): void => {
  const fonts = new Fonts(
    new Options({
      fonts: [
        {
          family: 'Roboto',
        },
      ],
      encode: false,
      fontDisplay: 'asdf',
    })
  )
  expect(fonts.createRequestUrls()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto&display=asdf',
  ])
})

test('Does create multiple request urls', (): void => {
  const fonts = new Fonts(
    new Options({
      fonts: [
        {
          family: 'Roboto',
          variants: ['400', '700', '900'],
          subsets: ['greek-ext', 'latin-ext', 'vietnamese'],
        },
        {
          family: 'Open Sans',
          variants: ['400', '700', '900'],
          subsets: ['greek-ext', 'latin-ext', 'vietnamese'],
        },
      ],
    })
  )
  expect(fonts.createRequestUrls()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto:400,700,900&subset=greek-ext,latin-ext,vietnamese',
    'https://fonts.googleapis.com/css?family=Open+Sans:400,700,900&subset=greek-ext,latin-ext,vietnamese',
  ])
})

test('Should replace urls with encoded fonts', async (): Promise<void> => {
  const fonts = new Fonts()
  mock
    .onGet(
      'https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2'
    )
    .reply(200, 'asdf')
  mock
    .onGet(
      'https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2'
    )
    .reply(200, 'fdsa')
  await expect(
    fonts.encode(
      '@font-face {\n' +
        "  font-family: 'Roboto';\n" +
        '  font-style: normal;\n' +
        '  font-weight: 400;\n' +
        "  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2) format('woff2');\n" +
        '}\n' +
        '@font-face {\n' +
        "  font-family: 'Roboto';\n" +
        '  font-style: normal;\n' +
        '  font-weight: 700;\n' +
        "  src: local('Roboto Bold'), local('Roboto-Bold'), url(https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2) format('woff2');\n" +
        '}\n'
    )
  ).resolves.toBe(
    '@font-face {\n' +
      "  font-family: 'Roboto';\n" +
      '  font-style: normal;\n' +
      '  font-weight: 400;\n' +
      "  src: local('Roboto'), local('Roboto-Regular'), url(\"data:application/x-font-woff2;base64,YXNkZg==\") format('woff2');\n" +
      '}\n' +
      '@font-face {\n' +
      "  font-family: 'Roboto';\n" +
      '  font-style: normal;\n' +
      '  font-weight: 700;\n' +
      "  src: local('Roboto Bold'), local('Roboto-Bold'), url(\"data:application/x-font-woff2;base64,ZmRzYQ==\") format('woff2');\n" +
      '}\n'
  )
})

test('Should keep as is', async (): Promise<void> => {
  const fonts = new Fonts(
    new Options({
      encode: false,
    })
  )
  mock
    .onGet(
      'https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2'
    )
    .reply(200, 'asdf')
  mock
    .onGet(
      'https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2'
    )
    .reply(200, 'fdsa')
  await expect(
    fonts.encode(
      '@font-face {\n' +
        "  font-family: 'Roboto';\n" +
        '  font-style: normal;\n' +
        '  font-weight: 400;\n' +
        "  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2) format('woff2');\n" +
        '}\n' +
        '@font-face {\n' +
        "  font-family: 'Roboto';\n" +
        '  font-style: normal;\n' +
        '  font-weight: 700;\n' +
        "  src: local('Roboto Bold'), local('Roboto-Bold'), url(https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2) format('woff2');\n" +
        '}\n'
    )
  ).resolves.toBe(
    '@font-face {\n' +
      "  font-family: 'Roboto';\n" +
      '  font-style: normal;\n' +
      '  font-weight: 400;\n' +
      "  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2) format('woff2');\n" +
      '}\n' +
      '@font-face {\n' +
      "  font-family: 'Roboto';\n" +
      '  font-style: normal;\n' +
      '  font-weight: 700;\n' +
      "  src: local('Roboto Bold'), local('Roboto-Bold'), url(https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2) format('woff2');\n" +
      '}\n'
  )
})

test('Should encode font file to base64', async (): Promise<void> => {
  const fonts = new Fonts()
  mock
    .onGet(
      'https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2'
    )
    .reply(200, 'asdf')
  await expect(
    fonts.requestFontFile(
      'https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2'
    )
  ).resolves.toBe('"data:application/x-font-woff2;base64,YXNkZg=="')
})

test('Should encode array of font files to base64', async (): Promise<void> => {
  const fonts = new Fonts()
  mock
    .onGet(
      'https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2'
    )
    .reply(200, 'asdf')
  mock
    .onGet(
      'https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2'
    )
    .reply(200, 'fdsa')
  await expect(
    fonts.requestFontFiles([
      'https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2',
      'https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2',
    ])
  ).resolves.toEqual([
    '"data:application/x-font-woff2;base64,YXNkZg=="',
    '"data:application/x-font-woff2;base64,ZmRzYQ=="',
  ])
})

test('Should ignore already encoded files', async (): Promise<void> => {
  const fonts = new Fonts()
  await expect(
    fonts.requestFontFiles([
      '"data:application/x-font-woff2;base64,YXNkZg=="',
      '"data:application/x-font-woff2;base64,ZmRzYQ=="',
    ])
  ).resolves.toEqual([
    '"data:application/x-font-woff2;base64,YXNkZg=="',
    '"data:application/x-font-woff2;base64,ZmRzYQ=="',
  ])
})

test('Should get desired font', async (): Promise<void> => {
  const fonts = new Fonts()
  mock
    .onGet(
      'https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin,latin-ext'
    )
    .reply(
      200,
      '@font-face {\n' +
        "  font-family: 'Roboto';\n" +
        '  font-style: normal;\n' +
        '  font-weight: 400;\n' +
        "  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2) format('woff2');\n" +
        '}\n' +
        '@font-face {\n' +
        "  font-family: 'Roboto';\n" +
        '  font-style: normal;\n' +
        '  font-weight: 700;\n' +
        "  src: local('Roboto Bold'), local('Roboto-Bold'), url(https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2) format('woff2');\n" +
        '}\n' +
        '@font-face {\n' +
        "  font-family: 'Roboto';\n" +
        '  font-style: italic;\n' +
        '  font-weight: 400;\n' +
        "  src: local('Roboto Italic'), local('Roboto-Italic'), url(https://fonts.gstatic.com/s/roboto/v16/vSzulfKSK0LLjjfeaxcREvesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n" +
        '}\n' +
        '@font-face {\n' +
        "  font-family: 'Roboto';\n" +
        '  font-style: italic;\n' +
        '  font-weight: 700;\n' +
        "  src: local('Roboto Bold Italic'), local('Roboto-BoldItalic'), url(https://fonts.gstatic.com/s/roboto/v16/t6Nd4cfPRhZP44Q5QAjcC6g5eI2G47JWe0-AuFtD150.woff2) format('woff2');\n" +
        '}\n'
    )
  await expect(fonts.requestFontsCSS('woff2')).resolves.toMatch(
    /Roboto Bold Italic.*\.woff2/
  )
})

test('Should get one font css', async (): Promise<void> => {
  const fonts = new Fonts()
  mock
    .onGet(
      'https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin,latin-ext'
    )
    .reply(
      200,
      '@font-face {\n' +
        "  font-family: 'Roboto';\n" +
        '  font-style: normal;\n' +
        '  font-weight: 400;\n' +
        "  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2) format('woff2');\n" +
        '}\n' +
        '@font-face {\n' +
        "  font-family: 'Roboto';\n" +
        '  font-style: normal;\n' +
        '  font-weight: 700;\n' +
        "  src: local('Roboto Bold'), local('Roboto-Bold'), url(https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2) format('woff2');\n" +
        '}\n' +
        '@font-face {\n' +
        "  font-family: 'Roboto';\n" +
        '  font-style: italic;\n' +
        '  font-weight: 400;\n' +
        "  src: local('Roboto Italic'), local('Roboto-Italic'), url(https://fonts.gstatic.com/s/roboto/v16/vSzulfKSK0LLjjfeaxcREvesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n" +
        '}\n' +
        '@font-face {\n' +
        "  font-family: 'Roboto';\n" +
        '  font-style: italic;\n' +
        '  font-weight: 700;\n' +
        "  src: local('Roboto Bold Italic'), local('Roboto-BoldItalic'), url(https://fonts.gstatic.com/s/roboto/v16/t6Nd4cfPRhZP44Q5QAjcC6g5eI2G47JWe0-AuFtD150.woff2) format('woff2');\n" +
        '}\n'
    )
  await expect(
    fonts.requestFont(
      'https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin,latin-ext',
      'woff2',
      'utf8'
    )
  ).resolves.toMatch(/Roboto Bold Italic.*\.woff2/)
})
