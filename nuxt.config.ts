export default defineNuxtConfig({
  compatibilityDate: '2026-03-05',
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  runtimeConfig: {
    // Server-only (never exposed to the browser)
    gpuInferenceUrl: process.env.GPU_INFERENCE_URL || '',
    gpuApiSecret: process.env.GPU_API_SECRET || '',
  },

  site: {
    url: 'https://mlsystemsuniverse.com',
  },

  modules: [
    '@tresjs/nuxt',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/sitemap',
    '@nuxt/eslint',
  ],

  sitemap: {
    urls: [
      '/',
      '/review',
      '/chapter/introduction',
      '/chapter/ml-systems',
      '/chapter/dl-primer',
      '/chapter/dnn-architectures',
      '/chapter/ai-workflow',
      '/chapter/data-engineering',
      '/chapter/ai-frameworks',
      '/chapter/ai-training',
      '/chapter/efficient-ai',
      '/chapter/model-optimizations',
      '/chapter/ai-acceleration',
      '/chapter/benchmarking',
      '/chapter/ml-operations',
      '/chapter/on-device-learning',
      '/chapter/security-privacy',
      '/chapter/robust-ai',
      '/chapter/responsible-ai',
      '/chapter/sustainable-ai',
      '/chapter/ai-for-good',
      '/chapter/agi-systems',
      '/chapter/conclusion',
    ],
  },

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
        { name: 'description', content: 'Unofficial interactive companion based on the open-source CS249r textbook. 21 chapters with visualizations, quizzes, and progress tracking.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'ML Systems Universe' },
        { property: 'og:url', content: 'https://mlsystemsuniverse.com' },
        { property: 'og:image', content: '/og-default.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'theme-color', content: '#05070f' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'preload',
          href: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
          as: 'style',
        },
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
    build: {
      sourcemap: false,
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  nitro: {
    preset: 'vercel',
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://cdn.jsdelivr.net https://va.vercel-scripts.com https://vitals.vercel-insights.com; worker-src 'self' blob: https://cdn.jsdelivr.net; media-src 'self' blob: mediastream:; frame-ancestors 'none'",
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(self), microphone=(), geolocation=()',
        },
      },
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/favicon.svg': { headers: { 'cache-control': 'public, max-age=86400' } },
      '/og-default.png': { headers: { 'cache-control': 'public, max-age=86400' } },
    },
  },
})
