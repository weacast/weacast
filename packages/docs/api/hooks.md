# Hooks

Weacast [core module](https://github.com/weacast/weacast-core) and [client module](https://github.com/weacast/weacast-client) provides a collection of common [hooks](https://docs.feathersjs.com/api/hooks.html) to be used by plugins or [client applications](https://docs.feathersjs.com/api/client.html). They also rely on [Feathers common hooks](https://docs.feathersjs.com/api/hooks-common.html).

::: tip
[Hooks](https://docs.feathersjs.com/api/hooks.html) are the main way to introduce business logic into applications and plugins so we recommend to understand them well first before reading this.
:::

## Data model management

[source](https://github.com/weacast/weacast-core/blob/master/src/hooks/marshall.js)

### .marshall(hook)

Converts from server side types (e.g. moment dates) to basic JS types, which is usually required when writing to the database.

### .unmarshall(hook)

Converts back to server side types (e.g. moment dates) from basic JS types, which is usually required when reading from the database.

## Query management

[source](https://github.com/weacast/weacast-core/blob/master/src/hooks/query.js)

### .marshallQuery(hook)

Converts from client/server side types (e.g. strings or moment dates) to basic JS types, which is usually required when querying the database.

### .marshallComparisonQuery(hook)

Converts from client/server side comparison types (e.g. numbers) to basic JS types, which is usually required when querying the database. Applies to `$lt`, `$lte`, `$gt` and `$gte` operators.

### .marshallSpatialQuery(hook)

Converts from client/server side spatial types (e.g. coordinates or numbers) to basic JS types, which is usually required when querying the database. Applies to [MongoDB geospatial operators](https://docs.mongodb.com/manual/reference/operator/query-geospatial/).

### .processForecastTime(hook)

Find the nearest forecast date/time corresponding to a requested date/time or date/time range.

### .processData(hook)

Discard or retrieve forecast data when required depending on the query parameters.

## Logging

[core source](https://github.com/weacast/weacast-core/blob/master/src/hooks/logger.js), [client source](https://github.com/weacast/weacast-client/blob/master/src/hooks/logger.js)

### .log(hook)

* Log error for each hook in error with error log level.
* Log information for each hook ran with verbose (respectively debug for client) log level.
* Log detailed information for each hook ran with debug (respectively trace for client) log level.

## Events

[source](https://github.com/weacast/weacast-client/blob/master/src/hooks/events.js)

### .emit(hook)

Emit an event named `{hook_type}Hook` (e.g. `beforeHook` or `afterHook`) for each hook ran, the payload of the event being the hook object.

## By type

* [Application](./application.md#application-hooks)
* [Forecast model service](./forecast.md#forecast-model-hooks)
* [Forecast element service](./element.md#forecast-element-hooks)
* [Probe service](./probe.md#probe-hooks)
* [Probe results service](./probe.md#probe-results-hooks)
