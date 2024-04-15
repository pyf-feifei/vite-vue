//录制方法二：可以用RecordRTC的官方提供的分片方法，但是有个问题要解决(在除了第一个分片外的其他分片都加上一个头其他就能正常用了)

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
   * 是否有某些设备
   */
  static isHasDevice(key = 'videoinput') {
    if (key === 'video') {
      key = 'videoinput'
    } else if (key === 'audio') {
      key = 'audioinput'
    }
    return navigator.mediaDevices.enumerateDevices().then(
      (devices) => {
        const microphones = devices.filter((device) => device.kind === key)
        if (microphones.length > 0) {
          console.log('找到麦克风设备', microphones)
          return true
        } else {
          console.log('未找到麦克风设备')
          return false
        }
      },
      (err) => {
        console.error(err)
        ElMessage.error('检测是否有设备失败！！')
        return false
      }
    )
  }

  /**
   * 是否有某些设备
   */
  static isHasDevicePermission(key = 'video') {
    const param = {}
    if (key) {
      param[key] = true
    }
    return navigator.mediaDevices.getUserMedia(param).then(
      (stream) => {
        // 注意：记得停止使用媒体流
        stream.getTracks().forEach((track) => track.stop())
        return true
      },
      (err) => {
        console.error(err)
        ElMessage.error('测试设备失败！！')
        return false
      }
    )
  }

  /**
   * 某些设备是否可使用
   */
  static hasDevice(keyList = ['videoinput', 'audioinput']) {
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      const resList = keyList.map((e) => false)
      keyList.forEach((key, index) => {
        const microphones = devices.filter(
          (device) => device.kind === 'audioinput'
        )
        if (microphones.length > 0) {
          console.log('找到麦克风设备', microphones)
          resList[index] = true
        } else {
          console.log('未找到麦克风设备')
          resList[index] = false
        }
      })

      return resList
    })
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
    this.startMediaRecorderParams = {
      interval: 5000,
      fileName: '',
      recorderMimeType: 'video/mp4',
      onMonitorRecording: null,
      ...params,
    }
    if (typeof this.startMediaRecorderParams.onMonitorRecording !== 'function')
      throw Error('必须传入录制视频回调函数!!')
    this.startMediaRecorderParams.fileName =
      this.startMediaRecorderParams.fileName ||
      `${createMd5Id()}${moment().format('YYYYMMDD_HHmmss')}_`
    if (this.mediaRecorder) {
      ElMessage.warning('录制中！')
      return
    }
    this.startMediaRecorderParams.mimeTypeSuffix =
      this.startMediaRecorderParams.recorderMimeType.match(/[^/]+?(?=;|$)/)[0]
    this.startMediaRecorderParams.prefix =
      this.startMediaRecorderParams.recorderMimeType.split('/')[0]
    this.startMediaRecorderParams.blobCount = 0
    this.mediaRecorder = RecordRTC(this.stream, {
      type: this.startMediaRecorderParams.prefix,
      mimeType: `${this.startMediaRecorderParams.recorderMimeType}`,
      bitsPerSecond: 5000000,
    })
    this.mediaRecorder?.startRecording()
    setTimeout(
      this.completeRecordingCallback,
      this.startMediaRecorderParams.interval
    )
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
    // this.mediaRecorder.stopRecording()
    this.wipeOffRecordingTime()
    this.completeRecordingCallback().then(() => {
      this.mediaRecorder = null
    })
  }
  /**
   * 完成录制回调
   */
  completeRecordingCallback = () => {
    return new Promise((resolve, reject) => {
      this.mediaRecorder?.stopRecording(() => {
        this.startMediaRecorderParams.blobCount++
        let blobget = this.mediaRecorder.getBlob()
        let blob = new Blob([blobget], {
          type: `${this.startMediaRecorderParams.prefix}/${this.startMediaRecorderParams.mimeTypeSuffix}`,
        })
        let everyFileName = `${
          this.startMediaRecorderParams.fileName
        }${this.startMediaRecorderParams.blobCount
          .toString()
          .padStart(4, '0')}.${this.startMediaRecorderParams.mimeTypeSuffix}`
        // 处理录制得到的数据
        const recordedFile = new File([blob], everyFileName, {
          type: this.startMediaRecorderParams.recorderMimeType,
        })
        this.startMediaRecorderParams.onMonitorRecording &&
          this.startMediaRecorderParams.onMonitorRecording({
            file: recordedFile,
            fileName: this.startMediaRecorderParams.fileName,
            completeRecordingStatus: this.recordingTimerIntervalId
              ? false
              : true,
          })
        if (this.recordingTimerIntervalId) {
          this.mediaRecorder?.startRecording()
          setTimeout(
            this.completeRecordingCallback,
            this.startMediaRecorderParams.interval
          )
        } else {
          resolve()
        }
      }) // 停止录制
    })
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
    this.recordingTimerIntervalId = null
  }
}
