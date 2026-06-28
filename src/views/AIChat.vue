<template>
  <div class="min-h-screen pb-12 flex flex-col">
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
        <h1 class="text-xl font-bold text-center flex-1 mr-12">🤖 AI志愿助手</h1>
      </div>
    </header>

    <!-- 需要配置API Key提示 -->
    <div v-if="showConfigHint" class="container py-8">
      <div class="card p-8 text-center">
        <div class="text-6xl mb-4">🔑</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">需要配置 API Key</h2>
        <p class="text-gray-600 mb-2">
          {{ configHintMessage }}
        </p>
        <p class="text-sm text-gray-500 mb-6">
          支持硅基流动、DeepSeek 等平台的 API Key
        </p>
        <button
          class="btn-primary px-8"
          @click="goToSettings"
        >
          前往配置
        </button>
      </div>
    </div>

    <!-- 欢迎信息 -->
    <div v-else-if="messages.length === 0" class="container py-8 animate-slide-up">
      <div class="card p-8 text-center">
        <div class="text-6xl mb-4">🤖</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Hi，我是AI志愿助手</h2>
        <p class="text-gray-600 mb-6 max-w-lg mx-auto">
          我可以帮你解答高考志愿填报相关的问题，比如：
        </p>
        <div class="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            class="card p-4 text-left hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-200"
            @click="sendMessage(suggestion)"
          >
            <span class="text-gray-700">{{ suggestion }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 消息列表 -->
    <div v-else class="flex-1 container py-6">
      <div class="space-y-4 max-w-3xl mx-auto">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="[
            'animate-fade-in',
            msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'
          ]"
        >
          <!-- AI消息 -->
          <div v-if="msg.role === 'assistant'" class="flex items-start max-w-[80%]">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
              <span class="text-xl">🤖</span>
            </div>
            <div class="bg-gray-100 rounded-2xl rounded-tl-sm p-4">
              <div class="prose prose-sm max-w-none" v-html="formatMessage(msg.content)"></div>
            </div>
          </div>

          <!-- 用户消息 -->
          <div v-else class="flex items-start max-w-[80%]">
            <div class="bg-primary-500 text-white rounded-2xl rounded-tr-sm p-4">
              <p>{{ msg.content }}</p>
            </div>
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center ml-3">
              <span class="text-xl">👤</span>
            </div>
          </div>
        </div>

        <!-- 加载中 -->
        <div v-if="isLoading" class="flex justify-start animate-fade-in">
          <div class="flex items-start max-w-[80%]">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
              <span class="text-xl">🤖</span>
            </div>
            <div class="bg-gray-100 rounded-2xl rounded-tl-sm p-4">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入框 -->
    <div v-if="!showConfigHint" class="bg-white border-t border-gray-200 sticky bottom-0">
      <div class="container py-4">
        <div class="flex space-x-3 max-w-3xl mx-auto">
          <input
            v-model="inputMessage"
            type="text"
            class="input-field flex-1"
            placeholder="输入你的问题..."
            :disabled="isLoading"
            @keyup.enter="sendCurrentMessage"
          />
          <button
            class="btn-primary px-6"
            :disabled="!inputMessage.trim() || isLoading"
            :class="{ 'opacity-50 cursor-not-allowed': !inputMessage.trim() || isLoading }"
            @click="sendCurrentMessage"
          >
            {{ isLoading ? '发送中' : '发送' }}
          </button>
        </div>
        <p class="text-xs text-gray-400 text-center mt-2">
          AI助手仅供参考，最终志愿填报请以官方数据为准
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getApiKey, getApiProvider } from '@/utils/apiKeyManager'

const router = useRouter()

// 状态变量
const messages = ref<Array<{ role: string; content: string }>>([])
const inputMessage = ref('')
const isLoading = ref(false)
const conversationId = ref(`user_${Date.now()}`)
const showConfigHint = ref(false)
const configHintMessage = ref('默认API Key已失效，请配置你自己的API Key')

// 快捷问题建议
const suggestions = [
  '计算机专业就业前景怎么样？',
  '如何选择适合自己的专业？',
  '平行志愿怎么填报？',
  '分数不够本科线怎么办？',
  '理科生可以报哪些专业？',
  '复读还是上专科？',
  '如何冲稳保？',
  '中外合作办学值得上吗？',
]

/**
 * 发送消息
 * 优先使用用户配置的API Key，如果没有则使用后端默认的
 */
async function sendMessage(text?: string) {
  const messageText = text || inputMessage.value.trim()
  if (!messageText || isLoading.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: messageText
  })

  // 清空输入框
  if (!text) {
    inputMessage.value = ''
  }

  // 显示加载状态
  isLoading.value = true

  try {
    // 获取用户配置的API Key（如果有）
    const userApiKey = getApiKey()

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: messageText,
        conversationId: conversationId.value,
        apiKey: userApiKey || undefined,
        provider: getApiProvider(),
        userInfo: {
          timestamp: new Date().toISOString()
        }
      })
    })

    const data = await response.json()

    // 如果需要配置API Key
    if (data.needConfig || response.status === 401 || response.status === 503) {
      showConfigHint.value = true
      configHintMessage.value = data.message || '请配置你自己的API Key'
      // 移除刚才添加的用户消息
      messages.value.pop()
      return
    }

    if (data.success) {
      messages.value.push({
        role: 'assistant',
        content: data.message
      })
    } else {
      messages.value.push({
        role: 'assistant',
        content: `抱歉，${data.message || 'AI服务暂时不可用'}`
      })
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    messages.value.push({
      role: 'assistant',
      content: '网络错误，请检查网络连接后重试'
    })
  } finally {
    isLoading.value = false
  }
}

/**
 * 发送当前输入框的消息
 */
function sendCurrentMessage() {
  sendMessage()
}

/**
 * 格式化消息（简单的 Markdown 处理）
 */
function formatMessage(text: string): string {
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 rounded">$1</code>')
    .replace(/- (.*?)(<br>|$)/g, '<li>$1</li>')
    .replace(/(<li>.*?<\/li>)/gs, '<ul class="list-disc pl-5 my-2">$1</ul>')
}

/**
 * 返回上一页
 */
function goBack() {
  router.push('/')
}

/**
 * 跳转到设置页面
 */
function goToSettings() {
  router.push('/settings')
}
</script>