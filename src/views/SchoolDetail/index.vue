<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { useRoute } from 'vue-router'
import { Identity } from '@/utils/config'

const appStore = useAppStore()
const { curSchool } = storeToRefs(appStore)
const { setCurSchool } = appStore
const userStore = useUserStore()
const { identity } = storeToRefs(userStore)
const route = useRoute()
const curMenu = ref<any[]>([route.name])

onUnmounted(() => {
	setCurSchool(null)
})

</script>

<template>
	<div v-if="curSchool" class="h-full flex justify-between items-start">
		<a-menu v-if="identity == Identity.Teacher" class="w-56 h-full" v-model:selectedKeys="curMenu">
			<a-menu-item key="Students">
				<router-link :to="{ name: 'Students' }">学生列表</router-link>
			</a-menu-item>
			<a-menu-item key="Teachers">
				<router-link :to="{ name: 'Teachers' }">教师列表</router-link>
			</a-menu-item>
		</a-menu>
		<div>
			<router-view></router-view>
		</div>
	</div>
	<div v-else>
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