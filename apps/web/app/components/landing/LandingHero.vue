<template>
  <section
    id="hero"
    class="relative min-h-screen flex items-center"
  >
    <UContainer
      class="max-w-3xl flex justify-center items-center flex-col text-center h-full"
    >
      <h1 class="text-5xl md:text-7xl text-white mb-4 font-bold">
        Protege tus pertenencias a bajo coste
      </h1>

      <h2 class="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
        Usa el telefono extra que tienes en casa como camara de seguridad
        inteligente. Recibe alertas en tiempo real y accede a las grabaciones
        desde cualquier lugar.
      </h2>

      <ClientOnly>
        <BaseLoadingIndicator v-if="loadingModel && !canSignIn" />
      </ClientOnly>

      <UButton
        v-if="canSignIn"
        :variant="buttonConfig.variant"
        @click="handleButtonClick"
        class="w-fit inline-block p-2 content-center"
      >
        {{ buttonConfig.text }}
      </UButton>
    </UContainer>
    <LandingStylesBackground />
  </section>
</template>

<script setup lang="ts">
  import { useSubscription } from '#layers/payment/app/composables/useSubscription';
  const { canSignIn } = useUserCanSignIn();

  const { buttonConfig, markFreeTrialSeen } = useSubscription();


  const handleButtonClick = async () => {
    switch (buttonConfig.value.action) {
      case 'free-trial':
        markFreeTrialSeen();
        await navigateTo('/auth?intent=trial');
        break;
      case 'sign-in':
        await navigateTo('/auth');
        break;
      case 'upgrade':
        await navigateTo('/subscriptions');
        break;
      case 'dashboard':
        await navigateTo('/dashboard');
        break;
    }
  };
</script>
