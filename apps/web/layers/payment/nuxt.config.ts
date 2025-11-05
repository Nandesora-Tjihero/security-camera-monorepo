interface PublicRuntimeConfig {
  sentry: { dns: string };
  baseUrlLocal: string;
  baseUrlProduction: string;
}

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      sentry: { dns: '' },
      baseUrlLocal: '',
      baseUrlProduction: '',
    } satisfies PublicRuntimeConfig,
  },
});
