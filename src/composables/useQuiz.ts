import { ref, computed, reactive } from 'vue'
import type { MajorMatchResult } from '@/types'
import { quizQuestions } from '@/data/quizQuestions'
import { majors } from '@/data/majors'

/**
 * 全局单例 quiz 状态
 * 确保所有组件共享同一个状态，不会因为组件卸载/重载而丢失进度
 */
const quizState = reactive({
  currentIndex: 0,
  answers: [] as string[],
  isCompleted: false,
})

/**
 * 兴趣测试逻辑 composable
 * 管理答题进度、计分、匹配专业
 */
export function useQuiz() {
  const totalQuestions = computed(() => quizQuestions.length)
  const currentQuestion = computed(() => quizQuestions[quizState.currentIndex])
  const progress = computed(() => ((quizState.currentIndex + 1) / totalQuestions.value) * 100)
  const isLastQuestion = computed(() => quizState.currentIndex === totalQuestions.value - 1)

  /**
   * 计算各兴趣标签的得分
   */
  const tagScores = computed(() => {
    const scores: Record<string, number> = {}

    quizState.answers.forEach((answer, index) => {
      const question = quizQuestions[index]
      const option = question.options.find((o) => o.label === answer)
      if (option) {
        option.tags.forEach((tag) => {
          scores[tag] = (scores[tag] || 0) + 1
        })
      }
    })

    return Object.entries(scores)
      .map(([tag, score]) => ({ tag, score }))
      .sort((a, b) => b.score - a.score)
  })

  /**
   * 根据标签得分匹配专业
   * 取 Top 3 标签，计算每个专业的匹配度
   */
  const matchResults = computed<MajorMatchResult[]>(() => {
    if (!quizState.isCompleted || tagScores.value.length === 0) {
      return []
    }

    const topTags = tagScores.value.slice(0, 3).map((t) => t.tag)

    const results = majors.map((major) => {
      const matchTags = major.tags.filter((tag) => topTags.includes(tag))
      const matchRate = Math.round((matchTags.length / 3) * 100)
      return { major, matchRate }
    })

    return results
      .filter((r) => r.matchRate > 0)
      .sort((a, b) => b.matchRate - a.matchRate)
      .slice(0, 5)
  })

  /**
   * 选择答案并进入下一题
   */
  function selectAnswer(label: string) {
    // 确保 answers 数组足够长
    while (quizState.answers.length <= quizState.currentIndex) {
      quizState.answers.push('')
    }
    quizState.answers[quizState.currentIndex] = label

    if (isLastQuestion.value) {
      quizState.isCompleted = true
    } else {
      quizState.currentIndex++
    }
  }

  /**
   * 重新开始测试
   */
  function restart() {
    quizState.currentIndex = 0
    quizState.answers = []
    quizState.isCompleted = false
  }

  return {
    quizState,
    totalQuestions,
    currentQuestion,
    progress,
    isLastQuestion,
    tagScores,
    matchResults,
    selectAnswer,
    restart,
  }
}

export default useQuiz
