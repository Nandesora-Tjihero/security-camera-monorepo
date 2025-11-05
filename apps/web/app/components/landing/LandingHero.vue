<template>
  <section id="hero">
    <UContainer class="max-w-2xl flex flex-col gap-5">
      <h1 class="text-5xl md:text-7xl text-white pt-10">
        Protege tus pertenencias a bajo coste
      </h1>

      <h2 class="text-xl leading-normal text-white">
        Usa el telefono extra que tienes en casa como camara de seguridad
        inteligente. Recibe alertas en tiempo real y accede a las grabaciones
        desde cualquier lugar.
      </h2>

      <div v-if="loadingModel && !canSignIn">
        <!-- <label class="text-sky-500 z-10"
          >Checking service availability...</label
        > -->
        <div class="grid gap-2">
          <USkeleton class="h-4 w-24" />
          <USkeleton class="h-4 w-14" />
        </div>
      </div>

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

  const { getButtonConfig, markFreeTrialSeen } = useSubscription();

  const buttonConfig = getButtonConfig;

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
