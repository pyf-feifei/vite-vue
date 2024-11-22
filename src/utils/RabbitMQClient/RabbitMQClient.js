// RabbitMQClient.js 使用RabbitMQ类
import { Stomp } from '@stomp/stompjs'
import JSONbig from 'json-bigint'

const JSONbigString = new JSONbig({ storeAsString: true })
const rabbitMQConfig = JSON.parse(import.meta.env.VITE_APP_rabbitMQConfig)

class RabbitMQClient {
  constructor() {
    this.client = null
    this.subscriptions = {}
    this.onMessageReceivedArr = {}
    this.messages = {}
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        this.client = Stomp.over(() => new WebSocket(rabbitMQConfig.client))
        this.client.heartbeatIncoming = 10000 // 接收心跳包的间隔，单位毫秒
        this.client.heartbeatOutgoing = 10000 // 发送心跳包的间隔，单位毫秒
        this.client.debug = (message) => {
          if (message.includes('<<< PONG') || message.includes('>>> PING')) {
            console.log() // 只打印非心跳日志
          }
          if (message.includes('Connection closed to')) {
            console.log(message) // 只打印非心跳日志
            // this.client.activate()
          }
        }
        this.client.connectHeaders = {
          login: rabbitMQConfig.loginName,
          passcode: rabbitMQConfig.password,
        }

        this.client.onConnect = () => {
          console.log('成功连接到 RabbitMQ1')
          resolve()
        }

        this.client.onStompError = (frame) => {
          console.error('STOMP 错误', frame)
          reject(frame)
        }

        this.client.activate()
      } else {
        resolve()
      }
    })
  }

  subscribe(queue, onMessageReceived) {
    if (!this.client) {
      console.error('Client not connected')
      return
    }

    const queues = Array.isArray(queue) ? queue : [queue]

    queues.forEach((q) => {
      if (!this.messages[q]) {
        this.messages[q] = []
      }

      if (!this.onMessageReceivedArr[q]) {
        this.onMessageReceivedArr[q] = []
      }

      if (!this.subscriptions[q]) {
        this.subscriptions[q] = this.client.subscribe(
          `/queue/QUEUE_NAME_${q}`,
          (msg) => {
            if (msg.headers && msg.headers['message-id']) {
              let msgBody = JSONbigString.parse(msg.body)
              msgBody.messageId = msg.headers['message-id']
              this.messages[q].push(msgBody)
            } else {
              console.error('消息中缺少 message-id')
            }
            this.onMessageReceivedArr[q].forEach((onMessage) => {
              onMessage({
                message: this.messages[q],
                queue: q,
                messages: this.messages,
                this: this,
              })
            })
          },
          { ack: 'client' }
        )
      }

      if (!this.onMessageReceivedArr[q].includes(onMessageReceived)) {
        this.onMessageReceivedArr[q].push(onMessageReceived)
      }
    })
  }

  unsubscribe(queue, onMessageReceived) {
    const queues = Array.isArray(queue) ? queue : [queue]

    queues.forEach((q) => {
      if (this.onMessageReceivedArr[q]) {
        this.onMessageReceivedArr[q] = this.onMessageReceivedArr[q].filter(
          (fn) => fn !== onMessageReceived
        )

        if (this.onMessageReceivedArr[q].length === 0) {
          this.subscriptions[q].unsubscribe()
          delete this.subscriptions[q]
          delete this.messages[q]
          delete this.onMessageReceivedArr[q]
        }
      }
    })
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate()
      this.client = null
      this.subscriptions = {}
      this.onMessageReceivedArr = {}
      this.messages = {}
    }
  }
}

export default RabbitMQClient
// export default new RabbitMQClient()
