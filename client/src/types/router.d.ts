import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题，由 MainLayout 读取展示 */
    title?: string
  }
}
