# [Alert plugin](https://github.com/weacast/weacast-alert)

Alerts are user-defined conditions automatically and continuously evaluated on streamed probe results as new forecast data are gathered. It can be viewed as an automated query of the [Probe results API](./probe.md) that will raise an event whenever a matching result is found. With alert you can create triggers which will fire on an occurrence of the selected weather conditions (temperature, humidity, pressure, etc.) in a specified period of time and area.

## Alerts API

::: tip
On the client/server side the API is exposed using the [Feathers isomorphic API](https://docs.feathersjs.com/api/client.html#universal-isomorphic-api)and the [Feathers common database query API](https://docs.feathersjs.com/api/databases/querying.html)
:::

The plugin exposes the available probes through the `alerts` service. Although only web sockets are usually used on the client side, both the [REST](https://docs.feathersjs.com/api/rest.html) and the [Socket](https://docs.feathersjs.com/api/socketio.html) interfaces are configured.

::: warning
`update`, `patch` methods are not allowed on alerts for now, you will have to recreate an alert to update it.
:::

### Data model

The common data model of an alert as used by the API is [detailed here](../architecture/data-model-view.md#alert-data-model).

### Create an alert

**Coming soon !**

### Remove an alert

**Coming soon !**

## Alert hooks

The following hooks are executed on the alert service.

### .marshallAlert(hook) [source](https://github.com/weacast/weacast-alert/blob/master/src/hooks/alerting.js)

Convert from server side types (moment dates) to basic JS types when "writing" to DB adapters. Because conditions contains Mongo reserved keywords they will be serialized as well.

### .unmarshallAlert(hook) [source](https://github.com/weacast/weacast-alert/blob/master/src/hooks/alerting.js)

Convert back to server side types (moment dates) from basic JS types when "reading" from DB adapters. Will unserialize conditions as well.
