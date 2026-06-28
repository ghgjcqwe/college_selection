<template>
  <div class="w-full">
    <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full bg-gradient-primary rounded-full transition-all duration-500 ease-out"
        :style="{ width: `${percent}%` }"
      ></div>
    </div>
    <div v-if="showText" class="text-center text-sm text-gray-500 mt-2">
      {{ Math.round(percent) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  percent: number
  showText?: boolean
}>()
</script>
