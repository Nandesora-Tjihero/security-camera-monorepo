// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ignore: ['/studio/node_modules'],
  experimental: {
    appManifest: false,
  },
  // devtools: { enabled: true },
  vite: {
    // server: { watch: { usePolling: true, interval: 150 } },
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
