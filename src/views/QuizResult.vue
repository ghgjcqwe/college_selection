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
        <h1 class="text-xl font-bold text-center flex-1 mr-12">🎉 测试结果</h1>
      </div>
    </header>

    <main class="container py-8 max-w-2xl mx-auto">
      <div class="text-center mb-8 animate-fade-in">
        <div class="text-6xl mb-4">🎊</div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          测试完成！
        </h1>
        <p class="text-gray-600">
          根据你的兴趣特点，为你推荐以下专业
        </p>
      </div>

      <!-- 推荐专业列表 -->
      <div class="space-y-4 mb-8">
        <div
          v-for="(result, index) in matchResults"
          :key="result.major.id"
          class="card p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300 animate-slide-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="goToMajorDetail(result.major.id)"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <span class="text-3xl mr-3">
                {{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}
              </span>
              <div>
                <h3 class="text-lg font-bold text-gray-800">
                  {{ result.major.name }}
                </h3>
                <p class="text-sm text-gray-500">{{ result.major.category }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-secondary-500">
                {{ result.matchRate }}%
              </div>
              <div class="text-xs text-gray-500">匹配度</div>
            </div>
          </div>

          <div class="mb-3">
            <ProgressBar :percent="result.matchRate" />
          </div>

          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in result.major.tags.slice(0, 4)"
              :key="tag"
              class="tag bg-primary-50 text-primary-600 text-xs"
            >
              {{ tag }}
            </span>
          </div>

          <div class="mt-4 text-primary-500 font-medium text-sm flex items-center">
            查看详情
            <span class="ml-1">→</span>
          </div>
        </div>
      </div>

      <!-- 你的兴趣标签 -->
      <div v-if="tagScores.length > 0" class="card p-6 mb-8">
        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span class="text-xl mr-2">🏷️</span>
          你的兴趣特点
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(item, index) in tagScores.slice(0, 5)"
            :key="item.tag"
            class="tag bg-gradient-to-r from-primary-500 to-purple-500 text-white text-sm"
          >
            {{ index + 1 }}. {{ item.tag }}
          </span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="space-y-4">
        <button class="btn-secondary w-full py-4 text-lg" @click="restartQuiz">
          🔄 再测一次
        </button>
        <button
          class="w-full py-4 text-lg text-primary-600 font-medium hover:text-primary-700 transition-colors"
          @click="goToChooseMajor"
        >
          📚 浏览全部专业
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProgressBar from '@/components/ProgressBar.vue'
import { useQuiz } from '@/composables/useQuiz'

const router = useRouter()
const { quizState, matchResults, tagScores, restart } = useQuiz()

/**
 * 页面加载时检查是否完成测试，未完成则跳转回测试页
 */
onMounted(() => {
  if (!quizState.isCompleted) {
    router.push('/quiz')
  }
})

/**
 * 跳转到专业详情页
 */
function goToMajorDetail(id: number) {
  router.push(`/major/${id}`)
}

/**
 * 重新测试
 */
function restartQuiz() {
  restart()
  router.push('/quiz')
}

/**
 * 跳转到选专业页
 */
function goToChooseMajor() {
  router.push('/choose-major')
}

/**
 * 返回上一页
 */
function goBack() {
  router.push('/choose-major')
}
</script>
