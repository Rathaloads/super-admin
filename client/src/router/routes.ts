import { type RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', public: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/home',
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { title: '首页', requiresAuth: true },
      },
      {
        path: 'financial',
        name: 'financial',
        component: () => import('@/views/financial/index.vue'),
        meta: { title: '财务管理', requiresAuth: true },
        redirect: '/financial/found',
        children: [
          {
            path: 'found',
            name: 'found',
            component: () => import('@/views/financial/FoundView.vue'),
            meta: { title: '流水管理', requiresAuth: true },
          },
          {
            path: 'liabilities',
            name: 'liabilities',
            component: () => import('@/views/financial/LiabilitiesView.vue'),
            meta: { title: '负债管理', requiresAuth: true },
          },
        ],
      },
    ],
  },
]