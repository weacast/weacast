# weacast-arpege

[![Build Status](https://travis-ci.org/weacast/weacast-arpege.png?branch=master)](https://travis-ci.org/weacast/weacast-arpege)
[![Code Climate](https://codeclimate.com/github/weacast/weacast-arpege/badges/gpa.svg)](https://codeclimate.com/github/weacast/weacast-arpege)
[![Test Coverage](https://codeclimate.com/github/weacast/weacast-arpege/badges/coverage.svg)](https://codeclimate.com/github/weacast/weacast-arpege/coverage)
[![Dependency Status](https://img.shields.io/david/weacast/weacast-arpege.svg?style=flat-square)](https://david-dm.org/weacast/weacast-arpege)
[![Download Status](https://img.shields.io/npm/dm/weacast-arpege.svg?style=flat-square)](https://www.npmjs.com/package/weacast-arpege)

> ARPEGE weather forecast model plugin for Weacast

## Installation

```
npm install weacast-arpege --save
```

## Documentation

Please refer to the [weacast-arpege documentation](http://docs.feathersjs.com/) for more details.

## Complete Example

Here's an example of a Feathers server that uses `weacast-arpege`. 

```js
const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const plugin = require('weacast-arpege');

// Initialize the application
const app = feathers()
  .configure(rest())
  .configure(hooks())
  // Needed for parsing bodies (login)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // Initialize your feathers plugin
  .use('/plugin', plugin())
  .use(errorHandler());

app.listen(3030);

console.log('Feathers app started on 127.0.0.1:3030');
```

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
