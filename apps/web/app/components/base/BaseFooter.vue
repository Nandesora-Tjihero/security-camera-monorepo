<script setup lang="ts"></script>

<template>
  <footer class="py-10">
    <UContainer class="flex justify-center items-center">
      <ULink
        to="https://insagram.com/yourprofile"
        active-class="text-primary"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        <UIcon
          name="uil:instagram"
          class="w-10 h-10 mx-2"
        />
      </ULink>

      <ULink
        to="https://linkedin.com/yourprofile"
        active-class="text-primary"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        <UIcon
          name="arcticons:linkedin"
          class="w-10 h-10 mx-2"
        />
      </ULink>

      <ULink
        to="https://twitter.com/yourprofile"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        <UIcon
          name="arcticons:x-twitter"
          class="w-10 h-10 mx-2"
        />
      </ULink>
    </UContainer>

    <p class="mt-5 text-black/50 dark:text-white/50 text-center">
      &copy; 2025 Security Camera. All rights reserved.
    </p>
  </footer>
</template>
