const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const { createWorker } = require('tesseract.js')

const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Cache-Control': 'max-age=0'
}

async function fetchPage(url, options = {}) {
  const { headers = {}, timeout = 15000, retries = 3 } = options
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        headers: { ...defaultHeaders, ...headers },
        timeout,
        responseType: 'text'
      })
      
      if (response.status === 200) {
        return response.data
      }
      
      console.log(`页面状态码异常: ${response.status}`)
    } catch (error) {
      console.log(`请求失败 (尝试 ${i + 1}/${retries}): ${error.message}`)
      
      if (i < retries - 1) {
        await delay(2000 * (i + 1))
      }
    }
  }
  
  throw new Error(`页面请求失败，已重试 ${retries} 次: ${url}`)
}

async function downloadImage(url, savePath) {
  try {
    const response = await axios.get(url, {
      headers: defaultHeaders,
      responseType: 'stream',
      timeout: 30000
    })
    
    const writer = fs.createWriteStream(savePath)
    response.data.pipe(writer)
    
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  } catch (error) {
    console.error(`下载图片失败: ${error.message}`)
    throw error
  }
}

async function ocrImage(imagePath) {
  try {
    const worker = await createWorker('chi_sim')
    
    const { data: { text } } = await worker.recognize(imagePath)
    
    await worker.terminate()
    return text
  } catch (error) {
    console.error(`OCR识别失败: ${error.message}`)
    return ''
  }
}

function parseHtml(html) {
  return cheerio.load(html)
}

function extractLinksFromHtml(html, baseUrl) {
  const $ = parseHtml(html)
  const links = []
  
  $('a').each((index, element) => {
    const href = $(element).attr('href')
    const text = $(element).text().trim()
    
    if (href && href.length > 0 && text.length > 0) {
      let fullUrl = href
      if (!href.startsWith('http')) {
        if (href.startsWith('/')) {
          fullUrl = baseUrl.replace(/\/$/, '') + href
        } else {
          fullUrl = baseUrl.replace(/\/$/, '') + '/' + href
        }
      }
      
      fullUrl = fullUrl.replace(/https?:\/\/[^/]+\/https?:\/\//, 'https://')
      fullUrl = fullUrl.replace(/https?:\/\/[^/]+\/http?:\/\//, 'http://')
      
      links.push({
        href: fullUrl,
        text: text
      })
    }
  })
  
  return links
}

function extractImagesFromHtml(html, baseUrl) {
  const $ = parseHtml(html)
  const images = []
  
  $('img').each((index, element) => {
    const src = $(element).attr('src')
    const alt = $(element).attr('alt') || ''
    
    if (src && src.length > 0) {
      let fullUrl = src
      if (!src.startsWith('http')) {
        if (src.startsWith('/')) {
          fullUrl = baseUrl.replace(/\/$/, '') + src
        } else {
          fullUrl = baseUrl.replace(/\/$/, '') + '/' + src
        }
      }
      
      images.push({
        src: fullUrl,
        alt: alt
      })
    }
  })
  
  return images
}

function extractTablesFromHtml(html) {
  const $ = parseHtml(html)
  const tables = []
  
  $('table').each((index, tableElement) => {
    const rows = []
    
    $(tableElement).find('tr').each((rowIndex, rowElement) => {
      const cells = []
      $(rowElement).find('td, th').each((cellIndex, cellElement) => {
        cells.push($(cellElement).text().trim())
      })
      
      if (cells.length > 0) {
        rows.push(cells)
      }
    })
    
    if (rows.length > 0) {
      tables.push(rows)
    }
  })
  
  return tables
}

function tablesToJson(tables) {
  const results = []
  
  for (const table of tables) {
    if (table.length < 2) continue
    
    const headers = table[0]
    for (let i = 1; i < table.length; i++) {
      const row = {}
      for (let j = 0; j < headers.length && j < table[i].length; j++) {
        row[headers[j]] = table[i][j]
      }
      results.push(row)
    }
  }
  
  return results
}

function parseScoreText(text) {
  const lines = []
  const linesArray = text.split('\n')
  
  for (const line of linesArray) {
    const trimmed = line.trim()
    if (!trimmed) continue
    
    const scoreMatch = trimmed.match(/(\d{3})/)
    if (scoreMatch) {
      let category = 'unknown'
      const categoryKeywords = {
        '理科': 'science',
        '文科': 'arts',
        '物理类': 'physics',
        '历史类': 'history',
        '本科': 'undergraduate',
        '专科': 'junior',
        '一本': 'first',
        '二本': 'second',
        '体育类': 'sports',
        '艺术类': 'art',
        '美术类': 'art_fine',
        '音乐类': 'art_music',
        '特殊类型': 'special'
      }
      
      for (const [keyword, cat] of Object.entries(categoryKeywords)) {
        if (trimmed.includes(keyword)) {
          category = cat
          break
        }
      }
      
      lines.push({
        text: trimmed,
        score: parseInt(scoreMatch[1]),
        category: category
      })
    }
  }
  
  return lines
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
  fetchPage,
  downloadImage,
  ocrImage,
  parseHtml,
  extractLinksFromHtml,
  extractImagesFromHtml,
  extractTablesFromHtml,
  tablesToJson,
  parseScoreText,
  delay
}