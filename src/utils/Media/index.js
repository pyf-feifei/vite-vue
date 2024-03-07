import { ref } from 'vue'
import moment from 'moment'
import { createMd5Id } from '@/core/js/$'
import { ElMessage } from 'element-plus'
const CompleteRecordingStatus = {
  NORECORDING: 'noRecording', //未录制
  RECORDING: 'recording', //录制中
  FINISHRECORDING: 'finishRecording', //完成录制
}
//摄像头视频录制
export default class MediaRecording {
  constructor({ videoDom = null, onMonitorRecording = null }) {
    if (!(videoDom instanceof Element)) throw Error('必须传入videoDom元素!!')
    if (typeof onMonitorRecording !== 'function')
      throw Error('必须传入录制视频回调函数!!')
    this.videoDom = videoDom
    this.onMonitorRecording = onMonitorRecording //录制返回回调函数
    this.stream = null //摄像头stream
    this.mediaRecorder = null
    this.recordedChunks = [] //录制视频快数组
    this.fileName = '' //文件下载名名
    this.recordingTimerIntervalId = null //录制中循环IntervalId
    this.startMediaRecorderParams = null //录制时间间隔配置

    Object.defineProperty(this, 'completeRecordingStatus', {
      writable: true,
      enumerable: true,
      configurable: true,
    })
    this.completeRecordingStatus = CompleteRecordingStatus.NORECORDING //完成录制标识
  }
  set completeRecordingStatus(status) {
    if (!Object.values(RecordingStatus).includes(status)) {
      throw new Error('completeRecordingStatus必须是枚举中的值')
    }
    this._completeRecordingStatus = status
  }

  get completeRecordingStatus() {
    return this._completeRecordingStatus
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
          this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm',
          })
          this.stream = stream
          // 当数据可用时，将视频块添加到 recordedChunks 数组中
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data)
            }
          }
          // 在 `onstop` 事件中重新开始录制，以实现循环录制
          this.mediaRecorder.onstop = (event) => {
            if (this.recordedChunks.length) {
              let everyFileName = `${this.fileName}${this.recordedChunks.length
                .toString()
                .padStart(4, '0')}.webm`
              // 处理录制得到的数据
              const recordedFile = new File(
                [this.recordedChunks[this.recordedChunks.length - 1]],
                everyFileName,
                {
                  type: 'video/webm',
                }
              )
              // this.downloadFile(recordedFile)
              this.onMonitorRecording && this.onMonitorRecording(recordedFile)
              if (
                this.mediaRecorder.state === 'inactive' &&
                this.recordingTimerIntervalId &&
                this.completeRecordingStatus ===
                  CompleteRecordingStatus.FINISHRECORDING
              ) {
                if (this.recordingTimerIntervalId) {
                  clearInterval(this.recordingTimerIntervalId)
                  this.recordingTimerIntervalId = null
                }
                this.completeRecordingStatus =
                  CompleteRecordingStatus.NORECORDING
                // 清理
                // this.mediaRecorder = null
                this.startMediaRecorderParams = null //录制时间间隔配置
                this.recordedChunks.length = 0
                this.fileName = ''
                this.wipeOffRecordingTime()
                return
              }
            }
            this.startMediaRecorder({ ...this.startMediaRecorderParams })
          }
          video.srcObject = stream
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
      if (this.mediaRecorder?.state === 'recording') {
        ElMessage.warning('录制中，请先完成录制，在进行关闭！')
        return
      }
      setTimeout(() => {
        const tracks = this.stream.getTracks()
        // 关闭每一个轨道
        tracks.forEach((track) => {
          track.stop()
        })
        this.stream = null //摄像头stream
        this.mediaRecorder = null
        this.recordedChunks = [] //录制视频快数组
        this.fileName = '' //文件下载名名
        this.recordingTimerIntervalId = null //录制中循环IntervalId
        this.completeRecordingStatus = CompleteRecordingStatus.NORECORDING //完成录制标识
        this.startMediaRecorderParams = null //录制时间间隔配置
        console.log('this.mediaRecorder', this.mediaRecorder)
        resolve()
      }, 100)
    })
  }
  /**
   * 开启录制
   * @param {*} param0
   */
  startMediaRecorder(params) {
    this.startMediaRecorderParams = params || { interval: 5000, fileName: '' }
    this.mediaRecorder?.start()
    if (!this.recordingTimerIntervalId) {
      ElMessage.success('开启录制成功')
      this.setRecordingTime()
      this.fileName =
        this.startMediaRecorderParams.fileName ||
        `${createMd5Id()}${moment().format('YYYYMMDD_HHmmss')}_`
      this.completeRecordingStatus = CompleteRecordingStatus.RECORDING
    }
    // 设置定时器，15秒后停止当前录制并处理数据
    setTimeout(() => {
      this.mediaRecorder?.stop() // 停止录制
      // 注意：停止录制后会触发 `onstop` 事件，在该事件的处理函数中重新开始录制
    }, this.startMediaRecorderParams.interval)
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
    this.mediaRecorder.stop()
    this.completeRecordingStatus = CompleteRecordingStatus.FINISHRECORDING
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
  }
}
