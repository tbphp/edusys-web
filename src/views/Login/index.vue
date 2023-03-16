<script setup lang="ts">
import { ref } from 'vue'
import LoginFormTeacher from '@/components/LoginForm.vue'
import LoginFormStudent from '@/components/LoginForm.vue'
import { useRouter } from 'vue-router'
import { userStore } from '@/store/modules/user'
import { Identity, pageTitle } from '@/utils/config'
import { AppServer } from '@/http/api'

const router = useRouter()
const store = userStore()
const loading = ref(false)
const identity = ref(Identity.Teacher)
const teacherFormRef = ref()
const studentFormRef = ref()

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
		router.replace('/')
	}).finally(() => loading.value = false)
}
</script>

<template>
	<div class="h-full bg-[#f0f2f5]">
		<div class="pt-[112px] pb-[24px]">
			<h3 class="text-2xl text-center">{{ pageTitle }}</h3>
			<div class="w-[368px] mt-[40px] mx-auto">
				<a-tabs class="login-tabs" v-model:activeKey="identity" size="large" animated @change="onTabChange">
					<a-tab-pane :key="Identity.Teacher" tab="教师登录">
						<login-form-teacher ref="teacherFormRef" :identity="Identity.Teacher" />
					</a-tab-pane>
					<a-tab-pane :key="Identity.Student" tab="学生登录">
						<login-form-student ref="studentFormRef" :identity="Identity.Student" />
					</a-tab-pane>
				</a-tabs>
				<a-button class="mt-5" type="primary" block size="large" :loading="loading" @click="handleLogin">登 录</a-button>
				<div class="text-right" v-show="identity == Identity.Teacher">
					<a-button class="p-0 pt-2" type="link" @click="router.replace('/register')">注册成为教师</a-button>
				</div>
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
