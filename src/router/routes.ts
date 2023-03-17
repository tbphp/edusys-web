// 路由列表
import { Identity } from '@/utils/config'

export const routes = [
	{
		path: '/',
		name: 'Layout',
		meta: {
			roles: [Identity.Teacher, Identity.Student]
		},
		component: () => import('@/views/Layout/index.vue'),
		children: [
			{
				path: 'schools',
				name: 'Schools',
				meta: {
					roles: [Identity.Teacher]
				},
				component: () => import('@/views/School/index.vue')
			},
			{
				path: 'fans',
				name: 'Fans',
				meta: {
					roles: [Identity.Teacher]
				},
				component: () => import('@/views/Fan/index.vue')
			},
			{
				path: 'schoolDetail',
				meta: {
					roles: [Identity.Teacher, Identity.Student]
				},
				component: () => import('@/views/SchoolDetail/index.vue'),
				children: [
					{
						path: 'students',
						name: 'Students',
						meta: {
							roles: [Identity.Teacher]
						},
						component: () => import('@/views/Student/index.vue')
					},
					{
						path: 'teachers',
						name: 'Teachers',
						meta: {
							roles: [Identity.Teacher, Identity.Student]
						},
						component: () => import('@/views/Teacher/index.vue')
					}
				]
			}
		]
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/Login/index.vue')
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import('@/views/Register/index.vue')
	},
	{
		path: '/403',
		name: '403',
		component: () => import('@/views/403.vue')
	},
	{
		path: '/404',
		name: '404',
		component: () => import('@/views/404.vue')
	},
	{ 
		path: '/:pathMatch(.*)*',
		redirect: '/404'
	}
]
