<script setup lang="ts">
  import { NuxtImg } from '#components';
</script>

<template>
  <NuxtImg
    width="2940"
    height="1664"
    src="/images/owl.webp"
    alt="Background Image"
    sizes="100vw sm:50vw md:400px"
    priority
    class="absolute top-0 left-0 w-full h-full object-cover -z-20"
  />
  <div class="absolute top-0 left-0 w-full h-full bg-black/40 -z-10"></div>
</template>
