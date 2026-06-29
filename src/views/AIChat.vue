<template>
  <div class="min-h-screen pb-12 flex flex-col relative overflow-hidden">
    <div class="absolute top-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

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
          <span class="text-gradient">🤖 AI志愿助手</span>
        </h1>
      </div>
    </header>

    <div v-if="showConfigHint" class="container py-8 flex-1 flex items-center justify-center relative z-10">
      <div class="card p-8 text-center max-w-md w-full relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-purple"></div>
        <div class="text-6xl mb-4 animate-bounce-soft">🔑</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">AI 服务暂不可用</h2>
        <p class="text-gray-600 mb-2">
          {{ configHintMessage }}
        </p>
        <p class="text-sm text-gray-500 mb-6">
          请检查后端服务是否已启动，或联系管理员配置 API Key
        </p>
        <button
          class="btn-gradient-purple px-8"
          @click="goToSettings"
        >
          前往设置
        </button>
      </div>
    </div>

    <div v-else-if="messages.length === 0" class="container py-8 animate-slide-up flex-1 flex items-center justify-center relative z-10">
      <div class="card p-8 text-center max-w-2xl w-full relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-purple"></div>
        <div class="text-6xl mb-4 animate-float">🤖</div>
        <h2 class="text-2xl font-bold mb-2">
          <span class="text-gradient">Hi，我是AI志愿助手</span>
        </h2>
        <p class="text-gray-600 mb-6 max-w-lg mx-auto">
          我可以帮你解答高考志愿填报相关的问题，比如：
        </p>
        <div class="grid md:grid-cols-2 gap-3 text-left">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            class="card p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer border-2 border-transparent hover:border-purple-200 group"
            @click="sendMessage(suggestion)"
          >
            <span class="text-gray-700 group-hover:text-purple-600 transition-colors">{{ suggestion }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="flex-1 container py-6 relative z-10">
      <div class="space-y-4 max-w-3xl mx-auto">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="[
            'animate-fade-in',
            msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'
          ]"
        >
          <div v-if="msg.role === 'assistant'" class="flex items-start max-w-[85%]">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mr-3 shadow-md">
              <span class="text-lg">🤖</span>
            </div>
            <div class="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 shadow-md border border-gray-100">
              <div class="prose prose-sm max-w-none" v-html="formatMessage(msg.content)"></div>
            </div>
          </div>

          <div v-else class="flex items-start max-w-[85%]">
            <div class="bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-2xl rounded-tr-sm p-4 shadow-md">
              <p>{{ msg.content }}</p>
            </div>
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center ml-3 shadow-md">
              <span class="text-lg">👤</span>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="flex justify-start animate-fade-in">
          <div class="flex items-start max-w-[85%]">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mr-3 shadow-md">
              <span class="text-lg">🤖</span>
            </div>
            <div class="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 shadow-md border border-gray-100">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
                <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
                <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!showConfigHint" class="bg-white/80 backdrop-blur-md border-t border-gray-200/50 sticky bottom-0 z-20">
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
            class="btn-gradient-purple px-6"
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
import { getApiProvider } from '@/utils/apiKeyManager'

const router = useRouter()

// 状态变量
const messages = ref<Array<{ role: string; content: string }>>([])
const inputMessage = ref('')
const isLoading = ref(false)
const conversationId = ref(`user_${Date.now()}`)
const showConfigHint = ref(false)
const configHintMessage = ref('后端 AI 服务暂未配置 API Key，请联系管理员在 server/.env 中配置')

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
 * 使用后端配置的 API Key，前端不接触密钥，更安全
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
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: messageText,
        conversationId: conversationId.value,
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