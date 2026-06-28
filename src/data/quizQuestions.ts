import type { QuizQuestion } from '@/types'

// 兴趣测试题目（8道题，每题4个选项，每个选项对应兴趣标签）
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: '周末的时候，你更喜欢做什么？',
    options: [
      { label: 'A', text: '摆弄电子产品、研究新软件', tags: ['实践型', '逻辑型'] },
      { label: 'B', text: '看书、学习新知识', tags: ['研究型', '逻辑型'] },
      { label: 'C', text: '和朋友聚会、参加社交活动', tags: ['社交型', '管理型'] },
      { label: 'D', text: '画画、玩乐器、看电影', tags: ['艺术型', '创意型'] },
    ],
  },
  {
    id: 2,
    question: '面对一个难题时，你通常会怎么做？',
    options: [
      { label: 'A', text: '动手尝试不同方法，边做边改', tags: ['实践型', '研究型'] },
      { label: 'B', text: '先分析原理，找出根本原因', tags: ['逻辑型', '研究型'] },
      { label: 'C', text: '找别人商量，集思广益', tags: ['社交型', '管理型'] },
      { label: 'D', text: '换个角度想，用创意的方法解决', tags: ['艺术型', '创意型'] },
    ],
  },
  {
    id: 3,
    question: '你更喜欢什么样的工作环境？',
    options: [
      { label: 'A', text: '有工具、有设备，可以动手操作', tags: ['实践型', '工科'] },
      { label: 'B', text: '安静的环境，可以独立思考', tags: ['研究型', '逻辑型'] },
      { label: 'C', text: '热闹的办公室，和团队一起工作', tags: ['社交型', '管理型'] },
      { label: 'D', text: '自由的空间，可以发挥创意', tags: ['艺术型', '创意型'] },
    ],
  },
  {
    id: 4,
    question: '以下哪类节目你更感兴趣？',
    options: [
      { label: 'A', text: '科技发明、机械制造类', tags: ['实践型', '工科'] },
      { label: 'B', text: '科普纪录片、历史人文类', tags: ['研究型', '逻辑型'] },
      { label: 'C', text: '访谈节目、真人秀、综艺', tags: ['社交型', '管理型'] },
      { label: 'D', text: '音乐、美术、设计类', tags: ['艺术型', '创意型'] },
    ],
  },
  {
    id: 5,
    question: '在一个团队项目中，你通常扮演什么角色？',
    options: [
      { label: 'A', text: '技术担当，负责解决具体问题', tags: ['实践型', '逻辑型'] },
      { label: 'B', text: '出谋划策，提供想法和方案', tags: ['研究型', '创意型'] },
      { label: 'C', text: '组织协调，推动大家前进', tags: ['管理型', '社交型'] },
      { label: 'D', text: '设计创意，负责外观和体验', tags: ['艺术型', '创意型'] },
    ],
  },
  {
    id: 6,
    question: '你更看重一份工作的什么？',
    options: [
      { label: 'A', text: '能学到技术，有一技之长', tags: ['实践型', '工科'] },
      { label: 'B', text: '能探索未知，不断学习新知识', tags: ['研究型', '逻辑型'] },
      { label: 'C', text: '能认识更多人，有上升空间', tags: ['社交型', '管理型'] },
      { label: 'D', text: '能发挥创意，做有趣的事', tags: ['艺术型', '创意型'] },
    ],
  },
  {
    id: 7,
    question: '以下哪种描述更接近你？',
    options: [
      { label: 'A', text: '手很巧，喜欢做手工、拆东西', tags: ['实践型', '工科'] },
      { label: 'B', text: '喜欢问为什么，爱琢磨原理', tags: ['研究型', '逻辑型'] },
      { label: 'C', text: '朋友多，善于说服别人', tags: ['社交型', '管理型'] },
      { label: 'D', text: '想象力丰富，审美品味好', tags: ['艺术型', '创意型'] },
    ],
  },
  {
    id: 8,
    question: '如果可以选择，你最想尝试什么？',
    options: [
      { label: 'A', text: '做一个机器人/开发一个软件', tags: ['实践型', '逻辑型'] },
      { label: 'B', text: '做一项科学研究/写一本书', tags: ['研究型', '逻辑型'] },
      { label: 'C', text: '创办一家公司/领导一个团队', tags: ['管理型', '社交型'] },
      { label: 'D', text: '办一场展览/创作一件艺术品', tags: ['艺术型', '创意型'] },
    ],
  },
]

export default quizQuestions
