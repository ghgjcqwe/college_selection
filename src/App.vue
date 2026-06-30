<template>
  <div class="app-container">
    <router-view />
    <AiAssistant />
  </div>
</template>

<script setup lang="ts">
import AiAssistant from '@/components/AiAssistant.vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}
</style>