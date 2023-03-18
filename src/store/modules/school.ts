import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSchoolStore = defineStore('app', () => {
	const curSchool = ref<any>()
	const isOwner = ref(false)
	
	function setCurSchool(data: any) {
		curSchool.value = data
	}

	function setIsOwner(val) {
		isOwner.value = val
	}

	return {
		curSchool,
		setCurSchool,
		setIsOwner
	}
}, {
	persist: [
		{ paths: ['curSchool', 'isOwner'], storage: sessionStorage }
	]
})
