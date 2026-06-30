const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = path.join(__dirname, '../data/college.db')

let db = null

function getDb() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }
    
    db = new sqlite3.Database(DB_PATH, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(db)
      }
    })
  })
}

function queryAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.all(sql, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows)
        }
      })
    }).catch(reject)
  })
}

function queryOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDb().then(db => {
      db.get(sql, params, (error, row) => {
        if (error) {
          reject(error)
        } else {
          resolve(row)
        }
      })
    }).catch(reject)
  })
}

async function getProvinces() {
  const rows = await queryAll(`SELECT * FROM provinces`)
  return rows.map(row => ({
    code: row.code,
    name: row.name,
    scoreFactor: row.score_factor,
    maxScore: row.max_score,
    gaokaoMode: row.gaokao_mode,
    gaokaoModeDesc: row.gaokao_mode_desc
  }))
}

async function getSchools() {
  const rows = await queryAll(`SELECT * FROM schools`)
  
  const schools = await Promise.all(rows.map(async row => {
    const provinceScores = {}
    const psRows = await queryAll(`SELECT province_code, score FROM province_scores WHERE school_id = ?`, [row.id])
    psRows.forEach(r => { provinceScores[r.province_code] = r.score })
    
    const majorScores = await queryAll(`SELECT major_name, min_score FROM major_scores WHERE school_id = ?`, [row.id])
    
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      city: row.city,
      tags: JSON.parse(row.tags),
      minScore: row.min_score,
      description: row.description,
      majors: JSON.parse(row.majors),
      provinceScores,
      majorScores: majorScores.map(r => ({ name: r.major_name, minScore: r.min_score }))
    }
  }))
  
  return schools
}

async function getSchoolById(id) {
  const row = await queryOne(`SELECT * FROM schools WHERE id = ?`, [id])
  
  if (!row) {
    return null
  }
  
  const provinceScores = {}
  const psRows = await queryAll(`SELECT province_code, score FROM province_scores WHERE school_id = ?`, [id])
  psRows.forEach(r => { provinceScores[r.province_code] = r.score })
  
  const majorScores = await queryAll(`SELECT major_name, min_score FROM major_scores WHERE school_id = ?`, [id])
  
  const historicalRows = await queryAll(`SELECT * FROM historical_scores WHERE school_id = ? ORDER BY year DESC`, [id])
  
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    city: row.city,
    tags: JSON.parse(row.tags),
    minScore: row.min_score,
    description: row.description,
    majors: JSON.parse(row.majors),
    provinceScores,
    majorScores: majorScores.map(r => ({ name: r.major_name, minScore: r.min_score })),
    historicalScores: historicalRows.map(r => ({
      year: r.year,
      minScore: r.min_score,
      maxScore: r.max_score,
      avgScore: r.avg_score,
      rank: r.rank,
      enrollment: r.enrollment
    }))
  }
}

async function getMajors() {
  const rows = await queryAll(`SELECT * FROM majors`)
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    category: row.category,
    courses: JSON.parse(row.courses),
    careers: JSON.parse(row.careers),
    fitPerson: JSON.parse(row.fit_person),
    tags: JSON.parse(row.tags)
  }))
}

async function getControlLines(province = 'hubei') {
  const rows = await queryAll(`SELECT * FROM crawl_control_lines WHERE source = ? ORDER BY year DESC, score DESC`, [province])
  return rows.map(row => ({
    id: row.id,
    year: row.year,
    category: row.category,
    categoryName: row.category_name,
    score: row.score,
    source: row.source,
    crawledAt: row.crawled_at
  }))
}

async function getControlLineByYear(year, province = 'hubei') {
  const rows = await queryAll(`SELECT * FROM crawl_control_lines WHERE source = ? AND year = ? ORDER BY score DESC`, [province, year])
  return rows.map(row => ({
    id: row.id,
    year: row.year,
    category: row.category,
    categoryName: row.category_name,
    score: row.score,
    source: row.source,
    crawledAt: row.crawled_at
  }))
}

module.exports = {
  getProvinces,
  getSchools,
  getSchoolById,
  getMajors,
  getControlLines,
  getControlLineByYear
}
