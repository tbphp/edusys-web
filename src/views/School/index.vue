<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TeacherServer } from '@/http/api'
import { useRouter } from 'vue-router'
import { SchoolStatus } from '@/utils/config'
import { message } from 'ant-design-vue'
import { useSchoolStore } from '@/store/modules/school'

const router = useRouter()
const { setCurSchool } = useSchoolStore()
const schoolList = ref<any[]>([])
const pageNo = ref<number>(1)
const total = ref<number>(0)
const pageSize = 7
const listLoading = ref(false)
const formVisible = ref(false)
const createLoading = ref(false)
const schoolName = ref('')
const editSchool = ref<any>()
const showErr = computed(() => {
	return !schoolName.value
})

getSchoolList()

function getSchoolList() {
	listLoading.value = true
	TeacherServer.getSchools({
		page: pageNo.value,
		per_page: pageSize
	}).then((res: any) => {
		schoolList.value = [{}, ...res.list]
		total.value = res.total
	}).catch(console.log).finally(() => listLoading.value = false)
}

function enterSchool(item) {
	setCurSchool(item)
	router.push(`/schools/${item.id}/students`)
}

function changePage() {
	getSchoolList()
}

function openSchoolForm(school?: any) {
	if (school) {
		editSchool.value = school
		schoolName.value = school.name
	} else {
		editSchool.value = undefined
		schoolName.value = ''
	}
	formVisible.value = true
}

function handleCreate() {
	if (!schoolName.value || createLoading.value) return
	createLoading.value = true
	if (editSchool.value) {
		TeacherServer.editSchool(editSchool.value.id, {
			name: schoolName.value
		}).then(() => {
			formVisible.value = false
			getSchoolList()
		}).finally(() => createLoading.value = false)
	} else {
		TeacherServer.addSchool({
			name: schoolName.value
		}).then(() => {
			formVisible.value = false
			pageNo.value = 1
			getSchoolList()
		}).finally(() => createLoading.value = false)
	}
}

function deleteSchool(id) {
	return new Promise((resolve) => {
		TeacherServer.deleteSchool(id).then(() => {
			message.success('删除成功')
			resolve('')
			getSchoolList()
		}).catch((err) => resolve(err))
	})
}

</script>

<template>
	<a-list class="p-10" :grid="{ gutter: 32, column: 4 }" :data-source="schoolList" :loading="listLoading">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-card v-if="item.id" hoverable>
					<template #cover>
						<div :class="`status-${item.status}`" class="h-48 text-white text-2xl font-bold flex justify-center items-center">{{ item.name }}</div>
						<a-tag v-if="item.is_owner" class="absolute top-2 left-2 w-auto text-white" color="#f9a964">
							<UserOutlined />
							<span>管理员</span>
						</a-tag>
						<div class="absolute right-1 top-1 w-auto" v-if="item.is_owner">
							<form-outlined v-if="item.status == SchoolStatus.Normal" class="cursor-pointer text-white text-lg" @click="openSchoolForm(item)" />
							<a-popconfirm
								title="确定要删除该学校吗?"
								ok-text="删除"
								cancel-text="取消"
								@confirm="deleteSchool(item.id)"
							>
								<delete-outlined class="cursor-pointer ml-2 text-white text-lg" />
							</a-popconfirm>
						</div>
					</template>
					<a-tag v-if="item.status == SchoolStatus.Pending" color="blue">{{ item.status_text }}</a-tag>
					<a-tag v-if="item.status == SchoolStatus.Rejected">{{ item.status_text }}</a-tag>
					<a-tooltip v-if="item.reject_reason" :title="item.reject_reason">
						<div class="text-slate-400 text-xs mt-2 truncate">{{ item.reject_reason }}</div>
					</a-tooltip>
					<a-button v-if="item.status == SchoolStatus.Normal" type="primary" @click="enterSchool(item)">进入学校</a-button>
				</a-card>
				<a-card class="create-card cursor-pointer" v-else @click="$event => openSchoolForm()">
					<div class="flex flex-col justify-center items-center h-full">
						<plus-outlined style="font-size:40px;color:#2A8DFF;" />
						<div class="text-blue mt-2">创建学校</div>
					</div>
				</a-card>
      </a-list-item>
    </template>
  </a-list>
	<div class="flex justify-center pb-10">
		<a-pagination v-model:current="pageNo" :total="total" :pageSize="pageSize" show-less-items hideOnSinglePage @change="changePage" />
	</div>
	<a-modal
		v-model:visible="formVisible"
		:title="`${editSchool ? '编辑' : '创建'}学校`"
		:confirm-loading="createLoading"
		@ok="handleCreate"
	>
		<a-input v-model:value.trim="schoolName" placeholder="输入学校名称" />
		<div v-show="showErr" class="text-red-500 text-xs mt-1 ml-3">学校名称必填</div>
	</a-modal>
</template>

<style lang="less" scoped>
.status-1 {
	background-color: rgba(9, 109, 217, 0.4);
}
.status-2 {
	background-color: #096dd9;
}
.status-3 {
	background-color: #ccc;
}
:deep(.ant-card-hoverable) {
	cursor: auto;
}
:deep(.ant-card-body) {
	padding: 15px;
	height: 80px;
}
.create-card {
	:deep(.ant-card-body) {
		padding: 0;
		height: 273px;
	}
}
</style>