import{_ as e,c as a,o as t,ak as o}from"./chunks/framework.B3JW-Vb0.js";const s="/weacast/assets/demo-gui.CaG4cnvs.png",r="/weacast/assets/weacast-wind.CLoFb-AE.png",i="/weacast/assets/weacast-timeline.B7rmssI5.png",n="/weacast/assets/weacast-probe.BWoYEdYP.png",c="/weacast/assets/weacast-probe-location.BLB1UQz1.png",l="/weacast/assets/weacast-alert.CNfSlC-q.png",v=JSON.parse('{"title":"Showcase","description":"","frontmatter":{},"headers":[],"relativePath":"about/showcase.md","filePath":"about/showcase.md"}'),p={name:"about/showcase.md"},d=o('<h1 id="showcase" tabindex="-1">Showcase <a class="header-anchor" href="#showcase" aria-label="Permalink to &quot;Showcase&quot;">​</a></h1><h2 id="demo-application" tabindex="-1">Demo application <a class="header-anchor" href="#demo-application" aria-label="Permalink to &quot;Demo application&quot;">​</a></h2><p>You can find the source code of our web application demo in the <a href="https://github.com/weacast/weacast-app" target="_blank" rel="noreferrer">weacast-app</a> repository, which mainly provides frontend objects for mapping. It depends on the <a href="https://github.com/weacast/weacast" target="_blank" rel="noreferrer">weacast API</a> module providing the backend services.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>The demo application is not actively maintained. If you&#39;d like to build client applications using Weacast you&#39;d better use the client API layer in the <a href="https://github.com/weacast/weacast-core" target="_blank" rel="noreferrer">core module</a> and dedicated map engine modules like our <a href="https://github.com/weacast/weacast-leaflet" target="_blank" rel="noreferrer">Leaflet plugin</a>.</p></div><p>On our demo weather data is gathered from the GFS (NCEP) and ARPEGE (Météo France) forecast models. The map shows:</p><ul><li>wind u/v-components (i.e. speed and direction) using a <a href="./../api/layers.html#flowlayer-source">flow layer</a></li><li>wind gust (i.e. max speed) using a <a href="./../api/layers.html#heatlayer-source">heat layer</a> or a <a href="./../api/layers.html#scalarlayer-source">scalar layer</a></li><li>precipitations using an additional <a href="./../api/layers.html#scalarlayer-source">scalar layer</a></li><li>a worldwide set of airports used to <a href="./../architecture/main-concepts.html#probe">probe</a> forecast data at these locations</li></ul><p>Using the playback buttons at the bottom of the map you can navigate among available forecast times and see the map change. On the side menu you can select the currently visualized weather forecast model. Last but not least, using the search button on the map you will be able to find the airport matching best specific wind conditions (i.e. speed/direction) based on the probed data. The analysis uses the <a href="https://github.com/weacast/weacast-app/blob/master/src/components/WindSeeker.vue#L125" target="_blank" rel="noreferrer">same weight</a> for both speed and direction differences so that it might result in a good match on speed <strong>and/or</strong> direction depending on the weather. You can also probe your own data by importing a GeoJSON file containing a collection of points, each location will be probed for the current forecast time.</p><p>You can also obtain a timeseries of forecast elements by either selecting one of the airports or double click on any location on the map. You will then see a timeseries button appear, which allow to open a popup displaying different graphs. Last but not least, you can activate an <a href="./../architecture/main-concepts.html#alert">alert zone</a> in the layer list to raise alerts in Paris whenever the wind speed is greater than 0 (this is of course unrealistic alert conditions to ensure it will always raises for demonstration purpose !).</p><p><img src="'+s+'" alt="Live demo"></p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Be sure to also have a look to our list of known <a href="./ecosystem.html#production-applications">production applications</a>.</p></div><h2 id="visualize-forecast-data" tabindex="-1">Visualize forecast data <a class="header-anchor" href="#visualize-forecast-data" aria-label="Permalink to &quot;Visualize forecast data&quot;">​</a></h2><p>This short video demonstrates how Weacast can be used to gather forecast data from different models to visualize and predict wind in different locations.</p><p><a href="https://www.youtube.com/watch?v=JHU7WbETWjw" target="_blank" rel="noreferrer"><img src="'+r+'" alt="Weacast video"></a></p><h2 id="explore-forecast-data" tabindex="-1">Explore forecast data <a class="header-anchor" href="#explore-forecast-data" aria-label="Permalink to &quot;Explore forecast data&quot;">​</a></h2><p>This short video demonstrates how Weacast can be used to explore forecast data and future wind prediction using a timeline widget.</p><p><a href="https://www.youtube.com/watch?v=YcWIlnSbpoo" target="_blank" rel="noreferrer"><img src="'+i+'" alt="Weacast video"></a></p><h2 id="probe-forecast-data" tabindex="-1">Probe forecast data <a class="header-anchor" href="#probe-forecast-data" aria-label="Permalink to &quot;Probe forecast data&quot;">​</a></h2><p>This short video demonstrates how Weacast can be used to probe your own business data to find locations matching target weather conditions. Using runways data, first are found airports with a target wind direction, then runways with a target wind direction relative to their own orientation.</p><p><a href="https://www.youtube.com/watch?v=4jvwNUbzuAY" target="_blank" rel="noreferrer"><img src="'+n+'" alt="Weacast video"></a></p><p>This short video demonstrates how Weacast can be used to probe your own business data or any location in the world to obtain timeseries of forecast elements.</p><p><a href="https://www.youtube.com/watch?v=43xdvaVXVUo" target="_blank" rel="noreferrer"><img src="'+c+'" alt="Weacast video"></a></p><p>This image illustrates how Weacast can be used to raise alerts on your probes with respect to weather conditions (temperature, humidity, pressure, etc.) in a specified period of time and area.</p><p><img src="'+l+'" alt="Live demo"></p>',23),h=[d];function u(m,f,w,b,g,_){return t(),a("div",null,h)}const k=e(p,[["render",u]]);export{v as __pageData,k as default};
