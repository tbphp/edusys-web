<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import ChatBox from '@/components/ChatBox.vue'
</script>

<template>
	<div class="h-full bg-slate-100">
		<page-header />
		<div class="h-full pt-12">
			<div class="h-full overflow-auto">
				<router-view></router-view>
			</div>
      <chat-box />
		</div>
	</div>
</template>
