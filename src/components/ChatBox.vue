<script setup lang="ts">
import { reactive, watch, nextTick } from 'vue'
import dayjs from '@/utils/dayjs'
import { useChatStore, Message, User } from '@/store/modules/chat'
import { useUserStore } from '@/store/modules/user'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'
import { Identity } from '@/utils/config'
import { notification } from 'ant-design-vue';
import { TeacherServer, StudentServer } from '@/http/api'
import { storeToRefs } from 'pinia'

const chatStore = useChatStore()
const userStore = useUserStore()
const messages = reactive({})
const { showBox, activeKey, hasNew, lastMessageId } = storeToRefs(chatStore)

startEcho()

function startEcho() {
  const identity = userStore.identity === Identity.Teacher ? 'teacher' : 'student'
  window.Pusher = Pusher
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_KEY,
    cluster: 'mt1',
    encrypted: true,
    occupied: true,
    authEndpoint: `${import.meta.env.VITE_API}/${identity}/broadcasting/auth`,
    auth: {
      headers: {
        'authorization': `${userStore.token}`
      }
    }
  })

  const userKey = `${userStore.identity}-${userStore.userId}`
  const channel = window.Echo.private(`chat.${userKey}`)
  channel.listen('.message', data => {
    if (lastMessageId.value >= data.id) {
      return
    }
    const user: User = data.from
    const message: Message = {
      self: false,
      time: data.time,
      message: data.message
    }
    chatStore.addMsg(user, message)
    chatStore.setLastId(data.id)
    channel.whisper('read', { id: data.id })
  })
      .listen('.notify', data => {
        if (lastMessageId.value >= data.id) {
          return
        }
        notification.open({
          class: 'system-notify',
          message: '系统消息',
          description: data.message,
          duration: null
        });
        chatStore.setLastId(data.id)
        channel.whisper('read', { id: data.id })
      })
}

function sendMsg() {
  if (!chatStore.messageStore[activeKey.value] || !messages[activeKey.value]) {
    console.error('当前会话不存在')
    return
  }

  const user = chatStore.messageStore[activeKey.value].user

  const message: Message = {
    self: true,
    time: dayjs().unix(),
    message: messages[activeKey.value]
  }

  chatStore.addMsg(user, message)

  const server = userStore.identity === Identity.Teacher ? TeacherServer : StudentServer

  server.sendMessages({
    identity: user.identity,
    user_id: user.id,
    message: messages[activeKey.value]
  })

  messages[activeKey.value] = ''
}

const msgRefs = {}

function setupMsgMain(key, el) {
  msgRefs[key] = el
}

// 聊天定位
watch(chatStore.messageStore, () => {
  if (showBox.value) {
    nextTick(() => {
      msgRefs[activeKey.value].lastElementChild.scrollIntoView()
    })
  }
})


</script>

<template>
  <div>
    <div class="fixed right-10 bottom-20" v-show="!showBox">
      <a-button
          type="primary"
          shape="circle"
          size="large"
          @click="showBox = true"
          class="chat-btn">
        Chat
      </a-button>
      <a-badge status="processing" class="newbd" v-show="hasNew" />
    </div>
    <a-card title="聊天窗" class="fixed right-10 bottom-10 top-auto w-[800px] z-50" v-show="showBox">
      <template #extra>
        <a-button type="link" size="small" @click="showBox = false">
          <minus-circle-two-tone />
        </a-button>
      </template>
      <a-tabs
          v-model:activeKey="activeKey"
          tab-position="left"
          :style="{ height: '400px' }"
      >
        <a-tab-pane v-for="(data, key) in chatStore.messageStore"
                    :key="key"
                    style="background: #096dd966;">
          <template #tab>
            <div class="w-24 text-right">
              <span>{{ data.user.name }}</span>
              <a-badge status="processing" class="checkbd" v-show="data.unread" />
            </div>
          </template>
          <div class="msg-main" :ref="el => { setupMsgMain(key, el) }" :key="key">
            <div class="msg" v-for="v in data.list" :class="{'msg-self': v.self}">
              <div class="msg-content">{{ v.message }}</div>
              <div class="msg-time">
                <a-tooltip placement="bottom" :title="dayjs(v.time * 1000).format('YYYY/MM/DD HH:mm:ss')">
                  {{ dayjs(v.time * 1000).fromNow() }}
                </a-tooltip>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
      <div class="mt-4" style="padding-left: 144px" v-show="activeKey !== ''">
        <a-textarea v-model:value="messages[activeKey]" style="resize: none;" :auto-size="{ minRows: 1, maxRows: 5 }" />
        <a-button type="primary" class="float-right mt-4" @click="sendMsg">发送</a-button>
      </div>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
.chat-btn {
  width: 60px;
  height: 60px;
  font-size: 22px;
}

.msg-main {
  height: 400px;
  overflow: auto;
  padding-top: 24px;
  padding-bottom: 14px;
}

.msg {
  margin-bottom: 10px;
  padding-right: 74px;

  .msg-content {
    text-align: left;
    display: inline-block;
    background: #fff;
    border-radius: 4px;
    padding: 10px;
    white-space: pre-wrap;
  }

  .msg-time {
    color: #5e5c5c;
    font-size: 12px;
  }
}

.msg-self {
  text-align: right;
  padding-right: 24px;
  padding-left: 50px;

  .msg-content {
    background: #95ec69;
  }

  .msg-time {
    text-align: right;
  }
}

.newbd, .checkbd {
  :deep(.ant-badge-status-processing) {
    background: #f5222d;
  }

  :deep(.ant-badge-status-processing::after) {
    border-color: #f5222d !important;
  }
}

.newbd {
  position: absolute;
  top: -4px;
  right: -4px;
}

.checkbd {
  position: absolute;
  right: 6px;
}
</style>
