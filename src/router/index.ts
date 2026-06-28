import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/find-school',
    name: 'find-school',
    component: () => import('@/views/FindSchool.vue'),
  },
  {
    path: '/school/:id',
    name: 'school-detail',
    component: () => import('@/views/SchoolDetail.vue'),
  },
  {
    path: '/choose-major',
    name: 'choose-major',
    component: () => import('@/views/ChooseMajor.vue'),
  },
  {
    path: '/major/:id',
    name: 'major-detail',
    component: () => import('@/views/MajorDetail.vue'),
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('@/views/QuizPage.vue'),
  },
  {
    path: '/quiz/result',
    name: 'quiz-result',
    component: () => import('@/views/QuizResult.vue'),
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
