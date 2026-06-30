const express = require('express')
const router = express.Router()
const { getSchools, getSchoolById } = require('../db/queries')

function calculateProbability(scoreDifference) {
  if (scoreDifference <= -40) {
    return 95
  } else if (scoreDifference <= -20) {
    return 85
  } else if (scoreDifference <= -10) {
    return 70
  } else if (scoreDifference <= 0) {
    return 55
  } else if (scoreDifference <= 5) {
    return 35
  } else if (scoreDifference <= 10) {
    return 20
  } else if (scoreDifference <= 15) {
    return 10
  } else if (scoreDifference <= 20) {
    return 5
  } else {
    return 2
  }
}

function getProbabilityLevel(probability) {
  if (probability >= 80) return 'very-high'
  if (probability >= 50) return 'high'
  if (probability >= 20) return 'medium'
  return 'low'
}

router.get('/', async (req, res) => {
  try {
    const schools = await getSchools()
    res.json(schools)
  } catch (error) {
    res.status(500).json({ error: '获取学校列表失败' })
  }
})

router.get('/match', async (req, res) => {
  const { score, province } = req.query
  const userScore = parseInt(score)
  const provinceCode = province || 'hubei'

  if (isNaN(userScore)) {
    return res.status(400).json({ error: '请提供有效的分数' })
  }

  try {
    const schools = await getSchools()

    const sprint = []
    const safe = []
    const guarantee = []

    schools.forEach((school) => {
      const schoolScore =
        school.provinceScores && school.provinceScores[provinceCode]
          ? school.provinceScores[provinceCode]
          : school.minScore
      const diff = schoolScore - userScore

      const probability = calculateProbability(diff)
      const level = getProbabilityLevel(probability)

      if (diff >= 0 && diff <= 20) {
        sprint.push({
          school,
          tier: 'sprint',
          probability,
          probabilityLevel: level,
          scoreDifference: diff
        })
      } else if (diff < 0 && Math.abs(diff) <= 30) {
        safe.push({
          school,
          tier: 'safe',
          probability,
          probabilityLevel: level,
          scoreDifference: diff
        })
      } else if (diff < -30) {
        guarantee.push({
          school,
          tier: 'guarantee',
          probability,
          probabilityLevel: level,
          scoreDifference: diff
        })
      }
    })

    sprint.sort((a, b) => a.probability - b.probability)
    safe.sort((a, b) => b.probability - a.probability)
    guarantee.sort((a, b) => b.probability - a.probability)

    res.json({
      sprint: sprint.slice(0, 8),
      safe: safe.slice(0, 8),
      guarantee: guarantee.slice(0, 8),
    })
  } catch (error) {
    res.status(500).json({ error: '获取学校数据失败' })
  }
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  
  try {
    const school = await getSchoolById(id)
    if (!school) {
      res.status(404).json({ error: '学校未找到' })
    } else {
      res.json(school)
    }
  } catch (error) {
    res.status(500).json({ error: '获取学校详情失败' })
  }
})

module.exports = router
