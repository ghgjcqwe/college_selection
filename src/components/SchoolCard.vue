<template>
  <div
    class="card p-5 cursor-pointer hover:-translate-y-2 group relative overflow-hidden"
    @click="handleClick"
  >
    <div class="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"
         :class="tierGlowClass"></div>
    
    <div class="absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-xs font-bold shadow-sm" :class="probabilityClass">
      {{ probabilityLabel }}
    </div>
    
    <div class="flex justify-between items-start mb-3 relative">
      <h3 class="text-lg font-bold group-hover:text-gradient transition-all duration-300 text-gray-800">
        {{ schoolData.name }}
      </h3>
      <span class="text-2xl font-bold text-gradient">
        {{ displayScore }}
        <span class="text-sm font-normal text-gray-400">分</span>
      </span>
    </div>
    <div class="flex items-center gap-2 mb-3 text-sm text-gray-600 flex-wrap">
      <span class="flex items-center gap-1">
        <span>📍</span> {{ schoolData.city }}
      </span>
      <span class="text-gray-300">·</span>
      <span>{{ schoolData.type }}</span>
    </div>
    
    <div v-if="probability !== undefined" class="mb-3">
      <div class="flex justify-between text-xs text-gray-500 mb-1.5">
        <span>录取概率</span>
        <span class="font-medium" :class="probabilityTextClass">{{ probability }}%</span>
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
    
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="tag in schoolData.tags"
        :key="tag"
        class="tag bg-gradient-to-r from-primary-50 to-purple-50 text-primary-600 text-xs font-medium"
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
  if (probability.value >= 80) return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
  if (probability.value >= 50) return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
  if (probability.value >= 20) return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
  return 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
})

const probabilityTextClass = computed(() => {
  if (!probability.value) return 'text-gray-500'
  if (probability.value >= 80) return 'text-green-600'
  if (probability.value >= 50) return 'text-blue-600'
  if (probability.value >= 20) return 'text-yellow-600'
  return 'text-red-600'
})

const probabilityGradient = computed(() => {
  if (!probability.value) return '#d1d5db'
  if (probability.value >= 80) return 'linear-gradient(90deg, #10b981, #14b8a6)'
  if (probability.value >= 50) return 'linear-gradient(90deg, #3b82f6, #6366f1)'
  if (probability.value >= 20) return 'linear-gradient(90deg, #f59e0b, #f97316)'
  return 'linear-gradient(90deg, #ef4444, #ec4899)'
})

const tierGlowClass = computed(() => {
  if (props.tier === 'sprint') return 'bg-red-500'
  if (props.tier === 'safe') return 'bg-blue-500'
  if (props.tier === 'guarantee') return 'bg-green-500'
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
  if (scoreDifference.value > 0) return 'text-red-500'
  return 'text-green-600'
})

function handleClick() {
  router.push(`/school/${schoolData.value.id}`)
}
</script>
