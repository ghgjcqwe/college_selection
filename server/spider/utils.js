const puppeteer = require('puppeteer')
const config = require('./config')

let browser = null

/**
 * 初始化浏览器实例
 */
async function initBrowser() {
  if (browser) {
    return browser
  }
  
  try {
    browser = await puppeteer.launch(config.puppeteer)
    console.log('浏览器初始化成功')
    return browser
  } catch (error) {
    console.error('浏览器初始化失败:', error)
    throw error
  }
}

/**
 * 关闭浏览器实例
 */
async function closeBrowser() {
  if (browser) {
    await browser.close()
    browser = null
    console.log('浏览器已关闭')
  }
}

/**
 * 创建新页面
 */
async function createPage() {
  const b = await initBrowser()
  const page = await b.newPage()
  
  await page.setViewport({ width: 1920, height: 1080 })
  await page.setUserAgent(config.puppeteer.args.find(arg => arg.startsWith('--user-agent=')).replace('--user-agent=', ''))
  await page.setExtraHTTPHeaders({
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0'
  })
  
  return page
}

/**
 * 延迟执行
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 带重试的页面访问
 */
async function navigateWithRetry(page, url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`正在访问: ${url} (尝试 ${i + 1}/${maxRetries})`)
      
      page.on('pageerror', (err) => {
        console.log(`页面错误: ${err.message}`)
      })
      
      page.on('console', (msg) => {
        console.log(`页面日志: ${msg.text()}`)
      })
      
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: config.request.timeout
      })
      
      await delay(3000)
      
      if (response) {
        const status = response.status()
        if (status === 200 || status === 301 || status === 302 || status === 304) {
          console.log(`页面访问成功: ${url} (状态码: ${status})`)
          return response
        }
      }
      
      console.log(`页面访问失败，状态码: ${response?.status()}`)
    } catch (error) {
      console.log(`页面访问异常: ${error.message}`)
    }
    
    if (i < maxRetries - 1) {
      console.log(`等待 ${config.request.retryDelay}ms 后重试...`)
      await delay(config.request.retryDelay)
    }
  }
  
  throw new Error(`页面访问失败，已重试 ${maxRetries} 次: ${url}`)
}

/**
 * 获取页面HTML内容
 */
async function getPageContent(page, selector = 'body') {
  try {
    await delay(2000)
    
    const content = await page.evaluate((sel) => {
      const el = document.querySelector(sel)
      return el ? el.innerHTML : ''
    }, selector)
    
    return content
  } catch (error) {
    console.error('获取页面内容失败:', error)
    return null
  }
}

/**
 * 等待元素出现
 */
async function waitForElement(page, selector, timeout = 10000) {
  try {
    await page.waitForSelector(selector, { timeout })
    return await page.$(selector)
  } catch (error) {
    console.error(`等待元素失败: ${selector}`, error)
    return null
  }
}

/**
 * 提取页面中的表格数据
 */
async function extractTableData(page, tableSelector = 'table') {
  try {
    await delay(2000)
    
    const tableData = await page.evaluate((selector) => {
      const tables = document.querySelectorAll(selector)
      const allData = []
      
      for (const table of tables) {
        const rows = table.querySelectorAll('tr')
        const data = []
        
        let headers = []
        const firstRow = rows[0]
        if (firstRow) {
          headers = Array.from(firstRow.querySelectorAll('th, td')).map(cell => cell.textContent.trim())
        }
        
        for (let i = 1; i < rows.length; i++) {
          const rowData = {}
          const cells = rows[i].querySelectorAll('td')
          
          cells.forEach((cell, index) => {
            const header = headers[index] || `column_${index}`
            rowData[header] = cell.textContent.trim()
          })
          
          if (Object.keys(rowData).length > 0) {
            data.push(rowData)
          }
        }
        
        if (data.length > 0) {
          allData.push(...data)
        }
      }
      
      return allData
    }, tableSelector)
    
    return tableData
  } catch (error) {
    console.error('提取表格数据失败:', error)
    return []
  }
}

/**
 * 提取页面中的链接
 */
async function extractLinks(page, selector = 'a') {
  try {
    await delay(1000)
    
    const links = await page.evaluate((sel) => {
      const anchors = document.querySelectorAll(sel)
      return Array.from(anchors).map(a => ({
        text: a.textContent.trim(),
        href: a.href,
        title: a.title || ''
      }))
    }, selector)
    
    return links
  } catch (error) {
    console.error('提取链接失败:', error)
    return []
  }
}

/**
 * 模拟人类滚动行为
 */
async function scrollPage(page, scrollHeight = 1000) {
  try {
    await page.evaluate(async (height) => {
      await new Promise(resolve => {
        let totalScroll = 0
        const interval = setInterval(() => {
          window.scrollBy(0, Math.random() * 100 + 50)
          totalScroll += 150
          if (totalScroll >= height) {
            clearInterval(interval)
            resolve()
          }
        }, 100)
      })
    }, scrollHeight)
    
    await delay(500)
  } catch (error) {
    console.error('滚动页面失败:', error)
  }
}

/**
 * 随机延迟（模拟人类行为）
 */
function randomDelay(min = 1000, max = 3000) {
  return delay(Math.random() * (max - min) + min)
}

/**
 * 日志输出
 */
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleString('zh-CN')
  switch (type) {
    case 'error':
      console.error(`[${timestamp}] ❌ ${message}`)
      break
    case 'success':
      console.log(`[${timestamp}] ✅ ${message}`)
      break
    case 'warning':
      console.log(`[${timestamp}] ⚠️ ${message}`)
      break
    default:
      console.log(`[${timestamp}] ℹ️ ${message}`)
  }
}

module.exports = {
  initBrowser,
  closeBrowser,
  createPage,
  delay,
  navigateWithRetry,
  getPageContent,
  waitForElement,
  extractTableData,
  extractLinks,
  scrollPage,
  randomDelay,
  log
}
