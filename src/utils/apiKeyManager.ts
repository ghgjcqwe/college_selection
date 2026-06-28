/**
 * API Key 管理
 * 存储用户自己的 API Key 和提供商选择
 */

const API_KEY_STORAGE_KEY = 'ai_api_key'
const API_PROVIDER_STORAGE_KEY = 'ai_api_provider'

export type ApiProvider = 'deepseek' | 'siliconflow'

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

/**
 * 获取保存的API提供商
 */
export function getApiProvider(): ApiProvider {
  const provider = localStorage.getItem(API_PROVIDER_STORAGE_KEY) as ApiProvider
  return provider || 'deepseek'
}

/**
 * 保存API提供商
 */
export function saveApiProvider(provider: ApiProvider): void {
  localStorage.setItem(API_PROVIDER_STORAGE_KEY, provider)
}

export default {
  getApiKey,
  saveApiKey,
  clearApiKey,
  hasApiKey,
  getApiProvider,
  saveApiProvider
}
