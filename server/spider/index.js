const HubeiSpider = require('./hubei')
const { log } = require('./utils')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = path.join(__dirname, '../data/college.db')

const spiderMap = {
  hubei: HubeiSpider
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'help'
  const target = args[1] || 'hubei'

  log(`爬虫启动，命令: ${command}, 目标: ${target}`, 'info')

  switch (command) {
    case 'crawl':
      await crawlData(target)
      break
    case 'test':
      await testSpider(target)
      break
    case 'save':
      await saveData(target)
      break
    case 'html':
      await getHtml(target, args[2])
      break
    case 'list':
      listSpiders()
      break
    case 'help':
    default:
      showHelp()
      break
  }

  log('爬虫任务结束', 'info')
}

function getSpider(target) {
  const SpiderClass = spiderMap[target]
  if (!SpiderClass) {
    log(`不支持的目标: ${target}`, 'error')
    return null
  }
  return new SpiderClass()
}

async function crawlData(target) {
  try {
    log(`开始爬取 ${target} 数据`, 'info')
    
    const spider = getSpider(target)
    if (!spider) return

    log('正在获取录取控制分数线...', 'info')
    const controlLines = await spider.getControlLines()
    log(`获取到 ${controlLines.length} 条控制分数线`, 'success')
    console.log(JSON.stringify(controlLines, null, 2))

    log('正在获取院校投档线...', 'info')
    const schoolScores = await spider.getSchoolAdmissionScores()
    log(`获取到 ${schoolScores.length} 条院校投档线`, 'success')
    console.log(JSON.stringify(schoolScores, null, 2))

  } catch (error) {
    log(`爬取数据失败: ${error.message}`, 'error')
    throw error
  }
}

async function testSpider(target) {
  try {
    log(`测试 ${target} 爬虫`, 'info')
    
    const spider = getSpider(target)
    if (!spider) return

    log('测试1: 获取首页链接', 'info')
    const links = await spider.getHomePageLinks()
    log(`找到 ${links.length} 个相关链接`, 'success')
    
    if (links.length > 0) {
      console.log('前5个链接:')
      links.slice(0, 5).forEach((link, index) => {
        console.log(`${index + 1}. ${link.text}`)
        console.log(`   ${link.href}`)
      })
    }

    log('测试2: 获取分数线页面URL', 'info')
    const scoreUrls = await spider.getAllScorePageUrls()
    log(`找到 ${scoreUrls.length} 个分数线页面`, 'success')
    
    if (scoreUrls.length > 0) {
      scoreUrls.forEach(url => {
        console.log(`${url.year}年: ${url.title}`)
        console.log(`   ${url.url}`)
      })
    }

  } catch (error) {
    log(`测试失败: ${error.message}`, 'error')
    throw error
  }
}

async function saveData(target) {
  try {
    log(`保存 ${target} 数据到数据库`, 'info')
    
    const spider = getSpider(target)
    if (!spider) return

    const controlLines = await spider.getControlLines()
    const schoolScores = await spider.getSchoolAdmissionScores()

    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        log(`数据库连接失败: ${err.message}`, 'error')
        return
      }
      log('数据库连接成功', 'success')

      db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS crawl_control_lines (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          year INTEGER,
          category TEXT,
          category_name TEXT,
          score INTEGER,
          source TEXT,
          crawled_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`)

        db.run(`CREATE TABLE IF NOT EXISTS crawl_school_scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          school_name TEXT,
          score INTEGER,
          source TEXT,
          crawled_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`)

        controlLines.forEach(line => {
          db.run(`INSERT INTO crawl_control_lines (year, category, category_name, score, source) VALUES (?, ?, ?, ?, ?)`,
            [line.year, line.category, line.categoryName, line.score, line.source])
        })

        schoolScores.forEach(score => {
          db.run(`INSERT INTO crawl_school_scores (school_name, score, source) VALUES (?, ?, ?)`,
            [score.schoolName, score.score, score.source])
        })

        log(`已保存 ${controlLines.length} 条控制分数线`, 'success')
        log(`已保存 ${schoolScores.length} 条院校投档线`, 'success')
      })

      db.close((err) => {
        if (err) {
          log(`数据库关闭失败: ${err.message}`, 'error')
        } else {
          log('数据库已关闭', 'info')
        }
      })
    })

  } catch (error) {
    log(`保存数据失败: ${error.message}`, 'error')
    throw error
  }
}

async function getHtml(target, url) {
  try {
    log(`获取页面HTML: ${url}`, 'info')
    
    const spider = getSpider(target)
    if (!spider) return

    const html = await spider.getPageHtml(url)
    if (html) {
      console.log(html)
    }

  } catch (error) {
    log(`获取HTML失败: ${error.message}`, 'error')
    throw error
  }
}

function listSpiders() {
  console.log('可用爬虫列表:')
  for (const [code, SpiderClass] of Object.entries(spiderMap)) {
    const spider = new SpiderClass()
    console.log(`  ${code}: ${spider.name}`)
  }
}

function showHelp() {
  console.log('爬虫命令使用说明:')
  console.log('')
  console.log('node spider/index.js <command> [target] [url]')
  console.log('')
  console.log('命令:')
  console.log('  crawl    - 爬取数据')
  console.log('  test     - 测试爬虫')
  console.log('  save     - 爬取并保存数据到数据库')
  console.log('  html     - 获取页面HTML内容')
  console.log('  list     - 列出可用爬虫')
  console.log('  help     - 显示帮助')
  console.log('')
  console.log('目标:')
  console.log('  hubei    - 湖北省教育考试院')
  console.log('')
  console.log('示例:')
  console.log('  node spider/index.js crawl hubei')
  console.log('  node spider/index.js test hubei')
  console.log('  node spider/index.js html hubei http://example.com')
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  crawlData,
  testSpider,
  saveData,
  getHtml,
  listSpiders
}