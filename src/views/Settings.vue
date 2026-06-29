<template>
  <div class="min-h-screen pb-12 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

    <header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-white/50">
      <div class="container py-4 flex items-center">
        <button
          class="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          @click="goBack"
        >
          <span class="text-xl mr-1">←</span>
          <span>返回</span>
        </button>
        <h1 class="text-xl font-bold text-center flex-1 mr-12">
          <span class="text-gradient">⚙️ 设置</span>
        </h1>
      </div>
    </header>

    <main class="container py-8 relative z-10">
      <div class="card p-6 md:p-8 animate-slide-up max-w-2xl mx-auto relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>
        <h2 class="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span>🤖</span> AI助手配置
        </h2>
        <p class="text-gray-600 mb-6">
          API Key 已配置在后端服务器（server/.env），前端不接触密钥，安全可靠
        </p>

        <div class="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
          <div class="flex items-center">
            <span class="text-2xl mr-3">✅</span>
            <div>
              <p class="font-medium text-green-700">
                AI 服务已就绪
              </p>
              <p class="text-sm text-green-600">
                如需更换 API Key，请编辑 server/.env 文件中的密钥
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card p-6 md:p-8 mt-6 animate-slide-up max-w-2xl mx-auto relative overflow-hidden" style="animation-delay: 100ms;">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>ℹ️</span> 关于
        </h2>
        <div class="text-gray-600 space-y-2">
          <p><strong class="text-gradient">高考志愿填报助手</strong></p>
          <p>版本: 1.0.0</p>
          <p>数据说明: 当前使用模拟数据，真实数据需要接入数据库</p>
          <p>AI功能: API Key 配置在服务器端，前端安全可靠</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 返回上一页
 */
function goBack() {
  router.push('/')
}
</script>
