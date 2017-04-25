# weacast-arpege

[![Build Status](https://travis-ci.org/weacast/weacast-arpege.png?branch=master)](https://travis-ci.org/weacast/weacast-arpege)
[![Code Climate](https://codeclimate.com/github/weacast/weacast-arpege/badges/gpa.svg)](https://codeclimate.com/github/weacast/weacast-arpege)
[![Test Coverage](https://codeclimate.com/github/weacast/weacast-arpege/badges/coverage.svg)](https://codeclimate.com/github/weacast/weacast-arpege/coverage)
[![Dependency Status](https://img.shields.io/david/weacast/weacast-arpege.svg?style=flat-square)](https://david-dm.org/weacast/weacast-arpege)
[![Download Status](https://img.shields.io/npm/dm/weacast-arpege.svg?style=flat-square)](https://www.npmjs.com/package/weacast-arpege)

> ARPEGE weather forecast model plugin for Weacast

**While it is a WIP and not yet pushed to NPM please clone this repository and use [npm link](https://docs.npmjs.com/cli/link).**
## Installation

```
npm install weacast-arpege --save
```

## Complete Example

Here's an example of a Weacast server that uses `weacast-arpege`. 

```js
import createService from '../service'
import arpegePlugin from 'weacast-arpege'

module.exports = function() {
  const app = this

  const users = createService('users', app)
  const forecasts = createService('forecasts', app)

  // Set up our plugin services
  app.configure(arpegePlugin)
}
```

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
