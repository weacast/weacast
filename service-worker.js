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
    "revision": "68dbb3c650a50bd7a493b735531644f8"
  },
  {
    "url": "about/contact.html",
    "revision": "14d4712ae4458b6b205d2f0d18b13705"
  },
  {
    "url": "about/ecosystem.html",
    "revision": "bb9ef9feb4a6548568352b6f54cd45a1"
  },
  {
    "url": "about/index.html",
    "revision": "b7309f742ad47f30e7e25f5b0c4039a6"
  },
  {
    "url": "about/license.html",
    "revision": "5595adff057c62b8cd27397af37defea"
  },
  {
    "url": "about/roadmap.html",
    "revision": "db45505330698792ca32e14aaa3ec077"
  },
  {
    "url": "about/showcase.html",
    "revision": "5f6878c5eb4ba6d335a127ca53dc0d5f"
  },
  {
    "url": "api/alert.html",
    "revision": "8ff744149016f40f542bb1a3448d1760"
  },
  {
    "url": "api/application.html",
    "revision": "7454239e1e9cc3e0f93af1f803508e03"
  },
  {
    "url": "api/element.html",
    "revision": "783478708d6a30260ff24ea088f6d5fb"
  },
  {
    "url": "api/forecast.html",
    "revision": "62df958759cd8e29b7795afe84ef804e"
  },
  {
    "url": "api/grid.html",
    "revision": "86a01b16a056c08ba24d86435d32d8d2"
  },
  {
    "url": "api/hooks.html",
    "revision": "8c3b8749bf3c18fca064ed5593f51b82"
  },
  {
    "url": "api/index.html",
    "revision": "dc36af6fd86d499abb8725ef725e564e"
  },
  {
    "url": "api/layers.html",
    "revision": "7898ba900dfed9b4fe7868dd0ab9062f"
  },
  {
    "url": "api/loader.html",
    "revision": "26f901719985aab5f2d7890b3ebc4cd9"
  },
  {
    "url": "api/mixins.html",
    "revision": "54f149430404b5ec5a3b7b073f456765"
  },
  {
    "url": "api/plugin.html",
    "revision": "04d64027b89c1bed8e3f47ceeaed74f6"
  },
  {
    "url": "api/probe.html",
    "revision": "85f5ac92ca56d9ae40bb1fc5dff63bb7"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "9445aecd44563453138282a2b8623c75"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "b4453564128bd180902a59cdff6177e7"
  },
  {
    "url": "architecture/domain-model.html",
    "revision": "bb099db34459b29349ff456f25d93aff"
  },
  {
    "url": "architecture/dynamic-view.html",
    "revision": "56010c2f71a54e31f3a6b59fecb9f26e"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "64837a977257f61f80d8b5c3def72164"
  },
  {
    "url": "architecture/index.html",
    "revision": "185d3f1f700ea720bafeac84621e54f1"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "e2e5b84d205678f28207ecd0996b2baf"
  },
  {
    "url": "assets/css/0.styles.b5921162.css",
    "revision": "a6bfd81266ed47a302ec9844898a9e26"
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
    "url": "assets/js/10.2482dcc5.js",
    "revision": "102a07f3bfc73013a2b5c406b1048074"
  },
  {
    "url": "assets/js/11.71dc1f2e.js",
    "revision": "06197ba4033f3466ea161cbad94c7a12"
  },
  {
    "url": "assets/js/12.8d42399f.js",
    "revision": "d5e1466a46addaa70a8c95b3a525dbae"
  },
  {
    "url": "assets/js/13.4d4e61a1.js",
    "revision": "36c7c921062f6199ed234acc0b392d26"
  },
  {
    "url": "assets/js/14.b6b36435.js",
    "revision": "290698d5f213efd62d5f73c9bc913204"
  },
  {
    "url": "assets/js/15.00f7e209.js",
    "revision": "6ef760aa1d1ce0404005740cee385325"
  },
  {
    "url": "assets/js/16.f39271e7.js",
    "revision": "33ac56cb1a30f851e2014cd8a5fcb8ee"
  },
  {
    "url": "assets/js/17.36f1389d.js",
    "revision": "c5c736bd1291990242ae7f9c2268f404"
  },
  {
    "url": "assets/js/18.14f6b987.js",
    "revision": "c24e3be5e80fcaf139591ea3118557fa"
  },
  {
    "url": "assets/js/19.9309fef2.js",
    "revision": "fae9b1cf0f2cec74f053294f0b1b243b"
  },
  {
    "url": "assets/js/2.c725a6e6.js",
    "revision": "9884a568f6def6ce4c522e302a727c3e"
  },
  {
    "url": "assets/js/20.c216c19f.js",
    "revision": "0bdef063f3518daee724245605d8dd3c"
  },
  {
    "url": "assets/js/21.c2a8a98c.js",
    "revision": "ea11b7c046fffdd8b0b16948da9d054f"
  },
  {
    "url": "assets/js/22.eb2fba5d.js",
    "revision": "7935438b1368481fb393d211b404890d"
  },
  {
    "url": "assets/js/23.d078d8bf.js",
    "revision": "020a1e588c091c1fd4e6184038a04e20"
  },
  {
    "url": "assets/js/24.d41651af.js",
    "revision": "bb14d3b5fc31c5d84cb77114c81d733c"
  },
  {
    "url": "assets/js/25.ca666a50.js",
    "revision": "4664e43fa48025a7fd2607f6ce064c3f"
  },
  {
    "url": "assets/js/26.3a87b69d.js",
    "revision": "17e81780bfe200f9f5139875fc6d10b7"
  },
  {
    "url": "assets/js/27.82d78b7d.js",
    "revision": "625f78824e0c2d99f6e5359b77d1a0d3"
  },
  {
    "url": "assets/js/28.1ee98ec3.js",
    "revision": "ed1115b8d8516606c8241971168b6f20"
  },
  {
    "url": "assets/js/29.40afb31d.js",
    "revision": "496e73b27242503619ddf507067cfefa"
  },
  {
    "url": "assets/js/3.f333d126.js",
    "revision": "5c1f82d58d6dc4f8532fa4f214bb9d92"
  },
  {
    "url": "assets/js/30.217be1b3.js",
    "revision": "3c0fda1b952314688888d266c0f1329e"
  },
  {
    "url": "assets/js/31.5a4b5921.js",
    "revision": "7373f54e1874a26762960c83636356d7"
  },
  {
    "url": "assets/js/32.8360cae7.js",
    "revision": "d0d860504f24445fea9338c78089c50e"
  },
  {
    "url": "assets/js/33.652b00a6.js",
    "revision": "78a25331bd963934d9b064199606ecf0"
  },
  {
    "url": "assets/js/34.fc34a500.js",
    "revision": "c445f4fea4c8fd771c0c162839bc92d4"
  },
  {
    "url": "assets/js/35.7f678d0d.js",
    "revision": "77c7751bed666f71be80d5c3a20a5be1"
  },
  {
    "url": "assets/js/36.49245a44.js",
    "revision": "166f9092f6ce697e1c0a3d93a5f913db"
  },
  {
    "url": "assets/js/37.b51f041d.js",
    "revision": "ac3c94dcceeb2b4121fda2681c4136b8"
  },
  {
    "url": "assets/js/38.2dde4b8f.js",
    "revision": "1d81c778845dc5b0134b8de0955c75c6"
  },
  {
    "url": "assets/js/39.a6e0a760.js",
    "revision": "5638e9cb03ad3f5f01870db1296e0b6f"
  },
  {
    "url": "assets/js/4.4baa74d9.js",
    "revision": "0853b541b3d3f6699e2441cc5af6d1dc"
  },
  {
    "url": "assets/js/40.00967fa7.js",
    "revision": "7bb7bfcc4756cbecad9bd60d1cfb4643"
  },
  {
    "url": "assets/js/41.38262a1a.js",
    "revision": "1b0e83923c6bb910378a2cf9a5da43dc"
  },
  {
    "url": "assets/js/42.d419e84c.js",
    "revision": "e8a62a2321a7f09b760384f23c2047d1"
  },
  {
    "url": "assets/js/5.c8a6671a.js",
    "revision": "fb9d8cec5f006079ad5f4b75ee73efe9"
  },
  {
    "url": "assets/js/6.4fd7b898.js",
    "revision": "055bcdc0f702d550522a4e8e2a96ea1c"
  },
  {
    "url": "assets/js/7.ad790eb5.js",
    "revision": "5acc5f7ed02a0ec25f6ff8e82e06e46f"
  },
  {
    "url": "assets/js/8.897b9c29.js",
    "revision": "ad2ecb2e4c0eb7d9c287c0f44f246413"
  },
  {
    "url": "assets/js/9.01347d0a.js",
    "revision": "eb643657a47a20e97a7db38246474428"
  },
  {
    "url": "assets/js/app.cdb84a0a.js",
    "revision": "9c58e5c8124af7b3b85e301ca85c6bc8"
  },
  {
    "url": "guides/basics.html",
    "revision": "a84899e75dedf26c22e4a70c3bb22d39"
  },
  {
    "url": "guides/development.html",
    "revision": "86a4daff32c482411e671f29f415cafa"
  },
  {
    "url": "guides/index.html",
    "revision": "3def4282bc733ba9d688520768d0ba0b"
  },
  {
    "url": "index.html",
    "revision": "df6b400105830619c64cf320de008297"
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
