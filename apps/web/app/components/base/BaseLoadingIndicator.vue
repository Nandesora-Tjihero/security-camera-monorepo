<template>
  <div v-if="loadingModel && !canSignIn">
    <!-- <label class="text-sky-500 z-10"
          >Checking service availability...</label
        > -->
    <div class="grid gap-2">
      <USkeleton class="h-4 w-24" />
      <USkeleton class="h-4 w-14" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const { canSignIn } = useUserCanSignIn();
</script>
