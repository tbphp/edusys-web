<script setup lang="ts">
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useSchoolStore } from '@/store/modules/school'
import { TeacherServer } from '@/http/api'
import { notification } from 'ant-design-vue'

const { curSchool } = storeToRefs(useSchoolStore())
const list = ref<any[]>([])
const listLoading = ref(false)
const total = ref(0)
const pageNo = ref(1)
const pageSize = 10
const columns = [
	{ title: 'ID', dataIndex: 'id', key: 'id' },
	{ title: '姓名', dataIndex: 'name', key: 'name' },
	{ title: '账号', dataIndex: 'username', key: 'username' },
	{ title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
	{ title: '最近更新', dataIndex: 'updated_at', key: 'updated_at' },
	{ title: '操作', dataIndex: 'action', key: 'action' }
]
const formVisible = ref(false)
const formLoading = ref(false)
const form = reactive({
	name: '',
	username: ''
})
const rules = {
	username: [{ required: true, message: '账号必填' }],
	name: [{ required: true, message: '姓名必填'}]
}
const editId = ref<number>(0)

getStudentList()

function getStudentList() {
	listLoading.value = true
	TeacherServer.getStudents(curSchool.value.id, {
		page: pageNo.value,
		per_page: pageSize
	}).then((res: any) => {
		list.value = res.list
		total.value = res.total
	}).finally(() => listLoading.value = false)
}

function openForm(item) {
	if (item) {
		editId.value = item.id
		form.name = item.name
		form.username = item.username
	} else {
		editId.value = 0
		form.name = ''
		form.username = ''
	}
	formVisible.value = true
}

function submitForm() {
	if (formLoading.value) return
	return new Promise((resolve, reject) => {
		formLoading.value = true
		if (editId.value) {
			TeacherServer.editStudent(editId.value, {
				name: form.name
			}).then(() => {
				formVisible.value = false
				resolve('')
				getStudentList()
			}).catch(reject).finally(() => formLoading.value = false)
		} else {
			TeacherServer.addStudent(curSchool.value.id, form).then((res: any) => {
				formVisible.value = false
				resolve(res)
				if (res.password) {
					notification.success({
						message: '学生创建成功',
						description: `该学生登录密码是：${res.password}，请复制保存发送给学生~`
					})
				}
				pageNo.value = 1
				getStudentList()
			}).catch(() => reject()).finally(() => formLoading.value = false)
		}
	})
}

function changePage(e) {
	pageNo.value = e
	getStudentList()
}

</script>

<template>
	<div>
		<a-button type="primary" @click="openForm">
			<template #icon><plus-outlined /></template>
			添加学生
		</a-button>
	</div>
	<a-table
		class="mt-5"
		:dataSource="list"
		:columns="columns"
		:loading="listLoading"
		:pagination="{
			position: ['bottomCenter'],
			current: pageNo,
			hideOnSinglePage: true,
			pageSize: pageSize,
			total: total,
			onChange: changePage
		}"
	>
		<template #bodyCell="{ column, record }">
			<template v-if="column.key === 'created_at'">
				<span v-time>{{ record.created_at }}</span>
			</template>
			<template v-if="column.key === 'updated_at'">
				<span v-time>{{ record.updated_at }}</span>
			</template>
			<div class="actions" v-if="column.key === 'action'">
				<a @click="openForm(record)">编辑</a>
				<a>重置密码</a>
				<a>聊天</a>
				<a class="red">删除</a>
			</div>
		</template>
	</a-table>
	<a-modal
		v-model:visible="formVisible"
		:title="`${editId ? '编辑' : '添加'}学生`"
		:confirm-loading="formLoading"
		@ok="submitForm"
	>
		<a-form :model="form" :rules="rules">
			<a-form-item label="姓名" name="name">
				<a-input v-model:value.trim="form.name" placeholder="输入姓名" />
			</a-form-item>
			<a-form-item label="账号" name="username">
				<a-input v-model:value.trim="form.username" placeholder="输入账号" :disabled="!!editId" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<style lang="less" scoped>
.actions {
	a {
		margin: 0 4px;
		&.red {
			color: red;
		}
	}
}
</style>