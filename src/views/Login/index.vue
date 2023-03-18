<script setup lang="ts">
import { ref } from 'vue'
import LoginFormTeacher from '@/components/LoginForm.vue'
import LoginFormStudent from '@/components/LoginForm.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { Identity, pageTitle } from '@/utils/config'
import { AppServer, LineServer } from '@/http/api'
import LineBtn from '@/components/LineBtn.vue'
import { message } from 'ant-design-vue'

const router = useRouter()
const store = useUserStore()
const loading = ref(false)
const identity = ref(Identity.Teacher)
const teacherFormRef = ref()
const studentFormRef = ref()
const isBind = Boolean(store.bindHash)

function onTabChange() {
	if (loading.value) loading.value = false
}

function handleLogin() {
	if (loading.value) return
	if (identity.value == Identity.Teacher) {
		teacherFormRef.value.getFormData().then(res => {
			handleSubmit(res)
		})
	} else {
		studentFormRef.value.getFormData().then(res => {
			handleSubmit(res)
		})
	}
}

function handleSubmit(data) {
	loading.value = true
	AppServer.login({
		...data,
		identity: identity.value
	}).then(() => {
		store.setIdentity(identity.value)
    // 绑定
    if (isBind) {
      LineServer.bind({
        identity: identity.value,
        code: null,
        hash: store.bindHash
      }).then(() => {
        message.success('绑定Line账号成功')
        router.replace('/')
      }).catch(() => {
        message.error('绑定失败，请退出重试')
        store.logout()
      }).finally(() => store.bindHash = '')
    } else {
      router.replace('/')
    }
	}).finally(() => loading.value = false)
}
</script>

<template>
	<div class="h-full bg-[#f0f2f5]">
		<div class="pt-[112px] pb-[24px]">
			<h3 class="text-2xl text-center">{{ isBind ? '绑定账号' : pageTitle }}</h3>
			<div class="w-[368px] mt-[40px] mx-auto">
				<a-tabs class="login-tabs" v-model:activeKey="identity" size="large" animated @change="onTabChange">
					<a-tab-pane :key="Identity.Teacher" :tab="'教师' + (isBind ? '' : '登录')">
						<login-form-teacher ref="teacherFormRef" :identity="Identity.Teacher" />
					</a-tab-pane>
					<a-tab-pane :key="Identity.Student" :tab="'学生' + (isBind ? '' : '登录')">
						<login-form-student ref="studentFormRef" :identity="Identity.Student" />
					</a-tab-pane>
				</a-tabs>
				<a-button class="mt-5" type="primary" block size="large" :loading="loading" @click="handleLogin">{{ isBind ? '绑 定' : '登 录' }}</a-button>
				<div class="text-right pb-2 mb-20 border-0 border-b border-dotted border-gray-400 h-[41px]">
					<a-button v-show="identity === Identity.Teacher && !isBind" class="p-0 pt-2" type="link" @click="router.replace('/register')">注册成为教师</a-button>
				</div>
        <line-btn v-if="!isBind" />
			</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
.login-tabs {
	:deep(.ant-tabs-nav) {
		&::before {
			border-bottom: none;
		}
		.ant-tabs-nav-wrap {
			justify-content: center;
		}
		.ant-tabs-tab {
			padding: 16px 20px;
		}
	}
}
</style>
