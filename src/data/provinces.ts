export interface Province {
  code: string
  name: string
  scoreFactor: number
  maxScore: number
  gaokaoMode: string
  gaokaoModeDesc: string
}

export const provinces: Province[] = [
  { code: 'beijing', name: '北京', scoreFactor: 0.85, maxScore: 750, gaokaoMode: '3+3', gaokaoModeDesc: '3门必考+3门选考（不分文理）' },
  { code: 'shanghai', name: '上海', scoreFactor: 0.85, maxScore: 660, gaokaoMode: '3+3', gaokaoModeDesc: '3门必考+3门选考（不分文理）' },
  { code: 'tianjin', name: '天津', scoreFactor: 0.88, maxScore: 750, gaokaoMode: '3+3', gaokaoModeDesc: '3门必考+3门选考（不分文理）' },
  { code: 'chongqing', name: '重庆', scoreFactor: 0.95, maxScore: 750, gaokaoMode: '3+1+2', gaokaoModeDesc: '3门必考+1门首选+2门再选' },
  { code: 'hebei', name: '河北', scoreFactor: 1.02, maxScore: 750, gaokaoMode: '3+1+2', gaokaoModeDesc: '3门必考+1门首选+2门再选' },
  { code: 'shanxi', name: '山西', scoreFactor: 0.98, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'neimenggu', name: '内蒙古', scoreFactor: 0.88, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'liaoning', name: '辽宁', scoreFactor: 0.95, maxScore: 750, gaokaoMode: '3+1+2', gaokaoModeDesc: '3门必考+1门首选+2门再选' },
  { code: 'jilin', name: '吉林', scoreFactor: 0.92, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'heilongjiang', name: '黑龙江', scoreFactor: 0.90, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'jiangsu', name: '江苏', scoreFactor: 0.95, maxScore: 750, gaokaoMode: '3+1+2', gaokaoModeDesc: '3门必考+1门首选+2门再选' },
  { code: 'zhejiang', name: '浙江', scoreFactor: 0.95, maxScore: 750, gaokaoMode: '3+3', gaokaoModeDesc: '3门必考+3门选考（不分文理）' },
  { code: 'anhui', name: '安徽', scoreFactor: 0.98, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'fujian', name: '福建', scoreFactor: 0.96, maxScore: 750, gaokaoMode: '3+1+2', gaokaoModeDesc: '3门必考+1门首选+2门再选' },
  { code: 'jiangxi', name: '江西', scoreFactor: 0.98, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'shandong', name: '山东', scoreFactor: 1.03, maxScore: 750, gaokaoMode: '3+3', gaokaoModeDesc: '3门必考+3门选考（不分文理）' },
  { code: 'henan', name: '河南', scoreFactor: 1.05, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'hubei', name: '湖北', scoreFactor: 1.00, maxScore: 750, gaokaoMode: '3+1+2', gaokaoModeDesc: '3门必考+1门首选+2门再选' },
  { code: 'hunan', name: '湖南', scoreFactor: 1.00, maxScore: 750, gaokaoMode: '3+1+2', gaokaoModeDesc: '3门必考+1门首选+2门再选' },
  { code: 'guangdong', name: '广东', scoreFactor: 1.02, maxScore: 750, gaokaoMode: '3+1+2', gaokaoModeDesc: '3门必考+1门首选+2门再选' },
  { code: 'guangxi', name: '广西', scoreFactor: 0.95, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'hainan', name: '海南', scoreFactor: 0.92, maxScore: 750, gaokaoMode: '3+3', gaokaoModeDesc: '3门必考+3门选考（不分文理）' },
  { code: 'sichuan', name: '四川', scoreFactor: 0.98, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'guizhou', name: '贵州', scoreFactor: 0.90, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'yunnan', name: '云南', scoreFactor: 0.92, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'xizang', name: '西藏', scoreFactor: 0.75, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'shaanxi', name: '陕西', scoreFactor: 0.96, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'gansu', name: '甘肃', scoreFactor: 0.88, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'qinghai', name: '青海', scoreFactor: 0.82, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'ningxia', name: '宁夏', scoreFactor: 0.88, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
  { code: 'xinjiang', name: '新疆', scoreFactor: 0.85, maxScore: 750, gaokaoMode: '3+X', gaokaoModeDesc: '传统文理分科（理科：理综；文科：文综）' },
]

export default provinces