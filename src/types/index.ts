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

// 学校匹配结果
export interface SchoolMatchResult {
  sprint: School[]
  safe: School[]
  guarantee: School[]
}
