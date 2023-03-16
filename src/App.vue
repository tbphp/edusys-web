<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
// import Echo from 'laravel-echo'
// import Pusher from 'pusher-js'

// window.Pusher = Pusher

// window.Echo = new Echo({
//   broadcaster: 'pusher',
//   key: 'bf14caee60da82394fd0',
//   cluster: 'mt1',
//   forceTLS: true,
// 	encrypted: true
// });

// var channel = window.Echo.channel('my-channel');
// channel.listen('.my-event', console.log)

</script>

<template>
	<a-config-provider :locale="zhCN">
		<router-view />
	</a-config-provider>
</template>
