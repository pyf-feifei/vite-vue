import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    //我事先在src下面创建了一个view文件夹，在view文件下面创建了home.vue文件
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/index.vue'),
    //我事先在src下面创建了一个view文件夹，在view文件下面创建了home.vue文件
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: '/login' })
  location.reload()
}
export default router
