<template>
  <div class="min-h-screen pb-12">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container py-4 flex items-center">
        <button
          class="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          @click="goBack"
        >
          <span class="text-xl mr-1">←</span>
          <span>返回</span>
        </button>
        <h1 class="text-xl font-bold text-center flex-1 mr-12">📊 分数找学校</h1>
      </div>
    </header>

    <main class="container py-8">
      <!-- 输入区域 -->
      <div class="card p-6 md:p-8 mb-8 animate-slide-up">
        <h2 class="text-xl font-bold text-gray-800 mb-6">输入你的高考信息</h2>

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

          <!-- 高考模式信息 -->
          <div class="bg-primary-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-600">当前省份高考模式</span>
                <div class="flex items-center mt-1">
                  <span class="text-xl font-bold text-primary-600 mr-2">{{ currentProvinceGaokaoMode }}</span>
                  <span class="text-sm text-gray-600">{{ currentProvinceGaokaoModeDesc }}</span>
                </div>
              </div>
              <span class="text-2xl">📝</span>
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
            <p class="text-sm text-gray-500 mt-1">位次比分数更准确，有条件建议填写</p>
          </div>

          <!-- 匹配按钮 -->
          <button
            class="btn-primary w-full text-lg py-4"
            :disabled="!scoreInput"
            :class="{ 'opacity-50 cursor-not-allowed': !scoreInput }"
            @click="matchSchools"
          >
            🔍 开始匹配学校
          </button>
        </div>
      </div>

      <!-- 结果区域 -->
      <div v-if="hasResult" class="space-y-8 animate-fade-in">
        <!-- 冲刺档 -->
        <section v-if="matchResult.sprint.length > 0">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-2xl mr-2">🔥</span>
            冲刺院校
            <span class="text-sm font-normal text-gray-500 ml-2">
              （分数接近，有希望冲上）
            </span>
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SchoolCard
              v-for="school in matchResult.sprint"
              :key="school.id"
              :school="school"
            />
          </div>
        </section>

        <!-- 稳妥档 -->
        <section v-if="matchResult.safe.length > 0">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-2xl mr-2">✅</span>
            稳妥院校
            <span class="text-sm font-normal text-gray-500 ml-2">
              （大概率能上）
            </span>
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SchoolCard
              v-for="school in matchResult.safe"
              :key="school.id"
              :school="school"
            />
          </div>
        </section>

        <!-- 保底档 -->
        <section v-if="matchResult.guarantee.length > 0">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-2xl mr-2">🛡️</span>
            保底院校
            <span class="text-sm font-normal text-gray-500 ml-2">
              （肯定能上，用来兜底）
            </span>
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SchoolCard
              v-for="school in matchResult.guarantee"
              :key="school.id"
              :school="school"
            />
          </div>
        </section>
      </div>

      <!-- 无结果提示 -->
      <div
        v-else-if="searched && !hasResult"
        class="card p-12 text-center animate-fade-in"
      >
        <div class="text-5xl mb-4">🤔</div>
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
const { userScore, userRank, selectedProvince, matchResult, hasResult } = useSchoolMatch()

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
function matchSchools() {
  if (!scoreInput.value) return
  userScore.value = scoreInput.value
  userRank.value = rankInput.value
  searched.value = true
}

/**
 * 返回上一页
 */
function goBack() {
  router.push('/')
}
</script>
