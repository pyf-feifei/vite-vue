import axios from 'axios'
import dialog from '@/utils/dialog/Dialog'
import userStore from '@/store/modules/user'
import JSONbig from 'json-bigint'
const JSONbigString = new JSONbig({ storeAsString: true })

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  transformResponse: [
    function (data) {
      if (typeof data === 'string') {
        return JSONbigString.parse(data)
      } else {
        return data
      }
    },
  ],
})
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log('response', response)
    if (response.data && response.data.errorCode === 'UNAUTHORIZED_LOGIN') {
      // 401, token失效
      dialog.closeAll()
      userStore.logout()
    } else {
      if (response.headers['refreshedtoken'] != null) {
        userStore.setToken(response.headers['refreshedtoken'])
      }
    }
    return response
  },
  (error) => {
    console.log('error', error)
    const response = error.response
    if (response && response.data) {
      if (response.data.errorCode === 'UNAUTHORIZED_LOGIN') {
        dialog.closeAll()
        userStore.logout()
      }
      return Promise.reject(response.data)
    } else {
      return Promise.reject(new Error('数据获取失败，请稍后再试'))
    }
  }
)

// 导出 axios 实例
export default service
