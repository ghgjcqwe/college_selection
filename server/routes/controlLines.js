const express = require('express')
const { getControlLines, getControlLineByYear } = require('../db/queries')

const router = express.Router()

router.get('/', async (req, res) => {
  const { province } = req.query
  
  try {
    const lines = await getControlLines(province || 'hubei')
    res.json(lines)
  } catch (error) {
    res.status(500).json({ error: '获取控制分数线失败' })
  }
})

router.get('/:year', async (req, res) => {
  const year = parseInt(req.params.year)
  const { province } = req.query
  
  try {
    const lines = await getControlLineByYear(year, province || 'hubei')
    res.json(lines)
  } catch (error) {
    res.status(500).json({ error: '获取控制分数线失败' })
  }
})

module.exports = router