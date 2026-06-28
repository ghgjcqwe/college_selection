<template>
  <div
    class="card p-5 cursor-pointer hover:-translate-y-1 group"
    @click="handleClick"
  >
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
        {{ school.name }}
      </h3>
      <span class="text-2xl font-bold text-secondary-500">
        {{ displayScore }}
        <span class="text-sm font-normal text-gray-500">分</span>
      </span>
    </div>
    <div class="flex items-center gap-2 mb-3 text-sm text-gray-600">
      <span>📍 {{ school.city }}</span>
      <span>·</span>
      <span>{{ school.type }}</span>
    </div>
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="tag in school.tags"
        :key="tag"
        class="tag bg-primary-50 text-primary-600 text-xs"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { School } from '@/types'
import { useRouter } from 'vue-router'
import { useSchoolMatch } from '@/composables/useSchoolMatch'

const props = defineProps<{
  school: School
}>()

const router = useRouter()
const { selectedProvince, getProvinceScore } = useSchoolMatch()

/**
 * 显示当前省份的录取分数
 */
const displayScore = computed(() => {
  return getProvinceScore(props.school, selectedProvince.value)
})

/**
 * 点击卡片跳转到学校详情页
 */
function handleClick() {
  router.push(`/school/${props.school.id}`)
}
</script>
