/**
 * API Key 管理
 * 存储用户自己的 DeepSeek API Key
 */

const API_KEY_STORAGE_KEY = 'deepseek_api_key'

/**
 * 获取保存的API Key
 */
export function getApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || ''
}

/**
 * 保存API Key
 */
export function saveApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key)
}

/**
 * 清除API Key
 */
export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY)
}

/**
 * 检查是否已配置API Key
 */
export function hasApiKey(): boolean {
  const key = getApiKey()
  return key.length > 0 && key.startsWith('sk-')
}

export default {
  getApiKey,
  saveApiKey,
  clearApiKey,
  hasApiKey
}
