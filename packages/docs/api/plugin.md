# Forecast model plugins

## [ARPEGE](http://www.umr-cnrm.fr/spip.php?article121&lang=en)

This [plugin](https://github.com/weacast/weacast-arpege) allows to gather data from the global numerical weather prediction model ARPEGE (Action de Recherche Petite Echelle Grande Echelle), which is an essential tool for operational weather forecasting at Météo France. Four daily forecasts are made at 0, 6, 12 and 18h UTC, with forecasting time of 102h, 72h, 114h and 60h respectively. ARPEGE forecasts are used as lateral boundary conditions for the high resolution AROME and ALADIN limited area models. Model forecasts are interpolated on a five horizontal regular lat/lon grids, with one 0.1°x0.1° grid over the Europe-Atlantic domain and one 0.5°x0.5° grid over the Earth, and on several vertical level types (pressure, height, isoPV, etc).

Data are downloaded using the [INSPIRE services](https://donneespubliques.meteofrance.fr/client/gfx/utilisateur/File/documentation-webservices-inspire-en.pdf) of Météo France, and more specifically the [WCS](https://en.wikipedia.org/wiki/Web_Coverage_Service) interface generating data in the [GeoTIFF](https://en.wikipedia.org/wiki/GeoTIFF) file format then processed using the [weacast-gtiff2json](https://github.com/weacast/weacast-gtiff2json) tool.

This plugin adds the following attributes to the [common Forecast data model](../architecture/data-model-view.md#forecast-data-model):
* **token**: the provider API token (see below)
* **wcsBaseUrl**: the URL of the WCS service providing forecast data
* **elements**:
  * **coverageid**: the name of the WCS coverage for the forecast element
  * **subsets**: a map of entries/values to subset the forecast domain (e.g. height) until the request results in a [2D grid](./grid.md).

::: tip
The `time` subset entry is automatically added by Weacast to retrieve data only for the considered forecast time
:::

## [AROME](http://www.umr-cnrm.fr/spip.php?article120)

This [plugin](https://github.com/weacast/weacast-arome) allows to gather data from the AROME small scale numerical prediction model, operational at Météo-France since December 2008, which was designed to improve short range forecasts of severe events such as intense Mediterranean precipitations (Cévenole events), severe storms, fog, urban heat during heat waves. Five daily forecasts are made with AROME, thus helping to better predict meteorological events of the day and of the morrow (42h forecast range). The size of the mesh, many time smaller than previous models, is 1.3km against 7.5km for ARPEGE over France.

::: tip
Technically this plugin is similar to the [ARPEGE](./plugin.md#arpege) plugin because the provider interface is similar as well, so the same architectural patterns, policies, etc. apply.
:::

::: warning
Please note that to use the ARPEGE/AROME plugin you need to first get an account from Météo France: refer to their [documentation](https://portail-api.meteofrance.fr/authenticationendpoint/aide_fr.do).

Once you have created your application and subscribed it to the relevant APIs (ARPEGE and/or AROME) you need to generate a JWT API key. The generated token is the one to be put in your Weacast [configuration](../guides/basics.md#configuring).
:::

## [GFS](https://www.ncdc.noaa.gov/data-access/model-data/model-datasets/global-forcast-system-gfs)

This [plugin](https://github.com/weacast/weacast-gfs) allows to gather data from the Global Forecast System (GFS), a weather forecast model produced by the National Centers for Environmental Prediction (NCEP). Dozens of atmospheric and land-soil variables are available through this dataset, from temperatures, winds, and precipitation to soil moisture and atmospheric ozone concentration. The entire globe is covered by the GFS at a base horizontal resolution of 18 miles (28 kilometers) between grid points, which is used by the operational forecasters who predict weather out to 16 days in the future.

Data are downloaded using the [Operational Model Archive and Distribution System](http://nomads.ncep.noaa.gov/) of NOAA, and more specifically the [filter](http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl) interface generating data in the [GRIBV2](https://en.wikipedia.org/wiki/GRIB) file format then processed using the [weacast-grib2json](https://github.com/weacast/weacast-grib2json) tool.

This plugin adds the following attributes to the [common Forecast data model](./../architecture/data-model-view.md#forecast-data-model):
* **baseUrl**: the URL of the [Grib Filter Service](http://nomads.ncep.noaa.gov/txt_descriptions/grib_filter_doc.shtml) providing forecast data
* **elements**:
  * **variable**: the name of the GRIB variable corresponding to the forecast element (not necessarily prefixed by `var_`)
  * **levels**: an array of levels (not necessarily prefixed by `lev_`) to subset the forecast domain (e.g. height) until the request results in a [2D grid](./grid.md).
  
> The file name is automatically computed by Weacast to retrieve data only for the considered forecast time

## Create a new plugin

> The simplest way to make a running plugin implementation is to copy existing forecast model plugins such as [ARPEGE](https://github.com/weacast/weacast-arpege)

The first thing a forecast model plugin has to do is to register to the database the available model instances as declared in the [configuration](./../guides/basics.md#configuring). Usually this is as simple as copying the right objects from the configuration (the ones tagged with the right **model** property) to the database. Then it has to declare all the services required to access the configured element for each model instance.

Hopefully, Weacast [core module](https://github.com/weacast/weacast-core) exposes the **initializePlugin()** function to do this for you, so you should simply call it in your *index.js*, e.g.:
```javascript
import path from 'path'
import { initializePlugin } from 'weacast-core'

export default function init () {
  const app = this

  initializePlugin(app, 'modelName', path.join(__dirname, 'services'))
}
```

This assumes you have created a *services* directory containing the required files to declare your forecast model, e.g. your folder/file hierarchy should look like this:
* *index.js*
* *services*
  * *modelName*
    * *modelName.hooks.js* : exporting the [hooks](./hooks.md) of all your element services, 
    * *modelName.filters.js* : exporting the filters of all your element services, 
    * *modelName.service.js* : exporting the specific mixin associated to all your element services

In your element service mixin the following interface has to be implemented

### .getForecastTimeRequest (runTime, forecastTime)

Return the request options object to download the forecast data of the element from the provider according to given run/forecast date/time in [request client format](https://github.com/request/request#requestoptions-callback).

### .getForecastTimeFilePath(runTime, forecastTime)

Return the target file name where to download the forecast data of the element according to given run/forecast date/time.

### async .convertForecastTime(runTime, forecastTime)

Performs the conversion from the provider input data format to the output Weacast format (usually JSON). Should return a promise resolved as crude data array.
