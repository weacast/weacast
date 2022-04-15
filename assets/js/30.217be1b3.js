(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{621:function(t,e,a){"use strict";a.r(e);var r=a(22),s=Object(r.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"mixins"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mixins"}},[t._v("#")]),t._v(" Mixins")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://vuejs.org/v2/guide/mixins.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Mixins"),a("OutboundLink")],1),t._v(" are a flexible way to distribute reusable functionalities for "),a("a",{attrs:{href:"https://vuejs.org/v2/guide/components.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Vue components"),a("OutboundLink")],1),t._v('. A mixin object can contain any component options. When a component uses a mixin, all options in the mixin will be "mixed" into the component\'s own options.')]),t._v(" "),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[t._v("WARNING")]),t._v(" "),a("p",[t._v("Mixins are only part of the legacy Weacast "),a("a",{attrs:{href:"https://github.com/weacast/weacast-client",target:"_blank",rel:"noopener noreferrer"}},[t._v("client module"),a("OutboundLink")],1),t._v(", which will not evolve anymore (see discussion "),a("a",{attrs:{href:"https://github.com/weacast/weacast-client/issues/6",target:"_blank",rel:"noopener noreferrer"}},[t._v("here"),a("OutboundLink")],1),t._v(") and will only be maintained for the purpose of our "),a("a",{attrs:{href:"https://github.com/weacast/weacast",target:"_blank",rel:"noopener noreferrer"}},[t._v("demo application"),a("OutboundLink")],1),t._v(". If you'd like to build client applications using Weacast you'd better have a look to our client API layer in "),a("a",{attrs:{href:"https://github.com/weacast/weacast-core",target:"_blank",rel:"noopener noreferrer"}},[t._v("core module"),a("OutboundLink")],1),t._v(" and build your own map component using dedicated map engine modules like our "),a("a",{attrs:{href:"https://github.com/weacast/weacast-leaflet",target:"_blank",rel:"noopener noreferrer"}},[t._v("Leaflet plugin"),a("OutboundLink")],1),t._v(".")])]),t._v(" "),a("h2",{attrs:{id:"map-mixins"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#map-mixins"}},[t._v("#")]),t._v(" Map mixins")]),t._v(" "),a("p",[t._v("A Weacast map is based on a "),a("a",{attrs:{href:"http://leafletjs.com/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Leaflet"),a("OutboundLink")],1),t._v(" map object.")]),t._v(" "),a("p",[t._v("This set of mixins is to be used to construct a new Weacast Map component and underlying Leaflet objects:")]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("Mandatory")]),t._v(" "),a("a",{attrs:{href:"https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.base.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("Base"),a("OutboundLink")],1),t._v(" mixin simply initialize the underlying Leaflet map object and registered controls by other mixins")]),t._v(" "),a("li",[a("a",{attrs:{href:"https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.base-layers.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("Base layers"),a("OutboundLink")],1),t._v(" adds a base layer selector on the map using "),a("a",{attrs:{href:"https://github.com/consbio/Leaflet.Basemaps",target:"_blank",rel:"noopener noreferrer"}},[t._v("Leaflet.Basemaps"),a("OutboundLink")],1)]),t._v(" "),a("li",[a("a",{attrs:{href:"https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.forecast-layers.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("Forecast layers"),a("OutboundLink")],1),t._v(" adds a configured set of forecast layers to the map")]),t._v(" "),a("li",[a("a",{attrs:{href:"https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.file-layers.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("File layers"),a("OutboundLink")],1),t._v(" adds a file-based layer (GeoJSON or KML) uploader to the map using "),a("a",{attrs:{href:"https://github.com/consbio/Leaflet.Basemaps",target:"_blank",rel:"noopener noreferrer"}},[t._v("Leaflet.Basemaps"),a("OutboundLink")],1),t._v(" "),a("ul",[a("li",[t._v("it will use the configured GeoJson style of the GeoJson layers mixin or you will have to implement a "),a("strong",[t._v("getGeoJsonOptions()")]),t._v(" method in your map component")])])]),t._v(" "),a("li",[a("a",{attrs:{href:"https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.geojson-layers.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("GeoJson layers"),a("OutboundLink")],1),t._v(" adds methods to ease "),a("a",{attrs:{href:"http://leafletjs.com/reference-1.0.3.html#geojson",target:"_blank",rel:"noopener noreferrer"}},[t._v("GeoJson"),a("OutboundLink")],1),t._v(" and "),a("a",{attrs:{href:"./LAYERS#feature-layers"}},[t._v("timestamped GeoJson")]),t._v(" layers addition to the map\n"),a("ul",[a("li",[t._v("it will use the statically configured GeoJson style or you can implement the following methods on your map component to have dynamic styling of your features:\n"),a("ul",[a("li",[a("strong",[t._v("getFeaturePopup(feature, layer)")]),t._v(" to provide an HTML "),a("a",{attrs:{href:"http://leafletjs.com/reference-1.1.0.html#popup",target:"_blank",rel:"noopener noreferrer"}},[t._v("popup content"),a("OutboundLink")],1),t._v(" to bind")]),t._v(" "),a("li",[a("strong",[t._v("getFeatureTooltip(feature, layer)")]),t._v(" to provide a "),a("a",{attrs:{href:"http://leafletjs.com/reference-1.1.0.html#tooltip",target:"_blank",rel:"noopener noreferrer"}},[t._v("tooltip content"),a("OutboundLink")],1),t._v(" to bind")]),t._v(" "),a("li",[a("strong",[t._v("getFeatureStyle(feature)")]),t._v(" to provide a "),a("a",{attrs:{href:"http://leafletjs.com/reference-1.1.0.html#path-option",target:"_blank",rel:"noopener noreferrer"}},[t._v("style object"),a("OutboundLink")],1),t._v(" for your line/polygon features")]),t._v(" "),a("li",[a("strong",[t._v("getPointMarker(feature, latlng)")]),t._v(" to provide a "),a("a",{attrs:{href:"http://leafletjs.com/reference-1.1.0.html#marker",target:"_blank",rel:"noopener noreferrer"}},[t._v("marker object"),a("OutboundLink")],1),t._v(" for your point features")])])])])]),t._v(" "),a("li",[a("a",{attrs:{href:"https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.scalebar.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("Scalebar"),a("OutboundLink")],1),t._v(" adds a "),a("a",{attrs:{href:"http://leafletjs.com/reference-1.0.3.html#control-scale",target:"_blank",rel:"noopener noreferrer"}},[t._v("scalebar"),a("OutboundLink")],1),t._v(" on the map")]),t._v(" "),a("li",[a("a",{attrs:{href:"https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.measure.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("Measure"),a("OutboundLink")],1),t._v(" adds a measure control on the map using "),a("a",{attrs:{href:"https://github.com/ljagis/leaflet-measure",target:"_blank",rel:"noopener noreferrer"}},[t._v("Leaflet.Measure"),a("OutboundLink")],1)]),t._v(" "),a("li",[a("a",{attrs:{href:"https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.fullscreen.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("Fullscreen"),a("OutboundLink")],1),t._v(" adds a fullscreen control on the map using "),a("a",{attrs:{href:"https://github.com/Leaflet/Leaflet.fullscreen",target:"_blank",rel:"noopener noreferrer"}},[t._v("Leaflet.Fullscreen"),a("OutboundLink")],1)]),t._v(" "),a("li",[a("a",{attrs:{href:"https://github.com/weacast/weacast-client/blob/master/src/mixins/map/mixin.legend.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("Legend"),a("OutboundLink")],1),t._v(" adds a legend control on the map using "),a("a",{attrs:{href:"https://github.com/mikeskaug/Leaflet.Legend",target:"_blank",rel:"noopener noreferrer"}},[t._v("Leaflet.Legend"),a("OutboundLink")],1),t._v(", "),a("strong",[t._v("the legend is attached to the last forecast layer that has been made visible")])])]),t._v(" "),a("p",[t._v("A Weacast map relies on a configuration object detailing mixins to be used with their options like this:")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[t._v("module"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("map")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Mixins to be applied to map")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("mixins")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'base'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'baseLayers'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'forecastLayers'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'geojsonLayers'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'fileLayers'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'fullscreen'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'measure'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'scalebar'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'legend'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Config for Base Layers mixin")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("baseLayers")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'tileLayer'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("arguments")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n          "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n          "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("maxZoom")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("20")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("label")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Streets'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("attribution")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Map data © <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors'")]),t._v("\n          "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Config for Forecast Layers mixin")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("forecastLayers")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'FlowLayer'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("options")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("elements")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'u-wind'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'v-wind'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n          "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("attribution")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Forecast data from <a href=\"http://www.meteofrance.com\">Météo-France</a>'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Default GeoJSON layer style for polygons/lines in File Layers mixin")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("featureStyle")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("opacity")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("radius")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("6")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("color")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'red'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("fillOpacity")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.5")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("fillColor")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'green'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("popup")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("excludedProperties")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'wikipedia'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Default GeoJSON layer style for points in File Layers mixin")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("pointStyle")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'circleMarker'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("options")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("opacity")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("color")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'red'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("fillOpacity")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.5")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("fillColor")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'green'")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n")])])])])}),[],!1,null,null,null);e.default=s.exports}}]);