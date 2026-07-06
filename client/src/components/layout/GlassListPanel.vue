<template>
  <article class="glass-panel">
    <div v-if="$slots.toolbar" class="glass-panel__toolbar">
      <slot name="toolbar" />
    </div>
    <div class="glass-panel__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="glass-panel__footer">
      <slot name="footer" />
    </div>
  </article>
</template>

<script setup lang="ts"></script>
