<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSchoolStore } from '@/store/modules/school'
import { useUserStore } from '@/store/modules/user'
import { useRoute } from 'vue-router'
import { Identity } from '@/utils/config'
import { TeacherServer } from '@/http/api'

const loading = ref(true)
const schoolStore = useSchoolStore()
const { curSchool } = storeToRefs(schoolStore)
const { setCurSchool } = schoolStore
const userStore = useUserStore()
const { identity } = storeToRefs(userStore)
const route = useRoute()
const curMenu = ref<any[]>([route.name])

getSchoolDetail()

onUnmounted(() => {
	setCurSchool(null)
})

function getSchoolDetail() {
	if (curSchool.value) {
		loading.value = false
		return
	}
	const id = Number(route.params.id)
	TeacherServer.getSchoolDetail(id).then((res) => {
		setCurSchool(res)
	}).finally(() => loading.value = false)
}

</script>

<template>
	<div v-if="loading" class="flex justify-center items-center mt-20">
		<a-spin />
	</div>
	<div v-else-if="curSchool" class="h-full flex justify-between items-start">
		<div class="flex-1 p-5" :class="curSchool.is_owner ? 'pl-[244px]' : ''">
			<router-view></router-view>
		</div>
		<a-menu v-if="curSchool.is_owner" class="w-56 h-full absolute left-0 top-0 pt-[48px]" v-model:selectedKeys="curMenu">
			<a-menu-item key="Students">
				<router-link :to="{ name: 'Students' }">学生列表</router-link>
			</a-menu-item>
			<a-menu-item key="Teachers">
				<router-link :to="{ name: 'Teachers' }">教师列表</router-link>
			</a-menu-item>
		</a-menu>
	</div>
	<div v-else class="mt-20">
		<a-empty>
			<template #description>
				<span>抱歉，该学校不存在~</span>
			</template>
			<a-button type="primary">
				<router-link to="/schools" replace>返回学校列表</router-link>
			</a-button>
		</a-empty>
	</div>
</template>