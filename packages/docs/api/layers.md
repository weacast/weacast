# Layers

Weacast includes a set of [Leaflet](http://leafletjs.com/) layers to help visualize forecast data or probe results.

::: warning
In the legacy Weacast [client module](https://github.com/weacast/weacast-client) each layer type implements the [TimeDimension Layer interface](https://github.com/socib/Leaflet.TimeDimension#ltimedimensionlayer). However, Weacast [client module](https://github.com/weacast/weacast-client) will not evolve anymore (see discussion [here](https://github.com/weacast/weacast-client/issues/6)) and will only be maintained for the purpose of our [demo application](https://github.com/weacast/weacast). If you'd like to build client applications using Weacast you'd better have a look to our client API layer in [core module](https://github.com/weacast/weacast-core) and dedicated map engine modules like our [Leaflet plugin](https://github.com/weacast/weacast-leaflet).
:::

## Feature Layers

[Time-stamped GeoJson layers](https://github.com/socib/Leaflet.TimeDimension#ltimedimensionlayergeojson) provide a generic way to visualize [GeoJSON features](https://geojson.org/geojson-spec.html#feature-objects) including temporal evolution. Because [probes](../architecture/data-model-view.md#probe-data-model) and [probe results](../architecture/data-model-view.md#probe-result-data-model) are internally modelled as GeoJSON features they can be used to visualize them. However Weacast does not make any assumption on how you want to visualize these data so you might have to manually process the retrieved probe results in order to add a `time` property on each feature corresponding to the `forecastTime` or the `runTime` for instance.

Using [map mixins](https://github.com/weacast/weacast-docs/blob/master/api/mixins.md#map-mixins) configuration options you can easily customize your probe results visualization to get something like this:

![Weacast feature layer](./../assets/feature-layer.png)

Weacast also provides a convenient [wind barb](http://weather.rap.ucar.edu/info/about_windbarb.html) icon based on [leaflet-windbarb](https://github.com/hulongping/windbarb) that can be used to symbolize wind like this:

![Weacast windbarb layer](./../assets/windbarb-layer.png)

## Forecast Data Layers

Weacast includes a set of [Leaflet](http://leafletjs.com/) layers to manage the temporal evolution of forecast data. Due to the possible large amount of forecast data it is recommanded to load data on-demand, although it is possible to have an internal data cache.

### ForecastLayer [source](https://github.com/weacast/weacast-client/blob/master/src/layers/forecast-layer.js)

Forecast layer interface implemented by all other types of layer, based on [leaflet-timedimension](https://github.com/socib/Leaflet.TimeDimension#ltimedimensionlayer). 

A Weacast layer of type `ClassName` are created like this (where app is the Weacast [client app](./application.md#client) instance):
```javascript
let layer = new L.Weacast.ClassName(app, {
  // Forecast element to be managed
  elements: ['u-wind', 'v-wind'],
  // Attribution
  attribution: 'Forecast data from <a href="http://www.meteofrance.com">Météo-France</a>'
})
```

#### .setForecastModel (model)

Called by the map whenever the current forecast model changes, can be customized by child classes to do whatever required then.

#### .fetchAvailableTimes()

Retrieve the forecast element available forecast times and configure the [TimeDimension](https://github.com/socib/Leaflet.TimeDimension#ltimedimension) object of the map accordingly.

#### .fetchData()

Retrieve the forecast element data for the currently configured time in the [TimeDimension](https://github.com/socib/Leaflet.TimeDimension#ltimedimension) object of the map.

#### .getQuery()

Build the query object to retrieve forecast element data, can be customized by child classes. By default create a query to retrieve data with the currently configured forecast model (i.e. bounds, resolution, etc.) and time in map.

#### .setData(data)

To be implemented by child classes, data contains an array of data array for each configured forecast element in the layer.

### FlowLayer [source](https://github.com/weacast/weacast-client/blob/master/src/layers/flow-layer.js)

To visualize forecast paired element as flow (e.g. wind direction), based on [leaflet-velocity](https://github.com/danwild/leaflet-velocity).

![Weacast flow layer](./../assets/flow-layer.png)

### HeatLayer [source](https://github.com/weacast/weacast-client/blob/master/src/layers/heat-layer.js)

To visualize forecast element scalar values (e.g. temperature) as a heatmap, based on [leaflet-heatmap](https://www.patrick-wied.at/static/heatmapjs/example-heatmap-leaflet.html).

![Weacast heat layer](./../assets/heat-layer.png)

### ColorLayer [source](https://github.com/weacast/weacast-client/blob/master/src/layers/color-layer.js)

> DEPRECATED: use the [ScalarLayer](./layers.md#scalarlayer-source)

To visualize forecast element scalar values (e.g. temperature) as a color image using [color maps](http://gka.github.io/chroma.js/#color-scales), based on [leaflet-canvaslayer-field](https://github.com/IHCantabria/Leaflet.CanvasLayer.Field).

![Weacast color layer](./../assets/color-layer.png)

### ScalarLayer [source](https://github.com/weacast/weacast-client/blob/master/src/layers/scalar-layer.js)

To visualize forecast element scalar values (e.g. temperature) as a structured mesh using [color maps](http://gka.github.io/chroma.js/#color-scales), based on [leaflet-pixi-overlay](https://github.com/manubb/Leaflet.PixiOverlay). It provides 2 ways of rendering the data: 
* As gridded based rendering to visualize the raw data. To each cell of the grid is assigned a data.
![Weacast raw scalar layer](./../assets/scalar-layer-raw.png)
* An interpolated based rendering to visualize the data as color image.
![Weacast interpolated scalar layer](./../assets/scalar-layer-interpolated.png)


