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
          配置你自己的 API Key 来启用 AI 助手功能（支持硅基流动、DeepSeek等平台）
        </p>

        <div class="mb-6 p-4 rounded-xl" :class="hasApiKey ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100'">
          <div class="flex items-center">
            <span class="text-2xl mr-3">{{ hasApiKey ? '✅' : 'ℹ️' }}</span>
            <div>
              <p class="font-medium" :class="hasApiKey ? 'text-green-700' : 'text-blue-700'">
                {{ hasApiKey ? 'API Key 已配置' : '使用默认API Key' }}
              </p>
              <p v-if="hasApiKey" class="text-sm text-green-600">
                当前Key: {{ maskApiKey(currentKey) }}
              </p>
              <p v-else class="text-sm text-blue-600">
                系统已内置默认API Key，如果失效请配置你自己的
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2">
              API 提供商
            </label>
            <select
              v-model="providerInput"
              class="input-field w-full"
            >
              <option value="deepseek">DeepSeek</option>
              <option value="siliconflow">硅基流动</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">
              API Key
            </label>
            <div class="flex space-x-3">
              <input
                v-model="apiKeyInput"
                :type="showKey ? 'text' : 'password'"
                class="input-field flex-1"
                placeholder="sk-xxxxxxxxxxxxxxxx"
              />
              <button
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-lg"
                @click="showKey = !showKey"
              >
                {{ showKey ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <button
            class="btn-primary w-full"
            @click="saveApiKey"
          >
            💾 保存配置
          </button>

          <button
            v-if="hasApiKey"
            class="w-full py-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            @click="clearApiKey"
          >
            🗑️ 清除已保存的 API Key
          </button>
        </div>

        <div class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <h3 class="font-medium text-blue-700 mb-3 flex items-center gap-2">
            <span>💡</span> 如何获取 API Key？
          </h3>
          <div class="text-sm text-blue-600 space-y-3">
            <div class="p-3 bg-white/60 rounded-lg backdrop-blur-sm">
              <p class="font-medium mb-2 text-purple-700">🌟 硅基流动（推荐）</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>访问 <a href="https://siliconflow.cn/" target="_blank" class="underline hover:text-purple-600">硅基流动官网</a></li>
                <li>注册/登录账号</li>
                <li>进入"API密钥"页面创建密钥</li>
                <li>复制生成的Key并粘贴到上方输入框</li>
              </ol>
              <p class="text-xs mt-2 text-purple-600">💡 新用户有免费额度，支持DeepSeek等多种模型</p>
            </div>
            <div class="p-3 bg-white/60 rounded-lg backdrop-blur-sm">
              <p class="font-medium mb-2 text-blue-700">DeepSeek 官方</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>访问 <a href="https://platform.deepseek.com/" target="_blank" class="underline hover:text-blue-600">DeepSeek 开放平台</a></li>
                <li>注册/登录账号</li>
                <li>进入 "API Keys" 页面</li>
                <li>点击 "Create API Key" 创建新的 Key</li>
              </ol>
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
          <p>AI功能: 需要用户配置自己的 DeepSeek API Key</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getApiKey, saveApiKey as saveKey, clearApiKey as clearKey, hasApiKey as hasKey, getApiProvider, saveApiProvider } from '@/utils/apiKeyManager'

const router = useRouter()

const apiKeyInput = ref('')
const providerInput = ref<'deepseek' | 'siliconflow'>('deepseek')
const showKey = ref(false)
const currentKey = ref('')

const hasApiKey = computed(() => {
  return currentKey.value.length > 0 && currentKey.value.startsWith('sk-')
})

onMounted(() => {
  currentKey.value = getApiKey()
  apiKeyInput.value = currentKey.value
  providerInput.value = getApiProvider()
})

/**
 * 保存 API Key 和提供商
 */
function saveApiKey() {
  const key = apiKeyInput.value.trim()
  if (!key) {
    alert('请输入 API Key')
    return
  }
  if (!key.startsWith('sk-')) {
    alert('API Key 格式不正确，应以 sk- 开头')
    return
  }
  saveKey(key)
  saveApiProvider(providerInput.value)
  currentKey.value = key
  alert('配置保存成功！')
}

/**
 * 清除 API Key
 */
function clearApiKey() {
  if (confirm('确定要清除已保存的 API Key 吗？')) {
    clearKey()
    currentKey.value = ''
    apiKeyInput.value = ''
    alert('API Key 已清除')
  }
}

/**
 * 隐藏 API Key 中间部分
 */
function maskApiKey(key: string): string {
  if (key.length <= 10) return key
  return key.slice(0, 6) + '...' + key.slice(-4)
}

/**
 * 返回上一页
 */
function goBack() {
  router.push('/')
}
</script>
