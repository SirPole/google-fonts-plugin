# Google Fonts Plugin

[![GitHub license](https://img.shields.io/github/license/SirPole/google-fonts-plugin.svg)](https://github.com/SirPole/google-fonts-plugin/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/google-fonts-plugin.svg)](https://www.npmjs.com/package/google-fonts-plugin)
[![CircleCI](https://img.shields.io/circleci/project/github/SirPole/google-fonts-plugin.svg)](https://circleci.com/gh/SirPole/google-fonts-plugin/tree/master)
[![Codecov](https://img.shields.io/codecov/c/github/sirpole/google-fonts-plugin.svg)](https://codecov.io/gh/SirPole/google-fonts-plugin)


[Webpack](https://webpack.js.org/) plugin that downloads fonts from [Google Fonts](https://fonts.google.com/) and encodes them to base64.

Supports various font formats, currently `eot`, `ttf`, `woff` and `woff2`.

Exports to format specific and minified css files, which you can serve to your clients.

> **Note**: Current version works with Webpack 4. For webpack 3, use version **1.0.3**

## Install
``` bash
npm i -D google-fonts-plugin
```

## Usage
###### webpack.config.js
``` javascript
const GoogleFontsPlugin = require('google-fonts-plugin')

module.exports = {
  plugins: {
    new GoogleFontsPlugin({
        /* options */
    })
  }
}
```

###### webpack.config.js
``` javascript
const GoogleFontsPlugin = require('google-fonts-plugin')

module.exports = {
  plugins: {
    new GoogleFontsPlugin('path/to/config.json')
  }
}
```

## Options
Plugin supports configuration in javascript object, json or [neon](https://ne-on.org/) file and also in your package.json.

| **Name**    | **Type**   | **Default**           | **Description**                                                                  |
|-------------|------------|-----------------------|----------------------------------------------------------------------------------|
| fonts       | `Font[]`   | Roboto                | Defines which fonts and it's variants and subsets to download                    |
| formats     | `String[]` | eot, ttf, woff, woff2 | Specifies which formats to download                                              |
| encode      | `Boolean`  | true                  | Whether should encode to base64                                                  |
| cache       | `Boolean`  | true                  | Whether FS caching should be checked before sending requests                     |
| fontDisplay | `String`   | swap                  | When `encode` if false, this will add font-display property. Disables when empty |

##### Font object

| **Name** | **Type**   | **Default**          | **Description**                                                                                          |
|----------|------------|----------------------|----------------------------------------------------------------------------------------------------------|
| family   | `String`   | Roboto               | Sets the font family                                                                                     |
| variants | `String[]` | 400, 400i, 700, 700i | Sets the variants of the font family to download, note that not all fonts have all the possible variants |
| subsets  | `String[]` | latin-ext            | Sets the subsets, note that not all fants are available in all subsets                                   |

## Example configuration
###### config.json
``` json
{
	"google-fonts-plugin": {
		"fonts": [
			{
				"family": "Roboto",
				"variants": [
					"400",
					"400i",
					"700",
					"700i"
				],
				"subsets": [
					"latin-ext"
				]
			}
		],
		"formats": [
			"woff",
			"woff2"
		]
	}
}
```

###### config.neon
``` neon
google-fonts-plugin:
	fonts: 
		- 
			family: Roboto
			variants:
				- 400
				- 400i
				- 700
				- 700i
			subsets:
				- latin-ext
	formats: 
		- woff
		- woff2
```

> **Note**: For Google's material icons, simply set `Material Icons` as font-family
