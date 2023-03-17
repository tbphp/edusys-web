import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/modules/user'

const store = useUserStore()

const http = axios.create({
	baseURL: import.meta.env.VITE_API,
	headers: {
		Authorization: 'test-token'
	},
	timeout: 1000 * 60 * 5
})

http.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		const token = store.token
		if (token) config.headers = {
			Authorization: token
		}
		return config
	},
	(err: any) => err
)

const ignore401Urls = ['/login', '/register']

http.interceptors.response.use(
	(res: AxiosResponse) => {
		const { status, data, statusText, config } = res
		if (status === 200) {
			if (data.code === 200) {
				const resData = data.data
				if (resData?.access_token) {
					store.setLogin(resData)
				}
				return resData
			} else if (data.code === 401 && !ignore401Urls.includes(config.url!)) {
				message.error(data.msg)
				store.logout()
			} else {
				message.error(data.msg || `Error:${data.code}`)
			}
			return Promise.reject(data)
		} else {
			message.error(statusText || `Error:${status}`)
			return Promise.reject(data)
		}
	},
	(err: any) => {
		const res = err.response
		message.error(res?.statusText ?? `Error:${res?.status}`)
		return Promise.reject(err)
	}
)

export default http
