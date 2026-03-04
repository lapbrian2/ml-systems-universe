export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
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
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'ML Systems Universe',
      meta: [
        { name: 'description', content: 'Interactive course for Harvard CS249r Machine Learning Systems' },
        { name: 'theme-color', content: '#05070f' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap',
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
