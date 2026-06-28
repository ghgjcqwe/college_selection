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
const { selectedProvince, getProvinceScore } = useSchoolMatch()

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
</script>
