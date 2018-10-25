# weacast-alert

[![Build Status](https://travis-ci.org/weacast/weacast-alert.png?branch=master)](https://travis-ci.org/weacast/weacast-alert)
[![Code Climate](https://codeclimate.com/github/weacast/weacast-alert/badges/gpa.svg)](https://codeclimate.com/github/weacast/weacast-alert)
[![Test Coverage](https://codeclimate.com/github/weacast/weacast-alert/badges/coverage.svg)](https://codeclimate.com/github/weacast/weacast-alert/coverage)
[![Dependency Status](https://img.shields.io/david/weacast/weacast-alert.svg?style=flat-square)](https://david-dm.org/weacast/weacast-alert)
[![Documentation](https://img.shields.io/badge/documentation-available-brightgreen.svg)](https://weacast.gitbooks.io/weacast-docs/api/)
[![Known Vulnerabilities](https://snyk.io/test/github/weacast/weacast-alert/badge.svg)](https://snyk.io/test/github/weacast/weacast-alert)
[![Download Status](https://img.shields.io/npm/dm/weacast-alert.svg?style=flat-square)](https://www.npmjs.com/package/weacast-alert)

> Forecast alert plugin for Weacast

## Installation

```
npm install weacast-alert --save
// Or with Yarn
yarn add weacast-alert
```

## Documentation

The [Weacast docs](https://weacast.gitbooks.io/weacast-docs/) are loaded with awesome stuff and tell you everything you need to know about using and configuring Weacast. Some details about this plugin can be found [here](https://weacast.gitbooks.io/weacast-docs/api/ALERT.html).

## Complete Example

Here's an example of a Weacast server that uses `weacast-alert`. 

```js
import alertPlugin from 'weacast-alert'

module.exports = function() {
  const app = this
  
  // Set up our plugin services
  app.configure(alertPlugin)
}
```
## Development

While it is a WIP and not yet pushed to NPM, or when developing this plugin, please clone this repository and use [npm link](https://docs.npmjs.com/cli/link):

```bash
// Clone and link the plugin
git clone https://github.com/weacast/weacast-alert.git
cd weacast-alert
npm link
// Clone and link plugin to weacast server
cd ..
git clone https://github.com/weacast/weacast.git
cd weacast
cd api
npm link weacast-alert
```

As this module also depends on [weacast-core](https://github.com/weacast/weacast-core) and [weacast-probe](https://github.com/weacast/weacast-probe) you have to do the same thing for it.

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
