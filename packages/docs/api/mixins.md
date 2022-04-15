# Mixins

[Mixins](https://vuejs.org/v2/guide/mixins.html) are a flexible way to distribute reusable functionalities for [Vue components](https://vuejs.org/v2/guide/components.html). A mixin object can contain any component options. When a component uses a mixin, all options in the mixin will be "mixed" into the component's own options.

::: warning
Mixins are only part of the legacy Weacast [client module](https://github.com/weacast/weacast-client), which will not evolve anymore (see discussion [here](https://github.com/weacast/weacast-client/issues/6)) and will only be maintained for the purpose of our [demo application](https://github.com/weacast/weacast). If you'd like to build client applications using Weacast you'd better have a look to our client API layer in [core module](https://github.com/weacast/weacast-core) and build your own map component using dedicated map engine modules like our [Leaflet plugin](https://github.com/weacast/weacast-leaflet).
:::

## Map mixins

A Weacast map is based on a [Leaflet](http://leafletjs.com/) map object.

This set of mixins is to be used to construct a new Weacast Map component and underlying Leaflet objects:
* **Mandatory** [Base](https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.base.js) mixin simply initialize the underlying Leaflet map object and registered controls by other mixins
* [Base layers](https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.base-layers.js) adds a base layer selector on the map using [Leaflet.Basemaps](https://github.com/consbio/Leaflet.Basemaps)
* [Forecast layers](https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.forecast-layers.js) adds a configured set of forecast layers to the map
* [File layers](https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.file-layers.js) adds a file-based layer (GeoJSON or KML) uploader to the map using [Leaflet.Basemaps](https://github.com/consbio/Leaflet.Basemaps)
  * it will use the configured GeoJson style of the GeoJson layers mixin or you will have to implement a **getGeoJsonOptions()** method in your map component
* [GeoJson layers](https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.geojson-layers.js) adds methods to ease [GeoJson](http://leafletjs.com/reference-1.0.3.html#geojson) and [timestamped GeoJson](./LAYERS#feature-layers) layers addition to the map
  * it will use the statically configured GeoJson style or you can implement the following methods on your map component to have dynamic styling of your features:
    * **getFeaturePopup(feature, layer)** to provide an HTML [popup content](http://leafletjs.com/reference-1.1.0.html#popup) to bind
    * **getFeatureTooltip(feature, layer)** to provide a [tooltip content](http://leafletjs.com/reference-1.1.0.html#tooltip) to bind
    * **getFeatureStyle(feature)** to provide a [style object](http://leafletjs.com/reference-1.1.0.html#path-option) for your line/polygon features
    * **getPointMarker(feature, latlng)** to provide a [marker object](http://leafletjs.com/reference-1.1.0.html#marker) for your point features
* [Scalebar](https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.scalebar.js) adds a [scalebar](http://leafletjs.com/reference-1.0.3.html#control-scale) on the map
* [Measure](https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.measure.js) adds a measure control on the map using [Leaflet.Measure](https://github.com/ljagis/leaflet-measure)
* [Fullscreen](https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.fullscreen.js) adds a fullscreen control on the map using [Leaflet.Fullscreen](https://github.com/Leaflet/Leaflet.fullscreen)
* [Legend](https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.legend.js) adds a legend control on the map using [Leaflet.Legend](https://github.com/mikeskaug/Leaflet.Legend), **the legend is attached to the last forecast layer that has been made visible**

A Weacast map relies on a configuration object detailing mixins to be used with their options like this:

```javascript
module.exports = {
  ...
map: {
    // Mixins to be applied to map
    mixins: [ 'base', 'baseLayers', 'forecastLayers', 'geojsonLayers', 'fileLayers', 'fullscreen', 'measure', 'scalebar', 'legend' ],
    // Config for Base Layers mixin
    baseLayers: [
      {
        type: 'tileLayer',
        arguments: [
          'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
          {
            maxZoom: 20,
            label: 'Streets',
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          }
        ]
      },
      ...
    ],
    // Config for Forecast Layers mixin
    forecastLayers: [
      {
        type: 'FlowLayer',
        options: {
          elements: ['u-wind', 'v-wind'],
          attribution: 'Forecast data from <a href="http://www.meteofrance.com">Météo-France</a>',
        }
      },
      ...
    ],
    // Default GeoJSON layer style for polygons/lines in File Layers mixin
    featureStyle: {
      opacity: 1,
      radius: 6,
      color: 'red',
      fillOpacity: 0.5,
      fillColor: 'green',
      popup: {
        excludedProperties: ['wikipedia']
      }
    },
    // Default GeoJSON layer style for points in File Layers mixin
    pointStyle: {
      type: 'circleMarker',
      options: {
        opacity: 1,
        color: 'red',
        fillOpacity: 0.5,
        fillColor: 'green'
      }
    }
  }
...
```
