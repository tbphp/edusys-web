<script setup lang="ts">
import { pageTitle } from '@/utils/config'
import { userStore } from '@/store/modules/user'
import { appStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'

const store = userStore()
const { curSchool } = storeToRefs(appStore())
</script>

<template>
	<div class="h-12 bg-[#1e40af] text-white flex justify-between items-center px-5 absolute top-0 left-0 w-full z-10">
		<h3 class="text-white m-0 flex items-center">
			<span>{{ pageTitle }}</span>
			<div v-if="curSchool">
				<span>- {{ curSchool.name }}</span>
				<a-button>返回学校列表</a-button>
			</div>
		</h3>
		<a-dropdown>
			<span class="ant-dropdown-link cursor-pointer">
				<user-outlined />
				{{ store.name }}
				<down-outlined />
			</span>
			<template #overlay>
				<a-menu>
					<a-menu-item>
						<router-link to="/fans">粉丝列表</router-link>
					</a-menu-item>
					<a-menu-item>
						<span @click="store.logout()">退出登录</span>
					</a-menu-item>
				</a-menu>
			</template>
		</a-dropdown>
	</div>
</template>
