# The Basics - A Step-by-Step introduction to Weacast

## Deploying

The Weacast web application demo includes the front-end side client as well as the back-end services/API. Once run it will continuously gather forecast data from configured model providers.

::: tip
After the first launch you will have to wait a few minutes before some data has been gathered and processed to be visible in the web app user interface
:::

### The easy way : using Docker

::: warning 
This requires you to [install Docker](https://docs.docker.com/engine/installation/), the world’s leading software container platform.
::: 

Weacast provides Docker images on the [Docker Hub](https://hub.docker.com/r/weacast/weacast/) to ease deploying your own server. To run correctly it has to be linked with a standard [MongoDB container](https://hub.docker.com/_/mongo/) for the database. 

The following commands should do the job:

```bash
// Run the MongoDB container
docker run --name weacast-mongodb -v weacast_mongodb:/data/db -d mongo

// Run the Weacast container
docker run --name weacast -d -p 8081:8081 --env LOADERS=gfs --link weacast-mongodb:mongodb weacast/weacast
```

Then point your browser to [localhost:8081](http://localhost:8081).

::: warning
If running Docker under Windows in a virtual machine first redirect the port 8081 of your virtual machine to your host
:::

You can also use [docker-compose](https://docs.docker.com/compose/) and the [docker compose file](https://github.com/weacast/weacast/blob/master/docker-compose.yml).
The following commands should do the job:

```bash
docker pull weacast/weacast
// Run the MongoDB and Weacast containers
docker-compose up -d

// Stop the MongoDB and Weacast containers
docker-compose down
// Stop the MongoDB and Weacast containers erasing DB data
docker-compose down -v
```

#### Domain binding

In production you can use [nginx-proxy](https://github.com/jwilder/nginx-proxy) to map the domain to the web app. Using `docker-compose` this requires to connect the Weacast network to the [reverse proxy](https://github.com/jwilder/nginx-proxy#multiple-networks) first.

```bash
docker network create weacast_weacast
docker run -d -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --name rproxy jwilder/nginx-proxy
docker network connect weacast_weacast rproxy
docker-compose up -d
```

As stated in the documentation of the reverse proxy you app container should define the `VIRTUAL_HOST` and `VIRTUAL_PORT` environment variables with your domain and the port your application is running on. You can have a look to our [docker compose file](https://github.com/weacast/weacast/blob/master/docker-compose.yml) as an example.

#### Using data loaders

The demo app can either work as a monolithic application using local [forecast model plugins](../api/plugin.md) (default mode) or with independent [data download services](../api/loader.md) available as Docker containers, for more details see the [architecture section](../architecture/global-architecture.md). To deploy the local loaders set the `LOADERS` environment variable to a comma-separated list of plugins you'd like to use like `arpege,gfs`. Otherwise to deploy the download services use the additional [docker compose file](https://github.com/weacast/weacast/blob/master/docker-compose.loader.yml):

```bash
// Pull generic download services images
docker pull weacast/weacast-arpege
docker pull weacast/weacast-gfs
// Build download services
docker-compose -f docker-compose.yml -f docker-compose.loader.yml build weacast-arpege-world  weacast-arpege-europe  weacast-arome-france weacast-gfs-world
// Run all download services, MongoDB and Weacast containers
docker-compose -f docker-compose.yml -f docker-compose.loader.yml up -d
// Run specific download services
docker-compose -f docker-compose.yml -f docker-compose.loader.yml up -d weacast-arpege-world weacast-gfs-world

// Stop all download services, MongoDB and Weacast containers
docker-compose -f docker-compose.yml -f docker-compose.loader.yml down
// Stop all download services, MongoDB and Weacast containers erasing DB data
docker-compose -f docker-compose.yml -f docker-compose.loader.yml down -v
// Stop specific download services
docker-compose -f docker-compose.yml -f docker-compose.loader.yml stop weacast-arpege-world weacast-gfs-world
docker-compose -f docker-compose.yml -f docker-compose.loader.yml rm -f weacast-arpege-world weacast-gfs-world
```

### The hard way : from source code

First you have to ensure the same [prerequisites](./development.md#prerequisites) as for developing to build Weacast from source code. Then the following commands, assuming you have a MongoDB instance running on local host and default port (27017), should launch your local instance of Weacast:

```bash
// Clone Weacast demo app
git clone https://github.com/weacast/weacast.git
cd weacast

// Client run
yarn install
yarn run dev

// In another terminal clone Weacast API
git clone https://github.com/weacast/weacast-api.git
cd weacast-api

// Server run
yarn install
yarn run dev
```

Then point your browser to [localhost:8080](http://localhost:8080).

## Configuring

### Backend side

Weacast backend configuration is based on [Feathers](https://docs.feathersjs.com/guides/advanced/configuration.html) so the same guidelines are applicable, the default configuration can be found in the `config` folder of the [backend API module](https://github.com/weacast/weacast-api). The main properties are the following:

* **host** : host name
* **port** : port on which the app is running
* **https** : object configuring [HTTPS](/guides/basics.md#configuring) key file, certificate file and running port
* **apiPath** : the API path prefix
* **staticPath** : path to the static files to be served by the server
* **pluginPath** : path to the plugin file to be used when the server starts
* **distribution** : options for service distribution (see https://github.com/kalisio/feathers-distributed)
* **authentication** : object configuring [Feathers authentication](https://github.com/feathersjs/feathers-authentication#default-options) plus custom weacast options, for OAuth2 providers add a `github`, `google`, `cognito` or `oidc` entry.
  * **defaultUsers** : the array of default users to be created on launch (format `{ email, password }`)
  * **disallowRegistration**: boolean to indicate if user registration is possible or not
* **logs** : object configuring the [winston](https://github.com/winstonjs/winston) loggers to be used - each key is a [transport name](https://github.com/winstonjs/winston/blob/master/docs/transports.md) which value is associated configuration options
* **db**
  * **adapter** : the database adapter, only [`mongodb`](https://github.com/feathersjs/feathers-mongodb) is officially supported right now
  * **path** : folder where to store database data for embedded database such as [`nedb`](https://github.com/feathersjs/feathers-nedb) and [`levelup`](https://github.com/feathersjs/feathers-levelup)
  * **url** : database URL to access the Weacast database used by drivers such as [mongodb](https://github.com/mongodb/node-mongodb-native)
  * **secondaries**: map of secondary databases to be used, each key is the name of the DB and each value the database URL, e.g. to declare a secondary DB to store the element data use `{ data: 'mongodb://127.0.0.1:27017/weacast-data' }`
* **services**: map of custom service configuration options, e.g. to use a secondary DB to store the element data use `{ elements: { dbName: 'data' } }`
* **defaultProbes** : the array of default probe streams to be created on launch (format `{ fileName, options }`)
* **defaultAlerts** : the array of default alerts to be created on launch (format `{ fileName, options }`)
* **forecastPath** : folder where temporary or persistent forecast data files are stored
* **forecasts** : an array of configuration objects for each registered forecast, which common properties are defined by the [Forecast data model](../architecture/data-model-view.md#forecast-data-model)
* **proxyTable**: a set of proxy rules typically used for [scaling](../architecture/global-architecture.md#architecture-at-scale)

::: warning
Only [MongoDB](https://docs.feathersjs.com/api/databases/mongodb.html) is officially supported right now although we had an experimental attempt with [LevelUP](https://github.com/feathersjs/feathers-levelup) as well. Please contact us if you'd like to support more adapters.
:::

### Frontend side

Weacast frontend configuration is based on the same underlying [tool](https://github.com/lorenwest/node-config) that powers [Feathers](https://docs.feathersjs.com/guides/advanced/configuration.html) so the same guidelines are applicable, the default configuration can be found in the `config` folder of the [demo app](https://github.com/weacast/weacast). The main properties are the following:
* **apiPath** : the API path prefix
* **transport** : the transport to be used between frontend and backend, could be `http` for standard REST or `websocket` for WebSockets
* **appName** : the name of the Weacast app
* **logs**
  * **level** : [log level](https://github.com/pimterry/loglevel#documentation) to be used 
* **login**
  * **providers** : the array of OAuth2 providers to be used on the sign in screen, e.g. `['google', 'github']`
* **map**
  * **seeker** : the name of the component to be used to look for weather conditions in the app
  * **mixins** : the set of [mixins](../api/mixins.md) to be applied to the map (could be `base`, `baseLayers`, `forecastLayers`, `geojsonLayers`, `fileLayers`, `fullscreen`, `measure`, `scalebar`, etc.)
  * **baseLayers** : the set of Leaflet layers to be shown in the base layer selector on the map
  * **forecastLayers** : the set of Weacast [forecast layers](../api/layers.md) to be shown in the overlay layer selector on the map
  * **featureStyle** : default style for GeoJson features in [Leaflet compatible format](http://leafletjs.com/reference-1.0.3.html#path-option)
  * **pointStyle** : default style for GeoJson points in [Leaflet compatible format](http://leafletjs.com/reference-1.0.3.html#marker-option)
  
::: tip 
The main difference with the backend configuration is that the actual frontend configuration is generated by WebPack at build time from the config files, so you will need to rebuild the app to see your changes applied
:::
