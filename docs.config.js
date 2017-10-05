module.exports = {
  modules: [
    '@nuxtjs/bulma',
    '@nuxtjs/markdownit'
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
  }
}
