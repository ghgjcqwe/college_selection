const express = require('express')
const router = express.Router()
const majors = require('../data/majors')

// 获取所有专业
router.get('/', (req, res) => {
  res.json(majors)
})

// 根据 ID 获取专业详情
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const major = majors.find((m) => m.id === id)
  if (!major) {
    return res.status(404).json({ error: '专业未找到' })
  }
  res.json(major)
})

module.exports = router
