import request from '@/utils/request/request'
/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data) {
  return request({
    url: '/api/v1/auth/login',
    method: 'post',
    params: data,
  })
}
