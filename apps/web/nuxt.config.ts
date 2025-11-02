// https://nuxt.com/docs/api/configuration/nuxt-config
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
config();
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  // devtools: { enabled: true },
  vite: {
    server: { watch: { usePolling: true, interval: 150 } },
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
  modules: [
    '@nuxt/ui',
    '@unlok-co/nuxt-stripe',
    '@nuxt/test-utils/module',
    '@nuxt/fonts',
    '@nuxt/image',
    '@sentry/nuxt/module',
  ],
  sourcemap: { client: 'hidden' },
  sentry: {
    org: 'ombujoweb',
    project: 'security-camera',
    authToken: process.env.SENTRY_AUTH_TOKEN,

    sourceMapsUploadOptions: {
      org: 'ombujoweb',
      project: 'security-camera',
    },
  },
  fonts: {
    families: [
      {
        name: 'Playfair+Display',
        provider: 'google',
        weights: ['400', '700'],
        styles: ['normal'],
        subsets: ['latin'],
        display: 'swap',
      },
    ],
  },
  runtimeConfig: {
    public: {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      measurementId: '',
      vapidKey: '',
      sentry: {
        dns: '',
      },
      baseUrlLocal: '',
      baseUrlProduction: '',
    },
    stripeApiKey: '',
    stripePublishableKey: '',
    firebaseAdminServiceAccountKey: '',
    stripeWebhookSecret: '',
  },
  // fcm: {
  //   firebaseConfig: {
  //     apiKey: 'AIzaSyA3nd8QGt6AYyQVKWA8h8dPTAeYzEiEVQo',
  //     authDomain: 'security-camera-4324d.firebaseapp.com',
  //     projectId: 'security-camera-4324d',
  //     storageBucket: 'security-camera-4324d.appspot.com',
  //     messagingSenderId: '1092350635908',
  //     appId: '1:1092350635908:web:58ae6cf5c9ecb119f4b7d1',
  //     measurementId: 'G-JBT7VHGLD2',
  //   },
  //   vapidKey:
  //     'BPWGCCSM3Udh7we6Eoiy7W1fa3mxmUQkmt3eNOqjaQRKv-ZokZFGVHl5jPLRTwsCY5nYMQwid0JYN5zFP-hNJYg',
  // },
  stripe: {
    server: {
      key: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      options: {
        timeout: 20000,
      },
    },
    client: {
      key: process.env.NUXT_PUBLIC_STRIPE_SECRET_KEY,
    },
  },
});
