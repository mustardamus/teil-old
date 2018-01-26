module.exports = {
  modules: [
    '@nuxtjs/bulma',
    '@nuxtjs/markdownit'
  ],

  css: [
    'highlight.js/styles/agate.css'
  ],

  srcDir: './docs',
  buildDir: './.docs',

  generate: {
    dir: './docs/dist'
  },

  router: {
    base: '/teil/',
    linkExactActiveClass: 'is-active'
  },

  build: {
    postcss: {
      plugins: {
        'postcss-custom-properties': {
          warnings: false
        }
      }
    }
  },

  markdownit: {
    preset: 'default',
    linkify: true,
    use: ['markdown-it-highlightjs']
  }
}
