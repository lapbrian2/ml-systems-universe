export default defineNuxtConfig({
  compatibilityDate: '2026-03-04',
  devtools: { enabled: true },

  modules: [
    '@tresjs/nuxt',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: [
    '~/assets/css/main.css',
    'katex/dist/katex.min.css',
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'ML Systems Universe',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Interactive companion for Harvard CS249r — Machine Learning Systems. 21 chapters with visualizations, quizzes, and progress tracking.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'ML Systems Universe' },
        { property: 'og:image', content: '/og-default.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'theme-color', content: '#05070f' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },

  build: {
    transpile: ['gsap', 'three'],
  },

  vite: {
    optimizeDeps: {
      include: ['three', 'gsap'],
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  nitro: {
    preset: 'vercel',
  },
})
