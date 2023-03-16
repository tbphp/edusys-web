<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Identity } from '@/utils/config'

const props = defineProps({
	identity: Number,
	isRegister: Boolean
})

defineExpose({
	getFormData
})

const formRef = ref()
const form = reactive({
	name: '',
	username: '',
	password: ''
})
const usernameStr = props.identity == Identity.Student ? '账号' : '邮箱'
const usernameRule: any = [{ required: true, message: `${ usernameStr }不能为空!` }]
if (usernameStr === '邮箱') {
	usernameRule.push({ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式错误' })
}
const rules = {
	name: [{ required: true, message: '姓名不能为空!'}],
	username: usernameRule,
	password: [{ required: true, message: '密码不能为空!' }]
}

function getFormData() {
	return new Promise((resolve) => {
		formRef.value.validate()
			.then(res => resolve(res))
			.catch(err => console.log(err))
	})
}
</script>

<template>
	<a-form ref="formRef" :model="form" :rules="rules">
		<a-form-item v-if="isRegister" name="name">
			<a-input
				v-model:value="form.name"
				placeholder="姓名"
				size="large"
			>
				<template #prefix>
					<user-outlined />
				</template>
			</a-input>
		</a-form-item>
		<a-form-item name="username">
			<a-input
				v-model:value="form.username"
				:placeholder="usernameStr"
				size="large"
			>
				<template #prefix>
					<user-outlined />
				</template>
			</a-input>
		</a-form-item>
		<a-form-item name="password">
			<a-input
				v-model:value="form.password"
				placeholder="密码"
				size="large"
				type="password"
			>
			<template #prefix>
				<lock-outlined />
			</template>
			</a-input>
		</a-form-item>
	</a-form>
</template>

<style lang="less" scoped></style>