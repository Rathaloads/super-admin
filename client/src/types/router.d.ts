import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题，由 MainLayout 读取展示 */
    title?: string;
    /** 是否需要登录 */
    requiresAuth?: boolean;
    /** 公开页面（如登录页） */
    public?: boolean;
  }
}
