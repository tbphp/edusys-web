<script setup lang="ts">
import { pageTitle } from '@/utils/config'
import { useUserStore } from '@/store/modules/user'
import { useSchoolStore } from '@/store/modules/school'
import { storeToRefs } from 'pinia'
import LineBtn from '@/components/LineBtn.vue'
import { LineServer } from '@/http/api'
import { message } from 'ant-design-vue'

const store = useUserStore()
const { curSchool } = storeToRefs(useSchoolStore())

function unBind() {
  LineServer.unBind({
    identity: store.identity
  }).then(() => {
    message.success('解绑成功')
    store.setBindLine(false)
  })
}

</script>

<template>
	<div class="h-12 bg-[#1e40af] text-white flex justify-between items-center px-5 absolute top-0 left-0 w-full z-10">
		<div class="text-white flex items-center">
			<div class="text-base font-bold">{{ pageTitle }}</div>
			<div class="text-xs ml-4" v-if="curSchool">
				<router-link to="/schools" replace class="text-slate-400 hover:text-blue cursor-pointer">全部学校</router-link>
				<span class="mx-1">/</span>
				<span>{{ curSchool.name }}</span>
			</div>
		</div>
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
            <line-btn is-text v-if="!store.bindLine" />
            <a-popconfirm v-else title="解绑之后将不可使用Line账号登录，确定解绑吗？" ok-text="确定" cancel-text="取消" @confirm="unBind">
              <span>解绑Line</span>
            </a-popconfirm>
          </a-menu-item>
					<a-menu-item>
						<span @click="store.logout()">退出登录</span>
					</a-menu-item>
				</a-menu>
			</template>
		</a-dropdown>
	</div>
</template>
