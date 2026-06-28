import { ref, computed } from 'vue'
import type { School, SchoolMatchResult } from '@/types'
import { schools } from '@/data/schools'

const userScore = ref<number | null>(null)
const userRank = ref<number | null>(null)
const selectedProvince = ref<string>('hubei')

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
   * 匹配结果：分三档
   * - 冲刺档：学校最低分 ≥ 用户分数，且分差 ≤ 20 分
   * - 稳妥档：用户分数 > 学校最低分，且分差 ≤ 30 分
   * - 保底档：用户分数 - 学校最低分 > 30 分
   */
  const matchResult = computed<SchoolMatchResult>(() => {
    if (userScore.value === null) {
      return { sprint: [], safe: [], guarantee: [] }
    }

    const score = userScore.value
    const provinceCode = selectedProvince.value
    const sprint: School[] = []
    const safe: School[] = []
    const guarantee: School[] = []

    schools.forEach((school) => {
      const schoolScore = getProvinceScore(school, provinceCode)
      const diff = schoolScore - score

      if (diff >= 0 && diff <= 20) {
        sprint.push(school)
      } else if (diff < 0 && Math.abs(diff) <= 30) {
        safe.push(school)
      } else if (diff < -30) {
        guarantee.push(school)
      }
    })

    sprint.sort((a, b) => getProvinceScore(a, provinceCode) - getProvinceScore(b, provinceCode))
    safe.sort((a, b) => getProvinceScore(b, provinceCode) - getProvinceScore(a, provinceCode))
    guarantee.sort((a, b) => getProvinceScore(b, provinceCode) - getProvinceScore(a, provinceCode))

    return {
      sprint: sprint.slice(0, 8),
      safe: safe.slice(0, 8),
      guarantee: guarantee.slice(0, 8),
    }
  })

  const hasResult = computed(() => {
    const result = matchResult.value
    return result.sprint.length > 0 || result.safe.length > 0 || result.guarantee.length > 0
  })

  /**
   * 根据ID查找学校
   */
  function getSchoolById(id: number): School | undefined {
    return schools.find((s) => s.id === id)
  }

  return {
    userScore,
    userRank,
    selectedProvince,
    matchResult,
    hasResult,
    getSchoolById,
    getProvinceScore,
  }
}

export default useSchoolMatch
