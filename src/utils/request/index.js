import { ElLoading, ElMessage } from 'element-plus'
import request from './request'
/**
 * 遮罩管理，多次调用支持引用计数
 */
class LoadingManager {
  constructor(options) {
    this.options = options
    this.refCount = 0
    this.loading = undefined
  }

  showMask() {
    this.refCount++

    if (!this.loading && this.refCount <= 1) {
      this.loading = ElLoading.service(this.options)
    }
  }

  hideMask() {
    this.refCount--
    this.refCount = Math.max(0, this.refCount)
    if (this.refCount < 1) {
      // console.log('hide this.refCount = ', this.refCount, ' ', !!this.loading)
      const loading = this.loading
      loading?.close()
      setTimeout(() => {
        loading?.close()
      }, 2000)

      this.loading = null
    }

    // console.log('hide this.refCount = ', this.refCount)
  }
}
const loadingManager = new LoadingManager({
  fullscreen: true,
  lock: true,
  background: 'rgba(0, 0, 0, 0.1)',
})
/**
 * post请求
 * @param {String} url 请求的url
 * @param {Object} params 请求参数
 * @param {Object} options axios设置项
 * @returns {Promise}
 */
const fetchPost = function (url, params, options) {
  if (options == null) return {}
  const tempOptions = {
    ...options,
    method: 'post',
    url: url,
    data: params,
  }

  return request(tempOptions)
}
/**
 * get请求
 * @param {String} url 请求的url
 * @param {Object} params 请求参数
 * @param {Object} options axios设置项
 * @returns {Promise}
 */
const fetchGet = function (url, params, options) {
  if (options == null) return {}
  const tempOptions = {
    ...options,
    method: 'get',
    url: url,
    params,
  }
  return request(tempOptions)
}
// url调用节流Set
const ajaxThrottleSet = new Set()
/**
 * 数据请求
 * @param {String} url 请求的url
 * @param {String} type 请求类型 (get，post)
 * @param {Object} params 请求参数
 * @param {Object} axiosOption axios设置
 * @param {Object} options 显示设置
 */
const doUrl = function (url, type, params, axiosOption, options) {
  options = Object.assign({}, merge({}, globalConfig.httpOption, options))
  axiosOption = merge({}, globalConfig.axiosOption, axiosOption)
  if (type == null || type === '') type = 'post'
  if (ajaxThrottleSet.has(url) && options.throttleFlag) {
    return Promise.resolve()
  } else {
    if (options.throttleFlag) {
      ajaxThrottleSet.add(url)
      setTimeout(() => {
        ajaxThrottleSet.delete(url)
      }, options.throttleTimeout || 50)
    }
    return new Promise((resolve, reject) => {
      // console.log('options.showMask: ', options.showMask)
      if (options.showMask) loadingManager.showMask()
      let ajaxCall = null
      if (type.toLowerCase() === 'get') {
        ajaxCall = fetchGet(url, params, axiosOption)
      } else if (type.toLowerCase() === 'post') {
        ajaxCall = fetchPost(url, params, axiosOption)
      }

      if (ajaxCall != null) {
        ajaxCall
          .then(
            (res) => {
              // console.log('res: ', res)
              if (options.showMask) loadingManager.hideMask()
              if (res.data?.success || res.data.message === 'success') {
                resolve(res.data)
              } else {
                // console.log('数据请求失败: ', res)
                if (options.showError) {
                  ElMessage.error({
                    showClose: true,
                    message: res.data.errorMessage
                      ? res.data.errorMessage
                      : '数据请求失败',
                  })
                }
                reject(res.data)
              }
            },
            (e) => {
              if (options.showMask) loadingManager.hideMask()
              console.log(url)
              console.dir(e)
              return Promise.reject(e)
            }
          )
          .catch((e) => {
            if (options.showError) {
              // console.log('e:', e)
              console.dir(e)
              ElMessage.error({
                showClose: true,
                message: e.errorMessage ? e.errorMessage : '网络请求错误',
              })
            }
            reject(e)
          })
      } else {
        if (options.showMask) loadingManager.hideMask()
        reject(new Error('错误的请求类型 - ' + type))
      }
    })
  }
}
export default {
  doUrl,
  fetchPost,
  fetchGet,
}
