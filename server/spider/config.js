module.exports = {
  puppeteer: {
    headless: 'new',
    timeout: 30000,
    slowMo: 200,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]
  },
  
  request: {
    timeout: 15000,
    delay: 2000,
    maxRetries: 3,
    retryDelay: 3000
  },
  
  targets: {
    hubei: {
      name: '湖北省教育考试院',
      baseUrl: 'http://www.hbea.edu.cn',
      examTypes: ['gaokao', 'zhuanke', 'chengren'],
      years: [2021, 2022, 2023, 2024],
      keywords: ['分数线', '录取', '高考', '投档', '招生'],
      scorePages: {
        gaokao: [
          { year: 2026, url: 'http://www.hbea.edu.cn/html/2026-05/15869.html', description: '2026年湖北省普通高考相关' }
        ]
      }
    },
    
    beijing: {
      name: '北京市教育考试院',
      baseUrl: 'https://www.bjeea.cn',
      keywords: ['分数线', '录取', '高考']
    },
    
    shanghai: {
      name: '上海市教育考试院',
      baseUrl: 'http://www.shmeea.edu.cn',
      keywords: ['分数线', '录取', '高考']
    },
    
    jiangsu: {
      name: '江苏省教育考试院',
      baseUrl: 'https://www.jseea.cn',
      keywords: ['分数线', '录取', '高考']
    },
    
    zhejiang: {
      name: '浙江省教育考试院',
      baseUrl: 'https://www.zjzs.net',
      keywords: ['分数线', '录取', '高考']
    },
    
    guangdong: {
      name: '广东省教育考试院',
      baseUrl: 'http://eea.gd.gov.cn',
      keywords: ['分数线', '录取', '高考']
    }
  }
}