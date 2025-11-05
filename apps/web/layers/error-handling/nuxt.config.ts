interface PublicRuntimeConfig {
  sentry: { dns: string };
}

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      sentry: { dns: '' },
    } satisfies PublicRuntimeConfig,
  },
});
