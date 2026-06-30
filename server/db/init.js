const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

const DB_PATH = path.join(__dirname, '../data/college.db')

if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH)
  console.log('删除旧数据库文件')
}

const db = new sqlite3.Database(DB_PATH)

console.log('开始初始化数据库...')

db.serialize(() => {
  console.log('创建表结构...')
  
  db.run(`CREATE TABLE provinces (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    score_factor REAL NOT NULL,
    max_score INTEGER NOT NULL,
    gaokao_mode TEXT NOT NULL,
    gaokao_mode_desc TEXT NOT NULL
  )`)
  
  db.run(`CREATE TABLE schools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    city TEXT NOT NULL,
    tags TEXT NOT NULL,
    min_score INTEGER NOT NULL,
    description TEXT NOT NULL,
    majors TEXT NOT NULL
  )`)
  
  db.run(`CREATE TABLE province_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL,
    province_code TEXT NOT NULL,
    score INTEGER NOT NULL
  )`)
  
  db.run(`CREATE TABLE major_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL,
    major_name TEXT NOT NULL,
    min_score INTEGER NOT NULL
  )`)
  
  db.run(`CREATE TABLE historical_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL,
    province_code TEXT NOT NULL,
    year INTEGER NOT NULL,
    min_score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    avg_score INTEGER NOT NULL,
    rank INTEGER,
    enrollment INTEGER
  )`)
  
  db.run(`CREATE TABLE majors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    courses TEXT NOT NULL,
    careers TEXT NOT NULL,
    fit_person TEXT NOT NULL,
    tags TEXT NOT NULL
  )`)
  
  console.log('表结构创建完成')
})

console.log('导入省份数据...')
const provincesData = require('../data/provinces')
let pCount = 0
provincesData.forEach((p) => {
  db.run(`INSERT INTO provinces VALUES (?, ?, ?, ?, ?, ?)`, 
    [p.code, p.name, p.scoreFactor, p.maxScore, p.gaokaoMode, p.gaokaoModeDesc], () => {
      pCount++
      if (pCount === provincesData.length) {
        console.log(`导入 ${pCount} 个省份`)
        importSchools()
      }
    })
})

function importSchools() {
  console.log('导入学校数据...')
  const schoolsData = require('../data/schools')
  let sCount = 0
  
  function importNext(index) {
    if (index >= schoolsData.length) {
      console.log(`导入 ${sCount} 所学校`)
      importMajors()
      return
    }
    
    const school = schoolsData[index]
    db.run(`INSERT INTO schools (name, type, city, tags, min_score, description, majors) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [school.name, school.type, school.city, JSON.stringify(school.tags), school.minScore, school.description, JSON.stringify(school.majors)], function() {
        const schoolId = this.lastID
        
        let pending = 0
        let done = 0
        
        function checkDone() {
          done++
          if (done === pending) {
            sCount++
            importNext(index + 1)
          }
        }
        
        if (school.provinceScores) {
          const entries = Object.entries(school.provinceScores)
          pending += entries.length
          entries.forEach(([code, score]) => {
            db.run(`INSERT INTO province_scores VALUES (NULL, ?, ?, ?)`, [schoolId, code, score], checkDone)
          })
        }
        
        if (school.majorScores) {
          pending += school.majorScores.length
          school.majorScores.forEach(ms => {
            db.run(`INSERT INTO major_scores VALUES (NULL, ?, ?, ?)`, [schoolId, ms.name, ms.minScore], checkDone)
          })
        }
        
        const years = [2021, 2022, 2023, 2024]
        pending += years.length
        years.forEach(year => {
          const offset = Math.floor(Math.random() * 20) - 10
          const minScore = Math.max(450, Math.min(700, school.minScore + offset))
          const maxScore = minScore + Math.floor(Math.random() * 30) + 15
          db.run(`INSERT INTO historical_scores VALUES (NULL, ?, 'hubei', ?, ?, ?, ?, ?, ?)`,
            [schoolId, year, minScore, maxScore, Math.round((minScore+maxScore)/2), 
             Math.floor(Math.random()*20000)+5000, Math.floor(Math.random()*100)+50], checkDone)
        })
        
        if (pending === 0) {
          sCount++
          importNext(index + 1)
        }
      })
  }
  
  importNext(0)
}

function importMajors() {
  console.log('导入专业数据...')
  const majorsData = require('../data/majors')
  let mCount = 0
  majorsData.forEach((m) => {
    db.run(`INSERT INTO majors VALUES (NULL, ?, ?, ?, ?, ?, ?)`,
      [m.name, m.category, JSON.stringify(m.courses), JSON.stringify(m.careers), 
       JSON.stringify(m.fitPerson), JSON.stringify(m.tags)], () => {
        mCount++
        if (mCount === majorsData.length) {
          console.log(`导入 ${mCount} 个专业`)
          verifyAndClose()
        }
      })
  })
}

function verifyAndClose() {
  db.get('SELECT COUNT(*) as count FROM province_scores', (err, row) => {
    console.log('验证 province_scores:', row.count)
    db.get('SELECT COUNT(*) as count FROM major_scores', (err, row) => {
      console.log('验证 major_scores:', row.count)
      db.get('SELECT COUNT(*) as count FROM historical_scores', (err, row) => {
        console.log('验证 historical_scores:', row.count)
        db.close(() => {
          console.log('数据库初始化完成！')
        })
      })
    })
  })
}
