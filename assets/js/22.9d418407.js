(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{451:function(e,t,a){"use strict";a.r(t);var r=a(5),o=Object(r.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"about"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#about"}},[e._v("#")]),e._v(" About")]),e._v(" "),t("p",[t("strong",[e._v("Weacast")]),e._v(" is an Open Source platform to gather, expose and make use of weather forecast data.")]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("Note")]),e._v(" "),t("p",[e._v("Read our "),t("a",{attrs:{href:"https://towardsdatascience.com/introducing-weacast-e6e98487b2a8",target:"_blank",rel:"noopener noreferrer"}},[e._v("introductory article"),t("OutboundLink")],1),e._v(" on Medium.")])]),e._v(" "),t("h2",{attrs:{id:"why-weacast"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#why-weacast"}},[e._v("#")]),e._v(" Why Weacast ?")]),e._v(" "),t("p",[e._v("Weather prediction data are now available from the major meteorological agencies and institutions on a day-to-day basis. Current weather observations serve as input to numerical computer models, through a process known as data assimilation, to produce a forecast of the future state of weather. These models output hundreds of other meteorological elements from the oceans to the top of the atmosphere such as temperature, precipitation, icing conditions, etc. As an example, the following animated image represents a typical output of the "),t("a",{attrs:{href:"https://www.ncdc.noaa.gov/data-access/model-data/model-datasets/global-forcast-system-gfs",target:"_blank",rel:"noopener noreferrer"}},[e._v("GFS weather forecast model"),t("OutboundLink")],1),e._v(" from NOAA.")]),e._v(" "),t("p",[t("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1600/1*10SiCHb5aTr5zeTrHLMbVA.gif",alt:"GFS animated image"}})]),e._v(" "),t("p",[t("strong",[e._v("Weacast")]),e._v(" (a shortcut for "),t("strong",[e._v("Wea")]),e._v("ther fore"),t("strong",[e._v("cast")]),e._v(") aims at providing web services and visualization tools to gather, expose and make use of weather forecast data in a simple manner and format. Indeed, although publicly available weather forecast data come from many different sources, in many different and dedicated protocols/formats (such as "),t("a",{attrs:{href:"https://en.wikipedia.org/wiki/Web_Coverage_Service",target:"_blank",rel:"noopener noreferrer"}},[e._v("WCS"),t("OutboundLink")],1),e._v(", "),t("a",{attrs:{href:"https://en.wikipedia.org/wiki/GeoTIFF",target:"_blank",rel:"noopener noreferrer"}},[e._v("GeoTIFF"),t("OutboundLink")],1),e._v(", "),t("a",{attrs:{href:"http://en.wikipedia.org/wiki/GRIB",target:"_blank",rel:"noopener noreferrer"}},[e._v("GRIB"),t("OutboundLink")],1),e._v(", etc.), making consumption in web applications not so easy, particularly on the client-side. Moreover, forecast data often cover large continental areas and contain hundred of elements such as temperature, wind, etc. but a few are usually required by a specific business use case. Last but not least, forecast data are in essence dynamic so that keeping your application up-to-date with the lastly available data is always a tedious task.")]),e._v(" "),t("h2",{attrs:{id:"weacast-philosophy"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#weacast-philosophy"}},[e._v("#")]),e._v(" Weacast philosophy")]),e._v(" "),t("p",[e._v("Weacast is "),t("strong",[e._v("weather forecast model agnostic")]),e._v(", i.e. it mainly exposes a minimalistic framework where forecast data sources can be added on-demand to extend its capabilities in a plugin-like architecture. These data are then available in Weacast through simple REST/Websocket services in JSON format and can be visualized using the built-in web app.")]),e._v(" "),t("p",[e._v("Currently supported plugins are the following:")]),e._v(" "),t("ul",[t("li",[t("RouterLink",{attrs:{to:"/api/plugin.html#arpege"}},[e._v("ARPEGE")]),e._v(" model from "),t("a",{attrs:{href:"http://www.meteofrance.com/simulations-numeriques-meteorologiques/monde",target:"_blank",rel:"noopener noreferrer"}},[e._v("Meteo France"),t("OutboundLink")],1)],1),e._v(" "),t("li",[t("RouterLink",{attrs:{to:"/api/plugin.html#arome"}},[e._v("AROME")]),e._v(" model from "),t("a",{attrs:{href:"http://www.meteofrance.com/simulations-numeriques-meteorologiques/monde",target:"_blank",rel:"noopener noreferrer"}},[e._v("Meteo France"),t("OutboundLink")],1)],1),e._v(" "),t("li",[t("RouterLink",{attrs:{to:"/api/plugin.html#gfs"}},[e._v("GFS")]),e._v(" model from "),t("a",{attrs:{href:"https://www.ncdc.noaa.gov/data-access/model-data/model-datasets/global-forcast-system-gfs",target:"_blank",rel:"noopener noreferrer"}},[e._v("NOAA"),t("OutboundLink")],1)],1)]),e._v(" "),t("p",[e._v("Weacast aims at going beyond providing crude forecast data and includes tools to derive your own business focussed data by:")]),e._v(" "),t("ul",[t("li",[t("RouterLink",{attrs:{to:"/api/probe.html#probe-plugin"}},[e._v("Probing")]),e._v(" forecast data to extract or analyze relevant data for your locations of interest (e.g. airports, cities, stores, etc.)")],1),e._v(" "),t("li",[t("RouterLink",{attrs:{to:"/api/probe.html#probe-results"}},[e._v("Querying")]),e._v(" your probed data to find which locations match specific weather conditions")],1)]),e._v(" "),t("h2",{attrs:{id:"what-is-inside"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#what-is-inside"}},[e._v("#")]),e._v(" What is inside ?")]),e._v(" "),t("p",[e._v("Weacast is possible and mainly powered by the following stack:")]),e._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"https://feathersjs.com/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Feathers"),t("OutboundLink")],1),e._v(" on the backend side")]),e._v(" "),t("li",[t("a",{attrs:{href:"http://quasar-framework.org/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Quasar"),t("OutboundLink")],1),e._v(" on the frontend side")]),e._v(" "),t("li",[t("a",{attrs:{href:"http://leafletjs.com/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Leaflet"),t("OutboundLink")],1),e._v(" and "),t("a",{attrs:{href:"http://leafletjs.com/plugins.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("plugins"),t("OutboundLink")],1),e._v(" for mapping")]),e._v(" "),t("li",[t("a",{attrs:{href:"https://github.com/socib/Leaflet.TimeDimension",target:"_blank",rel:"noopener noreferrer"}},[e._v("Leaflet-timedimension"),t("OutboundLink")],1),e._v(" for time management")]),e._v(" "),t("li",[t("a",{attrs:{href:"https://github.com/danwild/leaflet-velocity",target:"_blank",rel:"noopener noreferrer"}},[e._v("Leaflet-velocity"),t("OutboundLink")],1),e._v(" for wind visualization")]),e._v(" "),t("li",[t("a",{attrs:{href:"https://github.com/IHCantabria/Leaflet.CanvasLayer.Field",target:"_blank",rel:"noopener noreferrer"}},[e._v("Leaflet-canvaslayer-field"),t("OutboundLink")],1),e._v(" for color map visualization")]),e._v(" "),t("li",[t("a",{attrs:{href:"https://github.com/JoranBeaufort/Leaflet.windbarb",target:"_blank",rel:"noopener noreferrer"}},[e._v("Leaflet-windbarb"),t("OutboundLink")],1),e._v(" for "),t("a",{attrs:{href:"https://en.wikipedia.org/wiki/Station_model",target:"_blank",rel:"noopener noreferrer"}},[e._v("wind barbs"),t("OutboundLink")],1)])])])}),[],!1,null,null,null);t.default=o.exports}}]);