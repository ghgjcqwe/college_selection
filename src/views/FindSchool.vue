<template>
  <div class="min-h-screen pb-12 relative overflow-hidden bg-gradient-bg">
    <!-- 背景装饰 -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-safety-200/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

    <!-- 毛玻璃导航栏 -->
    <header class="glass-nav sticky top-0 z-20">
      <div class="container py-4 flex items-center">
        <button
          class="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          @click="goBack"
        >
          <span class="text-xl mr-1">←</span>
          <span>返回</span>
        </button>
        <h1 class="text-xl font-bold text-center flex-1 mr-12">
          <span class="text-gradient">📊 分数找学校</span>
        </h1>
      </div>
    </header>

    <main class="container py-8 relative z-10">
      <!-- 输入表单卡片 -->
      <div class="card p-6 md:p-8 mb-8 animate-fade-in-up relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-primary"></div>
        <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>✏️</span> 输入你的高考信息
        </h2>

        <div class="space-y-5">
          <!-- 省份选择 -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">
              所在省份 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="provinceInput"
              class="input-field"
            >
              <option v-for="province in provinces" :key="province.code" :value="province.code">
                {{ province.name }}
              </option>
            </select>
          </div>

          <!-- 高考模式提示 -->
          <div class="bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-xl p-4 border border-primary-200/50">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-600">当前省份高考模式</span>
                <div class="flex items-center mt-1">
                  <span class="text-xl font-bold text-primary-600 mr-2">{{ currentProvinceGaokaoMode }}</span>
                  <span class="text-sm text-gray-600">{{ currentProvinceGaokaoModeDesc }}</span>
                </div>
              </div>
              <span class="text-3xl animate-float">📝</span>
            </div>
          </div>

          <!-- 分数输入 -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">
              高考总分 <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="scoreInput"
              type="number"
              class="input-field"
              placeholder="请输入你的高考分数（如：580）"
              min="0"
              :max="currentProvinceMaxScore"
            />
            <p class="text-sm text-gray-500 mt-1">满分 {{ currentProvinceMaxScore }} 分</p>
          </div>

          <!-- 位次输入 -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">
              全省位次 <span class="text-gray-400">（选填）</span>
            </label>
            <input
              v-model.number="rankInput"
              type="number"
              class="input-field"
              placeholder="请输入你的全省排名"
              min="1"
            />
            <p class="text-sm text-gray-500 mt-1">💡 位次比分数更准确，有条件建议填写</p>
          </div>

          <!-- 匹配按钮 -->
          <button
            class="btn-primary w-full text-lg py-4"
            :disabled="!scoreInput || isLoading"
            :class="{ 'opacity-50 cursor-not-allowed': !scoreInput || isLoading }"
            @click="matchSchools"
          >
            {{ isLoading ? '⏳ 匹配中...' : '🔍 开始匹配学校' }}
          </button>
        </div>
      </div>

      <!-- 结果展示 -->
      <div v-if="hasResult" class="space-y-10 animate-fade-in">
        <!-- 冲刺院校 -->
        <section v-if="matchResult.sprint.length > 0">
          <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center">
            <span class="tag-sprint text-base px-4 py-1.5">冲刺</span>
            <span class="text-sm font-normal text-gray-500 ml-3">
              分数接近，有希望冲上
            </span>
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-list-fade-in">
            <SchoolCard
              v-for="school in matchResult.sprint"
              :key="school.id"
              :school="school"
              tier="sprint"
            />
          </div>
        </section>

        <!-- 稳妥院校 -->
        <section v-if="matchResult.safe.length > 0">
          <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center">
            <span class="tag-stable text-base px-4 py-1.5">稳妥</span>
            <span class="text-sm font-normal text-gray-500 ml-3">
              大概率能上
            </span>
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-list-fade-in">
            <SchoolCard
              v-for="school in matchResult.safe"
              :key="school.id"
              :school="school"
              tier="safe"
            />
          </div>
        </section>

        <!-- 保底院校 -->
        <section v-if="matchResult.guarantee.length > 0">
          <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center">
            <span class="tag-safety text-base px-4 py-1.5">保底</span>
            <span class="text-sm font-normal text-gray-500 ml-3">
              肯定能上，用来兜底
            </span>
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-list-fade-in">
            <SchoolCard
              v-for="school in matchResult.guarantee"
              :key="school.id"
              :school="school"
              tier="guarantee"
            />
          </div>
        </section>
      </div>

      <!-- 无结果提示 -->
      <div
        v-else-if="searched && !hasResult"
        class="card p-12 text-center animate-fade-in"
      >
        <div class="text-5xl mb-4 animate-bounce-soft">🤔</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">暂无匹配的学校</h3>
        <p class="text-gray-600">请检查分数是否输入正确，或尝试其他分数</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import SchoolCard from '@/components/SchoolCard.vue'
import { useSchoolMatch } from '@/composables/useSchoolMatch'
import { provinces } from '@/data/provinces'

const router = useRouter()
const { userScore, userRank, selectedProvince, matchResult, hasResult, isLoading, executeMatch } = useSchoolMatch()

const scoreInput = ref<number | null>(null)
const rankInput = ref<number | null>(null)
const provinceInput = ref<string>('hubei')
const searched = ref(false)

/**
 * 监听省份变化，实时同步到全局状态
 */
watch(provinceInput, (newProvince) => {
  selectedProvince.value = newProvince
}, { immediate: true })

/**
 * 获取当前省份的满分
 */
const currentProvinceMaxScore = computed(() => {
  const province = provinces.find((p) => p.code === provinceInput.value)
  return province?.maxScore || 750
})

/**
 * 获取当前省份的高考模式
 */
const currentProvinceGaokaoMode = computed(() => {
  const province = provinces.find((p) => p.code === provinceInput.value)
  return province?.gaokaoMode || '3+X'
})

/**
 * 获取当前省份的高考模式描述
 */
const currentProvinceGaokaoModeDesc = computed(() => {
  const province = provinces.find((p) => p.code === provinceInput.value)
  return province?.gaokaoModeDesc || ''
})

/**
 * 执行学校匹配
 */
async function matchSchools() {
  if (!scoreInput.value) return
  userScore.value = scoreInput.value
  userRank.value = rankInput.value
  searched.value = true
  await executeMatch()
}

/**
 * 返回上一页
 */
function goBack() {
  router.push('/')
}
</script>