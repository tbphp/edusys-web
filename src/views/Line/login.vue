<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { LineServer } from '@/http/api'
import { Identity } from '@/utils/config'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const query = route.query
const tokenList = ref<any[]>([])
const listLoading = ref(false)
const store = useUserStore()

handle()

function handle() {
  // 验证
  if (query.state !== 'loginedusys' || !query.code) {
    message.error('回调不合法，登陆失败！')
    router.push('/login')
    return
  }

  const token = localStorage.getItem('token')
  if (token) {
    bind()
  } else {
    login()
  }
}

function login() {
  listLoading.value = true
  LineServer.login({
    code: query.code
  }).then((res: any) => {
    switch (res.tokens.length) {
      case 0:
        store.bindHash = res.hash
        message.error('没有绑定账号，请登录已有账号以绑定Line。')
        router.push('/login')
        break
      case 1:
        loginByToken(res.tokens[0])
        break
      default:
        tokenList.value = res.tokens
        break
    }
  }).catch(() => router.push('/login'))
    .finally(() => listLoading.value = false)
}

function bind() {
  LineServer.bind({
    code: query.code,
    identity: store.identity,
    hash: null
  }).then(() => {
    message.success('绑定Line账号成功')
  }).catch(() => {
    message.error('绑定失败，请退出重试')
  }).finally(() => router.replace('/'))
}

// 选择token登录
function loginByToken(token) {
  store.setLogin(token)
  store.setIdentity(token.identity)
  router.replace('/')
}

</script>

<template>
  <div class="h-full bg-[#f0f2f5]">
    <div class="pt-[112px] pb-[24px] w-[1200px] mx-auto">
      <div class="text-center mt-10" v-show="listLoading">
        <a-spin size="large" />
      </div>
      <div v-show="tokenList.length > 0">
        <h3 class="text-2xl text-center mb-20">请选择已绑定账号</h3>
        <a-row type="flex" justify="center" :gutter="50">
          <a-col :span="8" v-for="token in tokenList" class="mb-[50px]">
            <a-card :title="token.username">
              <template #extra><a-button type="primary" @click="loginByToken(token)">登录</a-button></template>
              <p>{{ token.identity === Identity.Teacher ? '教师' : '学生' }}</p>
              <p>{{ token.name }}</p>
            </a-card>
          </a-col>
        </a-row>
        <div class="pt-4 border-0 border-t border-dotted border-gray-400 text-center">
          <a-button href="/login" size="large">取消</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
</style>
