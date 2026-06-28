<template>
  <div class="min-h-screen pb-12">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container py-4 flex items-center">
        <button
          class="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          @click="goBack"
        >
          <span class="text-xl mr-1">←</span>
          <span>返回</span>
        </button>
        <h1 class="text-xl font-bold text-center flex-1 mr-12 truncate">
          {{ school?.name || '学校详情' }}
        </h1>
      </div>
    </header>

    <main class="container py-8">
      <!-- 加载中 -->
      <div v-if="isLoading" class="card p-12 text-center">
        <div class="text-5xl mb-4">⏳</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">加载中...</h3>
      </div>

      <div v-else-if="school" class="animate-fade-in">
        <!-- 学校基本信息卡片 -->
        <div class="card p-6 md:p-8 mb-6">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {{ school.name }}
              </h1>
              <div class="flex flex-wrap items-center gap-2 text-gray-600">
                <span>📍 {{ school.city }}</span>
                <span>·</span>
                <span>{{ school.type }}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-4xl font-bold text-secondary-500">
                {{ displayScore }}
                <span class="text-lg font-normal text-gray-500">分</span>
              </div>
              <div class="text-sm text-gray-500">{{ currentProvinceName }}最低录取分</div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tag in school.tags"
              :key="tag"
              class="tag bg-primary-50 text-primary-600"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 学校简介 -->
        <div class="card p-6 md:p-8 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-xl mr-2">📖</span>
            学校简介
          </h2>
          <p class="text-gray-700 leading-relaxed">
            {{ school.description }}
          </p>
        </div>

        <!-- 录取信息 -->
        <div class="card p-6 md:p-8 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-xl mr-2">📊</span>
            录取信息
          </h2>
          <div class="bg-primary-50 rounded-xl p-5">
            <div class="flex items-center justify-between">
              <span class="text-gray-700">{{ currentProvinceName }}最低录取分数</span>
              <span class="text-2xl font-bold text-primary-600">
                {{ displayScore }} 分
              </span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-3">
            💡 提示：以上数据为参考值，实际录取分数请以学校官方公布为准
          </p>
        </div>

        <!-- 专业录取分析 -->
        <div class="card p-6 md:p-8 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-xl mr-2">🎯</span>
            专业录取分析
          </h2>
          
          <div v-if="userScore" class="mb-4 p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border border-primary-100">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-600">你的分数</span>
                <div class="text-xl font-bold text-gradient">{{ userScore }} 分</div>
              </div>
              <div class="text-right">
                <span class="text-sm text-gray-600">当前省份</span>
                <div class="text-lg font-bold text-gray-800">{{ currentProvinceName }}</div>
              </div>
            </div>
          </div>

          <div v-if="school.majorScores && school.majorScores.length > 0" class="space-y-3">
            <div
              v-for="(major, index) in school.majorScores"
              :key="major.name"
              class="border rounded-xl p-4 transition-all duration-200"
              :class="getMajorCardClass(major.minScore)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    :class="getMajorRankClass(index + 1)"
                  >
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800">{{ major.name }}</h3>
                    <div class="flex items-center gap-2 text-sm">
                      <span class="text-gray-500">最低分:</span>
                      <span class="font-bold" :class="getMajorScoreClass(major.minScore)">{{ major.minScore }}分</span>
                      <span v-if="userScore" class="text-xs px-2 py-0.5 rounded-full" :class="getMajorStatusClass(major.minScore)">
                        {{ getMajorStatusText(major.minScore) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-gray-500 mb-1">录取概率</div>
                  <div class="text-lg font-bold" :class="getMajorProbabilityClass(major.minScore)">
                    {{ getMajorProbability(major.minScore) }}%
                  </div>
                </div>
              </div>
              
              <div v-if="userScore" class="mt-3">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>分数差距</span>
                  <span>{{ getScoreDifference(major.minScore) }}</span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: `${getMajorProgress(major.minScore)}%` }"
                    :class="getMajorProgressClass(major.minScore)"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <div class="text-4xl mb-2">📚</div>
            <p>暂无专业录取分数线信息</p>
          </div>

          <p class="text-sm text-gray-500 mt-4">
            💡 提示：热门专业分数较高，冷门专业分数较低，建议合理搭配专业志愿
          </p>
        </div>

        <!-- 特色专业 -->
        <div class="card p-6 md:p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-xl mr-2">⭐</span>
            特色专业
          </h2>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="major in school.majors"
              :key="major"
              class="tag bg-secondary-50 text-secondary-700 text-base py-2 px-4"
            >
              {{ major }}
            </span>
          </div>
        </div>
      </div>

      <!-- 加载中/未找到 -->
      <div v-else class="card p-12 text-center">
        <div class="text-5xl mb-4">😕</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">未找到该学校</h3>
        <button class="btn-secondary mt-4" @click="goBack">
          返回列表
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSchoolMatch } from '@/composables/useSchoolMatch'
import { provinces } from '@/data/provinces'
import type { School } from '@/types'

const route = useRoute()
const router = useRouter()
const { selectedProvince, getProvinceScore, userScore } = useSchoolMatch()

const isLoading = ref(true)
const school = ref<School | undefined>(undefined)

onMounted(async () => {
  const id = parseInt(route.params.id as string, 10)
  if (isNaN(id)) {
    isLoading.value = false
    return
  }
  
  const { getSchoolById } = useSchoolMatch()
  school.value = await getSchoolById(id)
  isLoading.value = false
})

/**
 * 获取当前省份名称
 */
const currentProvinceName = computed(() => {
  const province = provinces.find((p) => p.code === selectedProvince.value)
  return province?.name || ''
})

/**
 * 显示当前省份的录取分数
 */
const displayScore = computed(() => {
  if (!school.value) return 0
  return getProvinceScore(school.value, selectedProvince.value)
})

/**
 * 返回上一页
 */
function goBack() {
  router.push('/find-school')
}

/**
 * 获取专业卡片样式类
 */
function getMajorCardClass(majorMinScore: number): string {
  if (!userScore.value) return 'border-gray-200 bg-white'
  
  const diff = userScore.value - majorMinScore
  if (diff >= 15) return 'border-green-200 bg-green-50'
  if (diff >= 5) return 'border-blue-200 bg-blue-50'
  if (diff >= -5) return 'border-yellow-200 bg-yellow-50'
  if (diff >= -15) return 'border-orange-200 bg-orange-50'
  return 'border-red-200 bg-red-50'
}

/**
 * 获取专业排名样式类
 */
function getMajorRankClass(rank: number): string {
  if (rank === 1) return 'bg-gradient-to-r from-red-500 to-pink-500'
  if (rank === 2) return 'bg-gradient-to-r from-orange-500 to-amber-500'
  if (rank === 3) return 'bg-gradient-to-r from-yellow-500 to-lime-500'
  return 'bg-gray-400'
}

/**
 * 获取专业分数样式类
 */
function getMajorScoreClass(majorMinScore: number): string {
  if (!userScore.value) return 'text-gray-800'
  
  const diff = userScore.value - majorMinScore
  if (diff >= 15) return 'text-green-600'
  if (diff >= 5) return 'text-blue-600'
  if (diff >= -5) return 'text-yellow-600'
  if (diff >= -15) return 'text-orange-600'
  return 'text-red-600'
}

/**
 * 获取专业状态样式类
 */
function getMajorStatusClass(majorMinScore: number): string {
  const diff = userScore.value! - majorMinScore
  if (diff >= 15) return 'bg-green-100 text-green-700'
  if (diff >= 5) return 'bg-blue-100 text-blue-700'
  if (diff >= -5) return 'bg-yellow-100 text-yellow-700'
  if (diff >= -15) return 'bg-orange-100 text-orange-700'
  return 'bg-red-100 text-red-700'
}

/**
 * 获取专业状态文本
 */
function getMajorStatusText(majorMinScore: number): string {
  const diff = userScore.value! - majorMinScore
  if (diff >= 15) return '稳'
  if (diff >= 5) return '较稳'
  if (diff >= -5) return '冲'
  if (diff >= -15) return '难'
  return '很难'
}

/**
 * 获取专业录取概率
 */
function getMajorProbability(majorMinScore: number): number {
  if (!userScore.value) return 50
  
  const diff = userScore.value - majorMinScore
  let probability = 50 + (diff * 2)
  probability = Math.max(0, Math.min(100, probability))
  return Math.round(probability)
}

/**
 * 获取专业概率样式类
 */
function getMajorProbabilityClass(majorMinScore: number): string {
  const probability = getMajorProbability(majorMinScore)
  if (probability >= 80) return 'text-green-600'
  if (probability >= 60) return 'text-blue-600'
  if (probability >= 40) return 'text-yellow-600'
  if (probability >= 20) return 'text-orange-600'
  return 'text-red-600'
}

/**
 * 获取分数差距文本
 */
function getScoreDifference(majorMinScore: number): string {
  const diff = userScore.value! - majorMinScore
  if (diff > 0) return `高于 ${diff} 分`
  if (diff < 0) return `低于 ${Math.abs(diff)} 分`
  return '正好'
}

/**
 * 获取专业进度条宽度
 */
function getMajorProgress(majorMinScore: number): number {
  if (!userScore.value) return 50
  
  const schoolMinScore = school.value?.minScore || majorMinScore
  const range = 50
  const progress = 50 + ((userScore.value - majorMinScore) / range) * 50
  return Math.max(0, Math.min(100, progress))
}

/**
 * 获取专业进度条样式类
 */
function getMajorProgressClass(majorMinScore: number): string {
  const diff = userScore.value! - majorMinScore
  if (diff >= 15) return 'bg-gradient-to-r from-green-400 to-green-600'
  if (diff >= 5) return 'bg-gradient-to-r from-blue-400 to-blue-600'
  if (diff >= -5) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  if (diff >= -15) return 'bg-gradient-to-r from-orange-400 to-orange-600'
  return 'bg-gradient-to-r from-red-400 to-red-600'
}
</script>
