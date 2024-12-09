<template>
  <div class="chat-container">
    <div class="flex items-center mb-4">
      <img
        aria-hidden="true"
        alt="chatbot-icon"
        src="https://openui.fly.dev/openui/24x24.svg?text=🤖"
        class="w-8 h-8 mr-2"
      />
      <h2 class="text-lg font-semibold text-foreground">智能客服</h2>
    </div>
    <div
      v-for="(message, index) in chatMessages"
      :key="index"
      class="chat-message"
    >
      <div
        :class="[
          'message-content',
          message.isUser ? 'user-message' : 'ai-message',
        ]"
      >
        {{ message.text }}
      </div>
    </div>
    <div class="mt-4 flex">
      <el-input
        v-model="inputMessage"
        placeholder="请输入问题，按 Enter 发送，Shift + Enter 换行"
        @keyup.enter="sendMessage"
        class="w-full"
      />
      <el-button type="primary" @click="sendMessage" class="ml-2"
        >发送</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElInput, ElButton } from 'element-plus'

// 初始化对话内容
const chatMessages = ref([
  { text: 'Hi，我是数派AI', isUser: false },
  {
    text: '很高兴为您服务！我将协助您进行快速创作，有什么想问我的吗？',
    isUser: false,
  },
  { text: '我想创建一个旅游大模型', isUser: true },
  { text: '您希望主要负责生成哪些与旅游相关的内容呢？', isUser: false },
  {
    text: '比如旅游攻略、旅行建议、目的地介绍还是其他方面的内容？',
    isUser: false,
  },
])

const inputMessage = ref('')

const sendMessage = () => {
  if (inputMessage.value.trim()) {
    chatMessages.value.push({ text: inputMessage.value, isUser: true })
    inputMessage.value = ''
  }
}
</script>

<style scoped>
.chat-container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
  background-color: #f9f9f9;
}

.chat-message {
  margin-bottom: 10px;
}

.message-content {
  padding: 10px;
  border-radius: 8px;
  max-width: 80%;
}

.user-message {
  background-color: #e1f5fe;
  align-self: flex-end;
}

.ai-message {
  background-color: #f1f0f0;
  align-self: flex-start;
}

.text-foreground {
  color: #333;
}

.text-muted-foreground {
  color: #666;
}

.bg-muted {
  background-color: #f1f0f0;
}

.border-border {
  border-color: #ccc;
}

.focus\:ring {
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

.focus\:ring-ring {
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}
</style>
