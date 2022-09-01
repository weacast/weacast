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
    "revision": "677305fb21b45b41cb3ff68d886264c7"
  },
  {
    "url": "about/contact.html",
    "revision": "1accf0b68ce2414ee53f182b5f1fc960"
  },
  {
    "url": "about/ecosystem.html",
    "revision": "1074b2642e482f1353fa36da8e115d9b"
  },
  {
    "url": "about/index.html",
    "revision": "7458e736496c5e83bc4ebaaa560bd1f1"
  },
  {
    "url": "about/license.html",
    "revision": "81cd8d4b167f586fefd691e5f0dabccc"
  },
  {
    "url": "about/roadmap.html",
    "revision": "d6d3c07ff9e202bb1b042e265fa5a209"
  },
  {
    "url": "about/showcase.html",
    "revision": "c0b9023edc637e8318fdaeef075d616b"
  },
  {
    "url": "api/alert.html",
    "revision": "9512f084d8074b3527b9a8afb2805283"
  },
  {
    "url": "api/application.html",
    "revision": "f16d15792f3cc441e23ab789a9ce002d"
  },
  {
    "url": "api/element.html",
    "revision": "8ee39b91cf39f4e5a12f569d1409bde2"
  },
  {
    "url": "api/forecast.html",
    "revision": "b4b5d4acc1bb181e9080a0ed2acb0e21"
  },
  {
    "url": "api/grid.html",
    "revision": "cedf21e7a8871d8bdc07d0402d22353e"
  },
  {
    "url": "api/hooks.html",
    "revision": "4f99317f6c4562159a3545f17ee53158"
  },
  {
    "url": "api/index.html",
    "revision": "5e2fb01159e51facb3243fedb118148c"
  },
  {
    "url": "api/layers.html",
    "revision": "134183fbd025adca1bb69f1114f58738"
  },
  {
    "url": "api/loader.html",
    "revision": "e04ed75115675a6b73f43b00912c03e5"
  },
  {
    "url": "api/mixins.html",
    "revision": "419acfb5fa3eed9508f1c6d6b1c89eba"
  },
  {
    "url": "api/plugin.html",
    "revision": "067d8b98e9a4f7266bec09a3dcffb6dc"
  },
  {
    "url": "api/probe.html",
    "revision": "8e6c05b7301882b1d7e3c152cdb62dd2"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "85c4fb702f704d854e58e0b2d07c407f"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "06fc3a98121cee47662ac9cc981c1461"
  },
  {
    "url": "architecture/domain-model.html",
    "revision": "f670cf9b5907b83652d33b88dae9c95e"
  },
  {
    "url": "architecture/dynamic-view.html",
    "revision": "d657547a9d43af6618f8efa2cb33707b"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "a37bfc1ad7dbf59fcee12dd37fd52fe2"
  },
  {
    "url": "architecture/index.html",
    "revision": "72e7024464bfbfeb588ecbaf1b361ef9"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "312d9279efe17e741f51070ced1b62c3"
  },
  {
    "url": "assets/css/0.styles.b919eae8.css",
    "revision": "903e9b8872829882a06e1e6ebc935190"
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
    "url": "assets/img/component.7e4b2cd8.svg",
    "revision": "7e4b2cd86d821432e65013aabd98ff1b"
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
    "url": "assets/img/etl-sequence.0e075755.svg",
    "revision": "0e07575581ae9fd9698d478e1e66bb55"
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
    "url": "assets/js/10.1e6aca52.js",
    "revision": "bc4ebabedbcf3c9f9f6a0c477cfecf34"
  },
  {
    "url": "assets/js/11.720101ee.js",
    "revision": "3561d2c7bd89e06b4e668b54ab900e77"
  },
  {
    "url": "assets/js/12.83815e84.js",
    "revision": "804c3642136adf88d792d4dc0fa414fa"
  },
  {
    "url": "assets/js/13.a4877bf7.js",
    "revision": "0da948e34a0a515066347f1707d851bc"
  },
  {
    "url": "assets/js/14.16171aa8.js",
    "revision": "e3f99550d2b8f69e5ac48e26683e0f94"
  },
  {
    "url": "assets/js/15.28b58c89.js",
    "revision": "e921e6f0f2f4f4c64c9bbb4cc7dbcae8"
  },
  {
    "url": "assets/js/16.faeeb0c2.js",
    "revision": "daf5074be543bfddaaff96f1b89e84a5"
  },
  {
    "url": "assets/js/17.3cca171c.js",
    "revision": "0a10512fa2afcac949d7b9af602c2f31"
  },
  {
    "url": "assets/js/18.519fff14.js",
    "revision": "e90e96b107a8816856006cbd7c9dfece"
  },
  {
    "url": "assets/js/19.2a11134d.js",
    "revision": "bc722c70ffc70633743376796f6e0f61"
  },
  {
    "url": "assets/js/2.c7fa2fe9.js",
    "revision": "a35eba0d8683e83eec97a36e374c6ece"
  },
  {
    "url": "assets/js/20.0d5c8d0d.js",
    "revision": "17aaed780456b76ec64545a46be42b9a"
  },
  {
    "url": "assets/js/21.0022efe0.js",
    "revision": "f7603b7b6e7f93e02a2295e514c39c8b"
  },
  {
    "url": "assets/js/22.9d418407.js",
    "revision": "4776fc7c1649d9df6838a9d8b2b85f49"
  },
  {
    "url": "assets/js/23.be09926b.js",
    "revision": "1ed821aa555ea678c336ce7fccb208f9"
  },
  {
    "url": "assets/js/24.5d2ae1c7.js",
    "revision": "6be599945c5daf53a2373d8fb08ead29"
  },
  {
    "url": "assets/js/25.edf6895d.js",
    "revision": "e8a20ed62d489471870bf4c423494ef0"
  },
  {
    "url": "assets/js/26.42f80a49.js",
    "revision": "506e75d6bce527416a3170d251f602ee"
  },
  {
    "url": "assets/js/27.a8f6dbff.js",
    "revision": "4c66140985e0076cdf8f149841b91bab"
  },
  {
    "url": "assets/js/28.66a3cea8.js",
    "revision": "acfab890e1cdcbbb997c81b3f9079ddf"
  },
  {
    "url": "assets/js/29.f97ec154.js",
    "revision": "f9e31c3d18ef518995a8a9369aad5c5d"
  },
  {
    "url": "assets/js/3.dd49bf65.js",
    "revision": "14b54a266b2ce9516c5c55c5713cf79b"
  },
  {
    "url": "assets/js/30.4f47cbd9.js",
    "revision": "396fafde3850ef9e18e0348d2801fc88"
  },
  {
    "url": "assets/js/31.b92c26e6.js",
    "revision": "a11de22244548ddae852ee527e9dd135"
  },
  {
    "url": "assets/js/32.cdfb2a96.js",
    "revision": "08a871b967fe14c02ff5d5a394af5a74"
  },
  {
    "url": "assets/js/33.5a8b915e.js",
    "revision": "011ad686a34e7fcc0745faec9ab3dd3a"
  },
  {
    "url": "assets/js/34.b9870969.js",
    "revision": "410587baa4dc15a3585050e1c7c92952"
  },
  {
    "url": "assets/js/35.762200d8.js",
    "revision": "20fec474c5f0eb2eb9b3dae9babbe3c6"
  },
  {
    "url": "assets/js/36.5136db71.js",
    "revision": "c5d516cf3bade89f9dd9a3d9e8007f53"
  },
  {
    "url": "assets/js/37.e6583651.js",
    "revision": "ad34288552f1ff03d0cdd012ceca381b"
  },
  {
    "url": "assets/js/38.0df91617.js",
    "revision": "0a26019b34fcb5070f9c2bafc8bda786"
  },
  {
    "url": "assets/js/39.1c16b9aa.js",
    "revision": "749b101bb81192e05e7099a8e4d6bab8"
  },
  {
    "url": "assets/js/4.1212a244.js",
    "revision": "cf4321b28c0550842ecc1e096bfd48ae"
  },
  {
    "url": "assets/js/40.e63ec89e.js",
    "revision": "ef4688221377717edb83c2beb5edeb35"
  },
  {
    "url": "assets/js/41.49e489ef.js",
    "revision": "9e45c90f629ad1066134ab252e90ca45"
  },
  {
    "url": "assets/js/42.3a0e3b92.js",
    "revision": "abff66eea21fb2626ce6acf4b270fbd6"
  },
  {
    "url": "assets/js/5.a7d71819.js",
    "revision": "d4c88facbefbaf27ef4d1ee75b8ae40c"
  },
  {
    "url": "assets/js/6.bc307403.js",
    "revision": "5710ef2257f837972ede8a04ef31149a"
  },
  {
    "url": "assets/js/7.5652ee95.js",
    "revision": "917648ce570ecd946e07f1ef1eadf20b"
  },
  {
    "url": "assets/js/8.0db594a3.js",
    "revision": "73b7edbc4ce4d153e7f1459b0cc4fc2b"
  },
  {
    "url": "assets/js/9.32d94dd7.js",
    "revision": "0a0826d48a80fa48ccf009e9088ff311"
  },
  {
    "url": "assets/js/app.dd8b61ab.js",
    "revision": "0c0533790c549aa1ea2b213b145d575b"
  },
  {
    "url": "guides/basics.html",
    "revision": "226fb4a40e1675b68f8eee33071c7a09"
  },
  {
    "url": "guides/development.html",
    "revision": "e1f8a6a3f25f52fc78f314f1a1f28afd"
  },
  {
    "url": "guides/index.html",
    "revision": "852b5b86705d09a0c488f05660c6f771"
  },
  {
    "url": "index.html",
    "revision": "a6d4a317dedb7ba3364ae0c12e57478a"
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
