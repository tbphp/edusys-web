import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
	const token = ref<string>(localStorage.getItem('token') || '')
	const name = ref<string>(localStorage.getItem('name') || '')
	const identity = ref<number>(0)
	const userId = ref<number>(0)
	const bindHash = ref<string>('')
	const identityStr = localStorage.getItem('identity')
	if (identityStr) identity.value = Number(identityStr)
	const userIdStr = localStorage.getItem('userId')
	if (userIdStr) userId.value = Number(userIdStr)
	const bindLine = ref<Boolean>(false)
	const bindLineStr = localStorage.getItem('bind_line')
	bindLine.value = bindLineStr === '1'


	function setLogin(data) {
		if (!data) return
		token.value = `Bearer ${data.access_token}`
		name.value = data.name
		userId.value = data.id
		localStorage.setItem('token', token.value)
		localStorage.setItem('name', name.value)
		localStorage.setItem('userId', userId.value)
		setBindLine(data.bind_line)
	}

	function setIdentity(val) {
		identity.value = typeof val === 'number' ? val : Number(val)
		localStorage.setItem('identity', val)
	}

	function setBindLine(val) {
		bindLine.value = Boolean(val)
		localStorage.setItem('bind_line', val ? '1' : '0')
	}

	function logout() {
		token.value = ''
		name.value = ''
		identity.value = 0
		userId.value = 0
		localStorage.removeItem('token')
		localStorage.removeItem('name')
		localStorage.removeItem('identity')
		localStorage.removeItem('userId')
		localStorage.removeItem('bind_line')
		window.location.reload()
	}

	return {
		token,
		name,
		identity,
		bindHash,
		bindLine,
		setLogin,
		setIdentity,
		setBindLine,
		logout
	}
})
