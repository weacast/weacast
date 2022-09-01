(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{417:function(t,a,e){t.exports=e.p+"assets/img/element-hooks.84065c3e.svg"},460:function(t,a,e){"use strict";e.r(a);var s=e(5),r=Object(s.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"forecast-element"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#forecast-element"}},[t._v("#")]),t._v(" Forecast element")]),t._v(" "),a("blockquote",[a("p",[t._v("On the client/server side the API is exposed using the "),a("a",{attrs:{href:"https://docs.feathersjs.com/api/client.html#universal-isomorphic-api",target:"_blank",rel:"noopener noreferrer"}},[t._v("Feathers isomorphic API"),a("OutboundLink")],1),t._v(" and the "),a("a",{attrs:{href:"https://docs.feathersjs.com/api/databases/querying.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Feathers common database query API"),a("OutboundLink")],1)])]),t._v(" "),a("p",[t._v("Forecast model instances expose each element found in "),a("a",{attrs:{href:"../guides/basics.mdconfiguring"}},[t._v("configuration")]),t._v(" through a service named "),a("code",[t._v("forecast.name/element.name")]),t._v(" implementing the "),a("a",{attrs:{href:"https://docs.feathersjs.com/api/services.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Feathers service interface"),a("OutboundLink")],1),t._v(" for "),a("a",{attrs:{href:"https://en.wikipedia.org/wiki/Create,_read,_update_and_delete",target:"_blank",rel:"noopener noreferrer"}},[t._v("CRUD"),a("OutboundLink")],1),t._v(". Although only web sockets are usually used on the client side by default, both the "),a("a",{attrs:{href:"https://docs.feathersjs.com/api/rest.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("REST"),a("OutboundLink")],1),t._v(" and the "),a("a",{attrs:{href:"https://docs.feathersjs.com/api/socketio.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Socket"),a("OutboundLink")],1),t._v(" interfaces are configured.")]),t._v(" "),a("blockquote",[a("p",[a("code",[t._v("create")]),t._v(", "),a("code",[t._v("update")]),t._v(", "),a("code",[t._v("patch")]),t._v(", "),a("code",[t._v("remove")]),t._v(" methods are only allowed from the server side, clients can only "),a("code",[t._v("get")]),t._v("and "),a("code",[t._v("find")]),t._v(" forecast elements.")])]),t._v(" "),a("p",[t._v("Each forecast model instance exposes each element service using a database adapter as an implementation of the "),a("a",{attrs:{href:"https://docs.feathersjs.com/api/services.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Feathers service interface"),a("OutboundLink")],1),t._v(". Because we want to remain database-agnostic, just like "),a("a",{attrs:{href:"https://docs.feathersjs.com/guides/step-by-step/intro/not-worry.html#how-do-i-use-my-preferred-database",target:"_blank",rel:"noopener noreferrer"}},[t._v("Feathers is"),a("OutboundLink")],1),t._v(", the database adapter to be used is only known at startup depending on your "),a("a",{attrs:{href:"../guides/basics.mdconfiguring"}},[t._v("configuration")]),t._v(". That's the reason why there is no static forecast element class in the core of Weacast, instead it provides a set of "),a("a",{attrs:{href:"https://github.com/daffl/uberproto#mixins",target:"_blank",rel:"noopener noreferrer"}},[t._v("functional mixins"),a("OutboundLink")],1),t._v(" that will be applied on the instantiated element service and are described hereafter.")]),t._v(" "),a("h2",{attrs:{id:"data-model"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#data-model"}},[t._v("#")]),t._v(" Data model")]),t._v(" "),a("p",[t._v("The common data model of a forecast element as used by the API is "),a("RouterLink",{attrs:{to:"/architecture/data-model-view.html#element-data-model"}},[t._v("detailed here")]),t._v(".")],1),t._v(" "),a("blockquote",[a("p",[t._v("Forecast element data are usually large so they are not returned by default, , you have to explicitely ask for using "),a("a",{attrs:{href:"https://docs.feathersjs.com/api/databases/querying.html#select",target:"_blank",rel:"noopener noreferrer"}},[a("code",[t._v("$select")]),a("OutboundLink")],1)])]),t._v(" "),a("h2",{attrs:{id:"available-forecast-data"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#available-forecast-data"}},[t._v("#")]),t._v(" Available forecast data")]),t._v(" "),a("p",[t._v("For example you can request the available forecast data for a given element like this:")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" api "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'src/api'")]),t._v("\n\napi"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getService")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("forecast"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" element"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("find")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("response")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Do something with the element data")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("p",[t._v("Response:")]),t._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"total"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("27")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"limit"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("10")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"skip"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"_id"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"59144a3ed0c0a234f8b4f86d"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"runTime"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2017-05-11T06:00:00.000Z"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"forecastTime"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2017-05-11T19:00:00.000Z"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"minValue"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("-10.490379333496094")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"maxValue"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("15.306495666503906")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"_id"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"59144ab0d0c0a234f8b4f88b"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"runTime"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2017-05-11T06:00:00.000Z"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"forecastTime"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2017-05-12T00:00:00.000Z"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"minValue"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("-10.069664001464844")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"maxValue"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("11.477210998535156")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h2",{attrs:{id:"property-selection"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#property-selection"}},[t._v("#")]),t._v(" Property selection")]),t._v(" "),a("p",[t._v("You can skip pagination and retrieve selected properties only:")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" api "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'src/api'")]),t._v("\n\napi"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getService")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("forecast"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" element"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("find")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("query")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("$paginate")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("$select")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'forecastTime'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("response")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Do something with the element data")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("p",[t._v("Response:")]),t._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"_id"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"59144a3ed0c0a234f8b4f86d"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"forecastTime"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2017-05-11T19:00:00.000Z"')]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"_id"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"59144a83d0c0a234f8b4f881"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"forecastTime"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2017-05-11T22:00:00.000Z"')]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"_id"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"59144a95d0c0a234f8b4f886"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"forecastTime"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2017-05-11T23:00:00.000Z"')]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])])]),a("h2",{attrs:{id:"data-retrieval"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#data-retrieval"}},[t._v("#")]),t._v(" Data retrieval")]),t._v(" "),a("p",[t._v("To retrieve data for a given time you have to request it explicitly:")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" api "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'src/api'")]),t._v("\n\napi"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getService")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("forecast"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" element"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("find")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("query")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("time")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Date")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("toISOString")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("$select")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'forecastTime'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'data'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("response")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Do something with the element data")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("p",[t._v("Response:")]),t._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"total"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"limit"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("10")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"skip"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"_id"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"59144a3ed0c0a234f8b4f86d"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"forecastTime"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2017-05-11T19:00:00.000Z"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v(" ... "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n     "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n   "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("p",[t._v("When no more query parameters are provided the data retrieved are the ones at the original resolution of the model. If you want to resample data at a lower resolution to improve bandwidth and performance you could add the target grid configuration as parameters:")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" api "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'src/api'")]),t._v("\n\napi"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getService")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("forecast"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" element"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("find")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("query")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("time")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Date")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("toISOString")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("$select")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'forecastTime'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'data'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("oLon")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" origin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("oLat")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" origin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("sLon")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" size"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("sLat")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" size"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("dLon")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" resolution"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("dLat")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" resolution"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("response")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Do something with the element data")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("p",[t._v("where:")]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("origin")]),t._v(" is the geographical origin of the target data grid as an array of decimal values "),a("code",[t._v("[longitude origin, latitude origin]")]),t._v(",\n"),a("ul",[a("li",[a("strong",[t._v("size")]),t._v(" is the size of the target data grid as an array of integer values "),a("code",[t._v("[width, height]")]),t._v(",")]),t._v(" "),a("li",[a("strong",[t._v("resolution")]),t._v(" is the geographical resolution of the target data grid as an array of decimal values "),a("code",[t._v("[longitude resolution, latitude resolution]")])])])])]),t._v(" "),a("h2",{attrs:{id:"tiles"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#tiles"}},[t._v("#")]),t._v(" Tiles")]),t._v(" "),a("p",[t._v("When "),a("a",{attrs:{href:"https://github.com/perliedman/tiled-maps",target:"_blank",rel:"noopener noreferrer"}},[t._v("tiling"),a("OutboundLink")],1),t._v(" is enabled you can retrieve element tiles instead of the whole forecast data when you'd like to know what occurs in a given area or at a given location. Because tiles have an indexed geometry property you can perform a "),a("a",{attrs:{href:"https://docs.mongodb.com/manual/reference/operator/query-geospatial/",target:"_blank",rel:"noopener noreferrer"}},[t._v("geospatial query"),a("OutboundLink")],1),t._v(".")]),t._v(" "),a("p",[t._v("If you also configured your element services to generate tiles with aggregated data over all forecast times you can select it by querying with the following additional field: "),a("code",[t._v("{ timeseries: true }")]),t._v(".")]),t._v(" "),a("h2",{attrs:{id:"base-element-mixin"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#base-element-mixin"}},[t._v("#")]),t._v(" Base element mixin")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://github.com/weacast/weacast/packages/core/blob/master/src/mixins/mixin.element.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("source"),a("OutboundLink")],1)]),t._v(" "),a("p",[t._v("This mixin includes the most basic functions shared by all forecast elements")]),t._v(" "),a("h3",{attrs:{id:"getnearestruntime-datetime"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#getnearestruntime-datetime"}},[t._v("#")]),t._v(" .getNearestRunTime(datetime)")]),t._v(" "),a("p",[t._v("Returns the nearest weather prediction model run date/time for a given date/time, it basically rounds the hours according to the "),a("code",[t._v("runInterval")]),t._v(" value in the "),a("a",{attrs:{href:"../guides/basics.mdbackend-side"}},[t._v("model configuration")]),t._v(".")]),t._v(" "),a("h3",{attrs:{id:"getnearestforecasttime-datetime"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#getnearestforecasttime-datetime"}},[t._v("#")]),t._v(" .getNearestForecastTime(datetime)")]),t._v(" "),a("p",[t._v("Returns the nearest weather prediction model forecast date/time step for a given date/time, it basically rounds the hours according to the "),a("code",[t._v("interval")]),t._v(" value in the "),a("a",{attrs:{href:"../guides/basics.mdbackend-side"}},[t._v("model configuration")]),t._v(".")]),t._v(" "),a("h2",{attrs:{id:"refresh-element-mixin"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#refresh-element-mixin"}},[t._v("#")]),t._v(" Refresh element mixin")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://github.com/weacast/weacast/packages/core/blob/master/src/mixins/mixin.element.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("source"),a("OutboundLink")],1)]),t._v(" "),a("p",[t._v("This mixin includes the most basic functions shared by all forecast elements to help updating forecast data from providers.")]),t._v(" "),a("h3",{attrs:{id:"getdatadirectory"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#getdatadirectory"}},[t._v("#")]),t._v(" .getDataDirectory()")]),t._v(" "),a("p",[t._v("Returns the path where downloaded/persisted data are located for the element")]),t._v(" "),a("h3",{attrs:{id:"async-updateforecastdata-mode"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#async-updateforecastdata-mode"}},[t._v("#")]),t._v(" async .updateForecastData(mode)")]),t._v(" "),a("p",[t._v("Launches the forecast data update process for the element depending on the mode value:")]),t._v(" "),a("ul",[a("li",[a("strong",[a("code",[t._v("'once'")])]),t._v(" : will perform data update for the current time only")]),t._v(" "),a("li",[a("strong",[a("code",[t._v("'interval'")])]),t._v(" : will perform data update for the current time and schedule the update process at regular interval after each data gathering according to the "),a("code",[t._v("updateInterval")]),t._v(" value in the "),a("a",{attrs:{href:"../guides/basics.mdbackend-side"}},[t._v("model configuration")]),t._v(".")])]),t._v(" "),a("h3",{attrs:{id:"async-refreshforecastdata-datetime"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#async-refreshforecastdata-datetime"}},[t._v("#")]),t._v(" async .refreshForecastData(datetime)")]),t._v(" "),a("p",[t._v("Refreshes forecast data for the element based on the nearest run for the provided date/time. It will harvest data for each forecast time step available in the model according to the "),a("code",[t._v("lowerLimit")]),t._v("/"),a("code",[t._v("upperLimit")]),t._v(" values in the "),a("a",{attrs:{href:"../guides/basics.mdbackend-side"}},[t._v("model configuration")]),t._v(".")]),t._v(" "),a("h3",{attrs:{id:"async-harvestforecasttime-datetime-runtime-forecasttime"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#async-harvestforecasttime-datetime-runtime-forecasttime"}},[t._v("#")]),t._v(" async .harvestForecastTime(datetime, runTime, forecastTime)")]),t._v(" "),a("p",[t._v("Refreshes forecast data for the element based on the provided run and forecast date/time. If the run is not yet available through the provider it will try to use the previous one until the "),a("code",[t._v("oldestRunInterval")]),t._v(" value in the "),a("a",{attrs:{href:"../guides/basics.mdbackend-side"}},[t._v("model configuration")]),t._v(" is reached.")]),t._v(" "),a("h3",{attrs:{id:"async-refreshforecasttime-datetime-runtime-forecasttime"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#async-refreshforecasttime-datetime-runtime-forecasttime"}},[t._v("#")]),t._v(" async .refreshForecastTime(datetime, runTime, forecastTime)")]),t._v(" "),a("p",[t._v("Download the forecast data for the given run/forecast date/time and process it, i.e. convert it if required then store it in the database.")]),t._v(" "),a("h3",{attrs:{id:"async-downloadforecasttime-runtime-forecasttime"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#async-downloadforecasttime-runtime-forecasttime"}},[t._v("#")]),t._v(" async .downloadForecastTime(runTime, forecastTime)")]),t._v(" "),a("p",[t._v("Download the forecast data for the given run/forecast date/time and returns the file path to the downloaded data.")]),t._v(" "),a("h2",{attrs:{id:"forecast-element-hooks"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#forecast-element-hooks"}},[t._v("#")]),t._v(" Forecast element hooks")]),t._v(" "),a("p",[t._v("The following "),a("RouterLink",{attrs:{to:"/api/hooks.html"}},[t._v("hooks")]),t._v(" are executed on each Forecast element service:\n"),a("img",{attrs:{src:e(417),alt:"Element hooks"}})],1)])}),[],!1,null,null,null);a.default=r.exports}}]);