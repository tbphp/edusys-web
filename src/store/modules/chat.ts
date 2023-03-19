import { ref, reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/store/modules/user'

export type User = {
  identity: number,
  id: number,
  name: string
}

export type Message = {
  self: boolean,
  time: number,
  message: string
}

export type MessageData = {
  unread: boolean,
  user: User,
  list: Message[]
}

export type MessageStore = {
  [key: string]: MessageData
}

const userStore = useUserStore()

export function getKey(user: User): string {
  return `${user.identity}-${user.id}`
}

// 数据按用户隔离
const myKey = getKey({
  identity: userStore.identity,
  id: userStore.userId,
  name: userStore.name
})

export const useChatStore = defineStore(`msgdata-${myKey}`, () => {
  const messageStore = reactive<MessageStore>({})

  const hasNew = ref<boolean>(false)

  const lastMessageId = ref<number>(0)

  const showBox = ref<Boolean>(false)

  const activeKey = ref<string>('')

  // 监听标记已读
  watch([activeKey, showBox], ([key, show]) => {
    if (show && messageStore[key].unread) {
      messageStore[key].unread = false
      let isNew = false
      for (const k in messageStore) {
        if (messageStore[k].unread) {
          isNew = true
          break
        }
      }
      if (!isNew) {
        hasNew.value = false
      }
    }
  })

  function addSession(key: string, user: User) {
    if (messageStore[key]) {
      return
    }

    messageStore[key] = {
      unread: false,
      user: user,
      list: []
    }
  }

  function addMsg(user: User, msg: Message) {
    const key = getKey(user)
    addSession(key, user)

    messageStore[key].list.push(msg)
    messageStore[key].user = user
    if (!showBox.value || key !== activeKey.value) {
      messageStore[key].unread = true
      hasNew.value = true
    }
  }

  function setLastId(id: number) {
    lastMessageId.value = id
  }

  function openNewSession(user: User) {
    const key = getKey(user)
    addSession(key, user)

    activeKey.value = key
    showBox.value = true
  }

  return {
    messageStore,
    hasNew,
    lastMessageId,
    activeKey,
    showBox,
    addMsg,
    setLastId,
    openNewSession
  }
}, {
  persist: [
    { paths: ['messageStore', 'hasNew', 'lastMessageId', 'activeKey'], storage: localStorage }
  ]
})