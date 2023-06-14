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
    "revision": "db3c3769a5074c1d317de8706ea8edfe"
  },
  {
    "url": "about/contact.html",
    "revision": "27f4d2fd88a6987d4a3c7ba3afd9e006"
  },
  {
    "url": "about/ecosystem.html",
    "revision": "ff1e842816d7081fc54748e81585e16c"
  },
  {
    "url": "about/index.html",
    "revision": "d28499ede59d3781d40a196a8bbc23d5"
  },
  {
    "url": "about/license.html",
    "revision": "265547ad88911e912367860f89f3367d"
  },
  {
    "url": "about/roadmap.html",
    "revision": "283b996b5771a1bdbaeefe4ee854516c"
  },
  {
    "url": "about/showcase.html",
    "revision": "138199b40103b11d13ee1c54e7dff683"
  },
  {
    "url": "api/alert.html",
    "revision": "643625eafcd5291226aaaabd15322fc9"
  },
  {
    "url": "api/application.html",
    "revision": "13bb4536ae3031646f5b8fe31d660777"
  },
  {
    "url": "api/element.html",
    "revision": "acd8b4c02e88861b5b599dafdf795326"
  },
  {
    "url": "api/forecast.html",
    "revision": "9b1b518af97b84bd7753d1664a86a5bd"
  },
  {
    "url": "api/grid.html",
    "revision": "bd73201cb4b9a89e7b9040ef9a76eb36"
  },
  {
    "url": "api/hooks.html",
    "revision": "2df6be2376164dd9a0f1383acec43b95"
  },
  {
    "url": "api/index.html",
    "revision": "50734d344c1213e757df68e897b411c7"
  },
  {
    "url": "api/layers.html",
    "revision": "03bf0027826de6918146954b6993b9c6"
  },
  {
    "url": "api/loader.html",
    "revision": "7702f5b94de9f1d490ab62715f29b311"
  },
  {
    "url": "api/mixins.html",
    "revision": "3fb3f5fa6d6e9928d74f22de5ae45410"
  },
  {
    "url": "api/plugin.html",
    "revision": "9733679da0d52c08fbdd834d0a633810"
  },
  {
    "url": "api/probe.html",
    "revision": "6c0c877813aad265f53afa2747aa257d"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "f45707826a3c1be23e57cc3f1d3fca5b"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "0b49cc32ea940d9a24e5dab36ba01bd4"
  },
  {
    "url": "architecture/domain-model.html",
    "revision": "54423908f1b917300e67f494b5fdd7e3"
  },
  {
    "url": "architecture/dynamic-view.html",
    "revision": "2ebe1e14910f7ed7359c34c6b4a048fb"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "4b60c5f53f98fee79abcd0c35a4820a7"
  },
  {
    "url": "architecture/index.html",
    "revision": "2381bd49499e3dca75dbcba49d6f5828"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "753d2e5bc8085e4152a94242ee0ea02c"
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
    "url": "assets/js/10.e708976b.js",
    "revision": "cc3c821e3631c8f637a24a5d8cede08d"
  },
  {
    "url": "assets/js/11.8c40195e.js",
    "revision": "231d632aa442e128e6c3f9d93500f7a3"
  },
  {
    "url": "assets/js/12.93a14dbd.js",
    "revision": "629098341ca1a8dea5bb2e1d1f38da40"
  },
  {
    "url": "assets/js/13.b15d4ecf.js",
    "revision": "a33c6f70dba599ebb063a720a1631324"
  },
  {
    "url": "assets/js/14.8d9e3071.js",
    "revision": "53365cf9d859c8e26765d4d887398053"
  },
  {
    "url": "assets/js/15.adda58e5.js",
    "revision": "cf6e2b8b2252cf3979d901fb21b047d2"
  },
  {
    "url": "assets/js/16.80ad5821.js",
    "revision": "f115cd5bdaac90996fec9287ac1260a9"
  },
  {
    "url": "assets/js/17.d03fdbee.js",
    "revision": "31209a7303deb83dcf7e8705442d9483"
  },
  {
    "url": "assets/js/18.50e9fff1.js",
    "revision": "b5ab52b056230df2bff03b9dbc34fc80"
  },
  {
    "url": "assets/js/19.2ea3ab40.js",
    "revision": "eccc8aef6998504bf2a2b1dd79b0b2c9"
  },
  {
    "url": "assets/js/2.80a13b76.js",
    "revision": "1bd3762777efba263ab82debe20c4c6f"
  },
  {
    "url": "assets/js/20.ab6f23b5.js",
    "revision": "6964b094679ea1a1186de2699fc1f5f6"
  },
  {
    "url": "assets/js/21.eb45f4b9.js",
    "revision": "9e0bb1ec86062819f559cc605ee81935"
  },
  {
    "url": "assets/js/22.7fabf37e.js",
    "revision": "3d4145f81f0a0bdefbf34707253e3daf"
  },
  {
    "url": "assets/js/23.0668be57.js",
    "revision": "f4048f1cce7663a4db71275adc998551"
  },
  {
    "url": "assets/js/24.5032a4ec.js",
    "revision": "8b2ff1abe9ebf952ec9e5c081585a73a"
  },
  {
    "url": "assets/js/25.e9a43d84.js",
    "revision": "3fe368ed9ec8d393cf6595483c72eb1e"
  },
  {
    "url": "assets/js/26.1b63d660.js",
    "revision": "b91c434c45bcb167e60749c6b6ee3777"
  },
  {
    "url": "assets/js/27.182d88fc.js",
    "revision": "34f65380b55563f2cb437b334f48c40d"
  },
  {
    "url": "assets/js/28.5b28dee2.js",
    "revision": "c2957c1b226e2fb3eaa00cd3b87e6851"
  },
  {
    "url": "assets/js/29.006fc8de.js",
    "revision": "1bce2cb265f6c4f8d7143693428ecbc0"
  },
  {
    "url": "assets/js/3.10045971.js",
    "revision": "a479a5bb4a584e2afe941ce5d7b74d95"
  },
  {
    "url": "assets/js/30.7d3c7144.js",
    "revision": "21f5a90a1affa443d6038bca285005db"
  },
  {
    "url": "assets/js/31.0bdfeb8f.js",
    "revision": "51f818e4ffba89c657cbc1a45660ac40"
  },
  {
    "url": "assets/js/32.71bd39d9.js",
    "revision": "0a70862904607ebef67460ddadcf0265"
  },
  {
    "url": "assets/js/33.29456b18.js",
    "revision": "a566dcf951dff4a3abfb67006f0e445a"
  },
  {
    "url": "assets/js/34.fad84f0a.js",
    "revision": "ba02e2ff33451335c4926d9f14051c4e"
  },
  {
    "url": "assets/js/35.dce97c51.js",
    "revision": "949db005888c8eb0d7ab269bcaccb122"
  },
  {
    "url": "assets/js/36.0fe08fc0.js",
    "revision": "c544a169de84ef0405dbd9ab5c3e815f"
  },
  {
    "url": "assets/js/37.d5b79171.js",
    "revision": "76d37d5821489ecc6724241ca436a57b"
  },
  {
    "url": "assets/js/38.7ff62e52.js",
    "revision": "c70b1dcbfd394a3eac27d6cb7ed06481"
  },
  {
    "url": "assets/js/39.2bdf94c9.js",
    "revision": "7b0b15246dc48d62c8c1edfdd7b4622a"
  },
  {
    "url": "assets/js/4.b3da8469.js",
    "revision": "04ea477ef8f5851be654a014ab5a5e75"
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
    "url": "assets/js/5.9ecbba30.js",
    "revision": "d008db57e8a24ca9494d3385306b5842"
  },
  {
    "url": "assets/js/6.f12ce3b2.js",
    "revision": "25b4a3defd55b684c19b0a34c6e4227d"
  },
  {
    "url": "assets/js/7.52d0cea1.js",
    "revision": "204a6386a3c9ea5d47a48cd6320ad0f8"
  },
  {
    "url": "assets/js/8.1f31c9ae.js",
    "revision": "6faebdf0172d6a52bb9348871b6267ce"
  },
  {
    "url": "assets/js/9.c7079255.js",
    "revision": "18ab23f4b1754da8a78c3550b24fb39f"
  },
  {
    "url": "assets/js/app.03e4d520.js",
    "revision": "4ef5482b22ddf8f9c4e5687267e875ce"
  },
  {
    "url": "guides/basics.html",
    "revision": "f8fc085e574f959dcce90dfd95798f3f"
  },
  {
    "url": "guides/development.html",
    "revision": "fec9a66912bbac3750ee348019b48d19"
  },
  {
    "url": "guides/index.html",
    "revision": "246ce513d2ffd54f81f7dfc1756bcd70"
  },
  {
    "url": "index.html",
    "revision": "fc498a4221a9754048ebe1dfb0fd9ee2"
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
