// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  extends: [
    '~/layers/01-base',
    '~/layers/auth',
    '~/layers/detection',
    '~/layers/payment',
    '~/layers/error-handling',
  ],

  // devtools: { enabled: true },
  vite: {
    server: { watch: { usePolling: true, interval: 150 } },
  },

  modules: ['@nuxt/test-utils/module'],

  runtimeConfig: {
    public: {
      vapidKey: '',
      public: {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        measurementId: '',
        baseUrlLocal: '',
        baseUrlProduction: '',
      },
    },
  },
});
