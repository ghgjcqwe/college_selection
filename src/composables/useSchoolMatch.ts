import { ref, computed } from 'vue'
import type { School, SchoolMatchResult } from '@/types'
import { matchSchools as apiMatchSchools, fetchSchoolById as apiFetchSchoolById } from '@/api/schoolApi'

const userScore = ref<number | null>(null)
const userRank = ref<number | null>(null)
const selectedProvince = ref<string>('hubei')
const matchResult = ref<SchoolMatchResult>({ sprint: [], safe: [], guarantee: [] })
const isLoading = ref(false)

/**
 * 学校匹配逻辑 composable
 * 根据用户输入的分数和省份，将学校分为冲刺、稳妥、保底三档
 */
export function useSchoolMatch() {

  /**
   * 获取学校在指定省份的录取分数
   */
  function getProvinceScore(school: School, provinceCode: string): number {
    if (school.provinceScores && school.provinceScores[provinceCode]) {
      return school.provinceScores[provinceCode]
    }
    return school.minScore
  }

  /**
   * 执行学校匹配（调用后端 API）
   */
  async function executeMatch() {
    if (userScore.value === null) return
    
    isLoading.value = true
    try {
      console.log('executeMatch called:', { userScore: userScore.value, selectedProvince: selectedProvince.value })
      const result = await apiMatchSchools(userScore.value, selectedProvince.value)
      console.log('executeMatch result:', result)
      matchResult.value = result
      console.log('matchResult updated:', matchResult.value)
    } catch (error) {
      console.error('匹配学校失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const hasResult = computed(() => {
    return matchResult.value.sprint.length > 0 || 
           matchResult.value.safe.length > 0 || 
           matchResult.value.guarantee.length > 0
  })

  /**
   * 根据ID查找学校（调用后端 API）
   */
  async function getSchoolById(id: number): Promise<School | undefined> {
    try {
      return await apiFetchSchoolById(id)
    } catch (error) {
      console.error('获取学校详情失败:', error)
      return undefined
    }
  }

  return {
    userScore,
    userRank,
    selectedProvince,
    matchResult,
    hasResult,
    isLoading,
    getSchoolById,
    getProvinceScore,
    executeMatch,
  }
}

export default useSchoolMatch
