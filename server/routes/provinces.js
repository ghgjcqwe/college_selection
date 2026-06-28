const express = require('express')
const router = express.Router()
const provinces = require('../data/provinces')

// 获取所有省份
router.get('/', (req, res) => {
  res.json(provinces)
})

module.exports = router
