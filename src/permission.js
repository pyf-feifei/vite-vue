import router from './router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false }) // 进度条

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 未匹配到任何路由，跳转404
  console.log('进入进度条', to.matched.length, from.name, to.name)
  if (to.matched.length === 0) {
    console.log('from.name', from.name)
    from.name ? next({ name: from.name }) : next('/404')
  } else {
    next()
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})
