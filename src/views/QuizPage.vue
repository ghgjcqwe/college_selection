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
        <h1 class="text-xl font-bold text-center flex-1 mr-12">
          🎯 兴趣小测试
        </h1>
      </div>
    </header>

    <main class="container py-8 max-w-2xl mx-auto">
      <div class="card p-6 md:p-8 animate-fade-in">
        <!-- 进度信息 -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-gray-500">
              第 {{ currentIndex + 1 }} 题 / 共 {{ totalQuestions }} 题
            </span>
            <span class="text-sm font-medium text-primary-600">
              {{ Math.round(progress) }}%
            </span>
          </div>
          <ProgressBar :percent="progress" />
        </div>

        <!-- 题目 -->
        <div class="mb-8">
          <h2 class="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
            {{ currentQuestion?.question }}
          </h2>
        </div>

        <!-- 选项 -->
        <div class="space-y-4 mb-8">
          <button
            v-for="option in currentQuestion?.options"
            :key="option.label"
            class="w-full text-left p-5 rounded-2xl border-2 transition-all duration-200"
            :class="[
              selectedLabel === option.label
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50',
            ]"
            @click="selectOption(option.label)"
          >
            <div class="flex items-start">
              <span
                class="w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0"
                :class="[
                  selectedLabel === option.label
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600',
                ]"
              >
                {{ option.label }}
              </span>
              <span class="text-gray-800 text-lg pt-1">{{ option.text }}</span>
            </div>
          </button>
        </div>

        <!-- 下一题按钮 -->
        <button
          class="btn-primary w-full text-lg py-4"
          :disabled="!selectedLabel"
          :class="{ 'opacity-50 cursor-not-allowed': !selectedLabel }"
          @click="handleNext"
        >
          {{ isLastQuestion ? '查看结果 🎉' : '下一题 →' }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProgressBar from '@/components/ProgressBar.vue'
import { useQuiz } from '@/composables/useQuiz'

const router = useRouter()
const {
  quizState,
  totalQuestions,
  currentQuestion,
  progress,
  isLastQuestion,
  selectAnswer,
} = useQuiz()

const selectedLabel = ref<string | null>(null)

// 当前题目索引（响应式）
const currentIndex = computed(() => quizState.currentIndex)

// 切换题目时重置选中状态
watch(
  () => quizState.currentIndex,
  () => {
    selectedLabel.value = null
  }
)

/**
 * 选择选项
 */
function selectOption(label: string) {
  selectedLabel.value = label
}

/**
 * 下一题/提交
 */
function handleNext() {
  if (!selectedLabel.value) return

  selectAnswer(selectedLabel.value)

  // 如果是最后一题，跳转到结果页
  if (isLastQuestion.value) {
    router.push('/quiz/result')
  }
}

/**
 * 返回上一页
 */
function goBack() {
  router.push('/choose-major')
}
</script>
