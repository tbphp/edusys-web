<script setup lang="ts">
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useSchoolStore } from '@/store/modules/school'
import { TeacherServer } from '@/http/api'
import { notification, message } from 'ant-design-vue'
import { useChatStore } from '@/store/modules/chat'
import { Identity } from '@/utils/config'

const { curSchool } = storeToRefs(useSchoolStore())
const chatStore = useChatStore()
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
	{ title: '最近更新', dataIndex: 'updated_at', key: 'updated_at' }
]
if (curSchool.value.is_owner) {
	columns.push({ title: '操作', dataIndex: 'action', key: 'action' })
}
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
	if (formLoading.value || !form.name || !form.username) return
	return new Promise((resolve, reject) => {
		formLoading.value = true
		if (editId.value) {
			TeacherServer.editStudent(curSchool.value.id, editId.value, {
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

function resetPsw(id) {
	TeacherServer.resetPasswordOfStudent(curSchool.value.id, id).then((res: any) => {
		if (res.password) {
			notification.success({
				message: '学生密码修改成功',
				description: `该学生登录密码修改为：${res.password}，请复制保存发送给学生~`
			})
		}
	})
}

function delStudent(id) {
	TeacherServer.deleteStudent(curSchool.value.id, id).then(() => {
		message.success('删除成功')
		getStudentList()
	})
}

function newChat(item) {
  chatStore.openNewSession({
    identity: Identity.Student,
    id: item.id,
    name: item.name
  })
}

</script>

<template>
	<div class="mb-5">
		<a-button v-if="curSchool.is_owner" type="primary" @click="openForm">
			<template #icon><plus-outlined /></template>
			添加学生
		</a-button>
		<p v-else class="text-lg font-bold">学生列表</p>
	</div>
	<a-table
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
				<a href="#" @click="openForm(record)">编辑</a>
				<a-popconfirm
					title="确定要重置密码?"
					ok-text="重置"
					cancel-text="取消"
					@confirm="resetPsw(record.id)"
				>
					<a href="#">重置密码</a>
				</a-popconfirm>
				<a v-if="record.is_owner" href="#" @click="newChat(record)">聊天</a>
				<a-popconfirm
					title="确定要删除该学生吗?"
					ok-text="删除"
					cancel-text="取消"
					@confirm="delStudent(record.id)"
				>
					<a class="red" href="#">删除</a>
				</a-popconfirm>
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