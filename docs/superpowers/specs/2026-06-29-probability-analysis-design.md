# 录取概率分析功能设计

**日期**: 2026-06-29  
**功能**: 录取概率分析  
**状态**: 待开发

---

## 1. 功能概述

在现有「分数找学校」页面集成录取概率分析功能，根据用户输入的分数和位次，计算并显示被各学校录取的概率等级（稳、较稳、冲、难）。

## 2. 用户场景

用户输入高考分数（580分）和省份（湖北）后，希望了解：
- 以自己的分数能被哪些学校录取
- 录取把握有多大（概率等级）
- 各学校的录取分数与自己的差距

## 3. 数据结构

### 3.1 概率等级定义

| 等级 | 标签 | 颜色 | 概率范围 | 条件 |
|------|------|------|----------|------|
| 稳 | 🛡️ 稳 | 绿色渐变 | >90% | 分数高于录取线 +15分以上 |
| 较稳 | 🎯 较稳 | 蓝色渐变 | 60-90% | 分数高于录取线 +5~15分 |
| 冲 | 🚀 冲 | 橙色渐变 | 30-60% | 分数高于录取线 -5~+5分 |
| 难 | ⚠️ 难 | 红色渐变 | <30% | 分数低于录取线 -5分以上 |

### 3.2 新增类型定义

```typescript
// 录取概率等级
export type ProbabilityLevel = 'very-high' | 'high' | 'medium' | 'low'

// 学校匹配结果（含概率）
export interface SchoolMatchWithProbability {
  school: School
  tier: SchoolTier
  probability: number
  probabilityLevel: ProbabilityLevel
  scoreDifference: number  // 用户分数 - 录取分数
}
```

## 4. 界面设计

### 4.1 位置

在 FindSchool.vue 的匹配结果区域，每个学校卡片右上角显示概率标签。

### 4.2 学校卡片增强

在现有学校卡片基础上增加：
- 右上角：概率百分比 + 概率等级标签
- 卡片底部：分数差值显示（如 "+18分" 或 "-12分"）

### 4.3 概率标签样式

```
┌─────────────────────────────┐
│ 武汉理工大学            [75%]│  ← 概率标签
│ 理工类 · 湖北武汉           │
│ "985" "211"                │
│                             │
│ 录取分数: 568分             │
│ ┌─────────────────────────┐ │
│ │ 🟢 你的分数 +12分        │ │  ← 差值提示
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

## 5. 计算逻辑

### 5.1 概率计算公式

```
scoreDiff = userScore - schoolProvinceScore

if (scoreDiff >= 15)  probability = 95%, level = 'very-high'
else if (scoreDiff >= 5)  probability = 75%, level = 'high'
else if (scoreDiff >= -5) probability = 45%, level = 'medium'
else if (scoreDiff >= -15) probability = 20%, level = 'low'
else probability = 10%, level = 'low'
```

### 5.2 档位分类

在原有冲刺/稳妥/保底三档基础上，结合概率等级重新排序：
- 冲刺档：probability < 50%
- 稳妥档：50% <= probability < 85%
- 保底档：probability >= 85%

## 6. 页面结构

```
FindSchool.vue
├── 顶部输入区（分数/省份）
├── 高考模式提示卡片
├── 匹配结果统计（可选）
└── 学校列表（改造后）
    ├── 冲刺院校
    │   └── SchoolCard（带概率标签）
    ├── 稳妥院校
    │   └── SchoolCard（带概率标签）
    └── 保底院校
        └── SchoolCard（带概率标签）
```

## 7. 组件变更

### 7.1 SchoolCard.vue 增强

props 新增：
- `probability`: number (0-100)
- `scoreDifference`: number

显示逻辑：
- 概率标签显示在右上角
- 分数差值显示在卡片底部
- 标签颜色根据 probabilityLevel 变化

### 7.2 useSchoolMatch.ts 增强

新增计算函数：
- `calculateProbability(score: number, schoolScore: number): ProbabilityResult`
- 返回 `{ probability, level, difference }`

## 8. 实现步骤

1. 更新 types/index.ts - 添加概率相关类型
2. 更新 useSchoolMatch.ts - 新增概率计算函数
3. 改造 SchoolCard.vue - 增加概率显示
4. 更新 FindSchool.vue - 传递概率数据到卡片
5. 测试验证

## 9. 验收标准

- [ ] 输入580分，显示对应概率等级
- [ ] 概率标签颜色与等级匹配
- [ ] 分数差值正确显示（正数绿色，负数红色）
- [ ] 三档分类正确（冲刺/稳妥/保底）
