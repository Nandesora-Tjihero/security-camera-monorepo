<template>
  <section
    class="h-screen border-b border-white/15 flex flex-col md:flex-row md:justify-between"
  >
    <div class="md:w-1/2">
      <h2 class="text-3xl mb-5">Start Monitoring in Minutes</h2>
      <ul class="col-start-1 row-start-2">
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
    </div>
    <img
      src=""
      alt="Affordable Security"
      class="md:w-1/2 object-cover"
    />
  </section>
</template>

<script setup lang="ts">
  const advantages = [
    {
      text: 'One-click Google sign-in for immediate access',
      icon: 'i-heroicons-arrow-left-end-on-rectangle',
    },
    {
      text: 'Automatic notifications to your main device when motion is detected',
      icon: 'i-heroicons-bell-alert',
    },
  ];
</script>
