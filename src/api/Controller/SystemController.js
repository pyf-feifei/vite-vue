import sender from '@/utils/request/index'
export default class SystemController {
  static login(params, axiosOption, httpOption) {
    return sender.doUrl(
      'admin/upms/login/doLogin',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }
}
