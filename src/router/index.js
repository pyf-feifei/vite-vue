import { createRouter, createWebHistory } from 'vue-router'
export const Layout = () => import('@/layout/index.vue')
export const constantRoutes = [
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/login',
  // },
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    meta: { hidden: true },
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true },
  },
  {
    path: '/',
    name: '/',
    component: Layout,
    meta: {
      title: '首页',
    },
    redirect: {
      name: 'dashboard',
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'dashboard',
        meta: {
          title: 'dashboard',
          icon: 'homepage',
          affix: true,
          keepAlive: true,
          alwaysShow: false,
        },
      },
      {
        path: 'home',
        component: () => import('@/views/home/index.vue'),
        name: 'home',
        meta: {
          title: 'home',
          icon: 'homepage',
          keepAlive: true,
          alwaysShow: false,
        },
      },
      {
        path: 'test',
        component: () => import('@/views/test/index.vue'),
        name: 'test',
        meta: {
          title: 'test',
          icon: 'homepage',
          keepAlive: true,
          alwaysShow: false,
        },
      },
    ],
  },
  {
    path: '/test',
    name: '/test',
    component: Layout,
    meta: {
      title: 'test',
    },
    children: [
      {
        path: 'testhome',
        component: () => import('@/views/home/index.vue'),
        name: 'testhome',
        meta: {
          title: 'test',
          icon: 'homepage',
          keepAlive: true,
          alwaysShow: false,
        },
      },
    ],
  },
  {
    path: '/iframe',
    name: '/iframe',
    component: Layout,
    meta: {
      title: 'iframe',
    },
    children: [
      {
        path: 'iframe',
        component: () => import('@/views/iframe/index.vue'),
        name: 'iframe',
        meta: {
          title: 'iframe',
          icon: 'homepage',
          keepAlive: true,
          alwaysShow: false,
        },
      },
    ],
  },
  {
    path: '/test/test',
    name: 'testtest',
    component: () => import('@/views/test/index.vue'),
    meta: { hidden: true },
    //我事先在src下面创建了一个view文件夹，在view文件下面创建了home.vue文件
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
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
