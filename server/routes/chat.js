const express = require('express')
const axios = require('axios')
const router = express.Router()

// API 配置
const API_CONFIG = {
  agnes: {
    url: 'https://apihub.agnes-ai.com/v1/chat/completions',
    model: 'agnes-2.0-flash'
  },
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
  agnes: process.env.AGNES_API_KEY || 'sk-VjiDocBSiTY4Uet4PAvsKneZVMwF1nY3m6XQ3mnHgwfKwKnt',
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
 * 内置问答响应（API不可用时回退）
 */
function getBuiltinResponse(message) {
  const lowerMsg = message.toLowerCase()
  
  if (lowerMsg.includes('帮我做什么') || lowerMsg.includes('功能') || lowerMsg.includes('介绍') || lowerMsg.includes('你是谁')) {
    return `我是AI志愿助手，专为高考考生设计的智能问答助手。我可以帮你：\n\n🎓 **学校与专业咨询**\n- 专业选择建议\n- 学校特色介绍\n- 就业前景分析\n\n📊 **分数与录取**\n- 分数线查询方法\n- 录取概率评估\n- 省排名参考\n\n💡 **增强功能**\n配置API Key后，我可以回答更复杂的问题，包括具体学校对比、专业深度分析等。`
  }
  
  if (lowerMsg.includes('帮助') || lowerMsg.includes('怎么用') || lowerMsg.includes('使用')) {
    return `你可以直接问我关于高考志愿填报的问题，比如：\n\n📝 **基础问题**\n- 平行志愿怎么填报？\n- 如何选择适合自己的专业？\n- 分数不够本科线怎么办？\n\n🎯 **进阶问题**\n- 如何运用冲稳保策略？\n- 某所学校的特色专业有哪些？\n- 某个专业的就业前景如何？\n\n我会根据你的问题提供专业的建议！`
  }
  
  if (lowerMsg.includes('专业') || lowerMsg.includes('选专业')) {
    return `选择专业是高考志愿填报中至关重要的一环。建议从以下四个维度进行考量：\n\n1. **兴趣与热爱**：选择自己感兴趣的专业，能让你在大学期间保持高昂的学习热情\n2. **能力与特长**：结合自己的学科优势选择，比如数理强适合工科，记忆表达强适合文科\n3. **职业规划**：了解专业的就业方向和发展前景\n4. **学校实力**：同一专业在不同学校的水平差异很大\n\n你可以告诉我你的兴趣和优势学科，我来帮你分析！`
  }
  
  if (lowerMsg.includes('平行志愿') || lowerMsg.includes('志愿填报')) {
    return `平行志愿的核心原则是：**分数优先、遵循志愿、一次投档**\n\n🎯 填报技巧：\n1. **梯度设置**：按照"冲-稳-保"的顺序排列志愿\n2. **拉开差距**：相邻志愿之间保持适当的分数差距（建议10-20分）\n3. **服从调剂**：勾选"服从专业调剂"可以提高录取概率\n4. **保底院校**：一定要设置保底院校，确保有学可上\n\n💡 注意：一旦被某所学校录取，后续志愿将不再检索！`
  }
  
  if (lowerMsg.includes('不够') || lowerMsg.includes('低') || lowerMsg.includes('专科') || lowerMsg.includes('本科线')) {
    return `如果分数不够本科线，可以考虑以下方案：\n\n🎓 **征集志愿**：关注本科批次的征集志愿补录机会\n\n🏫 **优质专科**：选择就业率高、专业特色鲜明的专科院校\n\n🔄 **复读**：如果有信心提升分数，可以考虑复读一年\n\n💼 **职业教育**：选择职业技术学院，学一门实用技能\n\n建议结合自己的兴趣和职业规划做出最适合的选择！`
  }
  
  if (lowerMsg.includes('冲稳保') || lowerMsg.includes('策略') || lowerMsg.includes('技巧')) {
    return `冲稳保是志愿填报的核心策略：\n\n🚀 **冲刺院校（30%）**：往年录取分数线略高于你的分数，有一定风险但值得尝试\n\n✅ **稳妥院校（50%）**：往年录取分数线与你的分数相当，录取概率较高\n\n🛡️ **保底院校（20%）**：往年录取分数线低于你的分数，确保有学可上\n\n💡 比例可根据你的风险偏好调整，但一定要保证有足够的保底院校！`
  }
  
  return `你好！我是AI志愿助手。关于"${message}"这个问题，我可以为你提供以下建议：\n\n🎓 **学校选择**：考虑学校的综合实力、学科优势和地理位置\n\n📚 **专业匹配**：结合自己的兴趣、能力和职业规划选择专业\n\n📊 **录取概率**：参考往年分数线和省排名，评估录取可能性\n\n💡 **填报策略**：合理运用"冲稳保"策略，拉开志愿梯度\n\n如果你有更具体的问题，欢迎继续提问！`
}

/**
 * 发送消息给大模型
 */
router.post('/', async (req, res) => {
  const { message, conversationId = 'default', apiKey, provider = 'agnes', userInfo = {} } = req.body

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
    const providerNames = {
      agnes: 'Agnes',
      deepseek: 'DeepSeek',
      siliconflow: '硅基流动'
    }
    return res.status(503).json({
      error: 'AI服务未配置',
      message: `请在设置页面配置 ${providerNames[provider] || provider} API Key`,
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
    console.error('完整错误:', JSON.stringify(error.response?.data || error, null, 2))
    const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || error.message || '未知错误'
    
    const builtinResponse = getBuiltinResponse(message)
    
    if (errorMessage.includes('Authentication') || errorMessage.includes('api key') || errorMessage.includes('invalid') || errorMessage.includes('Unauthorized') || errorMessage.includes('过期')) {
      return res.json({
        success: true,
        message: builtinResponse,
        conversationId: conversationId,
        fallback: true
      })
    }
    
    res.json({
      success: true,
      message: builtinResponse,
      conversationId: conversationId,
      fallback: true
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
