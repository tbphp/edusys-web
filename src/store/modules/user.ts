import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
	const token = ref<string>('')
	const name = ref<string>('')
	const identity = ref<number>(0)
	const userId = ref<number>(0)
	const bindHash = ref<string>('')
	const bindLine = ref<boolean>(false)


	function setLogin(data) {
		if (!data) return
		token.value = `Bearer ${data.access_token}`
		name.value = data.name
		userId.value = data.id
		setBindLine(data.bind_line)
	}

	function setIdentity(val) {
		identity.value = typeof val === 'number' ? val : Number(val)
	}

	function setBindLine(val) {
		bindLine.value = Boolean(val)
	}

	function logout() {
		token.value = ''
		name.value = ''
		identity.value = 0
		userId.value = 0
		window.location.reload()
	}

	return {
		token,
		name,
		identity,
		userId,
		bindHash,
		bindLine,
		setLogin,
		setIdentity,
		setBindLine,
		logout
	}
}, {
	persist: [
		{ paths: ['token', 'name', 'identity', 'userId', 'bindHash', 'bindLine'], storage: localStorage }
	]
})
