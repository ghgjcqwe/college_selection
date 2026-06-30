# 🎓 高考志愿填报助手

> 智能推荐 · 精准匹配 · 科学决策 — 让每一分都物尽其用

一个基于 **Vue 3 + TypeScript + Express + SQLite** 的全栈 Web 应用，帮助高考考生根据分数匹配学校、探索专业方向、进行兴趣测试，并通过 AI 助手解答志愿填报疑问。

---

## ✨ 核心功能

| 功能模块 | 说明 |
|---------|------|
| 📊 **分数找学校** | 输入分数+省份，按冲刺/稳妥/保底三档推荐院校，含录取概率计算 |
| 🏫 **学校详情** | 学校信息、各省录取分、历年分数线趋势图、各专业录取概率分析 |
| 🎯 **专业浏览** | 8 大学科分类浏览 25 个专业 |
| 📖 **专业详情** | 课程设置、就业方向、适合人群画像 |
| 📝 **兴趣测试** | 8 道选择题，统计兴趣标签，推荐匹配度最高的专业 |
| 🤖 **AI 志愿助手** | 对话式 AI 问答，侧边悬浮图标随时唤起，支持 Agnes/DeepSeek/硅基流动 |
| 📋 **志愿填报模拟** | 智能生成方案、手动调整、梯度分析、风险评估 |
| 📈 **历年分数线** | 学校历年录取分数线表格 + 趋势折线图 |
| 🕷️ **数据爬虫** | 自动从教育考试院网站采集真实分数线数据（支持OCR识别） |
| ⚙️ **设置** | API Key 管理（后端存储，安全可靠） |

---

## 🎨 设计风格

- **主色**：科技蓝 (#2563EB / #3B82F6) — 代表理性与信赖
- **辅助色**：暖橙 (#F97316) 冲刺标签；翠绿 (#10B981) 保底标签
- **背景**：极浅蓝灰 (#F8FAFC) — 干净通透
- **质感**：毛玻璃效果（Glassmorphism）用于导航栏和浮动卡片
- **微交互**：列表渐入动画、收藏按钮弹跳反馈

---

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| **前端框架** | Vue 3 (Composition API + `<script setup>`) |
| **语言** | TypeScript |
| **构建工具** | Vite 5 |
| **样式** | Tailwind CSS + 自定义动画 + 毛玻璃效果 |
| **路由** | vue-router 4 |
| **后端** | Express.js (Node.js) |
| **数据库** | SQLite (sqlite3) |
| **爬虫** | axios + cheerio + tesseract.js (OCR) |
| **AI 集成** | Agnes / DeepSeek / 硅基流动 |
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
│   │   ├── AiAssistant.vue # 侧边悬浮AI助手
│   │   ├── SchoolCard.vue# 学校卡片（含录取概率）
│   │   ├── MajorCard.vue # 专业卡片
│   │   └── ProgressBar.vue# 进度条组件
│   ├── composables/      # 可复用状态逻辑
│   │   ├── useSchoolMatch.ts # 学校匹配逻辑
│   │   └── useQuiz.ts    # 兴趣测试逻辑
│   ├── data/             # 静态数据
│   │   ├── schools.ts    # 25 所高校数据
│   │   ├── majors.ts     # 25 个专业数据
│   │   ├── provinces.ts  # 31 个省份数据
│   │   └── quizQuestions.ts # 8 道测试题
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   │   └── apiKeyManager.ts # API Key管理
│   ├── views/            # 10 个页面组件
│   ├── router/           # 路由配置
│   ├── App.vue           # 根组件
│   ├── style.css         # 全局样式+自定义类
│   └── main.ts           # 入口文件
├── server/               # Express 后端
│   ├── db/               # 数据库层
│   │   ├── index.js      # 数据库连接+表创建
│   │   └── queries.js    # 查询函数封装
│   ├── routes/           # API 路由
│   │   ├── schools.js    # 学校匹配 API
│   │   ├── majors.js     # 专业 API
│   │   ├── provinces.js  # 省份 API
│   │   └── chat.js       # AI 对话 API（默认Agnes模型）
│   ├── spider/           # 数据爬虫
│   │   ├── base.js       # 爬虫基类
│   │   ├── hubei.js      # 湖北教育考试院爬虫
│   │   ├── config.js     # 爬虫配置
│   │   ├── utils.js      # 工具函数
│   │   └── index.js      # 爬虫入口
│   ├── data/             # SQLite数据库文件
│   │   └── college.db    # 数据库文件
│   ├── init.js           # 数据库初始化脚本
│   ├── sync_spider_data.js # 爬虫数据同步脚本
│   ├── .env              # API Key 配置（不提交 Git）
│   └── index.js          # 服务入口
├── 启动应用_无窗口版.vbs  # 一键启动脚本（无窗口）
├── 启动应用.bat           # 一键启动脚本（有窗口）
├── tailwind.config.js    # Tailwind 配置
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

### 初始化数据库

```bash
cd server
node init.js
```

### 配置 API Key（AI 功能）

编辑 `server/.env` 文件，填入你的 API Key：

```env
# Agnes API Key（默认已配置免费模型）
AGNES_API_KEY=sk-你的agnes密钥

# DeepSeek API Key（可选）
DEEPSEEK_API_KEY=sk-你的deepseek密钥

# 硅基流动 API Key（可选）
SILICONFLOW_API_KEY=sk-你的硅基流动密钥
```

> 🔒 API Key 仅存储在后端服务器，前端不接触密钥，安全可靠。
>
> 💡 默认已配置 Agnes 平台免费模型，开箱即用。

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

### 数据爬虫（可选）

```bash
# 爬取湖北教育考试院数据
cd server
node spider/index.js crawl hubei

# 同步爬虫数据到系统表
node sync_spider_data.js
```

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
| `/school/:id` | 学校详情 | 学校信息+历年分数线+专业分析 |
| `/choose-major` | 专业浏览 | 分类浏览+测试入口 |
| `/major/:id` | 专业详情 | 课程/就业/适合人群 |
| `/quiz` | 兴趣测试 | 8 道题答题 |
| `/quiz/result` | 测试结果 | 推荐专业展示 |
| `/ai-chat` | AI 志愿助手 | 智能问答（完整页） |
| `/volunteer-plan` | 志愿填报模拟 | 方案生成+风险评估 |
| `/settings` | 设置 | API Key 配置 |

---

## 📊 数据说明

### 数据库表结构

- `provinces` — 省份信息（31个省份，含高考模式）
- `schools` — 学校信息（25所高校，覆盖985/211/双一流）
- `majors` — 专业信息（25个专业，覆盖8大学科）
- `province_scores` — 省份录取分数线
- `major_scores` — 专业录取分数线
- `historical_scores` — 历年分数线（2021-2024）
- `crawl_school_scores` — 爬虫采集的院校投档线
- `crawl_control_lines` — 爬虫采集的控制分数线

### 数据来源

- 湖北省教育考试院（爬虫采集，含OCR识别图片分数线）
- 模拟数据用于其他省份演示
- 数据仅供参考，请以官方发布为准

---

## 🔒 安全说明

- API Key 通过 `dotenv` 配置在 `server/.env` 文件中
- 前端**不接触** API Key，避免浏览器泄露风险
- `.env` 文件已加入 `.gitignore`，不会提交到 Git
- 支持 Agnes、DeepSeek、硅基流动三种 AI 提供商
- 侧边AI助手 API 调用失败时自动回退到内置问答模式

---

## 📝 开发计划

- [x] 分数找学校（含录取概率）
- [x] 专业分类浏览
- [x] 兴趣测试
- [x] AI 志愿助手（侧边悬浮+完整页）
- [x] 志愿填报模拟
- [x] 多省份支持
- [x] API Key 安全存储
- [x] 历年分数线查询（表格+趋势图）
- [x] 真实数据接入（湖北考试院爬虫）
- [x] SQLite数据库
- [x] 科技蓝+毛玻璃界面风格
- [ ] 学校/专业对比功能
- [ ] 更多省份爬虫

---

## 📄 许可证

MIT License

---

<p align="center">
  <strong>高考志愿填报助手 · 助你开启美好未来 ✨</strong>
  <br>
  <sub>数据仅供参考，请以官方发布为准</sub>
</p>