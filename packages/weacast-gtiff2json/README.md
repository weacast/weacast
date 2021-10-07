# weacast-gtiff2json

[![Build Status](https://app.travis-ci.com/weacast/weacast-gtiff2json.svg?branch=master)](https://app.travis-ci.com/weacast/weacast-gtiff2json)
[![Code Climate](https://codeclimate.com/github/weacast/weacast-gtiff2json/badges/gpa.svg)](https://codeclimate.com/github/weacast/weacast-gtiff2json)
[![Test Coverage](https://codeclimate.com/github/weacast/weacast-gtiff2json/badges/coverage.svg)](https://codeclimate.com/github/weacast/weacast-gtiff2json/coverage)
[![Dependency Status](https://img.shields.io/david/weacast/weacast-gtiff2json.svg?style=flat-square)](https://david-dm.org/weacast/weacast-gtiff2json)
[![Download Status](https://img.shields.io/npm/dm/weacast-gtiff2json.svg?style=flat-square)](https://www.npmjs.com/package/weacast-gtiff2json)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fweacast%2Fweacast-gtiff2json.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fweacast%2Fweacast-gtiff2json?ref=badge_shield)

A command line utility that decodes [GeoTIFF](https://en.wikipedia.org/wiki/GeoTIFF) files as JSON.

This utility uses the native [GDAL](http://www.gdal.org/) binding for [Node.js](http://nodejs.org) : [node-gdal](https://github.com/naturalatlas/node-gdal).

This work is highly inspired from [geotiff2json](https://github.com/avgp/geotiff2json) but extends it to support:
* simple JSON conversion without RLE encoding
* any block size in TIFF files (not just squares)

## Usage

Here's an example that converts `file.tif` into a JSON array and writes it to disk as `data.json`:

```javascript
    var geotiff2json = require('weacast-gtiff2json'),
    fs = require('fs')
    
    geotiff2json('file.tif').then(function(data) {
      fs.writeFile('data.json', JSON.stringify(data), function(err) {
        if(err) {
          console.error('Oh no, writing failed!', err)
          return
        }
    })
```

Here's an example that converts `file.tif` into an RLE value array and writes it to disk as `data.json`:

```javascript
    var geotiff2json = require('weacast-gtiff2json'),
    fs = require('fs')
    
    geotiff2json('file.tif', true).then(function(data) {
      fs.writeFile('data.json', JSON.stringify(points), function(err) {
        if(err) {
          console.error('Oh no, writing failed!', err)
          return
        }
        console.log('wrote ' + (data.length / 2) + ' tuples into file.')
    })
```

The output file's content will look similar to this:

```json
    [
      100,10,
      132,1,
      80,5,
      ...
    ]
```
Note: The linebreaks and whitespace have been added for better readability, the file won't contain those to reduce size.

These values are in fact value pairs. 
* The first value of each pair is the y-coordinate of the point.
* The second value of each pair is the number of times this y-coordinate is repeated.

So in the example above, the y-value `100` shall be repeated `10` times, the y-value `132` shall be repeated once and so on..

## Contribute

If you find a bug or a problem or data that doesn't parse correctly, even though it should, please [report an issue here](https://github.com/weacast/weacast-gtiff2json/issues/new).

In case you found a GeoTIFF that doesn't parse correctly, please attach a link to the file or attach it to the issue directly.

If you have improvement suggestions, feel free to fork this repository and submit a pull request.

Thank you for your help and support.

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).



[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fweacast%2Fweacast-gtiff2json.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fweacast%2Fweacast-gtiff2json?ref=badge_large)
