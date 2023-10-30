import router from './router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false }) // 进度条

router.beforeEach(async (to, from, next) => {
  console.log('进入这了')
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})
