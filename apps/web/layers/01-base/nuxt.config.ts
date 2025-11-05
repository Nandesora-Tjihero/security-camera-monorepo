export default defineNuxtConfig({
  runtimeConfig: {
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
  nitro: {
    firebase: {
      nodeVersion: '18',
      gen: 2,
      httpsOptions: {
        region: 'europe-west1',
        maxInstances: 3,
      },
    },
  },
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'tertiary',
        'info',
        'success',
        'warning',
        'error',
      ],
    },
  } as unknown as import('@nuxt/ui').ModuleOptions,
  modules: ['@nuxt/ui', '@nuxt/fonts', '@nuxt/image'],
});
