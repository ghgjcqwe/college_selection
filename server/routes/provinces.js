const express = require('express')
const router = express.Router()
const { getProvinces } = require('../db/queries')

router.get('/', async (req, res) => {
  try {
    const provinces = await getProvinces()
    res.json(provinces)
  } catch (error) {
    res.status(500).json({ error: '获取省份列表失败' })
  }
})

module.exports = router
