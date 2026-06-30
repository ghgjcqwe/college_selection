const sqlite3 = require('sqlite3').verbose()

const DB_PATH = 'D:\\wokespace\\trae\\college_preference\\server\\data\\college.db'
const db = new sqlite3.Database(DB_PATH)

console.log('=== crawl_school_scores 数据 ===')
db.all('SELECT * FROM crawl_school_scores LIMIT 5', (err, rows) => {
  if (err) {
    console.error('查询失败:', err)
    db.close()
    return
  }
  
  rows.forEach(row => {
    console.log(JSON.stringify(row, null, 2))
  })
  
  console.log('\n=== crawl_control_lines 数据 ===')
  db.all('SELECT * FROM crawl_control_lines', (err, rows) => {
    if (err) {
      console.error('查询失败:', err)
      db.close()
      return
    }
    
    rows.forEach(row => {
      console.log(JSON.stringify(row, null, 2))
    })
    
    db.close()
  })
})