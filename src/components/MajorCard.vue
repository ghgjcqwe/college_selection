<template>
  <div
    class="card p-4 cursor-pointer hover:-translate-y-1 group"
    @click="handleClick"
  >
    <h3 class="text-base font-bold text-gray-800 group-hover:text-primary-600 transition-colors mb-2">
      {{ major.name }}
    </h3>
    <div class="text-sm text-gray-500 mb-2">
      {{ major.category }}
    </div>
    <div class="flex flex-wrap gap-1">
      <span
        v-for="tag in major.tags.slice(0, 3)"
        :key="tag"
        class="tag bg-secondary-50 text-secondary-600 text-xs"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Major } from '@/types'
import { useRouter } from 'vue-router'

const props = defineProps<{
  major: Major
}>()

const router = useRouter()

/**
 * 点击卡片跳转到专业详情页
 */
function handleClick() {
  router.push(`/major/${props.major.id}`)
}
</script>
