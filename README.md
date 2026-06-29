# 🎓 高考志愿填报助手

> 智能推荐 · 精准匹配 · 科学决策 — 让每一分都物尽其用

一个基于 **Vue 3 + TypeScript + Express** 的全栈 Web 应用，帮助高考考生根据分数匹配学校、探索专业方向、进行兴趣测试，并通过 AI 助手解答志愿填报疑问。

---

## 📸 界面预览

### 首页
![首页](https://via.placeholder.com/800x450/667eea/ffffff?text=🏠+首页+-+4大功能入口)

首页展示四个核心功能入口卡片：**分数找学校**、**专业怎么选**、**AI志愿助手**、**志愿填报模拟**，每个卡片带有渐变色和悬浮动画效果。

### 分数找学校
![分数找学校](https://via.placeholder.com/800x450/4facfe/ffffff?text=📊+分数找学校+-+输入分数匹配院校)

选择省份、输入高考分数（可选填位次），系统自动将学校分为 **冲刺 🔥**、**稳妥 ✅**、**保底 🛡️** 三档，每所学校显示录取概率和分数差距。

### 学校详情
![学校详情](https://via.placeholder.com/800x450/764ba2/ffffff?text=🏫+学校详情+-+专业录取分析)

查看学校基本信息、简介、各省录取分数线，以及各专业的录取概率分析（含进度条和颜色标识）。

### 专业浏览与兴趣测试
![专业浏览](https://via.placeholder.com/800x450/f093fb/ffffff?text=🎯+专业浏览+-+8大学科分类)

8 大学科门类（工学、医学、文学、经济学、管理学、教育学、理学、法学）分类浏览 25 个专业。顶部提供兴趣测试入口。

### 兴趣测试
![兴趣测试](https://via.placeholder.com/800x450/fa709a/ffffff?text=📝+兴趣测试+-+8道题发现适合专业)

8 道选择题，逐题作答，实时显示进度。完成后根据兴趣标签匹配推荐专业。

### AI 志愿助手
![AI志愿助手](https://via.placeholder.com/800x450/8e2de2/ffffff?text=🤖+AI志愿助手+-+智能问答)

集成 DeepSeek / 硅基流动大模型，解答志愿填报相关问题。支持对话历史管理。

### 志愿填报模拟
![志愿填报模拟](https://via.placeholder.com/800x450/11998e/ffffff?text=📝+志愿填报模拟+-+智能生成方案)

智能生成志愿方案，支持手动调整学校顺序，实时分析梯度分布和方案风险评估。

### 设置页面
![设置](https://via.placeholder.com/800x450/667eea/ffffff?text=⚙️+设置+-+API+Key配置)

配置 AI 助手的 API Key（支持 DeepSeek / 硅基流动），Key 安全存储在后端服务器。

> 📌 完整设计稿可查看 [`docs/mockups/new-features-design.html`](docs/mockups/new-features-design.html)

---

## ✨ 核心功能

| 功能模块 | 说明 |
|---------|------|
| 📊 **分数找学校** | 输入分数+省份，按冲刺/稳妥/保底三档推荐院校，含录取概率计算 |
| 🏫 **学校详情** | 学校信息、各省录取分、各专业录取概率分析 |
| 🎯 **专业浏览** | 8 大学科分类浏览 25 个专业 |
| 📖 **专业详情** | 课程设置、就业方向、适合人群画像 |
| 📝 **兴趣测试** | 8 道选择题，统计兴趣标签，推荐匹配度最高的专业 |
| 🤖 **AI 志愿助手** | 对话式 AI 问答，解答志愿填报疑问 |
| 📋 **志愿填报模拟** | 智能生成方案、手动调整、梯度分析、风险评估 |
| ⚙️ **设置** | API Key 管理（后端存储，安全可靠） |

---

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| **前端框架** | Vue 3 (Composition API + `<script setup>`) |
| **语言** | TypeScript |
| **构建工具** | Vite 5 |
| **样式** | Tailwind CSS + 自定义动画 |
| **路由** | vue-router 4 |
| **后端** | Express.js (Node.js) |
| **AI 集成** | DeepSeek API / 硅基流动 API |
| **环境变量** | dotenv（安全存储 API Key） |

---

## 📂 项目结构

```
college_preference/
├── src/
│   ├── api/              # 前端 API 请求
│   │   ├── schoolApi.ts  # 学校相关接口
│   │   ├── majorApi.ts   # 专业相关接口
│   │   └── provinceApi.ts# 省份相关接口
│   ├── components/       # 公共 UI 组件
│   │   ├── SchoolCard.vue# 学校卡片（含录取概率）
│   │   ├── MajorCard.vue # 专业卡片
│   │   └── ProgressBar.vue# 进度条组件
│   ├── composables/      # 可复用状态逻辑
│   │   ├── useSchoolMatch.ts # 学校匹配逻辑
│   │   ├── useQuiz.ts    # 兴趣测试逻辑
│   │   └── useTheme.ts   # 主题切换
│   ├── data/             # 模拟数据
│   │   ├── schools.ts    # 25 所高校数据
│   │   ├── majors.ts     # 25 个专业数据
│   │   ├── provinces.ts  # 31 个省份数据
│   │   └── quizQuestions.ts # 8 道测试题
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── lib/              # 通用工具（cn）
│   ├── views/            # 10 个页面组件
│   ├── router/           # 路由配置
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── server/               # Express 后端
│   ├── routes/           # API 路由
│   │   ├── schools.js    # 学校匹配 API
│   │   ├── majors.js     # 专业 API
│   │   ├── provinces.js  # 省份 API
│   │   └── chat.js       # AI 对话 API
│   ├── data/             # 后端模拟数据
│   ├── .env              # API Key 配置（不提交 Git）
│   └── index.js          # 服务入口
├── docs/
│   ├── mockups/          # 界面设计稿
│   └── superpowers/      # 功能设计文档
├── 启动应用_无窗口版.vbs  # 一键启动脚本（无窗口）
├── 启动应用.bat           # 一键启动脚本（有窗口）
└── vite.config.ts        # Vite 配置
```

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server && npm install
```

### 配置 API Key（AI 功能）

编辑 `server/.env` 文件，填入你的 API Key：

```env
# DeepSeek API Key（在 https://platform.deepseek.com 获取）
DEEPSEEK_API_KEY=sk-你的deepseek密钥

# 硅基流动 API Key（在 https://siliconflow.cn 获取）
SILICONFLOW_API_KEY=sk-你的硅基流动密钥
```

> 🔒 API Key 仅存储在后端服务器，前端不接触密钥，安全可靠。

### 启动应用

**方式一：双击启动（推荐）**

双击 `启动应用_无窗口版.vbs` 或 `启动应用.bat`，自动启动前后端服务并打开浏览器。

**方式二：命令行启动**

```bash
# 启动后端（终端 1）
cd server && npm start

# 启动前端（终端 2）
npm run dev
```

访问 `http://localhost:5173` 即可使用。

---

## 🧠 核心算法

### 学校匹配算法

根据考生分数与学校录取分的**差值**计算录取概率：

| 分数差值 | 档次 | 录取概率 |
|---------|------|---------|
| 高于学校分 40+ | 🛡️ 保底 | 95% |
| 高于学校分 20~40 | 🛡️ 保底 | 85% |
| 高于学校分 10~20 | ✅ 稳妥 | 70% |
| 高于学校分 0~10 | ✅ 稳妥 | 55% |
| 低于学校分 0~5 | 🔥 冲刺 | 35% |
| 低于学校分 5~10 | 🔥 冲刺 | 20% |
| 低于学校分 10~15 | 🔥 冲刺 | 10% |
| 低于学校分 15~20 | 🔥 冲刺 | 5% |
| 低于学校分 20+ | — | 2% |

### 兴趣测试算法

1. 8 道题每题选 A/B/C/D，每个选项对应 1-2 个兴趣标签
2. 统计 8 个标签的总得分，取 Top 3 标签
3. 计算每个专业标签与 Top 3 标签的交集匹配度
4. 按匹配度降序展示 Top 5 推荐专业

### 志愿风险评估

根据志愿列表中冲刺/稳妥/保底的比例，自动评估方案风险等级：

| 条件 | 风险等级 |
|------|---------|
| 无保底院校 | 🔴 高风险 |
| 冲刺院校 > 50% | 🟠 较高风险 |
| 冲刺≥2 + 稳妥≥3 + 保底≥1 | 🟢 合理 |
| 其他 | 🟡 较低风险 |

---

## 🌐 路由一览

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 功能入口 |
| `/find-school` | 分数找学校 | 输入分数匹配院校 |
| `/school/:id` | 学校详情 | 学校信息+专业分析 |
| `/choose-major` | 专业浏览 | 分类浏览+测试入口 |
| `/major/:id` | 专业详情 | 课程/就业/适合人群 |
| `/quiz` | 兴趣测试 | 8 道题答题 |
| `/quiz/result` | 测试结果 | 推荐专业展示 |
| `/ai-chat` | AI 志愿助手 | 智能问答 |
| `/volunteer-plan` | 志愿填报模拟 | 方案生成+风险评估 |
| `/settings` | 设置 | API Key 配置 |

---

## 📊 数据说明

- 当前使用**模拟数据**，非真实录取分数线
- 包含 25 所高校（覆盖 985/211/双一流）
- 包含 25 个专业（覆盖 8 大学科门类）
- 支持 31 个省份（含高考模式信息）
- 省份分数系数仅作演示参考

---

## 🔒 安全说明

- API Key 通过 `dotenv` 配置在 `server/.env` 文件中
- 前端**不接触** API Key，避免浏览器泄露风险
- `.env` 文件已加入 `.gitignore`，不会提交到 Git
- 支持 DeepSeek 和硅基流动两种 AI 提供商

---

## 📝 开发计划

- [x] 分数找学校（含录取概率）
- [x] 专业分类浏览
- [x] 兴趣测试
- [x] AI 志愿助手
- [x] 志愿填报模拟
- [x] 多省份支持
- [x] API Key 安全存储
- [ ] 历年分数线查询
- [ ] 学校/专业对比功能
- [ ] 真实数据接入

---

## 📄 许可证

MIT License

---

<p align="center">
  <strong>高考志愿填报助手 · 助你开启美好未来 ✨</strong>
  <br>
  <sub>数据仅供参考，请以官方发布为准</sub>
</p>