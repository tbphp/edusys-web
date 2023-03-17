<script setup lang="ts">
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useSchoolStore } from '@/store/modules/school'
import { TeacherServer } from '@/http/api'

const { curSchool } = storeToRefs(useSchoolStore())
const list = ref<any[]>([])
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
const editStudent = ref()
const formLoading = ref(false)
const form = reactive({
	name: '',
	username: ''
})
const rules = {
	username: [{ required: true, message: '账号必填' }],
	name: [{ required: true, message: '姓名必填'}]
}

getStudentList()

function getStudentList() {
	TeacherServer.getStudents(curSchool.value.id, {
		page: pageNo.value,
		per_page: pageSize
	}).then((res: any) => {
		list.value = res.list
		total.value = res.total
	})
}

function openForm() {
	formVisible.value = true
}

function submitForm() {}

</script>

<template>
	<div>
		<a-button type="primary" @click="openForm">
			<template #icon><plus-outlined /></template>
			添加学生
		</a-button>
	</div>
	<a-table class="mt-5" :dataSource="list" :columns="columns" size="small">
		<template #bodyCell="{ column, record }">
			<template v-if="column.key === 'action'">
				<a-button>编辑</a-button>
				<a-button>重置密码</a-button>
				<a-button>聊天</a-button>
				<a-button>删除</a-button>
			</template>
		</template>
	</a-table>
	<a-modal
		v-model:visible="formVisible"
		:title="`${editStudent ? '编辑' : '添加'}学生`"
		:confirm-loading="formLoading"
		@ok="submitForm"
	>
		<a-form :model="form" :rules="rules">
			<a-form-item label="姓名" name="name">
				<a-input v-model:value.trim="form.name" placeholder="输入姓名" />
			</a-form-item>
			<a-form-item label="账号" name="username">
				<a-input v-model:value.trim="form.username" placeholder="输入账号" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>