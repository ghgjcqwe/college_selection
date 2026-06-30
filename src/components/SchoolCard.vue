<template>
  <div
    class="card p-5 cursor-pointer hover:-translate-y-2 group relative overflow-hidden"
    @click="handleClick"
  >
    <!-- 背景装饰 -->
    <div class="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"
         :class="tierGlowClass"></div>
    
    <!-- 概率等级标签 -->
    <div class="absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-xs font-bold shadow-sm" :class="probabilityClass">
      {{ probabilityLabel }}
    </div>
    
    <!-- 学校名称和分数 -->
    <div class="flex justify-between items-start mb-3 relative">
      <h3 class="text-lg font-bold group-hover:text-primary-600 transition-colors duration-300 text-gray-800">
        {{ schoolData.name }}
      </h3>
      <div class="text-right">
        <span class="data-core text-2xl">
          {{ displayScore }}
        </span>
        <span class="data-label block">最低分</span>
      </div>
    </div>
    
    <!-- 位置和类型 -->
    <div class="flex items-center gap-2 mb-3 text-sm text-gray-600 flex-wrap">
      <span class="flex items-center gap-1">
        <span>📍</span> {{ schoolData.city }}
      </span>
      <span class="text-gray-300">·</span>
      <span>{{ schoolData.type }}</span>
    </div>
    
    <!-- 概率进度条 -->
    <div v-if="probability !== undefined" class="mb-3">
      <div class="flex justify-between text-xs mb-1.5">
        <span class="data-label">录取概率</span>
        <span class="font-bold" :class="probabilityTextClass">{{ probability }}%</span>
      </div>
      <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          class="h-full rounded-full transition-all duration-700" 
          :style="{ width: `${probability}%`, background: probabilityGradient }"
        ></div>
      </div>
      <div class="text-xs mt-1.5 font-medium" :class="scoreDiffClass">
        {{ scoreDiffLabel }}
      </div>
    </div>
    
    <!-- 标签 -->
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="tag in schoolData.tags"
        :key="tag"
        class="tag bg-primary-50 text-primary-600 text-xs font-medium"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { School, SchoolMatchWithProbability, SchoolTier } from '@/types'
import { useRouter } from 'vue-router'
import { useSchoolMatch } from '@/composables/useSchoolMatch'

const props = defineProps<{
  school: School | SchoolMatchWithProbability
  tier?: SchoolTier
}>()

const router = useRouter()
const { selectedProvince, getProvinceScore } = useSchoolMatch()

const isMatchResult = computed(() => {
  return 'probability' in props.school
})

const schoolData = computed(() => {
  return isMatchResult.value ? props.school.school : props.school
})

const probability = computed(() => {
  return isMatchResult.value ? props.school.probability : undefined
})

const scoreDifference = computed(() => {
  return isMatchResult.value ? props.school.scoreDifference : undefined
})

const probabilityLevel = computed(() => {
  return isMatchResult.value ? props.school.probabilityLevel : undefined
})

const displayScore = computed(() => {
  return getProvinceScore(schoolData.value, selectedProvince.value)
})

const probabilityLabel = computed(() => {
  if (!probability.value) return ''
  if (probability.value >= 80) return '极高'
  if (probability.value >= 50) return '高'
  if (probability.value >= 20) return '中'
  return '低'
})

const probabilityClass = computed(() => {
  if (!probability.value) return 'bg-gray-100 text-gray-500'
  if (probability.value >= 80) return 'tag-probability-high'
  if (probability.value >= 50) return 'tag-probability-medium'
  if (probability.value >= 20) return 'bg-sprint-500 text-white'
  return 'tag-probability-low'
})

const probabilityTextClass = computed(() => {
  if (!probability.value) return 'text-gray-500'
  if (probability.value >= 80) return 'text-safety-600'
  if (probability.value >= 50) return 'text-primary-600'
  if (probability.value >= 20) return 'text-sprint-600'
  return 'text-red-600'
})

const probabilityGradient = computed(() => {
  if (!probability.value) return '#d1d5db'
  if (probability.value >= 80) return 'linear-gradient(90deg, #10b981, #059669)'
  if (probability.value >= 50) return 'linear-gradient(90deg, #3b82f6, #2563eb)'
  if (probability.value >= 20) return 'linear-gradient(90deg, #f97316, #ea580c)'
  return 'linear-gradient(90deg, #ef4444, #dc2626)'
})

const tierGlowClass = computed(() => {
  if (props.tier === 'sprint') return 'bg-sprint-500'
  if (props.tier === 'safe') return 'bg-primary-500'
  if (props.tier === 'guarantee') return 'bg-safety-500'
  return 'bg-primary-500'
})

const scoreDiffLabel = computed(() => {
  if (scoreDifference.value === undefined) return ''
  if (scoreDifference.value > 0) {
    return `需超${scoreDifference.value}分`
  } else if (scoreDifference.value < 0) {
    return `超出${Math.abs(scoreDifference.value)}分`
  }
  return '分数持平'
})

const scoreDiffClass = computed(() => {
  if (scoreDifference.value === undefined) return 'text-gray-500'
  if (scoreDifference.value > 0) return 'text-sprint-500'
  return 'text-safety-500'
})

function handleClick() {
  router.push(`/school/${schoolData.value.id}`)
}
</script>