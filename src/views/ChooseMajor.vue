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
        <h1 class="text-xl font-bold text-center flex-1 mr-12">🎯 专业怎么选</h1>
      </div>
    </header>

    <main class="container py-8">
      <!-- 兴趣测试入口 -->
      <div
        class="card p-6 md:p-8 mb-8 cursor-pointer hover:-translate-y-1 transition-all duration-300 bg-gradient-primary text-white animate-slide-up"
        @click="goToQuiz"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold mb-2">🎯 兴趣小测试</h2>
            <p class="text-white/90">
              答 8 道简单的题目，发现最适合你的专业方向
            </p>
            <p class="text-white/70 text-sm mt-1">约 2 分钟完成</p>
          </div>
          <div class="flex items-center">
            <span class="text-lg font-medium">开始测试</span>
            <span class="text-2xl ml-2">→</span>
          </div>
        </div>
      </div>

      <!-- 分类浏览 -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="text-2xl mr-2">📂</span>
          按学科分类浏览
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="category in categories"
            :key="category.name"
            class="card p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300"
            :class="{ 'ring-2 ring-primary-400': activeCategory === category.name }"
            @click="toggleCategory(category.name)"
          >
            <div class="text-3xl mb-2">{{ category.icon }}</div>
            <h3 class="font-bold text-gray-800 mb-1">{{ category.name }}类</h3>
            <p class="text-sm text-gray-500">
              {{ getMajorCountByCategory(category.name) }} 个专业
            </p>
          </div>
        </div>
      </div>

      <!-- 专业列表（展开时显示） -->
      <div v-if="activeCategory" class="animate-fade-in">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="text-2xl mr-2">📚</span>
          {{ activeCategory }}类专业
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MajorCard
            v-for="major in filteredMajors"
            :key="major.id"
            :major="major"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MajorCard from '@/components/MajorCard.vue'
import { majors } from '@/data/majors'

const router = useRouter()
const activeCategory = ref<string | null>(null)

// 学科分类配置
const categories = [
  { name: '工学', icon: '⚙️' },
  { name: '医学', icon: '🏥' },
  { name: '文学', icon: '📖' },
  { name: '经济学', icon: '💰' },
  { name: '管理学', icon: '📊' },
  { name: '教育学', icon: '🎓' },
  { name: '理学', icon: '🔬' },
  { name: '法学', icon: '⚖️' },
]

/**
 * 根据分类筛选专业
 */
const filteredMajors = computed(() => {
  if (!activeCategory.value) return []
  return majors.filter((m) => m.category === activeCategory.value)
})

/**
 * 获取某分类下的专业数量
 */
function getMajorCountByCategory(category: string): number {
  return majors.filter((m) => m.category === category).length
}

/**
 * 切换分类展开/收起
 */
function toggleCategory(category: string) {
  if (activeCategory.value === category) {
    activeCategory.value = null
  } else {
    activeCategory.value = category
  }
}

/**
 * 跳转到兴趣测试页
 */
function goToQuiz() {
  router.push('/quiz')
}

/**
 * 返回上一页
 */
function goBack() {
  router.push('/')
}
</script>
