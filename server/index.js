const express = require('express')
const cors = require('cors')
require('dotenv').config()
const schoolsRouter = require('./routes/schools')
const majorsRouter = require('./routes/majors')
const provincesRouter = require('./routes/provinces')
const chatRouter = require('./routes/chat')

const app = express()
const PORT = 3000

// 中间件
app.use(cors()) // 允许前端跨域访问
app.use(express.json()) // 解析 JSON 请求体

// 路由
app.use('/api/schools', schoolsRouter)
app.use('/api/majors', majorsRouter)
app.use('/api/provinces', provincesRouter)
app.use('/api/chat', chatRouter)

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '高考志愿填报助手后端服务运行正常' })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(` 后端服务已启动: http://localhost:${PORT}`)
  console.log(`📋 健康检查: http://localhost:${PORT}/api/health`)
})
