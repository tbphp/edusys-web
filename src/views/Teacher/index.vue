<script setup lang="ts">
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useSchoolStore } from '@/store/modules/school'
import { TeacherServer, StudentServer } from '@/http/api'
import { message } from 'ant-design-vue'
import { Identity } from '@/utils/config'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/store/modules/chat'

const route = useRoute()
const schoolStore = useSchoolStore()
const chatStore = useChatStore()
const { curSchool } = storeToRefs(schoolStore)
const { setCurSchool } = schoolStore
const { identity, userId } = storeToRefs(useUserStore())
const list = ref<any[]>([])
const listLoading = ref(false)
const total = ref(0)
const pageNo = ref(1)
const pageSize = 10
const columns = [
	{ title: 'ID', dataIndex: 'id', key: 'id' },
	{ title: '姓名', dataIndex: 'name', key: 'name' },
	{ title: '邮箱', dataIndex: 'username', key: 'username' },
	{ title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
	{ title: '最近更新', dataIndex: 'updated_at', key: 'updated_at' },
	{ title: '操作', dataIndex: 'action', key: 'action', width: 180 }
]
const formVisible = ref(false)
const formLoading = ref(false)
const form = reactive({
	username: ''
})
const rules = {
	username: [{ required: true, message: '邮箱必填' }]
}

getSchoolOfStudent()
getList()

function getList() {
	listLoading.value = true
	const data = {
		page: pageNo.value,
		per_page: pageSize
	}
	if (identity.value == Identity.Teacher) {
		TeacherServer.getTeachersOfSchool(curSchool.value.id, data).then((res: any) => {
			list.value = res.list
			total.value = res.total
		}).finally(() => listLoading.value = false)
	} else {
		StudentServer.getTeachers(data).then((res: any) => {
			list.value = res.list
			total.value = res.total
		}).finally(() => listLoading.value = false)
	}
}

function openForm() {
	form.username = ''
	formVisible.value = true
}

function submitForm() {
	if (formLoading.value || !form.username) return
	return new Promise((resolve) => {
		formLoading.value = true
		TeacherServer.inviteTeacher(curSchool.value.id, form).then(() => {
			formVisible.value = false
			message.success('邀请成功')
			resolve('')
			pageNo.value = 1
			getList()
		}).finally(() => formLoading.value = false)
	})
}

function changePage(e) {
	pageNo.value = e
	getList()
}

function removeTeacher(id) {
	TeacherServer.removeTeacher(curSchool.value.id, id).then(() => {
		message.success('删除成功')
		getList()
	})
}

function handleFollow(item) {
	item.is_followed = !item.is_followed
	if (item.is_followed) {
		StudentServer.followTeacher(item.id)
	} else {
		StudentServer.unfollowTeacher(item.id)
	}
}

function getSchoolOfStudent() {
	const routeName = route.name
	if (routeName === 'Student' && !curSchool.value) {
		StudentServer.getSchoolDetail().then((res: any) => {
			setCurSchool(res)
		})
	}
}

function newChat(item) {
  chatStore.openNewSession({
    identity: Identity.Teacher,
    id: item.id,
    name: item.name
  })
}

</script>

<template>
	<div :class="identity == Identity.Student ? 'p-5' : ''">
		<div class="mb-5">
			<a-button v-if="curSchool?.is_owner" type="primary" @click="openForm">
				<template #icon><plus-outlined /></template>
				邀请教师
			</a-button>
			<p v-else class="text-lg font-bold">教师列表</p>
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
					<template v-if="identity == Identity.Teacher">
						<a-popconfirm
							v-if="record.id !== userId"
							title="确定要移除该教师吗?"
							ok-text="移除"
							cancel-text="取消"
							@confirm="removeTeacher(record.id)"
						>
							<a class="red" href="#">移除</a>
						</a-popconfirm>
					</template>
					<span v-else>
						<a href="#" @click="handleFollow(record)">{{ record.is_followed ? '取消关注' : '关注' }}</a>
						<a v-if="record.is_owner" href="#" @click="newChat(record)">聊天</a>
					</span>
				</div>
			</template>
		</a-table>
	</div>

	<a-modal
		v-model:visible="formVisible"
		title="邀请教师"
		:confirm-loading="formLoading"
		@ok="submitForm"
	>
		<a-form :model="form" :rules="rules">
			<a-form-item label="邮箱" name="username">
				<a-input v-model:value.trim="form.username" placeholder="输入邮箱" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<style lang="less" scoped>
.actions {
	a {
		margin: 0 4px;
	}
}
</style>