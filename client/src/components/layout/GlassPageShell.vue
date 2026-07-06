<template>
  <div class="page-shell">
    <div class="page-bg" aria-hidden="true">
      <div class="page-bg-orb page-bg-orb--blue" />
      <div class="page-bg-orb page-bg-orb--mint" />
    </div>

    <div class="page-content">
      <header v-if="title" class="page-header">
        <h2 class="page-title">{{ title }}</h2>
        <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
      </header>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
}>();
</script>
