const config = require('./config')
const BaseSpider = require('./base')
const { log } = require('./utils')

class HubeiSpider extends BaseSpider {
  constructor() {
    super('hubei', config.targets.hubei.baseUrl, '湖北省教育考试院')
    this.years = config.targets.hubei.years
    this.keywords = config.targets.hubei.keywords
  }

  extractYearFromTitle(title) {
    const yearMatch = title.match(/(\d{4})/)
    if (yearMatch) {
      return parseInt(yearMatch[1])
    }
    return new Date().getFullYear()
  }

  parseControlLineTable(table, year) {
    const lines = []
    const keys = Object.keys(table)

    for (const key of keys) {
      const value = table[key]
      if (!value || value.trim() === '') continue

      const parsed = this.parseScoreEntry(key, value, year)
      if (parsed) {
        lines.push(parsed)
      }
    }

    return lines
  }

  parseScoreEntry(key, value, year) {
    const categoryMap = {
      '理科': 'science',
      '文科': 'arts',
      '物理类': 'physics',
      '历史类': 'history',
      '本科': 'undergraduate',
      '专科': 'junior',
      '一本': 'first',
      '二本': 'second',
      '一本线': 'first',
      '二本线': 'second',
      '本科线': 'undergraduate',
      '专科线': 'junior',
      '特殊类型招生': 'special',
      '体育类': 'sports',
      '艺术类': 'art',
      '美术类': 'art_fine',
      '音乐类': 'art_music',
      '舞蹈类': 'art_dance',
      '编导类': 'art_director',
      '播音主持': 'art_broadcast'
    }

    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (key.includes(keyword) || value.includes(keyword)) {
        const scoreMatch = value.match(/(\d{3})/)
        if (scoreMatch) {
          return {
            year,
            category,
            categoryName: keyword,
            score: parseInt(scoreMatch[1]),
            source: this.provinceCode
          }
        }
      }
    }

    return null
  }

  parseSchoolAdmissionTable(table) {
    const schoolScores = []
    
    const schoolNameKey = table['院校名称'] ? '院校名称' : 
                          table['学校名称'] ? '学校名称' : null
    
    if (!schoolNameKey) {
      return schoolScores
    }

    let schoolName = ''
    let score = 0

    for (const [key, value] of Object.entries(table)) {
      if (key.includes('院校') || key.includes('学校')) {
        schoolName = value
      } else if (!isNaN(parseInt(value))) {
        const numValue = parseInt(value)
        if (numValue > 200 && numValue < 800) {
          score = numValue
        }
      }
    }

    if (schoolName && score > 0) {
      schoolScores.push({
        schoolName,
        score,
        source: this.provinceCode
      })
    }

    return schoolScores
  }
}

module.exports = HubeiSpider