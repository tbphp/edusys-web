import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { Identity } from '@/utils/config'

const whiteList = [
	'/login',
	'/register',
	'/403',
	'/404'
]

const router = createRouter({
	history: createWebHistory('/'),
	routes: routes,
	strict: true,
	scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach((to, from, next) => {
	if (whiteList.includes(to.path)) {
		next()
	} else {
		const token = localStorage.getItem('token')
		if (token) {
			const identity = Number(localStorage.getItem('identity'))
			if (to.path === '/') {
				next(identity == Identity.Teacher ? '/schools' : '/schoolDetail/teachers')
			} else {
				const roles = to.meta.roles as any[]
				if (!roles || roles.includes(identity)) {
					next()
				} else {
					next('/403')
				}
			}
		} else {
			next('/login')
		}
	}
})

export default router
