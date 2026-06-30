const express = require('express')
const router = express.Router()
const { getMajors } = require('../db/queries')

router.get('/', async (req, res) => {
  try {
    const majors = await getMajors()
    res.json(majors)
  } catch (error) {
    res.status(500).json({ error: '获取专业列表失败' })
  }
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  
  try {
    const majors = await getMajors()
    const major = majors.find((m) => m.id === id)
    if (!major) {
      return res.status(404).json({ error: '专业未找到' })
    }
    res.json(major)
  } catch (error) {
    res.status(500).json({ error: '获取专业列表失败' })
  }
})

module.exports = router
