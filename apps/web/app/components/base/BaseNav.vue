<template>
  <nav>
    <div class="hidden md:flex flex-grow justify-center gap-5">
      <!-- <ULink
        v-for="item in props.navItems"
        :key="item.to"
        :to="item.to"
      >
        {{ item.label }}
      </ULink> -->
    </div>
 
  </nav>
</template>
<script setup lang="ts">
  const emits = defineEmits(['update:modelValue']);
  const props = defineProps<{
    navItems: { label: string; to: string }[];
    open: boolean;
  }>();
  const isOpen = ref(false);
  watch(
    () => props.open,
    (value) => {
      isOpen.value = value;
    }
  );
  const updateIsOpen = (value: boolean) => {
    emits('update:modelValue', value);
  };

  const goTo = async (to: string) => {
    emits('update:modelValue', false);
    console.log('isOpen', isOpen.value);

    await navigateTo(to);
  };
</script>
