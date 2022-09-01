(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{416:function(t,e,a){t.exports=a.p+"assets/img/application-hooks.17778c0b.svg"},459:function(t,e,a){"use strict";a.r(e);var s=a(5),r=Object(s.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"application"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#application"}},[t._v("#")]),t._v(" Application")]),t._v(" "),e("h2",{attrs:{id:"backend-setup"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#backend-setup"}},[t._v("#")]),t._v(" Backend setup")]),t._v(" "),e("p",[t._v("Weacast "),e("a",{attrs:{href:"https://github.com/weacast/weacast",target:"_blank",rel:"noopener noreferrer"}},[t._v("core module"),e("OutboundLink")],1),t._v(" provides a helper to quickly initialize what is required for your "),e("a",{attrs:{href:"https://docs.feathersjs.com/api/application.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("server application"),e("OutboundLink")],1),t._v(". The core module provides the ability to initialize a new Weacast application instance, attach it to the configured database and setup authentication:")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" weacast "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@weacast/core'")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Initialize app")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" app "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("weacast")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Connect to DB")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("await")]),t._v(" app"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("db"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("connect")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),e("h3",{attrs:{id:"authentication"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#authentication"}},[t._v("#")]),t._v(" Authentication")]),t._v(" "),e("p",[t._v("Weacast includes a built-in local authentication strategy based on the "),e("a",{attrs:{href:"https://docs.feathersjs.com/api/authentication/server.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Feathers authentication module"),e("OutboundLink")],1),t._v(". It also automatically configures the "),e("a",{attrs:{href:"https://docs.feathersjs.com/api/authentication/oauth2.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Feathers OAuth2 plugin"),e("OutboundLink")],1),t._v(" for "),e("a",{attrs:{href:"https://github.com/jaredhanson/passport-github",target:"_blank",rel:"noopener noreferrer"}},[t._v("GitHub"),e("OutboundLink")],1),t._v(", "),e("a",{attrs:{href:"https://github.com/jaredhanson/passport-google-oauth2",target:"_blank",rel:"noopener noreferrer"}},[t._v("Google"),e("OutboundLink")],1),t._v(", "),e("a",{attrs:{href:"https://github.com/kalisio/passport-openidconnect",target:"_blank",rel:"noopener noreferrer"}},[t._v("OpenID Connect"),e("OutboundLink")],1),t._v(" and "),e("a",{attrs:{href:"https://github.com/bainweb/passport-oauth2-cognito",target:"_blank",rel:"noopener noreferrer"}},[t._v("Congnito"),e("OutboundLink")],1),t._v(" if you provide them in your "),e("RouterLink",{attrs:{to:"/guides/basics.html#configuring"}},[t._v("configuration file")]),t._v(".")],1),t._v(" "),e("p",[t._v("You can read "),e("a",{attrs:{href:"https://blog.feathersjs.com/how-to-setup-oauth-flow-with-featherjs-522bdecb10a8",target:"_blank",rel:"noopener noreferrer"}},[t._v("this article"),e("OutboundLink")],1),t._v(" to learn more about the underlying process.")]),t._v(" "),e("h3",{attrs:{id:"https-support"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#https-support"}},[t._v("#")]),t._v(" HTTPS support")]),t._v(" "),e("p",[t._v("Adding the right configuration like below you can easily Weacast run under "),e("a",{attrs:{href:"https://docs.feathersjs.com/api/express.html#https",target:"_blank",rel:"noopener noreferrer"}},[t._v("HTTPS"),e("OutboundLink")],1),t._v(":")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("https")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("key")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" path"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("join")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("__dirname"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'server.key'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("cert")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" path"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("join")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("__dirname"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'server.crt'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("port")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" process"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("env"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token constant"}},[t._v("HTTPS_PORT")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("||")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("8084")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("h2",{attrs:{id:"client-setup"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#client-setup"}},[t._v("#")]),t._v(" Client setup")]),t._v(" "),e("p",[t._v("The Weacast "),e("a",{attrs:{href:"https://github.com/weacast/weacast",target:"_blank",rel:"noopener noreferrer"}},[t._v("core module"),e("OutboundLink")],1),t._v(" provides a helper to quickly initialize what is required for your "),e("a",{attrs:{href:"https://docs.feathersjs.com/api/client.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("client application"),e("OutboundLink")],1),t._v(".")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" weacast "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@weacast/core/client'")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Initialize API wrapper")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" api "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("weacast")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Retrieve a given service")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" probes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" api"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("getService")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'probes'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),e("h2",{attrs:{id:"application-api"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#application-api"}},[t._v("#")]),t._v(" Application API")]),t._v(" "),e("h3",{attrs:{id:"getservice-name-backend-client"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#getservice-name-backend-client"}},[t._v("#")]),t._v(" .getService(name) - backend/client")]),t._v(" "),e("p",[t._v("Retrieve the given service by name, should replace "),e("a",{attrs:{href:"https://docs.feathersjs.com/api/application.html#servicepath",target:"_blank",rel:"noopener noreferrer"}},[t._v("Feathers service method"),e("OutboundLink")],1),t._v(" so that you are abstracted away from service path (i.e. API prefix) and only refer to it by internal name.")]),t._v(" "),e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),e("p",[t._v("On the client side this is also used to instantiate the service on first call.")])]),t._v(" "),e("h3",{attrs:{id:"getelementservices-name-backend-only"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#getelementservices-name-backend-only"}},[t._v("#")]),t._v(" .getElementServices(name) - backend only")]),t._v(" "),e("p",[t._v("Retrieve all forecast element services related to a forecast model (or all if not provided) instance by name.")]),t._v(" "),e("h3",{attrs:{id:"createservice-name-app-modelspath-servicespath-backend-only"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#createservice-name-app-modelspath-servicespath-backend-only"}},[t._v("#")]),t._v(" .createService(name, app, modelsPath, servicesPath) - backend only")]),t._v(" "),e("p",[t._v("Create a new service attached to the application by name and given a set of directories where to find model/service")]),t._v(" "),e("p",[t._v("This assumes you have created a "),e("em",[t._v("models")]),t._v(" and "),e("em",[t._v("services")]),t._v(" directories containing the required files to declare your service, e.g. your folder/file hierarchy should look like this:")]),t._v(" "),e("ul",[e("li",[e("em",[t._v("index.js")])]),t._v(" "),e("li",[e("em",[t._v("models")]),t._v(" : constains one file per database adapter you'd like to support, e.g.\n"),e("ul",[e("li",[e("em",[t._v("serviceName.model.mongodb.js")]),t._v(" : exporting the data model managed by your service in "),e("a",{attrs:{href:"https://docs.feathersjs.com/api/databases/mongodb.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("MongoDB"),e("OutboundLink")],1)])])]),t._v(" "),e("li",[e("em",[t._v("services")]),t._v(" "),e("ul",[e("li",[e("em",[t._v("serviceName")]),t._v(" "),e("ul",[e("li",[e("em",[t._v("serviceName.hooks.js")]),t._v(" : exporting the "),e("a",{attrs:{href:"https://docs.feathersjs.com/api/hooks.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("hooks"),e("OutboundLink")],1),t._v(" of your service,")]),t._v(" "),e("li",[e("em",[t._v("serviceName.filters.js")]),t._v(" : exporting the "),e("a",{attrs:{href:"https://docs.feathersjs.com/api/events.html#event-filtering",target:"_blank",rel:"noopener noreferrer"}},[t._v("filters"),e("OutboundLink")],1),t._v(" of your service,")]),t._v(" "),e("li",[e("em",[t._v("serviceName.service.js")]),t._v(" : exporting the specific mixin associated to your service (optional)")])])])])])]),t._v(" "),e("div",{staticClass:"custom-block warning"},[e("p",{staticClass:"custom-block-title"},[t._v("WARNING")]),t._v(" "),e("p",[t._v("Only "),e("a",{attrs:{href:"https://docs.feathersjs.com/api/databases/mongodb.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("MongoDB"),e("OutboundLink")],1),t._v(" is officially supported right now although we had an experimental attempt with "),e("a",{attrs:{href:"https://github.com/feathersjs/feathers-levelup",target:"_blank",rel:"noopener noreferrer"}},[t._v("LevelUP"),e("OutboundLink")],1),t._v(" as well. Please contact us if you'd like to support more adapters.")])]),t._v(" "),e("h3",{attrs:{id:"createelementservice-forecast-element-app-servicespath-backend-only"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#createelementservice-forecast-element-app-servicespath-backend-only"}},[t._v("#")]),t._v(" .createElementService(forecast, element, app, servicesPath) - backend only")]),t._v(" "),e("p",[t._v("Internally used by "),e("RouterLink",{attrs:{to:"/api/plugin.html"}},[t._v("forecast model plugins")]),t._v(", similar to above but using the built-in forecast element model.")],1),t._v(" "),e("h2",{attrs:{id:"application-hooks"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#application-hooks"}},[t._v("#")]),t._v(" Application Hooks")]),t._v(" "),e("p",[t._v("The following "),e("RouterLink",{attrs:{to:"/api/hooks.html"}},[t._v("hooks")]),t._v(" are globally executed on the application:\n"),e("img",{attrs:{src:a(416),alt:"Application hooks"}})],1)])}),[],!1,null,null,null);e.default=r.exports}}]);