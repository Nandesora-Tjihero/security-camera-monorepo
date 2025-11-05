interface PublicRuntimeConfig {
  sentry: { dns: string };
  baseUrlLocal: string;
  baseUrlProduction: string;
}

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseUrlLocal: '',
      baseUrlProduction: '',
    },
    stripeApiKey: '',
    stripePublishableKey: '',
    firebaseAdminServiceAccountKey: '',
    stripeWebhookSecret: '',
  },
});
