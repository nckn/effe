const base = 'gh-pages' === process.env.NODE_ENV ? '/effe/' : '/';

module.exports = {
  // mode: 'spa',
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    script: [
      { src: 'http://connect.soundcloud.com/sdk.js' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Anonymous+Pro:400,400i,700,700i&display=swap' }
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap' }
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:400,400i,700,700i&display=swap' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    // SCSS file in the project
    // '@/assets/scss/main.scss'
  ],
  server: {
    port: 8000, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  router: {
    base: process.env.NODE_ENV === 'development' ? '' : '/effe/'
    // base,
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '~/plugins/flanger.js', ssr: false},
    {src: '@/plugins/window-fix', ssr: false},
    {src: '@/plugins/ga.js', mode: 'client' }, // Google Analytics
    // {src: '@/plugins/main', ssr: false},
    // {src: '@/plugins/fetchsong', ssr: false}
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    // publicPath: '/static/',
    extend (config, { isDev, isClient }) {
      if (!isDev) {
        // relative links, please.
        config.output.publicPath = './_nuxt/'
      }
      return config;
    }
  }
}
