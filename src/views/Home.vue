<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden">
    <div class="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute top-1/4 right-0 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl translate-x-1/3"></div>
    <div class="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl -translate-y-1/3"></div>

    <main class="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
      <div class="max-w-5xl w-full text-center animate-fade-in">
        <div class="mb-12">
          <div class="text-7xl mb-6 animate-float">🎓</div>
          <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span class="text-gradient">
              高考志愿填报助手
            </span>
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            智能推荐 · 精准匹配 · 科学决策<br />
            <span class="text-gray-500 text-lg">让每一分都物尽其用</span>
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div
            class="card p-6 cursor-pointer hover:-translate-y-2 transition-all duration-300 group text-left relative overflow-hidden"
            @click="goToFindSchool"
          >
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative">
              <div class="text-5xl mb-4">📊</div>
              <h2 class="text-xl font-bold text-gray-800 group-hover:text-gradient transition-all mb-2">
                分数找学校
              </h2>
              <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                输入高考分数，智能推荐冲刺、稳妥、保底三档院校
              </p>
              <div class="flex items-center text-primary-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                立即体验
                <span class="ml-1">→</span>
              </div>
            </div>
          </div>

          <div
            class="card p-6 cursor-pointer hover:-translate-y-2 transition-all duration-300 group text-left relative overflow-hidden"
            @click="goToChooseMajor"
          >
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative">
              <div class="text-5xl mb-4">🎯</div>
              <h2 class="text-xl font-bold text-gray-800 group-hover:text-gradient-pink transition-all mb-2">
                专业怎么选
              </h2>
              <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                8大学科分类浏览，兴趣小测试帮你找到适合的专业
              </p>
              <div class="flex items-center text-pink-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                立即体验
                <span class="ml-1">→</span>
              </div>
            </div>
          </div>

          <div
            class="card p-6 cursor-pointer hover:-translate-y-2 transition-all duration-300 group text-left relative overflow-hidden"
            @click="goToAIChat"
          >
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative">
              <div class="text-5xl mb-4">🤖</div>
              <h2 class="text-xl font-bold text-gray-800 group-hover:text-gradient transition-all mb-2">
                AI志愿助手
              </h2>
              <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                智能问答，解答志愿填报、专业选择等各种问题
              </p>
              <div class="flex items-center text-purple-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                立即体验
                <span class="ml-1">→</span>
              </div>
            </div>
          </div>

          <div
            class="card p-6 cursor-pointer hover:-translate-y-2 transition-all duration-300 group text-left relative overflow-hidden"
            @click="goToVolunteerPlan"
          >
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative">
              <div class="text-5xl mb-4">📝</div>
              <h2 class="text-xl font-bold text-gray-800 group-hover:text-gradient-ocean transition-all mb-2">
                志愿填报模拟
              </h2>
              <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                智能生成志愿方案，模拟填报流程，评估方案风险
              </p>
              <div class="flex items-center text-teal-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                开始填报
                <span class="ml-1">→</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center items-center gap-2 text-sm text-gray-500 mb-8">
          <span class="animate-pulse-soft">💡</span>
          <p>数据仅供参考，请以官方发布为准</p>
        </div>

        <div>
          <button
            class="text-gray-400 hover:text-gray-600 text-sm underline transition-colors"
            @click="goToSettings"
          >
            ⚙️ AI助手设置
          </button>
        </div>
      </div>
    </main>

    <footer class="py-6 text-center text-sm text-gray-500 border-t border-gray-200/50 relative z-10">
      <p>高考志愿填报助手 · 助你开启美好未来 ✨</p>
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

/**
 * 跳转到AI助手页面
 */
function goToAIChat() {
  router.push('/ai-chat')
}

/**
 * 跳转到志愿填报模拟页面
 */
function goToVolunteerPlan() {
  router.push('/volunteer-plan')
}

/**
 * 跳转到设置页面
 */
function goToSettings() {
  router.push('/settings')
}
</script>
