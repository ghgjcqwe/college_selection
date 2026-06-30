const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = path.join(__dirname, '../data/college.db')

let db = null

function getDb(callback) {
  if (db) {
    callback(null, db)
    return
  }
  
  db = new sqlite3.Database(DB_PATH, (error) => {
    if (error) {
      console.error('❌ 数据库连接失败:', error)
      callback(error)
    } else {
      console.log('✅ 数据库连接成功')
      callback(null, db)
    }
  })
}

function createTables(callback) {
  getDb((error, db) => {
    if (error) {
      callback(error)
      return
    }
    
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS provinces (
        code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        score_factor REAL NOT NULL,
        max_score INTEGER NOT NULL,
        gaokao_mode TEXT NOT NULL,
        gaokao_mode_desc TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`)
      
      db.run(`CREATE TABLE IF NOT EXISTS schools (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        city TEXT NOT NULL,
        tags TEXT NOT NULL,
        min_score INTEGER NOT NULL,
        description TEXT NOT NULL,
        majors TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`)
      
      db.run(`CREATE TABLE IF NOT EXISTS province_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        school_id INTEGER NOT NULL,
        province_code TEXT NOT NULL,
        score INTEGER NOT NULL,
        FOREIGN KEY (school_id) REFERENCES schools(id),
        FOREIGN KEY (province_code) REFERENCES provinces(code),
        UNIQUE(school_id, province_code)
      )`)
      
      db.run(`CREATE TABLE IF NOT EXISTS major_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        school_id INTEGER NOT NULL,
        major_name TEXT NOT NULL,
        min_score INTEGER NOT NULL,
        FOREIGN KEY (school_id) REFERENCES schools(id),
        UNIQUE(school_id, major_name)
      )`)
      
      db.run(`CREATE TABLE IF NOT EXISTS historical_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        school_id INTEGER NOT NULL,
        province_code TEXT NOT NULL,
        year INTEGER NOT NULL,
        min_score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        avg_score INTEGER NOT NULL,
        rank INTEGER,
        enrollment INTEGER,
        FOREIGN KEY (school_id) REFERENCES schools(id),
        FOREIGN KEY (province_code) REFERENCES provinces(code),
        UNIQUE(school_id, province_code, year)
      )`)
      
      db.run(`CREATE TABLE IF NOT EXISTS majors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        courses TEXT NOT NULL,
        careers TEXT NOT NULL,
        fit_person TEXT NOT NULL,
        tags TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`)
      
      console.log('✅ 数据库表结构创建完成')
      callback(null)
    })
  })
}

function closeDb(callback) {
  if (db) {
    db.close((error) => {
      if (error) {
        console.error('❌ 关闭数据库失败:', error)
      } else {
        console.log('✅ 数据库连接已关闭')
      }
      db = null
      if (callback) callback(error)
    })
  } else {
    if (callback) callback(null)
  }
}

module.exports = {
  getDb,
  createTables,
  closeDb,
  DB_PATH
}
