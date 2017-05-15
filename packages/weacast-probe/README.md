# weacast-probe

[![Build Status](https://travis-ci.org/weacast/weacast-probe.png?branch=master)](https://travis-ci.org/weacast/weacast-probe)
[![Code Climate](https://codeclimate.com/github/weacast/weacast-probe/badges/gpa.svg)](https://codeclimate.com/github/weacast/weacast-probe)
[![Test Coverage](https://codeclimate.com/github/weacast/weacast-probe/badges/coverage.svg)](https://codeclimate.com/github/weacast/weacast-probe/coverage)
[![Dependency Status](https://img.shields.io/david/weacast/weacast-probe.svg?style=flat-square)](https://david-dm.org/weacast/weacast-probe)
[![Download Status](https://img.shields.io/npm/dm/weacast-probe.svg?style=flat-square)](https://www.npmjs.com/package/weacast-probe)

> Probing forecast model plugin for Weacast

## Installation

```
npm install weacast-probe --save
// Or with Yarn
yarn add weacast-probe
```

## Complete Example

Here's an example of a Weacast server that uses `weacast-probe`. 

```js
import probePlugin from 'weacast-probe'

module.exports = function() {
  const app = this
  
  // Set up our plugin services
  app.configure(probePlugin)
}
```
## Development

While it is a WIP and not yet pushed to NPM, or when developing this plugin, please clone this repository and use [npm link](https://docs.npmjs.com/cli/link):

```bash
// Clone and link the plugin
git clone https://github.com/weacast/weacast-probe.git
cd weacast-probe
npm link
// Clone and link plugin to weacast server
cd ..
git clone https://github.com/weacast/weacast.git
cd weacast
cd api
npm link weacast-probe
```

As this module also depends on [weacast-core](https://github.com/weacast/weacast-core) you have to do the same thing for it.

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
