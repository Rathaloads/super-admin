import { createRouter, createWebHashHistory } from 'vue-router';
// import { useAuthStore } from '@/stores/auth';
import { routes } from './routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// router.beforeEach((to) => {
//   const authStore = useAuthStore();

//   if (to.meta.public && authStore.isLoggedIn) {
//     return { path: '/home' };
//   }

//   if (to.meta.requiresAuth && !authStore.isLoggedIn) {
//     return { path: '/login', query: { redirect: to.fullPath } };
//   }
// });

export default router;
