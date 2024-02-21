import { defineStore } from 'pinia'
import { loginApi } from '@/api/auth'
import { SystemController } from '@/api'
import { encrypt } from '@/utils/index'
import { useStorage } from '@vueuse/core'
const useUserStore = defineStore('user', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断出它们的类型,
      token: useStorage('sds_token', ''),
      userInfo: useStorage('userInfo', ''),
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
      this.userInfo = null
    },
    setToken(data) {
      this.token = data
    },
    logout() {
      if (this.token.value) {
        return SystemController.logout().then(() => {
          this.reset()
        })
      }
    },
  },
})
export default useUserStore()
