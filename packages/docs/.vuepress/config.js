module.exports = {
  base: '/weacast-docs/',
  title: 'Weacast',
  description: 'An Open Source platform to gather, expose and make use of weather forecast data',
  head: [
    ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/weacast/weacast-icon-64x64.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
  theme: 'kalisio',
  themeConfig: {
    docsDir: 'docs',
    nav: [
      { text: 'About', link: '/about/' },
      { text: 'Guides', link: '/guides/' },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'API', link: '/api/' }
    ],
    sidebar: {
      '/about/': getAboutSidebar(),
      '/guides/': getGuidesSidebar(),
      '/architecture/': getArchitectureSidebar(),
      '/api/': getAPISidebar()
    }
  }
}

function getAboutSidebar () {
  return [
    '',
    'showcase',
    'roadmap',
    'ecosystem',
    'license',
    'contact'
  ] 
}

function getGuidesSidebar () {
  return [
    '',
    'basics',
    'development'
  ]
}

function getArchitectureSidebar () {
  return [
    '',
    'main-concepts',
    'domain-model',
    'global-architecture', 
    'component-view',
    'data-model-view'
  ]
}

function getAPISidebar () {
  return [
    '',
    {
      title: 'Core',
      children: [ 'application', 'forecast', 'element', 'hooks', 'grid' ]
    },
    {
      title: 'Plugins',
      children: [ 'plugin', 'loader', 'probe', 'alert' ]
    },
    {
      title: 'Client',
      children: [ 'layers', 'mixins' ]
    }
  ]
}
