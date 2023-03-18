import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { Identity } from '@/utils/config'
import { useUserStore } from '@/store/modules/user'

const whiteList = [
	'/login',
	'/register',
	'/line-login',
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
		const store = useUserStore()
		const token = store.token
		if (token) {
			const identity = store.identity
			if (to.path === '/') {
				next(identity == Identity.Teacher ? '/schools' : '/student')
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
