<template>
  <section class="border-b py-12 relative">
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-sky-100/60 dark:bg-sky-900/10 rounded-full blur-[100px] -z-10 pointer-events-none opacity-80"
    ></div>
    <div class="text-center mb-16">
      <h2
        class="text-3xl md:text-4xl font-bold text-gray-700 dark:text-white mb-4"
      >
        ¿Por qué usar Security Camera?
      </h2>
      <p class="text-lg text-gray-500 max-w-3xl mx-auto max-md:px-5">
        Descubre las ventajas de transformar tu viejo teléfono en un sistema de
        seguridad avanzado, accesible y fácil de usar.
      </p>
    </div>
    <UContainer
      class="grid md:grid-rows-[auto_1fr] md:gap-x-3 gap-y-6 md:grid-cols-3"
    >
      <UCard
        v-for="(feature, index) in features"
        :key="feature.title"
        class="ring-primary dark:ring-primary/10 dark:bg-gray-800/70 relative"
        :class="`col-span-${index}`"
      >
        <template #header>
          <div
            class="absolute -top-10 -right-10 text-primary/10 group-hover:text-primary/20 transition-all duration-300 transform group-hover:scale-125"
          >
            <Icon
              :name="feature.icon"
              class="material-symbols-outlined text-9xl"
            />
          </div>
          <div
            class="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-800 text-primary border border-slate-700"
          >
            <Icon
              :name="feature.icon"
              class="material-symbols-outlined text-3xl"
              >smartphone</Icon
            >
          </div>
          <h3 class="text-xl font-semibold text-gray-700 dark:text-white mb-3">
            {{ feature.title }}
          </h3>
        </template>
        <div>
          <img />
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            {{ feature.body }}
          </p>
        </div>
      </UCard>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
  const features = [
    {
      icon: 'i-heroicons-device-phone-mobile',
      title: 'Tu móvil como cámara inteligente',
      body: 'Convierte cualquier smartphone en una cámara de seguridad con IA y acceso remoto a grabaciones.',
    },
    {
      icon: 'i-heroicons-rocket-launch',
      title: 'Monitorización en minutos',
      body: 'Configuración sencilla y protección instantánea. Prueba gratuita de 14 días con un solo clic, sin tarjeta.',
    },
    {
      icon: 'mdi:pig-variant',
      title: 'Seguridad asequible para todos',
      body: 'Seguridad profesional por solo 11,99 €/mes, sin hardware costoso ni instalación. Disfruta de una protección doméstica más inteligente y asequible después de tu prueba gratuita.',
    },
  ];
  // ...existing code...
</script>

<style scoped>
  section {
    background: radial-gradient(
        1200px 500px at 20% 81%,
        var(--hero-spot-1),
        transparent 60%
      ),
      radial-gradient(
        900px 400px at 90% 10% 10%,
        var(--hero-spot-2),
        transparent 60%
      ),
      linear-gradient(
        180deg,
        var(--hero-bg) 0,
        var(--hero-bg-2) 55%,
        var(--page-bg) 100%
      );
  }
</style>
