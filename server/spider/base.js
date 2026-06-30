const { 
  fetchPage, 
  downloadImage, 
  ocrImage,
  extractLinksFromHtml, 
  extractImagesFromHtml, 
  extractTablesFromHtml, 
  tablesToJson, 
  parseScoreText,
  delay 
} = require('./simple')
const { log } = require('./utils')
const fs = require('fs')
const path = require('path')

class BaseSpider {
  constructor(provinceCode, baseUrl, name) {
    this.provinceCode = provinceCode
    this.baseUrl = baseUrl
    this.name = name
    this.years = [2021, 2022, 2023, 2024]
    this.keywords = ['分数线', '录取', '高考']
    this.tempDir = path.join(__dirname, 'temp')
    
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true })
    }
  }

  async getHomePageLinks(filterKeywords = null) {
    const keywords = filterKeywords || this.keywords
    
    try {
      log(`正在访问首页: ${this.baseUrl}`, 'info')
      const html = await fetchPage(this.baseUrl)
      
      const links = extractLinksFromHtml(html, this.baseUrl)
      const relevantLinks = links.filter(link => 
        keywords.some(keyword => link.text.includes(keyword))
      )

      log(`找到 ${relevantLinks.length} 个相关链接`, 'info')
      return relevantLinks
    } catch (error) {
      log(`获取首页链接失败: ${error.message}`, 'error')
      return []
    }
  }

  async exploreSite() {
    const allLinks = []
    
    try {
      const html = await fetchPage(this.baseUrl)
      const links = extractLinksFromHtml(html, this.baseUrl)
      
      const sectionLinks = links.filter(link => 
        link.href.includes('/html/') && 
        !link.href.includes('.html') &&
        !link.href.includes('javascript') &&
        !link.href.includes('#')
      ).slice(0, 10)
      
      log(`找到 ${sectionLinks.length} 个栏目入口`, 'info')
      
      for (const section of sectionLinks) {
        log(`正在探索栏目: ${section.text}`, 'info')
        try {
          const sectionHtml = await fetchPage(section.href)
          
          if (sectionHtml.length > 2000) {
            const sectionLinksInner = extractLinksFromHtml(sectionHtml, this.baseUrl)
            const relevantLinks = sectionLinksInner.filter(link => 
              this.keywords.some(keyword => link.text.includes(keyword))
            )
            allLinks.push(...relevantLinks)
            log(`  找到 ${relevantLinks.length} 个相关链接`, 'info')
          }
          
          await delay(2000)
        } catch (error) {
          log(`  访问失败: ${error.message}`, 'warning')
        }
      }
      
      const datePatternLinks = links.filter(link => 
        link.href.match(/\/html\/\d{4}-\d{2}\//)
      ).slice(0, 5)
      
      log(`找到 ${datePatternLinks.length} 个日期目录链接`, 'info')
      for (const dateLink of datePatternLinks) {
        log(`正在探索日期目录: ${dateLink.href}`, 'info')
        try {
          const dateHtml = await fetchPage(dateLink.href)
          if (dateHtml.length > 2000) {
            const dateLinksInner = extractLinksFromHtml(dateHtml, this.baseUrl)
            const relevantLinks = dateLinksInner.filter(link => 
              this.keywords.some(keyword => link.text.includes(keyword))
            )
            allLinks.push(...relevantLinks)
          }
          await delay(2000)
        } catch (error) {
          log(`  访问失败: ${error.message}`, 'warning')
        }
      }
      
    } catch (error) {
      log(`探索网站失败: ${error.message}`, 'error')
    }
    
    return allLinks
  }

  async getAllScorePageUrls() {
    const allLinks = []
    
    const homeLinks = await this.getHomePageLinks()
    allLinks.push(...homeLinks)
    
    const exploredLinks = await this.exploreSite()
    allLinks.push(...exploredLinks)
    
    const uniqueLinks = []
    const seen = new Set()
    
    for (const link of allLinks) {
      if (!seen.has(link.href)) {
        seen.add(link.href)
        uniqueLinks.push(link)
      }
    }
    
    log(`共收集到 ${uniqueLinks.length} 个独特链接`, 'info')
    
    const scoreUrls = []
    for (const year of this.years) {
      const yearLinks = uniqueLinks.filter(link => 
        link.text.includes(year.toString()) && 
        (link.text.includes('分数线') || link.text.includes('录取') || link.text.includes('投档'))
      )
      
      if (yearLinks.length > 0) {
        scoreUrls.push({
          year,
          url: yearLinks[0].href,
          title: yearLinks[0].text
        })
        log(`找到 ${year} 年分数线页面: ${yearLinks[0].text}`, 'success')
      } else {
        log(`未找到 ${year} 年分数线页面`, 'warning')
      }
    }

    return scoreUrls
  }

  async parseScorePage(url, year) {
    try {
      log(`正在解析页面: ${url}`, 'info')
      const html = await fetchPage(url)
      
      if (!html || html.length < 1000) {
        log('页面内容过短，可能为空或被重定向', 'warning')
        return null
      }

      const tables = extractTablesFromHtml(html)
      const jsonData = tablesToJson(tables)
      const images = extractImagesFromHtml(html, this.baseUrl)
      
      let ocrResults = []
      
      if (tables.length === 0 && images.length > 0) {
        log(`页面没有表格，但有 ${images.length} 张图片，尝试OCR识别`, 'info')
        
        for (const img of images) {
          if (img.src.includes('/files/') && (img.src.endsWith('.png') || img.src.endsWith('.jpg'))) {
            try {
              const imgName = path.basename(img.src)
              const savePath = path.join(this.tempDir, imgName)
              
              log(`下载图片: ${img.src}`, 'info')
              await downloadImage(img.src, savePath)
              
              log(`OCR识别中...`, 'info')
              const text = await ocrImage(savePath)
              
              if (text && text.length > 0) {
                log(`OCR识别成功，识别到 ${text.length} 个字符`, 'success')
                const parsed = parseScoreText(text)
                ocrResults = ocrResults.concat(parsed)
              }
              
              fs.unlinkSync(savePath)
            } catch (error) {
              log(`OCR处理失败: ${error.message}`, 'warning')
            }
          }
        }
      }
      
      log(`从页面提取到 ${tables.length} 个表格，${jsonData.length} 条数据，OCR识别到 ${ocrResults.length} 条分数`, 'info')

      return {
        year,
        url,
        tables,
        jsonData,
        ocrResults,
        rawContent: html.substring(0, 500)
      }
    } catch (error) {
      log(`解析分数线页面失败: ${error.message}`, 'error')
      return null
    }
  }

  async getControlLines() {
    try {
      const scoreUrls = await this.getAllScorePageUrls()
      const controlLines = []

      for (const { year, url, title } of scoreUrls) {
        log(`正在爬取 ${year} 年分数线: ${title}`, 'info')
        
        const data = await this.parseScorePage(url, year)
        if (data) {
          if (data.jsonData.length > 0) {
            for (const table of data.jsonData) {
              const parsed = this.parseControlLineTable(table, year)
              if (parsed.length > 0) {
                controlLines.push(...parsed)
              }
            }
          }
          
          if (data.ocrResults.length > 0) {
            for (const ocrResult of data.ocrResults) {
              controlLines.push({
                year,
                category: ocrResult.category,
                categoryName: ocrResult.text.substring(0, 20),
                score: ocrResult.score,
                source: this.provinceCode
              })
            }
          }
        }

        await delay(3000)
      }

      return controlLines
    } catch (error) {
      log(`获取录取控制分数线失败: ${error.message}`, 'error')
      return []
    }
  }

  parseControlLineTable(table, year) {
    throw new Error('子类必须实现 parseControlLineTable 方法')
  }

  async getSchoolAdmissionScores() {
    try {
      const links = await this.getHomePageLinks(['投档', '院校', '录取'])
      
      const validLinks = links.filter(link => link.href && link.href.startsWith('http'))
      log(`找到 ${validLinks.length} 个有效院校投档相关链接`, 'info')
      
      const schoolScores = []
      for (const link of validLinks.slice(0, 3)) {
        log(`正在爬取: ${link.text}`, 'info')
        
        const data = await this.parseScorePage(link.href, 0)
        if (data) {
          if (data.jsonData.length > 0) {
            for (const table of data.jsonData) {
              const parsed = this.parseSchoolAdmissionTable(table)
              if (parsed.length > 0) {
                schoolScores.push(...parsed)
              }
            }
          }
          
          if (data.ocrResults.length > 0) {
            for (const ocrResult of data.ocrResults) {
              schoolScores.push({
                schoolName: ocrResult.text.substring(0, 30),
                score: ocrResult.score,
                source: this.provinceCode
              })
            }
          }
        }

        await delay(3000)
      }

      return schoolScores
    } catch (error) {
      log(`获取院校投档线失败: ${error.message}`, 'error')
      return []
    }
  }

  parseSchoolAdmissionTable(table) {
    throw new Error('子类必须实现 parseSchoolAdmissionTable 方法')
  }

  async getPageHtml(url) {
    try {
      const html = await fetchPage(url)
      return html.substring(0, 5000)
    } catch (error) {
      log(`获取页面HTML失败: ${error.message}`, 'error')
      return null
    }
  }
}

module.exports = BaseSpider