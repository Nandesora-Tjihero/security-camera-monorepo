<template>
  <section
    class="h-screen border-b flex flex-col md:flex-row md:justify-between"
  >
    <img
      src=""
      alt="Affordable Security"
      class="md:w-1/2 object-cover"
    />
    <div class="md:w-1/2">
      <h2 class="text-3xl mb-5">Affordable Security for Everyone</h2>
      <ul class="col-start-1 row-start-2 mb-4">
        <li
          v-for="(advantage, index) in advantages"
          :key="index"
          class="flex items-center gap-2 mb-3"
        >
          <UIcon
            :name="advantage.icon"
            class="w-5 h-5 text-primary"
          />
          <span>{{ advantage.text }}</span>
        </li>
      </ul>
      <UButton
        to="/auth?intent=trial"
        class="self-start"
        >Start a 14-day Free Trial</UButton
      >
    </div>
  </section>
</template>
<script setup lang="ts">
  const advantages = [
    // 'Professional-grade security monitoring at a fraction of traditional costs',
    {
      text: 'No expensive hardware purchases or installation fees',
      icon: 'i-heroicons-x-circle',
    },
    {
      text: 'Join thousands protecting their homes with smart technology',
      icon: 'i-heroicons-user-group',
    },
    {
      text: '€5.99/month after free trial - significantly cheaper than traditional security systems',
      icon: 'i-lucide-piggy-bank',
    },
  ];
</script>
