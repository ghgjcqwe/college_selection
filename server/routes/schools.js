const express = require('express')
const router = express.Router()
const schools = require('../data/schools')

// 获取所有学校
router.get('/', (req, res) => {
  res.json(schools)
})

// 根据分数和省份匹配学校
router.get('/match', (req, res) => {
  const { score, province } = req.query
  const userScore = parseInt(score)
  const provinceCode = province || 'hubei'

  if (isNaN(userScore)) {
    return res.status(400).json({ error: '请提供有效的分数' })
  }

  const sprint = []
  const safe = []
  const guarantee = []

  schools.forEach((school) => {
    const schoolScore =
      school.provinceScores && school.provinceScores[provinceCode]
        ? school.provinceScores[provinceCode]
        : school.minScore
    const diff = schoolScore - userScore

    if (diff >= 0 && diff <= 20) {
      sprint.push(school)
    } else if (diff < 0 && Math.abs(diff) <= 30) {
      safe.push(school)
    } else if (diff < -30) {
      guarantee.push(school)
    }
  })

  sprint.sort((a, b) => {
    const sa = a.provinceScores?.[provinceCode] || a.minScore
    const sb = b.provinceScores?.[provinceCode] || b.minScore
    return sa - sb
  })
  safe.sort((a, b) => {
    const sa = a.provinceScores?.[provinceCode] || a.minScore
    const sb = b.provinceScores?.[provinceCode] || b.minScore
    return sb - sa
  })
  guarantee.sort((a, b) => {
    const sa = a.provinceScores?.[provinceCode] || a.minScore
    const sb = b.provinceScores?.[provinceCode] || b.minScore
    return sb - sa
  })

  res.json({
    sprint: sprint.slice(0, 8),
    safe: safe.slice(0, 8),
    guarantee: guarantee.slice(0, 8),
  })
})

// 根据 ID 获取学校详情
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const school = schools.find((s) => s.id === id)
  if (!school) {
    return res.status(404).json({ error: '学校未找到' })
  }
  res.json(school)
})

module.exports = router
