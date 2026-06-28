import type { Major } from '@/types'

const BASE_URL = '/api'

/**
 * 获取所有专业
 */
export async function fetchMajors(): Promise<Major[]> {
  const response = await fetch(`${BASE_URL}/majors`)
  if (!response.ok) {
    throw new Error('获取专业列表失败')
  }
  return response.json()
}

/**
 * 根据 ID 获取专业详情
 */
export async function fetchMajorById(id: number): Promise<Major> {
  const response = await fetch(`${BASE_URL}/majors/${id}`)
  if (!response.ok) {
    throw new Error('获取专业详情失败')
  }
  return response.json()
}
