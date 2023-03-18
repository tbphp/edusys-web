import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
	const token = ref<string>(localStorage.getItem('token') || '')
	const name = ref<string>(localStorage.getItem('name') || '')
	const identity = ref<number>(0)
	const bindHash = ref<string>('')
	const identityStr = localStorage.getItem('identity')
	if (identityStr) identity.value = Number(identityStr)
	const bindLine = ref<Boolean>(false)
	const bindLineStr = localStorage.getItem('bind_line')
	bindLine.value = bindLineStr === '1'


	function setLogin(data) {
		if (!data) return
		token.value = `Bearer ${data.access_token}`
		name.value = data.name
		bindLine.value = data.bind_line
		localStorage.setItem('token', token.value)
		localStorage.setItem('name', name.value)
		localStorage.setItem('bind_line', data.bind_line ? '1' : '0')
	}

	function setIdentity(val) {
		identity.value = typeof val === 'number' ? val : Number(val)
		localStorage.setItem('identity', val)
	}

	function logout() {
		token.value = ''
		name.value = ''
		identity.value = 0
		localStorage.removeItem('token')
		localStorage.removeItem('name')
		localStorage.removeItem('identity')
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
		logout
	}
})
