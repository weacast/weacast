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
    "revision": "acda2c41250c8fe6286fb1361e855cbf"
  },
  {
    "url": "about/contact.html",
    "revision": "015fa861196a290f5b9394ea2504fbf4"
  },
  {
    "url": "about/ecosystem.html",
    "revision": "85dd04082937d80f62f9ec695a06a6f1"
  },
  {
    "url": "about/index.html",
    "revision": "234a4be219093d5cb614ed9f4fd4b068"
  },
  {
    "url": "about/license.html",
    "revision": "3dee9d3b14da6f16e45395542f758a0c"
  },
  {
    "url": "about/roadmap.html",
    "revision": "85b76419ac23f2f55ae9ef89a8564757"
  },
  {
    "url": "about/showcase.html",
    "revision": "47ff4babf09996d56223109d2963f4b8"
  },
  {
    "url": "api/alert.html",
    "revision": "34b6618b791d28f05784bbc427708d8c"
  },
  {
    "url": "api/application.html",
    "revision": "f56dfa7485cf0d075d034abbcf4b9016"
  },
  {
    "url": "api/element.html",
    "revision": "0f5330eba960cc2c1b44ad011f9dbcba"
  },
  {
    "url": "api/forecast.html",
    "revision": "c0ac3356971b1c1f5a5f171f12f46f59"
  },
  {
    "url": "api/grid.html",
    "revision": "915a55354dd08647abad9b035f568a1d"
  },
  {
    "url": "api/hooks.html",
    "revision": "9b0d8483e2056c6943621955c90d8dbe"
  },
  {
    "url": "api/index.html",
    "revision": "7645d307c21b972970c1c711d9d0c742"
  },
  {
    "url": "api/layers.html",
    "revision": "7a817d7a21091450f22df39ea09b1447"
  },
  {
    "url": "api/loader.html",
    "revision": "204e192965a320bb588cdc47e521bd8c"
  },
  {
    "url": "api/mixins.html",
    "revision": "5df4d98d0865c145d0f0bc776dd2322e"
  },
  {
    "url": "api/plugin.html",
    "revision": "5bd973e17ec35ee13cec3a3e9d2087d1"
  },
  {
    "url": "api/probe.html",
    "revision": "ed56a7c4937510f2a5552d7c858e2fcc"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "f8362610060f16d742402e82beb1fb4b"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "71bab2ba2257e7121d085aea2850b2b5"
  },
  {
    "url": "architecture/domain-model.html",
    "revision": "31c4c879a14b6b8ebc919f7457ed8235"
  },
  {
    "url": "architecture/dynamic-view.html",
    "revision": "dae59df09c9fe969b19bb1c9e3b70841"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "275230773df246669e1a163e988ba4aa"
  },
  {
    "url": "architecture/index.html",
    "revision": "2c9fd46fbbb6e5e9810df13ddb472aca"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "1eec905fb0b5e7b543e84a5669cbe36c"
  },
  {
    "url": "assets/css/0.styles.9527b1d4.css",
    "revision": "d46a2ab1e6a2fb45549598e0f0a6e6fc"
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
    "url": "assets/js/10.ad8453ae.js",
    "revision": "0cf7b725c3ae4c7477f13fda7214ac60"
  },
  {
    "url": "assets/js/11.4f3f0fbb.js",
    "revision": "585668a6fd35362f0caf2c2050e65bda"
  },
  {
    "url": "assets/js/12.8fef0f62.js",
    "revision": "1ce4b0c0d01149dc4648de72b1dc0593"
  },
  {
    "url": "assets/js/13.6fc839d2.js",
    "revision": "824acf63d58dbea21053f2f58925f607"
  },
  {
    "url": "assets/js/14.190f2928.js",
    "revision": "5a2be88435bbdcfd0012b390f320fbef"
  },
  {
    "url": "assets/js/15.c62a707e.js",
    "revision": "f4865a0bfffb7455475027f2b93370a9"
  },
  {
    "url": "assets/js/16.978240e4.js",
    "revision": "a4f13a3c0aa8d81d330fbb26ac15c4ec"
  },
  {
    "url": "assets/js/17.8467f210.js",
    "revision": "d603ac05ccca52bc954d586633e7fb55"
  },
  {
    "url": "assets/js/18.163ce16a.js",
    "revision": "5f8a950eeea98c8c984acfc24b380d70"
  },
  {
    "url": "assets/js/19.f53d495f.js",
    "revision": "12766225b1862bf39078280fde1ceb68"
  },
  {
    "url": "assets/js/2.80a13b76.js",
    "revision": "1bd3762777efba263ab82debe20c4c6f"
  },
  {
    "url": "assets/js/20.889ac0ed.js",
    "revision": "fba487b55aa72ba3441847dd0fec5f21"
  },
  {
    "url": "assets/js/21.a16b2983.js",
    "revision": "805d8f550f215753e03e261704342b6b"
  },
  {
    "url": "assets/js/22.7980f715.js",
    "revision": "3d2adb263fd2f10f3119ea50bc29a350"
  },
  {
    "url": "assets/js/23.d5c60238.js",
    "revision": "8b2612fe0be9042b8275ad261956e6c4"
  },
  {
    "url": "assets/js/24.b114f8e0.js",
    "revision": "e99c52a69afbb8c5959b361cb4459737"
  },
  {
    "url": "assets/js/25.2963c0d9.js",
    "revision": "833076537e85e670aff79eb3e375a14b"
  },
  {
    "url": "assets/js/26.6e117de9.js",
    "revision": "133370b7d47493e80207b21e635f5cb0"
  },
  {
    "url": "assets/js/27.0658503c.js",
    "revision": "c03246902280ff62fbe07b8873a5561f"
  },
  {
    "url": "assets/js/28.5deae372.js",
    "revision": "aec9ccf69b305995ea22f34f1ea76cd5"
  },
  {
    "url": "assets/js/29.22f4135b.js",
    "revision": "09ae458b510715da91aedbf8e58cd8bf"
  },
  {
    "url": "assets/js/3.0ff65fcc.js",
    "revision": "5078a1143e4106b57f35f1b29a6d8fc1"
  },
  {
    "url": "assets/js/30.f7e98609.js",
    "revision": "b8df2a41f351e2a6d402829d05a198c9"
  },
  {
    "url": "assets/js/31.ceb3bb99.js",
    "revision": "71f4c84e4cf3b02a0caadcbc0eb2a953"
  },
  {
    "url": "assets/js/32.29c6b6e1.js",
    "revision": "d310507734fa07da06d3dda9f5bb0d9f"
  },
  {
    "url": "assets/js/33.706865ee.js",
    "revision": "b20a9ac1c60e702ce2061dced9b030bd"
  },
  {
    "url": "assets/js/34.2888c40c.js",
    "revision": "121461e4149d0e80f6864de32aabcec0"
  },
  {
    "url": "assets/js/35.6f0e05e4.js",
    "revision": "a3d6dca2edb74e5a40546973a156327d"
  },
  {
    "url": "assets/js/36.c450d7f6.js",
    "revision": "bd3aa1ec81650a2320cab554368a9dde"
  },
  {
    "url": "assets/js/37.df0f851c.js",
    "revision": "7616a2c99a2066df9e663c90f025cd76"
  },
  {
    "url": "assets/js/38.64112eb7.js",
    "revision": "6d26c61b2cf9e8d24b79b54d9477e5fe"
  },
  {
    "url": "assets/js/39.2bdf94c9.js",
    "revision": "7b0b15246dc48d62c8c1edfdd7b4622a"
  },
  {
    "url": "assets/js/4.4fc1800b.js",
    "revision": "c4888e223f9e528a19e8bc57cc56e744"
  },
  {
    "url": "assets/js/40.5035c37a.js",
    "revision": "cd06a8b9b03e1f7456180f81022777f8"
  },
  {
    "url": "assets/js/41.bc93dd04.js",
    "revision": "44a171ca7896438ecef433232e155563"
  },
  {
    "url": "assets/js/42.cf7414ad.js",
    "revision": "bd75edc7a92a412943452f410e03554e"
  },
  {
    "url": "assets/js/5.6313696f.js",
    "revision": "e9939bb3448824b6ac65d5cb2f553277"
  },
  {
    "url": "assets/js/6.d4ff00ae.js",
    "revision": "16f3c32c1d461c51a0427c56a9217320"
  },
  {
    "url": "assets/js/7.f1b918e0.js",
    "revision": "b59e46dbbfcb548fc85581ae7b86866e"
  },
  {
    "url": "assets/js/8.51ffcda0.js",
    "revision": "eb922396dd1139c6c0a86868f47ce4a0"
  },
  {
    "url": "assets/js/9.23dadda0.js",
    "revision": "e4c4478515f9a264d2f69b2c965377a8"
  },
  {
    "url": "assets/js/app.cb403563.js",
    "revision": "1e1c718030f17be10d8b1df74e70ba94"
  },
  {
    "url": "guides/basics.html",
    "revision": "ab1a8e4e7f013eff7115a8a58a7c47ea"
  },
  {
    "url": "guides/development.html",
    "revision": "f9a1bab59afe54f3eb4d0295b2b5abf8"
  },
  {
    "url": "guides/index.html",
    "revision": "31a80d24db0e3e85cb925cd159364038"
  },
  {
    "url": "index.html",
    "revision": "aaa6a258f7c7d2f6e7f2d63d1862e42a"
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
