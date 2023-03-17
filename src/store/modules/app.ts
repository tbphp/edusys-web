import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
	const curSchool = ref<any>()
	
	function setCurSchool(data: any) {
		curSchool.value = data
	}

	return {
		curSchool,
		setCurSchool
	}
}, {
	persist: [
		{ paths: ['curSchool'], storage: sessionStorage }
	]
})
