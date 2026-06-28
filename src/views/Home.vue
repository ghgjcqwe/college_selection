<template>
  <div class="min-h-screen flex flex-col">
    <!-- 主内容区 -->
    <main class="flex-1 flex items-center justify-center py-12 px-4">
      <div class="max-w-4xl w-full text-center animate-fade-in">
        <!-- 标题区域 -->
        <div class="mb-12">
          <div class="text-6xl mb-4 animate-bounce-soft">🎓</div>
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
              高考志愿填报助手
            </span>
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            输入分数，快速找到适合你的大学<br />
            测一测，发现最适合你的专业
          </p>
        </div>

        <!-- 功能入口卡片 -->
        <div class="grid md:grid-cols-2 gap-6 mb-12">
          <!-- 找学校 -->
          <div
            class="card p-8 cursor-pointer hover:-translate-y-2 transition-all duration-300 group text-left"
            @click="goToFindSchool"
          >
            <div class="text-5xl mb-4">📊</div>
            <h2 class="text-2xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors mb-2">
              分数找学校
            </h2>
            <p class="text-gray-600 mb-4">
              输入你的高考分数，智能推荐冲刺、稳妥、保底三档院校
            </p>
            <div class="flex items-center text-primary-500 font-medium group-hover:translate-x-1 transition-transform">
              立即体验
              <span class="ml-2">→</span>
            </div>
          </div>

          <!-- 选专业 -->
          <div
            class="card p-8 cursor-pointer hover:-translate-y-2 transition-all duration-300 group text-left"
            @click="goToChooseMajor"
          >
            <div class="text-5xl mb-4">🎯</div>
            <h2 class="text-2xl font-bold text-gray-800 group-hover:text-secondary-500 transition-colors mb-2">
              专业怎么选
            </h2>
            <p class="text-gray-600 mb-4">
              8大学科分类浏览，更有兴趣小测试帮你找到适合的专业
            </p>
            <div class="flex items-center text-secondary-500 font-medium group-hover:translate-x-1 transition-transform">
              立即体验
              <span class="ml-2">→</span>
            </div>
          </div>
        </div>

        <!-- 底部提示 -->
        <div class="text-sm text-gray-500">
          <p>💡 提示：数据仅供参考，请以官方发布为准</p>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
      <p>高考志愿填报助手 · 助你开启美好未来</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 跳转到找学校页面
 */
function goToFindSchool() {
  router.push('/find-school')
}

/**
 * 跳转到选专业页面
 */
function goToChooseMajor() {
  router.push('/choose-major')
}
</script>
