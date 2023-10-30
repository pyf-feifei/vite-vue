import { defineStore } from 'pinia'
import { loginApi } from '@/api/auth'
const useUserStore = defineStore('user', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断出它们的类型,
      token: '',
    }
  },
  getters: {},
  actions: {
    login(loginData) {
      return new Promise((resolve, reject) => {
        loginApi(loginData)
          .then((response) => {
            const { tokenType, accessToken } = response.data
            token = tokenType + ' ' + accessToken // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
})
export default useUserStore
