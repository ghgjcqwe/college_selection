// 专业分数线
export interface MajorScore {
  name: string
  minScore: number
}

// 学校类型定义
export interface School {
  id: number
  name: string
  type: string
  city: string
  tags: string[]
  minScore: number
  provinceScores?: Record<string, number>
  description: string
  majors: string[]
  majorScores?: MajorScore[]
}

// 省份类型定义
export interface Province {
  code: string
  name: string
  scoreFactor: number
  maxScore: number
  gaokaoMode: string
  gaokaoModeDesc: string
}

// 专业类型定义
export interface Major {
  id: number
  name: string
  category: string
  courses: string[]
  careers: string[]
  fitPerson: string[]
  tags: string[]
}

// 测试选项类型定义
export interface QuizOption {
  label: string
  text: string
  tags: string[]
}

// 测试题目类型定义
export interface QuizQuestion {
  id: number
  question: string
  options: QuizOption[]
}

// 兴趣标签得分类型
export interface TagScore {
  tag: string
  score: number
}

// 专业匹配结果类型
export interface MajorMatchResult {
  major: Major
  matchRate: number
}

// 学校匹配档次
export type SchoolTier = 'sprint' | 'safe' | 'guarantee'

// 学校匹配结果（含概率）
export interface SchoolMatchWithProbability {
  school: School
  tier: SchoolTier
  probability: number
  probabilityLevel: 'low' | 'medium' | 'high' | 'very-high'
  scoreDifference: number
}

// 学校匹配结果
export interface SchoolMatchResult {
  sprint: SchoolMatchWithProbability[]
  safe: SchoolMatchWithProbability[]
  guarantee: SchoolMatchWithProbability[]
}

// 志愿填报项
export interface VolunteerItem {
  id: string
  schoolId: number
  schoolName: string
  majors: string[]
  tier: SchoolTier
  probability: number
  rank: number
}

// 志愿填报方案
export interface VolunteerPlan {
  id: string
  province: string
  score: number
  rank: number | null
  items: VolunteerItem[]
  createdAt: string
}

// 概率等级描述
export interface ProbabilityLevel {
  level: 'low' | 'medium' | 'high' | 'very-high'
  label: string
  color: string
  minProbability: number
}
