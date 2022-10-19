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
    "revision": "c3fe77eea727ae26c731c5b61a609ca1"
  },
  {
    "url": "about/contact.html",
    "revision": "4ece0bd69e8239a97d754e6c2c54951f"
  },
  {
    "url": "about/ecosystem.html",
    "revision": "e512ff96508f19042c3e0b939483b357"
  },
  {
    "url": "about/index.html",
    "revision": "3c3b194a6eba78b6dcf3937008efda4b"
  },
  {
    "url": "about/license.html",
    "revision": "beda6869b113afadfd78bacf0c6c58e1"
  },
  {
    "url": "about/roadmap.html",
    "revision": "3e4f78cfeee4a519a5bfe02899cf0350"
  },
  {
    "url": "about/showcase.html",
    "revision": "bbbb1751b2a603f412140dd33994d92b"
  },
  {
    "url": "api/alert.html",
    "revision": "fa6a8dc73735b11b688bde1143d39724"
  },
  {
    "url": "api/application.html",
    "revision": "8d927094f767b76179cc0eac71ea2bdb"
  },
  {
    "url": "api/element.html",
    "revision": "891c02e7c3f8f48485665d1e65b880f3"
  },
  {
    "url": "api/forecast.html",
    "revision": "c94aa157c579035a4587fcbe0e2aea6d"
  },
  {
    "url": "api/grid.html",
    "revision": "04a6b68c4f4b56d11bcdab0720059667"
  },
  {
    "url": "api/hooks.html",
    "revision": "9f971229256c490cc97e551294f20a06"
  },
  {
    "url": "api/index.html",
    "revision": "3ed1e0274dfdcc176458935fc3247404"
  },
  {
    "url": "api/layers.html",
    "revision": "5c3256564a44b75be033cc8b81856f94"
  },
  {
    "url": "api/loader.html",
    "revision": "063d1c26e3465b2faa2ed1942edda2bf"
  },
  {
    "url": "api/mixins.html",
    "revision": "9837516a47c78aa3d0827243a9358c9a"
  },
  {
    "url": "api/plugin.html",
    "revision": "2bc35ef371e6d416fe05fa82c2d05a6d"
  },
  {
    "url": "api/probe.html",
    "revision": "fb50793f2a409abf6ebbe0b759cac606"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "ad5022cc1b59150e4e9c899d488c24dc"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "fdc9e729be28603a835722d8f9f1c273"
  },
  {
    "url": "architecture/domain-model.html",
    "revision": "3fb40b118d66cc7c2a68f47b90c9cbea"
  },
  {
    "url": "architecture/dynamic-view.html",
    "revision": "75be2e08f663925403c872686a84d392"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "1504597f6ff9bf43c905e895e17771f2"
  },
  {
    "url": "architecture/index.html",
    "revision": "06caead11c37f355f292c12fd87d7fb5"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "86979f122e87bc092b809b6ec0a69a83"
  },
  {
    "url": "assets/css/0.styles.839d4ab3.css",
    "revision": "b2cabd1a8709a87ca977cc4479560c71"
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
    "url": "assets/js/10.bf925bca.js",
    "revision": "d29c885862eadcd910fe67ca934dbf8d"
  },
  {
    "url": "assets/js/11.a1eafd96.js",
    "revision": "195d3e1718a435d5044f9acb57cb8fa0"
  },
  {
    "url": "assets/js/12.3bf494a7.js",
    "revision": "e0015264f15c5c6491b6ad5f981cceba"
  },
  {
    "url": "assets/js/13.173572b5.js",
    "revision": "f0eb372feb0cccf82a098dcae4bd6e9f"
  },
  {
    "url": "assets/js/14.186309d9.js",
    "revision": "e1258ae63e75be1d88041c7bb48b0069"
  },
  {
    "url": "assets/js/15.a1ee6a42.js",
    "revision": "7aedca7054376a50b510e53622795f6d"
  },
  {
    "url": "assets/js/16.99c281e6.js",
    "revision": "9472e48559dea47b2a5fe584b81611d0"
  },
  {
    "url": "assets/js/17.f1f60d5d.js",
    "revision": "493d2a20155d0ba916bf50b767f0f1f8"
  },
  {
    "url": "assets/js/18.4151ffb7.js",
    "revision": "076711f4916b4dbee90bd8ab44c13406"
  },
  {
    "url": "assets/js/19.140715f3.js",
    "revision": "b8021488aa11acfb1788aecba6f6343d"
  },
  {
    "url": "assets/js/2.2917992e.js",
    "revision": "9e617f952c79d5619edcb56c33174003"
  },
  {
    "url": "assets/js/20.4c4a514a.js",
    "revision": "aaad59f2be80ab55dc6d2ba7c538189d"
  },
  {
    "url": "assets/js/21.f87c0699.js",
    "revision": "d906abcb8c0595615860ce3bfc449ea8"
  },
  {
    "url": "assets/js/22.abad0510.js",
    "revision": "6124173ce9fbf9bf7b08b4cc22c22678"
  },
  {
    "url": "assets/js/23.597f23da.js",
    "revision": "fd207aeb2e9982f8b67673774d725c27"
  },
  {
    "url": "assets/js/24.2af3b066.js",
    "revision": "43c7c207267c0039067071ade9077712"
  },
  {
    "url": "assets/js/25.9ae144cb.js",
    "revision": "77ee4eb3d70b1b7072eb47fc61014a2f"
  },
  {
    "url": "assets/js/26.858779d5.js",
    "revision": "499ed31aa8c9a5bf124baba56e2c2019"
  },
  {
    "url": "assets/js/27.3a6466d1.js",
    "revision": "57025f131ef8dca170da682d53cfd8a6"
  },
  {
    "url": "assets/js/28.0a2e5496.js",
    "revision": "94ea1707dee37624b0232a0425f299e0"
  },
  {
    "url": "assets/js/29.a8bd578d.js",
    "revision": "8d5c5ce51e194cf284a6fa1d8c35cd67"
  },
  {
    "url": "assets/js/3.348f9e1a.js",
    "revision": "00969b04a529bc514326a19c6f4c7187"
  },
  {
    "url": "assets/js/30.692f525e.js",
    "revision": "f2cd371f7d4940eab32456a4de00543b"
  },
  {
    "url": "assets/js/31.7a9fa7c9.js",
    "revision": "5bc291b79acba94b3babcd16ddcf11dc"
  },
  {
    "url": "assets/js/32.8e2a66ff.js",
    "revision": "1870d28da62e0e99a3ba6773cdbfb69f"
  },
  {
    "url": "assets/js/33.ef2367ae.js",
    "revision": "0ce50d3c7330d1818112951597699132"
  },
  {
    "url": "assets/js/34.9fee776f.js",
    "revision": "112fcfb77260f44fcc948cf4ffee3904"
  },
  {
    "url": "assets/js/35.741f30c5.js",
    "revision": "c3faa00d8bf7b9e3928088abd902613a"
  },
  {
    "url": "assets/js/36.f2208b92.js",
    "revision": "85c8d9816758aaf7ea9086f95bc887d7"
  },
  {
    "url": "assets/js/37.0c3b0e67.js",
    "revision": "4800200ccb9041426dfc113efe13f4e3"
  },
  {
    "url": "assets/js/38.fa9a3684.js",
    "revision": "336d5a1ecffa73700e4b88822848c6c5"
  },
  {
    "url": "assets/js/39.94e97cef.js",
    "revision": "d21486f3999d58f979e99da242280f8c"
  },
  {
    "url": "assets/js/4.f4cae0e3.js",
    "revision": "c0179f9210d045b3d9381bcd0323e38c"
  },
  {
    "url": "assets/js/40.07bfda8a.js",
    "revision": "bd3f7c4f4434f40f5b730fef1d24d728"
  },
  {
    "url": "assets/js/41.51032acb.js",
    "revision": "9eda8abc081adde283773781b0f2fc3b"
  },
  {
    "url": "assets/js/42.9458c4f2.js",
    "revision": "7e3e7e7912cdbb8a1a5867aab618a9fa"
  },
  {
    "url": "assets/js/5.a9b7d65f.js",
    "revision": "04287bb24f67f124eb2fe09016788025"
  },
  {
    "url": "assets/js/6.36ec7b9d.js",
    "revision": "b74aeecfe1e23de4e15f65b211ce23c7"
  },
  {
    "url": "assets/js/7.1ce440b2.js",
    "revision": "b639f102d94e2029c4c48e77397039c8"
  },
  {
    "url": "assets/js/8.1e30f86a.js",
    "revision": "98452a3c0945a322c1b82527fdeb491a"
  },
  {
    "url": "assets/js/9.a8297d0d.js",
    "revision": "d6822baf92a86199970d30406e2a6017"
  },
  {
    "url": "assets/js/app.4a403408.js",
    "revision": "b471f0ad5b04cbcee5025cdb83168dd4"
  },
  {
    "url": "guides/basics.html",
    "revision": "53b5ed5b3d60259ecae7f534e21bbcca"
  },
  {
    "url": "guides/development.html",
    "revision": "0459b4d84754af1d4e5cbda5ddca02e9"
  },
  {
    "url": "guides/index.html",
    "revision": "dafd525259a7e6f38f380a0df92cca08"
  },
  {
    "url": "index.html",
    "revision": "da6b744fcdbc4c789a533aac182f2b3b"
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
