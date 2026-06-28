const express = require('express')
const axios = require('axios')
const router = express.Router()

// API 配置
const API_CONFIG = {
  deepseek: {
    url: 'https://api.deepseek.com/chat/completions',
    model: 'deepseek-chat'
  },
  siliconflow: {
    url: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'deepseek-ai/DeepSeek-V3'
  }
}

// 默认 API Key（请在此处配置你的默认 API Key）
const DEFAULT_API_KEY = {
  deepseek: process.env.DEEPSEEK_API_KEY || '',
  siliconflow: process.env.SILICONFLOW_API_KEY || ''
}

/**
 * 高考志愿填报助手的系统提示词
 */
const SYSTEM_PROMPT = `你是一位专业的高考志愿填报顾问助手。请根据用户的问题，结合以下信息给出建议：

1. 高校信息：全国各高校的基本情况、专业优势、就业前景等
2. 录取规则：各省份的高考录取规则、平行志愿填报技巧
3. 专业选择：根据考生兴趣、性格、能力测试结果推荐适合的专业
4. 分数分析：根据考生分数和位次，分析可报考的高校范围

请注意：
- 回答要专业、客观、易懂
- 如果涉及具体分数线，请说明这是参考往年数据，实际录取情况可能有变化
- 鼓励用户结合自身兴趣和职业规划做选择
- 不要编造具体的录取分数线数据

请用简洁、友好的语言回答。`

/**
 * 存储对话历史（简单实现，生产环境建议用数据库）
 */
const conversations = new Map()

/**
 * 发送消息给大模型
 */
router.post('/', async (req, res) => {
  const { message, conversationId = 'default', apiKey, provider = 'deepseek', userInfo = {} } = req.body

  if (!message) {
    return res.status(400).json({ error: '请提供消息内容' })
  }

  // 验证provider
  const config = API_CONFIG[provider]
  if (!config) {
    return res.status(400).json({ error: '不支持的API提供商' })
  }

  // 优先使用用户配置的 API Key，其次使用默认 API Key
  const effectiveApiKey = apiKey || DEFAULT_API_KEY[provider]

  // 如果没有配置 API Key，返回提示
  if (!effectiveApiKey) {
    return res.status(503).json({
      error: 'AI服务未配置',
      message: `请在设置页面配置 ${provider === 'deepseek' ? 'DeepSeek' : '硅基流动'} API Key`,
      hint: '访问 /settings 页面进行配置',
      needConfig: true
    })
  }

  try {
    // 获取或创建对话历史
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, [])
    }
    const history = conversations.get(conversationId)

    // 构建消息列表
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ]

    // 调用对应提供商的 API
    const response = await axios.post(
      config.url,
      {
        model: config.model,
        messages: messages,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${effectiveApiKey}`
        },
        timeout: 30000
      }
    )

    const assistantMessage = response.data.choices[0].message.content

    // 保存对话历史
    history.push({ role: 'user', content: message })
    history.push({ role: 'assistant', content: assistantMessage })

    // 限制历史长度（保留最近10轮）
    if (history.length > 20) {
      history.splice(0, history.length - 20)
    }

    res.json({
      success: true,
      message: assistantMessage,
      conversationId: conversationId
    })
  } catch (error) {
    console.error('AI对话错误:', error.message)
    const errorMessage = error.response?.data?.error?.message || error.message
    
    // 如果是认证错误，提示用户配置自己的 API Key
    if (errorMessage.includes('Authentication') || errorMessage.includes('api key') || errorMessage.includes('invalid')) {
      return res.status(401).json({
        error: 'API Key无效',
        message: '默认API Key已失效，请配置你自己的API Key',
        hint: '访问 /settings 页面配置',
        needConfig: true
      })
    }
    
    res.status(500).json({
      error: 'AI服务调用失败',
      message: errorMessage
    })
  }
})

/**
 * 获取对话历史
 */
router.get('/history/:conversationId', (req, res) => {
  const { conversationId } = req.params
  const history = conversations.get(conversationId) || []
  res.json({ history })
})

/**
 * 清除对话历史
 */
router.delete('/history/:conversationId', (req, res) => {
  const { conversationId } = req.params
  conversations.delete(conversationId)
  res.json({ success: true })
})

module.exports = router
