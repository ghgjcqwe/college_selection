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
          {{ major?.name || '专业详情' }}
        </h1>
      </div>
    </header>

    <main class="container py-8">
      <div v-if="major" class="animate-fade-in">
        <!-- 专业基本信息卡片 -->
        <div class="card p-6 md:p-8 mb-6">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {{ major.name }}
          </h1>
          <div class="flex flex-wrap items-center gap-2 text-gray-600 mb-4">
            <span class="tag bg-primary-50 text-primary-600">
              {{ major.category }}
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in major.tags"
              :key="tag"
              class="tag bg-secondary-50 text-secondary-600"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 学什么 -->
        <div class="card p-6 md:p-8 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-xl mr-2">📚</span>
            学什么？
          </h2>
          <div class="grid md:grid-cols-2 gap-3">
            <div
              v-for="(course, index) in major.courses"
              :key="index"
              class="flex items-center bg-gray-50 rounded-xl px-4 py-3"
            >
              <span class="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                {{ index + 1 }}
              </span>
              <span class="text-gray-700">{{ course }}</span>
            </div>
          </div>
        </div>

        <!-- 毕业做什么 -->
        <div class="card p-6 md:p-8 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-xl mr-2">💼</span>
            毕业做什么？
          </h2>
          <div class="space-y-3">
            <div
              v-for="(career, index) in major.careers"
              :key="index"
              class="flex items-center bg-green-50 rounded-xl px-4 py-3"
            >
              <span class="text-xl mr-3">✅</span>
              <span class="text-gray-700">{{ career }}</span>
            </div>
          </div>
        </div>

        <!-- 适合什么样的人 -->
        <div class="card p-6 md:p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-xl mr-2">🎯</span>
            适合什么样的人？
          </h2>
          <div class="space-y-3">
            <div
              v-for="(trait, index) in major.fitPerson"
              :key="index"
              class="flex items-center bg-orange-50 rounded-xl px-4 py-3"
            >
              <span class="text-xl mr-3">⭐</span>
              <span class="text-gray-700">{{ trait }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 未找到 -->
      <div v-else class="card p-12 text-center">
        <div class="text-5xl mb-4">😕</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">未找到该专业</h3>
        <button class="btn-secondary mt-4" @click="goBack">
          返回列表
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { majors } from '@/data/majors'

const route = useRoute()
const router = useRouter()

/**
 * 根据路由参数获取专业信息
 */
const major = computed(() => {
  const id = Number(route.params.id)
  return majors.find((m) => m.id === id)
})

/**
 * 返回上一页
 */
function goBack() {
  router.push('/choose-major')
}
</script>
