import { ref } from 'vue'
import { defineStore } from 'pinia'

export const userStore = defineStore('user', () => {
	const token = ref<string>(localStorage.getItem('token') || '')
	const name = ref<string>(localStorage.getItem('name') || '')
	const identity = ref<number>(0)
	const identityStr = localStorage.getItem('identity')
	if (identityStr) identity.value = Number(identityStr)
	

	function setLogin(data) {
		if (!data) return
		token.value = `Bearer ${data.access_token}`
		name.value = data.name
		localStorage.setItem('token', token.value)
		localStorage.setItem('name', name.value)
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
		window.location.reload()
	}

	return {
		token,
		name,
		setLogin,
		setIdentity,
		logout
	}
})
