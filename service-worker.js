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
    "revision": "60fea5d54f0040f9e8fd363e527fcc09"
  },
  {
    "url": "about/contact.html",
    "revision": "e009b71a92facc297d3de3e3b7a6b8a3"
  },
  {
    "url": "about/ecosystem.html",
    "revision": "eab84c31cec7a2b72ff080d826558951"
  },
  {
    "url": "about/index.html",
    "revision": "343961da06b68339ea77de31873d7410"
  },
  {
    "url": "about/license.html",
    "revision": "5b8ba9b846c4ea86aae368182d297167"
  },
  {
    "url": "about/roadmap.html",
    "revision": "31fea7d086bbe3bd9c8c2171b4f75717"
  },
  {
    "url": "about/showcase.html",
    "revision": "28009c607091e25aaccdab267a5e4438"
  },
  {
    "url": "api/alert.html",
    "revision": "df11679a4da29514b48d8cf011f80e42"
  },
  {
    "url": "api/application.html",
    "revision": "0d9008f67e9804287d4352b1b433b67e"
  },
  {
    "url": "api/element.html",
    "revision": "f39271a1faeced76103f3943f2a4ea73"
  },
  {
    "url": "api/forecast.html",
    "revision": "6c240a4592070ddb724441212d101db4"
  },
  {
    "url": "api/grid.html",
    "revision": "6ad94186685a459e42acc7c906268743"
  },
  {
    "url": "api/hooks.html",
    "revision": "b6c1e9e2a1e6e83589904bf1476bed83"
  },
  {
    "url": "api/index.html",
    "revision": "b687830e1c2cb0ec5b89884366f63cfa"
  },
  {
    "url": "api/layers.html",
    "revision": "c875779e94664529edea46a04b76b14f"
  },
  {
    "url": "api/loader.html",
    "revision": "78a9a3da5641239186359722ff50c72b"
  },
  {
    "url": "api/mixins.html",
    "revision": "3197948dd146f825292096116fe8f16e"
  },
  {
    "url": "api/plugin.html",
    "revision": "21974b4ab320c1c6698f5fd8be1479ab"
  },
  {
    "url": "api/probe.html",
    "revision": "aa7f8e6a8c28892f643e6342876a77ff"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "da9368528479ac7d5af653ade6e3b749"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "cf7c074c2b02066f042737794156501b"
  },
  {
    "url": "architecture/domain-model.html",
    "revision": "879309f844c722de60538702b7ae1494"
  },
  {
    "url": "architecture/dynamic-view.html",
    "revision": "e3064e20b1a0fd44ff5ed489711a7a3d"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "27c143d0bed48be3a18bc77c99903f55"
  },
  {
    "url": "architecture/index.html",
    "revision": "5c7faf6446a336901c300509f188d43f"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "3535d1eeb5baeb3729f091e50b2971f3"
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
    "url": "assets/js/10.0bd69f78.js",
    "revision": "9edab7057c2294f1ff7858ecde429098"
  },
  {
    "url": "assets/js/11.222fb095.js",
    "revision": "391d98126f88d6e15e88a8176e137189"
  },
  {
    "url": "assets/js/12.3d9f2c05.js",
    "revision": "06adc18193d0e10cc0afe02c95bc66ab"
  },
  {
    "url": "assets/js/13.8d459d3e.js",
    "revision": "64603d5061605ce13475aa90c2276528"
  },
  {
    "url": "assets/js/14.ac0434c5.js",
    "revision": "d59cd74426be50165e50d5d1dc4e3730"
  },
  {
    "url": "assets/js/15.0ecd3040.js",
    "revision": "cc49f008d7259f01e2d2b41cab87b270"
  },
  {
    "url": "assets/js/16.35c50976.js",
    "revision": "d07acbc77a18cae914b1f42f619a106f"
  },
  {
    "url": "assets/js/17.46c51dc9.js",
    "revision": "a189189470db543f9559234381ee631d"
  },
  {
    "url": "assets/js/18.507afa88.js",
    "revision": "7e0a37aa15b8473f8bc84c416b456b78"
  },
  {
    "url": "assets/js/19.cdca6a83.js",
    "revision": "2bad180337ac4819904038dcc1e5b9e2"
  },
  {
    "url": "assets/js/2.cb793405.js",
    "revision": "23d6437345c192a125109c745b9af0f2"
  },
  {
    "url": "assets/js/20.da810556.js",
    "revision": "3f4e41c568383a3594d22ff973a3e3db"
  },
  {
    "url": "assets/js/21.826d11b5.js",
    "revision": "801b788fb09d587393e648627ba6d86e"
  },
  {
    "url": "assets/js/22.6e76a2df.js",
    "revision": "615bd370ce4306cc1a0086a28221a353"
  },
  {
    "url": "assets/js/23.29521f1b.js",
    "revision": "01a8023a0ca2a182a7f892333ac0d9ed"
  },
  {
    "url": "assets/js/24.be326c0b.js",
    "revision": "a2d45a1ddb156f119f7d4e568e554919"
  },
  {
    "url": "assets/js/25.4afed87e.js",
    "revision": "50407dbb77903044ccd55d3a1d7bd225"
  },
  {
    "url": "assets/js/26.4dda818c.js",
    "revision": "64e6c0fe0334b9fedeed10876a5fe2f2"
  },
  {
    "url": "assets/js/27.fa76a0ed.js",
    "revision": "e7f666c11d85dbd2672ca0cd205cb3ed"
  },
  {
    "url": "assets/js/28.e6136d9a.js",
    "revision": "e60aae7824e5bd6b7a9dfa93de106d60"
  },
  {
    "url": "assets/js/29.55793532.js",
    "revision": "5ceb8422e447a20881f3343199f72a5c"
  },
  {
    "url": "assets/js/3.b15629dc.js",
    "revision": "97599615b312e4a559239689a02c47de"
  },
  {
    "url": "assets/js/30.392a95cb.js",
    "revision": "abc106e497c54ddfb81f3500f83d706a"
  },
  {
    "url": "assets/js/31.b19573bb.js",
    "revision": "734c90d35926bf0580fc8e37357ce930"
  },
  {
    "url": "assets/js/32.d0c09c6f.js",
    "revision": "4afbd55fa7b363274260badc489c5ad7"
  },
  {
    "url": "assets/js/33.b2ac416b.js",
    "revision": "5fc0d6d604bf49d111beb8ed8e74df93"
  },
  {
    "url": "assets/js/34.8a18087e.js",
    "revision": "e62d25e6be72dc6e528642fe14a62386"
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
    "url": "assets/js/38.4ffe1c7b.js",
    "revision": "c1fbb549d797cfbe139373f56671cb3e"
  },
  {
    "url": "assets/js/39.8ebd1583.js",
    "revision": "3b54f6d9dda3a6a01c1fa1b6c261c50a"
  },
  {
    "url": "assets/js/4.5a12e330.js",
    "revision": "680ea16cdfa0b018515001299624e54c"
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
    "url": "assets/js/5.96f31a56.js",
    "revision": "cd993315eee394ce051ef8c0bdc9a590"
  },
  {
    "url": "assets/js/6.986ec23e.js",
    "revision": "ff73e5211661cd8ddc55f471974953bd"
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
    "url": "assets/js/app.ac060bd1.js",
    "revision": "c06670938a4d8ed4e50740527e52a8a0"
  },
  {
    "url": "guides/basics.html",
    "revision": "4f6fc2e71e32f3d24d31d0c6de272b78"
  },
  {
    "url": "guides/development.html",
    "revision": "91cc09e69f9ee1e042fb9e37615867de"
  },
  {
    "url": "guides/index.html",
    "revision": "3ee6e280b6c10a4ac908a75ffdbba409"
  },
  {
    "url": "index.html",
    "revision": "181fc91022e1efc5bc9b2ed3436ba3d2"
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
