<script setup lang="ts">
import { ref } from 'vue'
import { TeacherServer } from '@/http/api'

const list = ref<any[]>([])
const columns = [
	{ title: 'ID', dataIndex: 'id', key: 'id' },
	{ title: '姓名', dataIndex: 'name', key: 'name' },
	{ title: '账号', dataIndex: 'username', key: 'username' },
	{ title: '学校', dataIndex: ['school', 'name'], key: 'schoolname' },
	{ title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
	{ title: '最近更新', dataIndex: 'updated_at', key: 'updated_at' },
	{ title: '操作', dataIndex: 'action', key: 'action' }
]
const listLoading = ref(false)
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)

getList()

function getList() {
	listLoading.value = true
	TeacherServer.getFans({
		per_page: pageSize,
		page: pageNo.value
	}).then((res: any) => {
		list.value = res.list
		total.value = res.total
	}).finally(() => listLoading.value = false)
}

function changePage(e) {
	pageNo.value = e
	getList()
}

</script>

<template>
	<div class="p-5">
		<p class="font-bold text-lg">粉丝列表</p>
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
					<a href="#">聊天</a>
				</div>
			</template>
		</a-table>
	</div>
</template>