<template>
  <UContainer class="flex flex-col h-screen justify-center items-center">
    <h1 class="font-medium mb-8 sm:text-10xl text-8xl">
      {{ error?.statusCode }}
    </h1>

    <p class="font-light leading-tight mb-16 px-8 sm:px-0 sm:text-4xl text-xl">
      {{ error?.message }}
    </p>
    <NuxtLink
      to="/"
      class="text-sky-500 underline"
    >
      Go Home
    </NuxtLink>
  </UContainer>
</template>

<script setup lang="ts">
  const error = useError();
</script>
