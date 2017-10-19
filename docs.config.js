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

  router: {
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
    breaks: true,
    use: ['markdown-it-highlightjs']
  }
}
