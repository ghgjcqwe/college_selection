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
        <h1 class="text-xl font-bold text-center flex-1 mr-12">⚙️ 设置</h1>
      </div>
    </header>

    <main class="container py-8">
      <!-- API Key 设置 -->
      <div class="card p-6 md:p-8 animate-slide-up">
        <h2 class="text-xl font-bold text-gray-800 mb-2">🤖 AI助手配置</h2>
        <p class="text-gray-600 mb-6">
          配置你自己的 API Key 来启用 AI 助手功能（支持硅基流动、DeepSeek等平台）
        </p>

        <!-- 当前状态 -->
        <div class="mb-6 p-4 rounded-lg" :class="hasApiKey ? 'bg-green-50' : 'bg-blue-50'">
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

        <!-- 输入框 -->
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2">
              DeepSeek API Key
            </label>
            <div class="flex space-x-3">
              <input
                v-model="apiKeyInput"
                :type="showKey ? 'text' : 'password'"
                class="input-field flex-1"
                placeholder="sk-xxxxxxxxxxxxxxxx"
              />
              <button
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                @click="showKey = !showKey"
              >
                {{ showKey ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- 保存按钮 -->
          <button
            class="btn-primary w-full"
            @click="saveApiKey"
          >
            保存配置
          </button>

          <!-- 清除按钮 -->
          <button
            v-if="hasApiKey"
            class="w-full py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            @click="clearApiKey"
          >
            清除已保存的 API Key
          </button>
        </div>

        <!-- 提示信息 -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-medium text-blue-700 mb-2">如何获取 API Key？</h3>
          <div class="text-sm text-blue-600 space-y-3">
            <div class="p-3 bg-blue-100 rounded">
              <p class="font-medium mb-1">硅基流动（推荐）</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>访问 <a href="https://siliconflow.cn/" target="_blank" class="underline">硅基流动官网</a></li>
                <li>注册/登录账号</li>
                <li>进入"API密钥"页面创建密钥</li>
                <li>复制生成的Key并粘贴到上方输入框</li>
              </ol>
              <p class="text-xs mt-2">💡 新用户有免费额度，支持DeepSeek等多种模型</p>
            </div>
            <div class="p-3 bg-gray-100 rounded">
              <p class="font-medium mb-1">DeepSeek 官方</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>访问 <a href="https://platform.deepseek.com/" target="_blank" class="underline">DeepSeek 开放平台</a></li>
                <li>注册/登录账号</li>
                <li>进入 "API Keys" 页面</li>
                <li>点击 "Create API Key" 创建新的 Key</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他设置 -->
      <div class="card p-6 md:p-8 mt-6 animate-slide-up" style="animation-delay: 100ms;">
        <h2 class="text-xl font-bold text-gray-800 mb-4">ℹ️ 关于</h2>
        <div class="text-gray-600 space-y-2">
          <p><strong>高考志愿填报助手</strong></p>
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
import { getApiKey, saveApiKey as saveKey, clearApiKey as clearKey, hasApiKey as hasKey } from '@/utils/apiKeyManager'

const router = useRouter()

const apiKeyInput = ref('')
const showKey = ref(false)
const currentKey = ref('')

const hasApiKey = computed(() => {
  return currentKey.value.length > 0 && currentKey.value.startsWith('sk-')
})

onMounted(() => {
  currentKey.value = getApiKey()
  apiKeyInput.value = currentKey.value
})

/**
 * 保存 API Key
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
  currentKey.value = key
  alert('API Key 保存成功！')
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
