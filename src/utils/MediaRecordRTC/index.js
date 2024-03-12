import { ref } from 'vue'
import moment from 'moment'
import { createMd5Id } from '@/core/js/$'
import { ElMessage } from 'element-plus'
import RecordRTC from 'recordrtc'

export default class MediaRecording {
  constructor({ videoDom = null }) {
    if (!(videoDom instanceof Element)) throw Error('必须传入videoDom元素!!')
    //
    this.videoDom = videoDom //录像播放dom
    this.stream = null //摄像头stream
    this.mediaRecorder = null //录制对象
    //
    this.recordingTimerIntervalId = null //录制中字样interval
  }
  /**
   * 获取用户有无视频和音频录制权限
   */
  static async permissionToView() {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(function (stream) {
          // 用户已授予视频和音频录制权限
          console.log('用户已授予视频和音频录制权限')
          resolve(true)
        })
        .catch(function (error) {
          // 用户拒绝或未授予视频和音频录制权限
          console.error('用户未授予视频和音频录制权限')
          resolve(false)
        })
    })
  }
  /**
   * 开启摄像头
   * @param {*} mediaOption
   */
  getMedia(mediaOption = { video: true, audio: true }) {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        mediaOption,
        (stream) => {
          this.stream = stream
          video.srcObject = this.stream
          video.onloadedmetadata = function (e) {
            video.play()
          }
        },
        (err) => {
          alert(err)
        }
      )
    }
    // this.setTimerSend()
  }
  /**
   * 关闭摄像头
   */
  closeMedia() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tracks = this.stream.getTracks()
        // 关闭每一个轨道
        tracks.forEach((track) => {
          track.stop()
        })
        this.stream = null //摄像头stream
        this.mediaRecorder = null
        this.wipeOffRecordingTime()
        resolve()
      }, 100)
    })
  }
  /**
   * 开启录制
   * @param {*} params
   * @returns {Object}
   * @returns {Blob} return.file - 录制得到的文件对象
   * @returns {string} return.fileName - 文件名称
   * @returns {boolean} return.completeRecordingStatus - 录制状态,true为完成
   */
  startMediaRecorder(params) {
    let startMediaRecorderParams = {
      interval: 5000,
      fileName: '',
      recorderMimeType: 'video/mp4',
      onMonitorRecording: null,
      ...params,
    }
    if (typeof onMonitorRecording !== 'function')
      throw Error('必须传入录制视频回调函数!!')
    startMediaRecorderParams.fileName =
      startMediaRecorderParams.fileName ||
      `${createMd5Id()}${moment().format('YYYYMMDD_HHmmss')}_`
    let mimeTypeSuffix =
      startMediaRecorderParams.recorderMimeType.match(/[^/]+$/)[0]
    let blobCount = 0
    console.log('startMediaRecorderParams', startMediaRecorderParams)
    this.mediaRecorder = RecordRTC(this.stream, {
      type: 'video',
      mimeType: startMediaRecorderParams.recorderMimeType,
      timeSlice: startMediaRecorderParams.interval,
      //该回调函数必须和上面的timeSlice分片时间配合使用
      ondataavailable: (blob) => {
        // blob为每一秒的视频片段
        blobCount++
        let everyFileName = `${startMediaRecorderParams.fileName}${blobCount
          .toString()
          .padStart(4, '0')}.${mimeTypeSuffix}`
        // 处理录制得到的数据
        const recordedFile = new File([blob], everyFileName, {
          type: startMediaRecorderParams.recorderMimeType,
        })
        startMediaRecorderParams.onMonitorRecording &&
          startMediaRecorderParams.onMonitorRecording({
            file: recordedFile,
            fileName: startMediaRecorderParams.fileName,
            completeRecordingStatus:
              this.mediaRecorder?.getState() == 'stopped',
          })
      },
      bitsPerSecond: 128000,
    })
    this.mediaRecorder?.startRecording()
    this.setRecordingTime()
  }
  // /**
  //  * 暂停录制
  //  */
  // pauseRecording() {
  //   this.mediaRecorder?.pause()
  //   ElMessage.success('暂停录制成功')
  // }
  /**
  //  * 恢复录制
  //  */
  // resumeRecording() {
  //   this.mediaRecorder?.resume()
  //   ElMessage.success('恢复录制成功')
  // }
  /**
   * 完成录制
   */
  completeRecording() {
    this.mediaRecorder.stopRecording()
    this.wipeOffRecordingTime()
  }
  /**
   * 下载文件
   * @param {*} file
   */
  downloadFile(file) {
    const url = URL.createObjectURL(file)
    // 创建一个下载链接
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    a.href = url
    a.download = file.name
    a.click()
    // 清理
    window.URL.revokeObjectURL(url)
  }

  /**
   * 开启录制中字样显示
   */
  setRecordingTime() {
    const parentDom = this.videoDom.parentElement
    // 添加一个wrapper元素
    const wrapper = document.createElement('div')

    wrapper.classList.add('video-parent')
    // 设置同等宽高
    wrapper.style.width = `${this.videoDom.offsetWidth}px`
    wrapper.style.height = `${this.videoDom.offsetHeight}px`
    // 设置相对定位
    wrapper.style.position = 'relative'
    // 替换元素
    parentDom.replaceChild(wrapper, this.videoDom)
    // 将video移动到wrapper里
    wrapper.appendChild(this.videoDom)
    // 首先定义 CSS 变量
    wrapper.style.setProperty('--video-parent-before-content', '"⦿录制中"') // 注意字符串值的外层引号
    // wrapper.offsetWidth
    const style = document.createElement('style')
    style.innerHTML = `.video-parent::before {
      content: var(--video-parent-before-content); /* 使用 CSS 变量 */
      display: block;
      position: absolute;
      right: 1px;
      top: 1px;
      color: red;
      padding: 2px 4px;
      position: absolute;
      right: 0px;
      border: 1px solid red;
    }`
    document.head.appendChild(style)

    //添加录制时间
    let recordingTime = 0
    const updateTimer = () => {
      recordingTime++
      const minutes = Math.floor(recordingTime / 60)
      const seconds = recordingTime % 60
      let content = `"⦿录制中 (${minutes}:${seconds
        .toString()
        .padStart(2, '0')})"`
      wrapper.style.setProperty('--video-parent-before-content', content)
      // 强制重绘更新变量
      wrapper.offsetWidth
    }
    this.recordingTimerIntervalId = setInterval(() => {
      updateTimer()
    }, 1000)
  }
  /**
   * 关闭录制中字样显示
   */
  wipeOffRecordingTime() {
    const parentDom = this.videoDom.parentElement
    let parentDomIsAdd = parentDom.classList.contains('video-parent')
    if (parentDomIsAdd) {
      const oldParentDom = parentDom.parentElement
      // 替换元素
      oldParentDom.replaceChild(this.videoDom, parentDom)
      // 删除wrapper
      parentDom?.remove()
      const styles = parentDom.style
      styles.cssText = ''
      // // 恢复video父元素
      // oldParentDom.appendChild(this.videoDom)
    }
    clearInterval(this.recordingTimerIntervalId)
  }
}
