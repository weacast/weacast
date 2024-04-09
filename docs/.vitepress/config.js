import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/weacast/',
  title: 'Weacast',
  description: 'An Open Source platform to gather, expose and make use of weather forecast data',
  ignoreDeadLinks: true,
  head: [
    ['link', { href: 'https://cdnjs.cloudflare.com/ajax/libs/line-awesome/1.3.0/line-awesome/css/line-awesome.min.css', rel: 'stylesheet' }],
    ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/weacast/weacast-icon-64x64.png` }]
  ],
  themeConfig: {
    logo: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/weacast/weacast-icon-256x256.png',
    domain: 'dev.kalisio.xyz',
    socialLinks: [{ icon: 'github', link: 'https://github.com/weacast/weacast' }],   
    nav: [
      { text: 'About', link: '/about/introduction.md' },
      { text: 'Guides', link: '/guides/introduction.md' },
      { text: 'Architecture', link: '/architecture/introduction.md' },
      { text: 'API', link: '/api/introduction.md' }
    ],
    sidebar: {
      '/about/': getAboutSidebar(),
      '/guides/': getGuidesSidebar(),
      '/architecture/': getArchitectureSidebar(),
      '/api/': getAPISidebar()
    },
    footer: {
      copyright: 'MIT Licensed | Copyright © 2017-20xx Kalisio'
    },
    trustLogos: [
      { imageLink: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/assets/logos/airbus.png', link: 'https://www.airbus.com/' },
      { imageLink: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/assets/logos/irsn.png', link: 'https://www.irsn.fr/' }
    ]
  },
  vite: {
    optimizeDeps: {
			include: ['keycloak-js', 'lodash'],
		},
		ssr: {
			noExternal: ['vitepress-theme-kalisio']
		}
  }
})

function getAboutSidebar () {
  return [
    { text: 'About', link: '/about/introduction' },
    { text: 'Showcase', link: '/about/showcase' },
    { text: 'Roadmap', link: '/about/roadmap' },
    { text: 'Ecosystem', link: '/about/ecosystem' },
    { text: 'License', link: '/about/license' },
    { text: 'Contact', link: '/about/contact' }
  ]
}

function getGuidesSidebar () {
  return [
    { text: 'Guides', link: '/guides/introduction' },
    { text: 'The Basics', link: '/guides/basics' },
    { text: 'Weacast development', link: '/guides/development' }
  ]
}

function getArchitectureSidebar () {
  return [
    { text: 'Architecture', link: '/architecture/introduction' },
    { text: 'Main concepts', link: '/architecture/main-concepts' },
    { text: 'Domain model', link: '/architecture/domain-model' },
    { text: 'Global architecture', link: '/architecture/global-architecture' },
    { text: 'Component-oriented view of the architecture', link: '/architecture/component-view' },
    { text: 'Data model-oriented view of the architecture', link: '/architecture/data-model-view' },
    { text: 'Dynamic view of the architecture', link: '/architecture/dynamic-view' }
  ]
}

function getAPISidebar () {
  return [
    { text: 'API', link: '/api/introduction' },
    { text: 'Core', 
      collapsed: true,
      items: [
        { text: 'Application', link: '/api/application' },
        { text: 'Forecast model', link: '/api/forecast' },
        { text: 'Forecast element', link: '/api/element' },
        { text: 'Hooks', link: '/api/hooks' },
        { text: 'Grid', link: '/api/grid' }
      ]
    },
    { text: 'Plugins', 
      collapsed: true,
      items: [
        { text: 'Forecast model plugins', link: '/api/plugin' },
        { text: 'Forecast data loaders', link: '/api/loader' },
        { text: 'Probe plugin', link: '/api/probe' },
        { text: 'Alert plugin', link: '/api/alert' }
      ]
    },
    { text: 'Client', 
      collapsed: true,
      items: [
        { text: 'Layers', link: '/api/layers' },
        { text: 'Mixins', link: '/api/mixins' }
      ]
    }
  ]
}