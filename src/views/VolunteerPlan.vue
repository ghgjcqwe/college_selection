<template>
  <div class="min-h-screen pb-12 relative">
    <div class="absolute top-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

    <header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-white/50">
      <div class="container py-4 flex items-center">
        <button
          class="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          @click="goBack"
        >
          <span class="text-xl mr-1">←</span>
          <span>返回</span>
        </button>
        <h1 class="text-xl font-bold text-center flex-1 mr-12">
          <span class="text-gradient">📝 志愿填报模拟</span>
        </h1>
      </div>
    </header>

    <main class="container py-6 relative z-10">
      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="card p-6 mb-6 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>📋</span> 志愿列表
              </h2>
              <button
                class="btn-gradient-ocean px-4 py-2 text-sm"
                @click="autoGenerate"
                :disabled="isGenerating"
              >
                {{ isGenerating ? '生成中...' : '✨ 智能生成' }}
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="(item, index) in volunteerItems"
                :key="item.id"
                class="border border-gray-100 rounded-xl p-4 bg-gradient-to-r from-white to-gray-50/50 hover:border-primary-200 hover:shadow-md transition-all duration-300 group"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                    :class="getRankBgClass(index + 1)"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="font-bold text-gray-800">{{ item.schoolName }}</h3>
                      <span
                        class="text-xs px-2 py-0.5 rounded-full font-medium"
                        :class="getTierClass(item.tier)"
                      >
                        {{ getTierLabel(item.tier) }}
                      </span>
                      <span class="text-xs text-gray-500 flex items-center gap-1">
                        <span>📊</span> 录取概率: {{ item.probability }}%
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-1 mt-2">
                      <span
                        v-for="major in item.majors.slice(0, 3)"
                        :key="major"
                        class="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded"
                      >
                        {{ major }}
                      </span>
                      <span v-if="item.majors.length > 3" class="text-xs text-gray-400">
                        +{{ item.majors.length - 3 }}个专业
                      </span>
                    </div>
                  </div>
                  <button
                    class="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-lg"
                    @click="removeItem(index)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div
                v-if="volunteerItems.length === 0"
                class="text-center py-16 text-gray-500"
              >
                <div class="text-5xl mb-4 opacity-50">📋</div>
                <p class="text-lg font-medium text-gray-600 mb-2">暂无志愿</p>
                <p class="text-sm">点击"智能生成"或从右侧搜索添加学校</p>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-100">
              <div class="flex gap-3">
                <button
                  class="btn-primary flex-1"
                  @click="savePlan"
                  :disabled="volunteerItems.length === 0"
                >
                  💾 保存方案
                </button>
                <button
                  class="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-gray-600 font-medium"
                  @click="clearAll"
                  :disabled="volunteerItems.length === 0"
                >
                  🗑️ 清空
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="card p-6 sticky top-24 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>
            <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📊</span> 方案分析
            </h2>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl">
                <span class="text-gray-700 font-medium">志愿数量</span>
                <span class="font-bold text-lg">
                  <span class="text-gradient">{{ volunteerItems.length }}</span>
                  <span class="text-gray-400 text-base"> / 10</span>
                </span>
              </div>

              <div class="p-4 bg-gray-50/80 rounded-xl">
                <div class="flex justify-between items-center mb-3">
                  <span class="text-gray-700 font-medium">梯度分布</span>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <span class="text-xs w-12 text-red-600 font-medium">🔥 冲刺</span>
                    <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :style="{ width: `${sprintRatio}%`, background: 'linear-gradient(90deg, #ef4444, #f97316)' }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-500 w-6 text-right">{{ sprintCount }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xs w-12 text-blue-600 font-medium">✅ 稳妥</span>
                    <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :style="{ width: `${safeRatio}%`, background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-500 w-6 text-right">{{ safeCount }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xs w-12 text-green-600 font-medium">🛡️ 保底</span>
                    <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :style="{ width: `${guaranteeRatio}%`, background: 'linear-gradient(90deg, #10b981, #14b8a6)' }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-500 w-6 text-right">{{ guaranteeCount }}</span>
                  </div>
                </div>
              </div>

              <div class="p-4 rounded-xl" :class="riskBgClass">
                <div class="flex justify-between items-center">
                  <span class="font-medium" :class="riskTextClass">方案风险评估</span>
                  <span class="font-bold text-sm" :class="riskTextClass">{{ riskLabel }}</span>
                </div>
                <p class="text-sm mt-2" :class="riskAdviceClass">{{ riskAdvice }}</p>
              </div>

              <div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div class="flex justify-between items-center">
                  <span class="text-green-700 font-medium">平均录取概率</span>
                  <span class="font-bold text-green-600 text-lg">{{ averageProbability }}%</span>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-gray-100">
              <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <span>➕</span> 添加学校
              </h3>
              <div class="space-y-3">
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">分数</label>
                  <input
                    v-model.number="scoreInput"
                    type="number"
                    class="input-field text-sm"
                    placeholder="输入分数"
                  />
                </div>
                <select
                  v-model="provinceInput"
                  class="input-field text-sm"
                >
                  <option v-for="p in provinces" :key="p.code" :value="p.code">
                    {{ p.name }}
                  </option>
                </select>
                <button
                  class="w-full btn-gradient-purple text-sm"
                  @click="searchSchools"
                  :disabled="!scoreInput"
                >
                  🔍 搜索学校
                </button>
              </div>

              <div v-if="searchResults.length > 0" class="mt-4 max-h-60 overflow-y-auto space-y-2 pr-1">
                <div
                  v-for="item in searchResults"
                  :key="item.school.id"
                  class="p-3 border border-gray-100 rounded-xl hover:border-primary-300 hover:bg-primary-50/30 cursor-pointer transition-all duration-200 group"
                  @click="addSchool(item)"
                >
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-sm text-gray-800 group-hover:text-primary-600 transition-colors">{{ item.school.name }}</span>
                    <span
                      class="text-xs px-2 py-0.5 rounded-full font-medium"
                      :class="getTierClass(item.tier)"
                    >
                      {{ getTierLabel(item.tier) }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span>📊</span> 录取概率: {{ item.probability }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="savedPlan" class="card p-6 mt-6 animate-slide-up relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-forest"></div>
        <div class="flex items-center gap-4">
          <div class="text-4xl animate-bounce-soft">✅</div>
          <div>
            <h3 class="font-bold text-gray-800 text-lg">方案保存成功！</h3>
            <p class="text-sm text-gray-600 mt-1">方案ID: {{ savedPlan.id }}</p>
            <p class="text-sm text-gray-600">共{{ savedPlan.items.length }}个志愿</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { provinces } from '@/data/provinces'
import type { VolunteerItem, SchoolMatchWithProbability, SchoolTier } from '@/types'

const router = useRouter()

const volunteerItems = ref<VolunteerItem[]>([])
const scoreInput = ref<number | null>(null)
const provinceInput = ref('hubei')
const searchResults = ref<SchoolMatchWithProbability[]>([])
const isGenerating = ref(false)
const savedPlan = ref<{ id: string; items: VolunteerItem[] } | null>(null)

const sprintCount = computed(() => volunteerItems.value.filter(i => i.tier === 'sprint').length)
const safeCount = computed(() => volunteerItems.value.filter(i => i.tier === 'safe').length)
const guaranteeCount = computed(() => volunteerItems.value.filter(i => i.tier === 'guarantee').length)

const sprintRatio = computed(() => volunteerItems.value.length > 0 ? (sprintCount.value / volunteerItems.value.length) * 100 : 0)
const safeRatio = computed(() => volunteerItems.value.length > 0 ? (safeCount.value / volunteerItems.value.length) * 100 : 0)
const guaranteeRatio = computed(() => volunteerItems.value.length > 0 ? (guaranteeCount.value / volunteerItems.value.length) * 100 : 0)

const averageProbability = computed(() => {
  if (volunteerItems.value.length === 0) return 0
  const sum = volunteerItems.value.reduce((acc, item) => acc + item.probability, 0)
  return Math.round(sum / volunteerItems.value.length)
})

const riskLabel = computed(() => {
  if (volunteerItems.value.length < 3) return '信息不足'
  if (guaranteeCount.value === 0) return '高风险'
  if (sprintCount.value > volunteerItems.value.length * 0.5) return '较高风险'
  if (sprintCount.value >= 2 && safeCount.value >= 3 && guaranteeCount.value >= 1) return '合理'
  return '较低风险'
})

const riskClass = computed(() => {
  if (riskLabel.value === '高风险') return 'text-red-600'
  if (riskLabel.value === '较高风险') return 'text-orange-600'
  if (riskLabel.value === '合理') return 'text-green-600'
  return 'text-gray-500'
})

const riskAdvice = computed(() => {
  if (volunteerItems.value.length < 3) return '建议至少填报3所学校'
  if (guaranteeCount.value === 0) return '建议添加保底院校，避免滑档'
  if (sprintCount.value > volunteerItems.value.length * 0.5) return '冲刺院校过多，建议增加稳妥和保底院校'
  if (sprintCount.value === 0) return '可以适当增加冲刺院校，争取更好的机会'
  return '志愿梯度分布合理，继续保持'
})

function getRankBgClass(rank: number) {
  if (rank <= 3) return 'bg-gradient-to-br from-red-400 to-pink-500'
  if (rank <= 6) return 'bg-gradient-to-br from-blue-400 to-indigo-500'
  return 'bg-gradient-to-br from-green-400 to-emerald-500'
}

function getTierClass(tier: SchoolTier) {
  if (tier === 'sprint') return 'bg-gradient-to-r from-red-100 to-orange-100 text-red-600'
  if (tier === 'safe') return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
  return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-600'
}

function getTierLabel(tier: SchoolTier) {
  if (tier === 'sprint') return '冲刺'
  if (tier === 'safe') return '稳妥'
  return '保底'
}

const riskBgClass = computed(() => {
  if (riskLabel.value === '高风险') return 'bg-gradient-to-r from-red-50 to-orange-50'
  if (riskLabel.value === '较高风险') return 'bg-gradient-to-r from-orange-50 to-yellow-50'
  if (riskLabel.value === '合理') return 'bg-gradient-to-r from-green-50 to-emerald-50'
  return 'bg-gray-50'
})

const riskTextClass = computed(() => {
  if (riskLabel.value === '高风险') return 'text-red-600'
  if (riskLabel.value === '较高风险') return 'text-orange-600'
  if (riskLabel.value === '合理') return 'text-green-600'
  return 'text-gray-500'
})

const riskAdviceClass = computed(() => {
  if (riskLabel.value === '高风险') return 'text-red-500'
  if (riskLabel.value === '较高风险') return 'text-orange-500'
  if (riskLabel.value === '合理') return 'text-green-500'
  return 'text-gray-500'
})

async function searchSchools() {
  if (!scoreInput.value) return
  
  try {
    const response = await fetch(`/api/schools/match?score=${scoreInput.value}&province=${provinceInput.value}`)
    const data = await response.json()
    
    const allResults: SchoolMatchWithProbability[] = []
    if (data.sprint) allResults.push(...data.sprint)
    if (data.safe) allResults.push(...data.safe)
    if (data.guarantee) allResults.push(...data.guarantee)
    
    searchResults.value = allResults.slice(0, 10)
  } catch (error) {
    console.error('搜索学校失败:', error)
  }
}

function addSchool(item: SchoolMatchWithProbability) {
  if (volunteerItems.value.length >= 10) {
    alert('最多只能填报10个志愿')
    return
  }
  
  const existing = volunteerItems.value.find(i => i.schoolId === item.school.id)
  if (existing) {
    alert('该学校已在志愿列表中')
    return
  }
  
  volunteerItems.value.push({
    id: `item_${Date.now()}`,
    schoolId: item.school.id,
    schoolName: item.school.name,
    majors: item.school.majors || [],
    tier: item.tier,
    probability: item.probability,
    rank: volunteerItems.value.length + 1
  })
}

function removeItem(index: number) {
  volunteerItems.value.splice(index, 1)
  volunteerItems.value.forEach((item, i) => {
    item.rank = i + 1
  })
}

async function autoGenerate() {
  if (!scoreInput.value) {
    alert('请先输入分数')
    return
  }
  
  isGenerating.value = true
  
  try {
    await searchSchools()
    
    const sprints = searchResults.value.filter(r => r.tier === 'sprint').slice(0, 3)
    const safes = searchResults.value.filter(r => r.tier === 'safe').slice(0, 4)
    const guarantees = searchResults.value.filter(r => r.tier === 'guarantee').slice(0, 3)
    
    volunteerItems.value = [
      ...sprints.map((item, i) => ({
        id: `item_sprint_${i}`,
        schoolId: item.school.id,
        schoolName: item.school.name,
        majors: item.school.majors || [],
        tier: 'sprint',
        probability: item.probability,
        rank: i + 1
      })),
      ...safes.map((item, i) => ({
        id: `item_safe_${i}`,
        schoolId: item.school.id,
        schoolName: item.school.name,
        majors: item.school.majors || [],
        tier: 'safe',
        probability: item.probability,
        rank: sprints.length + i + 1
      })),
      ...guarantees.map((item, i) => ({
        id: `item_guarantee_${i}`,
        schoolId: item.school.id,
        schoolName: item.school.name,
        majors: item.school.majors || [],
        tier: 'guarantee',
        probability: item.probability,
        rank: sprints.length + safes.length + i + 1
      }))
    ]
  } catch (error) {
    console.error('自动生成失败:', error)
  } finally {
    isGenerating.value = false
  }
}

function clearAll() {
  if (confirm('确定要清空所有志愿吗？')) {
    volunteerItems.value = []
  }
}

function savePlan() {
  const plan = {
    id: `plan_${Date.now()}`,
    province: provinceInput.value,
    score: scoreInput.value || 0,
    items: volunteerItems.value,
    createdAt: new Date().toISOString()
  }
  
  const plans = JSON.parse(localStorage.getItem('volunteer_plans') || '[]')
  plans.unshift(plan)
  localStorage.setItem('volunteer_plans', JSON.stringify(plans))
  
  savedPlan.value = {
    id: plan.id,
    items: plan.items
  }
  
  setTimeout(() => {
    savedPlan.value = null
  }, 3000)
}

/**
 * 从 localStorage 加载最新保存的志愿方案
 */
function loadSavedPlan() {
  try {
    const plans = JSON.parse(localStorage.getItem('volunteer_plans') || '[]')
    if (plans.length > 0) {
      const latestPlan = plans[0]
      volunteerItems.value = latestPlan.items || []
      scoreInput.value = latestPlan.score || null
      provinceInput.value = latestPlan.province || 'hubei'
    }
  } catch (error) {
    console.error('加载志愿方案失败:', error)
  }
}

onMounted(() => {
  loadSavedPlan()
})

function goBack() {
  router.push('/')
}
</script>