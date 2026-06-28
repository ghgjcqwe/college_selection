import type { School } from '@/types'

const BASE_URL = '/api'

/**
 * 获取所有学校
 */
export async function fetchSchools(): Promise<School[]> {
  const response = await fetch(`${BASE_URL}/schools`)
  if (!response.ok) {
    throw new Error('获取学校列表失败')
  }
  return response.json()
}

/**
 * 根据 ID 获取学校详情
 */
export async function fetchSchoolById(id: number): Promise<School> {
  const response = await fetch(`${BASE_URL}/schools/${id}`)
  if (!response.ok) {
    throw new Error('获取学校详情失败')
  }
  return response.json()
}

/**
 * 根据分数和省份匹配学校
 */
export async function matchSchools(
  score: number,
  province: string
): Promise<{ sprint: School[]; safe: School[]; guarantee: School[] }> {
  const response = await fetch(
    `${BASE_URL}/schools/match?score=${score}&province=${province}`
  )
  if (!response.ok) {
    throw new Error('匹配学校失败')
  }
  return response.json()
}
