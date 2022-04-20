/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "b34c4bf5228d0bd8bbdc46921d104ca1"
  },
  {
    "url": "about/contact.html",
    "revision": "d1d8802e33a38851ac3472a04d90e710"
  },
  {
    "url": "about/ecosystem.html",
    "revision": "5b80401a036870b4b3ef90b5b911895a"
  },
  {
    "url": "about/index.html",
    "revision": "4a877cfedb9d284d45bdad3bd84475e3"
  },
  {
    "url": "about/license.html",
    "revision": "2a8b5dfd8c39bde0f9097b50761d5dda"
  },
  {
    "url": "about/roadmap.html",
    "revision": "243f33f2957440b8a0e32b3a0196357e"
  },
  {
    "url": "about/showcase.html",
    "revision": "d4ec12615ca3c2d8782bf75941aacf93"
  },
  {
    "url": "api/alert.html",
    "revision": "facf5eca78da158421820d3bc418d756"
  },
  {
    "url": "api/application.html",
    "revision": "421b9748ed887ff17509c1814f27ea0b"
  },
  {
    "url": "api/element.html",
    "revision": "157f53ad86695ae11be349f9c059a8aa"
  },
  {
    "url": "api/forecast.html",
    "revision": "ec4de03ea23917f0dadee8dce8b1d235"
  },
  {
    "url": "api/grid.html",
    "revision": "c0f2a72525675563fd69486e015676e5"
  },
  {
    "url": "api/hooks.html",
    "revision": "400742027c6691b8fd4cd955c7ae2b29"
  },
  {
    "url": "api/index.html",
    "revision": "26fcafdbc0cf85e96e804b978a61d2e0"
  },
  {
    "url": "api/layers.html",
    "revision": "5fca012ddcf5c982438d3225576f3bd4"
  },
  {
    "url": "api/loader.html",
    "revision": "315da633c61936ac90874217d350b652"
  },
  {
    "url": "api/mixins.html",
    "revision": "5a2f92de838517072b6f00bca468072a"
  },
  {
    "url": "api/plugin.html",
    "revision": "849a15f8511321b63186cf4cd9c43a09"
  },
  {
    "url": "api/probe.html",
    "revision": "b9ab87815c99abe303cf64798e58efe9"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "055dfdd7d0a816b0ed21ff6b95aa52b4"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "7c200769b60783cacef805d6b965120d"
  },
  {
    "url": "architecture/domain-model.html",
    "revision": "c4bc326de82b02280dda26ae888355c6"
  },
  {
    "url": "architecture/dynamic-view.html",
    "revision": "a29788ba776d0ee56b06615b9eab9806"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "9cc269dfda7e666420c613da851aa95c"
  },
  {
    "url": "architecture/index.html",
    "revision": "62284e18369dc670f26fb19f054b120c"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "36aabd4e96984d7880e609a0ea65b27d"
  },
  {
    "url": "assets/css/0.styles.a9f019ae.css",
    "revision": "ffa99047eef9b4e54e88961f1266d252"
  },
  {
    "url": "assets/img/alert-data-model.9873ece7.svg",
    "revision": "9873ece7a7f0358e82e39df3fa11f06b"
  },
  {
    "url": "assets/img/application-hooks.17778c0b.svg",
    "revision": "17778c0b723cad0e7ea624d4a36149bc"
  },
  {
    "url": "assets/img/demo-gui.089e7f80.png",
    "revision": "089e7f80e8fecb3c23eee5a51e181644"
  },
  {
    "url": "assets/img/domain-model.c1c7b17f.svg",
    "revision": "c1c7b17f78d96a15a28541e7d421b397"
  },
  {
    "url": "assets/img/element-data-model.15e304c2.svg",
    "revision": "15e304c2912fc7684401139641a47c8a"
  },
  {
    "url": "assets/img/element-hooks.84065c3e.svg",
    "revision": "84065c3e897a19b08ea10a293468923d"
  },
  {
    "url": "assets/img/flow-layer.f4bb86a7.png",
    "revision": "f4bb86a73c4f2b42ae72fc2d90f0f41d"
  },
  {
    "url": "assets/img/forecast-data-model.c1141568.svg",
    "revision": "c11415682aa4611f323dd8e64c8eca08"
  },
  {
    "url": "assets/img/forecast-hooks.4e52c1ee.svg",
    "revision": "4e52c1ee88ea7cfc63e7022f01247cbf"
  },
  {
    "url": "assets/img/global-architecture-v2.515c9d8b.png",
    "revision": "515c9d8be47c7fe5b0f4bba6fe89ccf5"
  },
  {
    "url": "assets/img/global-architecture.c9eb93bc.png",
    "revision": "c9eb93bcb17d1b3499368d7e9b114ffa"
  },
  {
    "url": "assets/img/probe-data-model.837741f0.svg",
    "revision": "837741f078bb342a0ae53af0ea7a4f2f"
  },
  {
    "url": "assets/img/probe-hooks.b36dde04.svg",
    "revision": "b36dde0427b4642df978d51bf60c5265"
  },
  {
    "url": "assets/img/probe-result-data-model.f209e861.svg",
    "revision": "f209e861a0d250914485ed7eb17a85fc"
  },
  {
    "url": "assets/img/probe-result-hooks.630d12f2.svg",
    "revision": "630d12f21ffb1e73648f6bc7af19eea9"
  },
  {
    "url": "assets/img/scalar-layer-interpolated.77d2160e.png",
    "revision": "77d2160e2a97d56f525fcba65e9b564d"
  },
  {
    "url": "assets/img/scalar-layer-raw.34fa3550.png",
    "revision": "34fa3550cfd0fd47efc1755b5e8b39af"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/img/weacast-alert.72238de6.png",
    "revision": "72238de65a80cc714c042c2bac32feb2"
  },
  {
    "url": "assets/img/weacast-probe-location.250d7aed.png",
    "revision": "250d7aed75cc2f6c04ab62fcd6a86c22"
  },
  {
    "url": "assets/img/weacast-probe.a76e8a52.png",
    "revision": "a76e8a523999ef69115551300020eb58"
  },
  {
    "url": "assets/img/weacast-timeline.fbea36b5.png",
    "revision": "fbea36b5d3bf5e95bee0741ed6c500ae"
  },
  {
    "url": "assets/img/weacast-wind.58090169.png",
    "revision": "580901692b6d9f8fd2709ab8d4c6925c"
  },
  {
    "url": "assets/img/windbarb-layer.9029ed85.png",
    "revision": "9029ed8552ecb7092433dd6561984888"
  },
  {
    "url": "assets/js/10.0bd69f78.js",
    "revision": "9edab7057c2294f1ff7858ecde429098"
  },
  {
    "url": "assets/js/11.040f7ff3.js",
    "revision": "4618810faca89e408fde3e4a5b0894de"
  },
  {
    "url": "assets/js/12.f58edeea.js",
    "revision": "7a1bea3dfcd22c42e8f43e7469420782"
  },
  {
    "url": "assets/js/13.e01bfd6f.js",
    "revision": "757a6606bd6acaf9d1ff792062305461"
  },
  {
    "url": "assets/js/14.0dbe16f3.js",
    "revision": "c8779c2b06fa5d0476bb1d943591874e"
  },
  {
    "url": "assets/js/15.0ecd3040.js",
    "revision": "cc49f008d7259f01e2d2b41cab87b270"
  },
  {
    "url": "assets/js/16.65d0d326.js",
    "revision": "e6f3f77bd2da616cd7d63e28452d97d6"
  },
  {
    "url": "assets/js/17.b44df975.js",
    "revision": "7eb10d524f8ff863d967cb4aebfab454"
  },
  {
    "url": "assets/js/18.d10ead73.js",
    "revision": "eac12c9eaa9693cbd14f788cc0dc99c9"
  },
  {
    "url": "assets/js/19.7b103dce.js",
    "revision": "50eea44a8b01b1978f0df3aacfc33a96"
  },
  {
    "url": "assets/js/2.cb793405.js",
    "revision": "23d6437345c192a125109c745b9af0f2"
  },
  {
    "url": "assets/js/20.2ed729e6.js",
    "revision": "7a9d14f2bd50ce53f55f22aec78a391e"
  },
  {
    "url": "assets/js/21.fc8255fb.js",
    "revision": "3a16ca4b2da75292982f4b35d46b4c71"
  },
  {
    "url": "assets/js/22.b3593643.js",
    "revision": "4a222b776daba978f689750999522ec1"
  },
  {
    "url": "assets/js/23.f70595dc.js",
    "revision": "ae1417851692ecf891f375cdee9d9cc0"
  },
  {
    "url": "assets/js/24.40a501a8.js",
    "revision": "68e37f6c82bfb7be65d9386804f2dbd1"
  },
  {
    "url": "assets/js/25.5db295f4.js",
    "revision": "788c33709bebc1bbfcc66c0aaf0de2cd"
  },
  {
    "url": "assets/js/26.6bd2fdc2.js",
    "revision": "0c7da4ed3ce6c2e8e07c8b23bf5ce41b"
  },
  {
    "url": "assets/js/27.df480874.js",
    "revision": "7f5a22baf53a8b41f1742c4b513aeceb"
  },
  {
    "url": "assets/js/28.b1a64577.js",
    "revision": "52bd62d8dba0216ca7fde1551fde03ea"
  },
  {
    "url": "assets/js/29.fa0ab62a.js",
    "revision": "512b1dd9d388882dbe1a725a4e09c7f5"
  },
  {
    "url": "assets/js/3.b15629dc.js",
    "revision": "97599615b312e4a559239689a02c47de"
  },
  {
    "url": "assets/js/30.4f78a92a.js",
    "revision": "a9a2c20a7435f9a279edbfa660118284"
  },
  {
    "url": "assets/js/31.87ba8d37.js",
    "revision": "800820489fa91dcb390480fac95ce822"
  },
  {
    "url": "assets/js/32.406dcd6d.js",
    "revision": "88e93f942dada3a0316d07a2a283072d"
  },
  {
    "url": "assets/js/33.c6857bd2.js",
    "revision": "fc9efcb122d00ba2e3c658bcabd3577a"
  },
  {
    "url": "assets/js/34.270732e7.js",
    "revision": "49c4026500b1e15576237cc737c0be3c"
  },
  {
    "url": "assets/js/35.114b641e.js",
    "revision": "6adf289bcceed268fe50c09dc75085ed"
  },
  {
    "url": "assets/js/36.095dbb6c.js",
    "revision": "ca5c5670c3852f7565ff3df285cc7114"
  },
  {
    "url": "assets/js/37.ef2c247e.js",
    "revision": "6d5163e980fd3d116e83aecdf7cc2887"
  },
  {
    "url": "assets/js/38.d5d37a46.js",
    "revision": "108e1da1bd6c7cd0f6d2be5f83906b81"
  },
  {
    "url": "assets/js/39.8ebd1583.js",
    "revision": "3b54f6d9dda3a6a01c1fa1b6c261c50a"
  },
  {
    "url": "assets/js/4.3244724a.js",
    "revision": "49ef1bac4d59b9036b09e6ef6b19d716"
  },
  {
    "url": "assets/js/40.07495c10.js",
    "revision": "b126d4435bf3ed2ba02bfd077ea64e7f"
  },
  {
    "url": "assets/js/41.ccbb3579.js",
    "revision": "eeebb58b4f29900ad622231d6e2d555d"
  },
  {
    "url": "assets/js/42.bff72d9a.js",
    "revision": "d1b7cf58b46afaf530a276e352ed9c3e"
  },
  {
    "url": "assets/js/5.f8dfeef7.js",
    "revision": "60dd9cad4ebf89a2a95c1e7cc38727c3"
  },
  {
    "url": "assets/js/6.173f85e5.js",
    "revision": "e522ebb2684b518100dbaae3f9fc01b5"
  },
  {
    "url": "assets/js/7.672f8327.js",
    "revision": "3c127704282316eadbdf472da4e69486"
  },
  {
    "url": "assets/js/8.38b6ea1d.js",
    "revision": "388e9731516fc2f9d16ba4cffca491e1"
  },
  {
    "url": "assets/js/9.e56c8433.js",
    "revision": "ac04baaeb2ce28b35b463d281808f197"
  },
  {
    "url": "assets/js/app.72cfd8a0.js",
    "revision": "45c4da445137ce0d0518a95111200522"
  },
  {
    "url": "guides/basics.html",
    "revision": "7dbb32241de6ffdd5289d9779e64e168"
  },
  {
    "url": "guides/development.html",
    "revision": "c84cebffe2edb6673c757bf9bfb90ed6"
  },
  {
    "url": "guides/index.html",
    "revision": "5d95d084d292f99f84304725e3a435cd"
  },
  {
    "url": "index.html",
    "revision": "351c282b7b4324c5ea385a2f2f749af4"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
