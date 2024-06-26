import { defineStore } from 'pinia'
import { loginApi } from '@/api/auth'
import { SystemController } from '@/api'
import { encrypt } from '@/utils/index'
const userInfo = useStorage('userInfo', {}, localStorage, {
  mergeDefaults: true,
})
userInfo.value =
  Object.keys(userInfo.value).length === 0 ? null : userInfo.value //解决useStorage存对象不同步的问题
const useUserStore = defineStore('user', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断出它们的类型,
      token: useStorage('token', ''),
      userInfo: userInfo,
    }
  },
  getters: {},
  actions: {
    login(loginData) {
      return new Promise((resolve, reject) => {
        SystemController.login({
          ...loginData,
          password: encrypt(loginData.password),
        })
          .then((res) => {
            this.token = res.data.tokenData
            this.userInfo = res.data
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    reset() {
      this.token = ''
      this.userInfo = ''
    },
    setToken(data) {
      this.token = data
    },
    logout() {
      if (this.token) {
        return SystemController.logout().then(() => {
          this.reset()
        })
      }
    },
  },
})
export default useUserStore()
