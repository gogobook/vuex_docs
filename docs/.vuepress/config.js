module.exports = {
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vuex',
      description: 'Centralized State Management for Vue.js'
    }
  },
  serviceWorker: true,
  // theme: 'vue',
  themeConfig: {
    // docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'API Reference',
            link: '/api/'
          },
          {
            text: 'Release Notes',
            link: 'https://github.com/vuejs/vuex/releases'
          }
        ],
        sidebar: [
          '/installation',
          '/',
          '/guide/',
          {
            title: 'Core Concepts',
            collapsable: false,
            children: [
              '/guide/state',
              '/guide/getters',
              '/guide/mutations',
              '/guide/actions',
              '/guide/modules'
            ]
          },
          '/guide/structure',
          '/guide/plugins',
          '/guide/strict',
          '/guide/forms',
          '/guide/testing',
          '/guide/hot-reload'
        ]
      }
    }
  }
}