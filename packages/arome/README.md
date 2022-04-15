# @weacast/arome

[![Build Status](https://app.travis-ci.com/weacast/weacast.svg?branch=master)](https://app.travis-ci.com/weacast/weacast)
[![Documentation](https://img.shields.io/badge/documentation-available-brightgreen.svg)](https://weacast.github.io/weacast-docs/)
[![Download Status](https://img.shields.io/npm/dm/weacast-arome.svg?style=flat-square)](https://www.npmjs.com/package/weacast-arome)

> AROME weather forecast model plugin for Weacast

## Installation

```
npm install weacast-arome --save
// Or with Yarn
yarn add weacast-arome
```

## Documentation

The [Weacast docs](https://weacast.github.io/weacast-docs/) are loaded with awesome stuff and tell you everything you need to know about using and configuring Weacast. Some details about this plugin can be found [here](https://weacast.gitbooks.io/weacast-docs/api/PLUGIN.html#arome).

## Complete Example

Here's an example of a Weacast server that uses `weacast-arome`. 

```js
import aromePlugin from 'weacast-arome'

module.exports = function() {
  const app = this

  // Set up our plugin services
  app.configure(aromePlugin)
}
```
## Development

While it is a WIP and not yet pushed to NPM, or when developing this plugin, please clone this repository and use [npm link](https://docs.npmjs.com/cli/link):

```bash
// Clone and link the plugin
git clone https://github.com/weacast/weacast-arome.git
cd weacast-arome
npm link
// Clone and link plugin to weacast server
cd ..
git clone https://github.com/weacast/weacast.git
cd weacast
cd api
npm link weacast-arome
```

As this module also depends on [weacast-core](https://github.com/weacast/weacast-core), [weacast-arpege](https://github.com/weacast/weacast-arpege) and [gtiff2json](https://github.com/weacast/gtiff2json) you have to do the same thing for them.

## License

Copyright (c) 2022

Licensed under the [MIT license](LICENSE).
