# weacast-gfs

[![Build Status](https://travis-ci.org/weacast/weacast-gfs.png?branch=master)](https://travis-ci.org/weacast/weacast-gfs)
[![Code Climate](https://codeclimate.com/github/weacast/weacast-gfs/badges/gpa.svg)](https://codeclimate.com/github/weacast/weacast-gfs)
[![Test Coverage](https://codeclimate.com/github/weacast/weacast-gfs/badges/coverage.svg)](https://codeclimate.com/github/weacast/weacast-gfs/coverage)
[![Dependency Status](https://img.shields.io/david/weacast/weacast-gfs.svg?style=flat-square)](https://david-dm.org/weacast/weacast-gfs)
[![Download Status](https://img.shields.io/npm/dm/weacast-gfs.svg?style=flat-square)](https://www.npmjs.com/package/weacast-gfs)

> GFS weather forecast model plugin for Weacast

## Installation

```
npm install weacast-gfs --save
// Or with Yarn
yarn add weacast-gfs
```

## Documentation

The [Weacast docs](https://weacast.gitbooks.io/weacast-docs/) are loaded with awesome stuff and tell you everything you need to know about using and configuring Weacast. Some details about this plugin can be found [here](https://weacast.gitbooks.io/weacast-docs/api/PLUGIN.html#gfs).

## Complete Example

Here's an example of a Weacast server that uses `weacast-gfs`. 

```js
import gfsPlugin from 'weacast-gfs'

module.exports = function() {
  const app = this
  
  // Set up our plugin services
  app.configure(gfsPlugin)
}
```
## Development

While it is a WIP and not yet pushed to NPM, or when developing this plugin, please clone this repository and use [npm link](https://docs.npmjs.com/cli/link):

```bash
// Clone and link the plugin
git clone https://github.com/weacast/weacast-gfs.git
cd weacast-gfs
npm link
// Clone and link plugin to weacast server
cd ..
git clone https://github.com/weacast/weacast.git
cd weacast
cd api
npm link weacast-gfs
```

As this module also depends on [weacast-core](https://github.com/weacast/weacast-core) and [grib2json](https://github.com/weacast/grib2json) you have to do the same thing for them.

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
