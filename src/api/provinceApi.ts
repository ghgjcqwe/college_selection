import type { Province } from '@/types'

const BASE_URL = '/api'

/**
 * 获取所有省份
 */
export async function fetchProvinces(): Promise<Province[]> {
  const response = await fetch(`${BASE_URL}/provinces`)
  if (!response.ok) {
    throw new Error('获取省份列表失败')
  }
  return response.json()
}
