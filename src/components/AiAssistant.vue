<template>
  <div class="ai-assistant-container">
    <button
      class="ai-toggle-btn"
      :class="{ 'is-expanded': isExpanded }"
      @click="toggleChat"
    >
      <div class="ai-icon">
        <span>{{ isExpanded ? '✕' : '🤖' }}</span>
      </div>
      <span v-if="!isExpanded && hasUnread" class="ai-badge">!</span>
    </button>

    <transition name="slide">
      <div v-if="isExpanded" class="ai-chat-panel">
        <div class="ai-chat-header">
          <div class="ai-header-content">
            <div class="ai-avatar">🤖</div>
            <div class="ai-info">
              <h3 class="ai-title">AI志愿助手</h3>
              <p class="ai-status">{{ isUsingBuiltin ? '内置模式' : 'AI模式' }}</p>
            </div>
          </div>
          <button class="ai-minimize-btn" @click="toggleChat">
            <span>−</span>
          </button>
        </div>

        <div ref="chatContainer" class="ai-chat-messages">
          <div
            v-if="messages.length === 0"
            class="ai-welcome-screen"
          >
            <div class="welcome-icon">🤖</div>
            <h3 class="welcome-title">你好！我是AI志愿助手</h3>
            <p class="welcome-desc">我可以帮你解答高考志愿填报相关的问题</p>
            <div class="welcome-suggestions">
              <button
                v-for="suggestion in suggestions"
                :key="suggestion"
                class="suggestion-btn"
                @click="sendMessage(suggestion)"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>

          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="[
              'ai-message',
              msg.role === 'user' ? 'ai-user-message' : 'ai-assistant-message'
            ]"
          >
            <div v-if="msg.role === 'assistant'" class="ai-message-content">
              <div class="ai-message-avatar">🤖</div>
              <div class="ai-message-bubble">
                <div v-html="formatMessage(msg.content)"></div>
              </div>
            </div>
            <div v-else class="ai-message-content">
              <div class="ai-message-bubble ai-user-bubble">
                <p>{{ msg.content }}</p>
              </div>
              <div class="ai-message-avatar">👤</div>
            </div>
          </div>

          <div v-if="isLoading" class="ai-message ai-assistant-message">
            <div class="ai-message-content">
              <div class="ai-message-avatar">🤖</div>
              <div class="ai-message-bubble">
                <div class="ai-loading">
                  <div class="ai-loading-dot"></div>
                  <div class="ai-loading-dot"></div>
                  <div class="ai-loading-dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="ai-chat-input">
          <input
            v-model="inputMessage"
            type="text"
            class="ai-input-field"
            placeholder="输入你的问题..."
            :disabled="isLoading"
            @keyup.enter="sendCurrentMessage"
          />
          <button
            class="ai-send-btn"
            :disabled="!inputMessage.trim() || isLoading"
            @click="sendCurrentMessage"
          >
            <span>{{ isLoading ? '发送中' : '发送' }}</span>
          </button>
        </div>

        <div class="ai-chat-footer">
          <p class="ai-footer-text">
            {{ isUsingBuiltin ? '💡 使用内置问答模式' : '🔑 使用配置的API' }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { getApiKey, getApiProvider, hasApiKey } from '@/utils/apiKeyManager'

const isExpanded = ref(false)
const messages = ref<Array<{ role: string; content: string }>>([])
const inputMessage = ref('')
const isLoading = ref(false)
const hasUnread = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

const isUsingBuiltin = computed(() => {
  return !hasApiKey()
})

const suggestions = [
  '你能帮我做什么？',
  '如何选择适合自己的专业？',
  '平行志愿怎么填报？',
  '分数不够本科线怎么办？',
  '如何冲稳保？',
]

const builtinResponses: Record<string, (query?: string) => string> = {
  introduction: () => `
我是AI志愿助手，专为高考考生设计的智能问答助手。我可以帮你：

**🎓 志愿填报指导**
- 平行志愿填报规则解读
- 冲稳保策略制定
- 志愿顺序安排建议

**🏫 学校与专业咨询**
- 热门专业介绍
- 学校特色分析
- 专业就业前景

**📊 分数分析**
- 分数线查询方法
- 省排名参考
- 录取概率评估

**💡 常见问题解答**
- 复读还是上专科？
- 中外合作办学值得吗？
- 转专业政策解读

你可以直接问我具体问题，我会尽力为你解答！
  `.trim(),

  help: () => `
**使用帮助**

**基础操作**
- 在输入框中输入你的问题，按回车或点击发送按钮
- 点击右侧图标可以收起/展开对话面板
- 支持发送任意与高考志愿相关的问题

**推荐问题类型**
- \`专业选择\`: "计算机专业怎么样？"
- \`学校对比\`: "武大与华科哪个更好？"
- \`分数咨询\`: "600分能上什么学校？"
- \`志愿填报\`: "平行志愿怎么填？"

**快捷功能**
- 点击下方建议问题可以快速提问
- 支持追问和多轮对话

**💡 提示**
如果我无法回答你的问题，建议你访问设置页面配置自己的API Key以获得更强大的AI能力。
  `.trim(),

  faq_choice: (query: string) => {
    if (query.includes('专业')) {
      return `
**如何选择适合自己的专业？**

1. **了解兴趣**：想一想你对什么领域感兴趣，比如科学、艺术、技术等
2. **分析特长**：数学好可以考虑理工科，语言好可以考虑文科
3. **职业规划**：了解不同专业的就业方向和前景
4. **参考测评**：可以尝试我们的专业选择测试功能

**热门专业推荐**
- 🖥️ 计算机类：就业前景好，薪资较高
- 🏥 医学类：稳定，社会需求大
- 🏢 经管类：适合喜欢商业的同学
- 🎨 艺术类：适合有艺术天赋的同学

**建议**：不要盲目跟风，选择真正适合自己的专业！
      `.trim()
    }
    return `
**专业选择建议**

选择专业需要综合考虑以下因素：

**兴趣爱好**
- 你对什么领域最感兴趣？
- 平时喜欢做什么类型的事情？

**学科优势**
- 哪科成绩最好？
- 数理化强还是文科强？

**职业规划**
- 未来想从事什么工作？
- 目标城市和生活方式？

**就业前景**
- 专业就业率如何？
- 行业发展趋势？

**💡 小贴士**：可以先选择大类，入学后再细分方向！
    `.trim()
  },

  faq_parallel: () => `
**平行志愿填报规则**

**基本概念**
平行志愿是指考生填报的多个志愿院校在同一录取批次中具有同等的投档机会。

**填报原则**
1. **分数优先**：按考生分数从高到低排序投档
2. **遵循志愿**：按考生填报的志愿顺序检索
3. **一次投档**：一旦投档成功，不再检索后续志愿

**填报技巧**
- 🚀 **冲刺档**：比自己分数稍高的学校（2-3所）
- ✅ **稳妥档**：与自己分数匹配的学校（3-4所）
- 🛡️ **保底档**：比自己分数低的学校（2-3所）

**注意事项**
- 一定要服从专业调剂，增加录取机会
- 了解学校的退档规则
- 注意志愿顺序，前面的志愿优先检索
    `.trim(),

  faq_low_score: () => `
**分数不够本科线怎么办？**

**方案一：征集志愿**
- 关注本科批次的征集志愿补录机会
- 部分学校可能降分录取

**方案二：专科院校**
- 选择优质专科院校的王牌专业
- 毕业后可以专升本

**方案三：复读**
- 如果不甘心，可以选择复读一年
- 需要有坚定的决心和良好的心态

**方案四：其他途径**
- 中外合作办学（学费较高）
- 职业技术学院（注重实践技能）

**建议**：不要灰心，专科也能出人才！关键在于选择好专业和学校。
    `.trim(),

  faq_strategy: () => `
**冲稳保策略详解**

**🚀 冲刺档（约占30%）**
- 选择比自己分数高5-10分的学校
- 录取概率约20%-40%
- 数量建议：2-3所

**✅ 稳妥档（约占50%）**
- 选择与自己分数相当的学校
- 录取概率约60%-80%
- 数量建议：3-4所

**🛡️ 保底档（约占20%）**
- 选择比自己分数低10-20分的学校
- 录取概率约90%以上
- 数量建议：2-3所

**💡 关键技巧**
1. 拉开梯度：每档之间要有合理分数差距
2. 专业调剂：勾选服从专业调剂
3. 地域因素：考虑城市发展和生活成本
4. 院校类型：综合类、理工类、师范类等

**示例比例**：8个志愿 → 2冲 + 4稳 + 2保
    `.trim(),

  fallback: (query: string) => {
    const keywords = ['学校', '大学', '分数线', '录取', '志愿', '专业', '高考', '分数']
    const hasKeyword = keywords.some(kw => query.includes(kw))
    
    if (hasKeyword) {
      return `
关于"${query}"的问题，我可以为你提供一些基本信息：

**💡 相关建议**

如果你想了解具体学校的信息，可以使用"分数找学校"功能；
如果想了解专业，可以使用"专业怎么选"功能；
如果想模拟填报，可以使用"志愿填报模拟"功能。

**🔍 你可以问我**：
- "计算机专业就业前景怎么样？"
- "平行志愿怎么填报？"
- "如何冲稳保？"

**✨ 提示**：配置API Key后，我可以回答更复杂的问题！
      `.trim()
    }
    
    return `
抱歉，我暂时无法回答这个问题。

**💡 我可以回答以下类型的问题**：

🎓 志愿填报相关
- 平行志愿填报规则
- 冲稳保策略
- 志愿顺序安排

🏫 学校与专业咨询
- 专业选择建议
- 学校特色介绍
- 就业前景分析

📊 分数与录取
- 分数线查询方法
- 录取概率评估
- 省排名参考

**🔑 增强功能**
配置API Key后，我可以回答更复杂的问题，包括具体学校对比、专业深度分析等。
    `.trim()
  }
}

function getBuiltinResponse(query: string): string {
  const q = query.toLowerCase().trim()
  
  if (q.includes('帮我做什么') || q.includes('功能') || q.includes('介绍')) {
    return builtinResponses.introduction()
  }
  
  if (q.includes('帮助') || q.includes('怎么用') || q.includes('使用')) {
    return builtinResponses.help()
  }
  
  if (q.includes('平行志愿') || q.includes('志愿填报')) {
    return builtinResponses.faq_parallel()
  }
  
  if (q.includes('不够') || q.includes('低') || q.includes('专科') || q.includes('本科线')) {
    return builtinResponses.faq_low_score()
  }
  
  if (q.includes('冲稳保') || q.includes('策略') || q.includes('技巧')) {
    return builtinResponses.faq_strategy()
  }
  
  if (q.includes('专业') || q.includes('选专业')) {
    return builtinResponses.faq_choice(query)
  }
  
  return builtinResponses.fallback(query)
}

async function sendMessage(text?: string) {
  const messageText = text || inputMessage.value.trim()
  if (!messageText || isLoading.value) return

  messages.value.push({
    role: 'user',
    content: messageText
  })

  if (!text) {
    inputMessage.value = ''
  }

  isLoading.value = true
  hasUnread.value = false

  await nextTick()
  scrollToBottom()

  try {
    if (isUsingBuiltin.value) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))
      
      const response = getBuiltinResponse(messageText)
      messages.value.push({
        role: 'assistant',
        content: response
      })
    } else {
      const userApiKey = getApiKey()
      
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: messageText,
            conversationId: `assistant_${Date.now()}`,
            apiKey: userApiKey || undefined,
            provider: getApiProvider(),
            userInfo: {
              timestamp: new Date().toISOString()
            }
          })
        })

        const data = await response.json()

        if (data.success) {
          messages.value.push({
            role: 'assistant',
            content: data.message
          })
        } else if (data.needConfig || response.status === 401 || response.status === 503) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const fallbackResponse = getBuiltinResponse(messageText)
          messages.value.push({
            role: 'assistant',
            content: fallbackResponse
          })
        } else {
          messages.value.push({
            role: 'assistant',
            content: `抱歉，${data.message || 'AI服务暂时不可用'}`
          })
        }
      } catch (apiError) {
        console.error('API调用失败，回退到内置模式:', apiError)
        await new Promise(resolve => setTimeout(resolve, 500))
        const fallbackResponse = getBuiltinResponse(messageText)
        messages.value.push({
          role: 'assistant',
          content: fallbackResponse
        })
      }
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    messages.value.push({
      role: 'assistant',
      content: '网络错误，请检查网络连接后重试'
    })
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

function sendCurrentMessage() {
  sendMessage()
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

function toggleChat() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    hasUnread.value = false
    nextTick(() => scrollToBottom())
  }
}

function formatMessage(text: string): string {
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="ai-code">$1</code>')
    .replace(/- (.*?)(<br>|$)/g, '<li>$1</li>')
    .replace(/(<li>.*?<\/li>)/gs, '<ul class="ai-list">$1</ul>')
    .replace(/🚀|✅|🛡️|💡|🎓|🏫|📊|🖥️|🏥|🏢|🎨/g, (match) => {
      const iconMap: Record<string, string> = {
        '🚀': '<span class="ai-icon-emoji">🚀</span>',
        '✅': '<span class="ai-icon-emoji">✅</span>',
        '🛡️': '<span class="ai-icon-emoji">🛡️</span>',
        '💡': '<span class="ai-icon-emoji">💡</span>',
        '🎓': '<span class="ai-icon-emoji">🎓</span>',
        '🏫': '<span class="ai-icon-emoji">🏫</span>',
        '📊': '<span class="ai-icon-emoji">📊</span>',
        '🖥️': '<span class="ai-icon-emoji">🖥️</span>',
        '🏥': '<span class="ai-icon-emoji">🏥</span>',
        '🏢': '<span class="ai-icon-emoji">🏢</span>',
        '🎨': '<span class="ai-icon-emoji">🎨</span>'
      }
      return iconMap[match] || match
    })
}
</script>

<style scoped>
.ai-assistant-container {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.ai-toggle-btn {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(142, 45, 226, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.ai-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(142, 45, 226, 0.5);
}

.ai-toggle-btn.is-expanded {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.ai-icon {
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-icon span {
  line-height: 1;
}

.ai-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
  border-radius: 50%;
  color: white;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.4);
  animation: aiBadgePulse 2s infinite;
}

@keyframes aiBadgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.ai-chat-panel {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 420px;
  max-height: 600px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: aiPanelSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes aiPanelSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.ai-chat-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ai-header-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ai-avatar {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 4px 12px rgba(142, 45, 226, 0.3);
}

.ai-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ai-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.ai-status {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.ai-minimize-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  color: #64748b;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.ai-minimize-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #1e293b;
}

.ai-chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  max-height: 400px;
  scrollbar-width: thin;
  scrollbar-color: rgba(102, 126, 234, 0.3) transparent;
}

.ai-chat-messages::-webkit-scrollbar {
  width: 6px;
}

.ai-chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.ai-chat-messages::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
}

.ai-welcome-screen {
  text-align: center;
  padding: 30px 20px;
}

.welcome-icon {
  font-size: 56px;
  margin-bottom: 16px;
  animation: aiFloat 3s ease-in-out infinite;
}

@keyframes aiFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.welcome-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 10px 0;
}

.welcome-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px 0;
}

.welcome-suggestions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-btn {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  background: rgba(102, 126, 234, 0.05);
  color: #475569;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-btn:hover {
  border-color: rgba(102, 126, 234, 0.4);
  background: rgba(102, 126, 234, 0.1);
  color: #334155;
  transform: translateX(4px);
}

.ai-message {
  margin-bottom: 16px;
}

.ai-message-content {
  display: flex;
  gap: 12px;
  max-width: 90%;
}

.ai-assistant-message .ai-message-content {
  align-items: flex-start;
}

.ai-user-message .ai-message-content {
  flex-direction: row-reverse;
  margin-left: auto;
}

.ai-message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.ai-assistant-message .ai-message-avatar {
  background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%);
}

.ai-user-message .ai-message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #00d4ff 100%);
}

.ai-message-bubble {
  padding: 14px 18px;
  border-radius: 20px;
  background: rgba(248, 250, 252, 1);
  border: 1px solid rgba(226, 232, 240, 1);
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.ai-user-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.ai-loading {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 0;
}

.ai-loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(142, 45, 226, 0.6);
  animation: aiLoadingBounce 1.4s infinite ease-in-out both;
}

.ai-loading-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.ai-loading-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes aiLoadingBounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.ai-chat-input {
  padding: 16px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  gap: 12px;
}

.ai-input-field {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid rgba(226, 232, 240, 1);
  border-radius: 14px;
  font-size: 14px;
  background: rgba(248, 250, 252, 1);
  outline: none;
  transition: all 0.2s;
}

.ai-input-field:focus {
  border-color: rgba(102, 126, 234, 0.4);
  background: white;
}

.ai-input-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-send-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 45, 226, 0.3);
}

.ai-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-chat-footer {
  padding: 12px 20px;
  background: rgba(248, 250, 252, 1);
  border-top: 1px solid rgba(0, 0, 0, 0.03);
}

.ai-footer-text {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  text-align: center;
}

.ai-code {
  background: rgba(0, 0, 0, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: monospace;
}

.ai-list {
  margin: 8px 0;
  padding-left: 24px;
}

.ai-icon-emoji {
  margin-right: 4px;
}

@media (max-width: 480px) {
  .ai-assistant-container {
    right: 16px;
    bottom: 16px;
  }

  .ai-toggle-btn {
    width: 56px;
    height: 56px;
  }

  .ai-icon {
    font-size: 24px;
  }

  .ai-chat-panel {
    width: calc(100vw - 48px);
    max-height: 500px;
  }
}
</style>