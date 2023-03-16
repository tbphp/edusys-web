<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '@/components/LoginForm.vue'
import { useRouter } from 'vue-router'
import { userStore } from '@/store/modules/user'
import { Identity, pageTitle } from '@/utils/config'
import { TeacherServer } from '@/http/api'

const router = useRouter()
const store = userStore()
const loading = ref(false)
const formRef = ref()

function handleRegister() {
	if (loading.value) return
	formRef.value.getFormData().then(data => {
		loading.value = true
		TeacherServer.register(data).then(() => {
			store.setIdentity(Identity.Teacher)
			router.replace('/')
		}).finally(() => loading.value = false)
	})
}

</script>

<template>
	<div class="h-full bg-[#f0f2f5]">
		<div class="pt-[112px] pb-[24px]">
			<h3 class="text-2xl text-center">{{ pageTitle }} - 教师注册</h3>
			<div class="w-[368px] mt-[40px] mx-auto">
				<login-form ref="formRef" :identity="Identity.Teacher" is-register />
				<a-button
					class="mt-5 bg-green-600 border-green-600 hover:bg-green-500 hover:border-green-500 focus:bg-green-500 focus:border-green-500"
					type="primary"
					block
					:loading="loading"
					size="large"
					@click="handleRegister"
				>注 册</a-button>
				<div class="text-right">
					<a-button
						class="p-0 pt-2"
						type="link"
						@click="router.replace('/login')"
					>返回登录</a-button>
				</div>
			</div>
		</div>
	</div>
</template>
