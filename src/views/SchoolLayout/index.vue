<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { appStore } from '@/store/modules/app'
import { useRoute } from 'vue-router'

const store = appStore()
const { curSchool } = storeToRefs(store)
const { setCurSchool } = store
const route = useRoute()
const curMenu = ref<any[]>([route.name])

onUnmounted(() => {
	setCurSchool(null)
})
</script>

<template>
	<div v-if="curSchool" class="h-full flex justify-between items-start">
		<div>{{ route.fullPath }}</div>
		<a-menu class="w-56 h-full" v-if="curSchool" v-model:selectedKeys="curMenu">
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
	<div v-else>该学校不存在</div>
</template>