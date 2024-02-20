import router from './router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false }) // 进度条

router.beforeEach(async (to, from, next) => {
  console.log('进入进度条')
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})
