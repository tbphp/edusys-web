import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export function registerTimeDirective(app) {
	let fmt = 'YYYY/MM/DD HH:mm:ss'
	app.directive('time', {
		created(el, bindings) {
			if (bindings.value) {
				fmt = bindings.value
			}
		},
		mounted(el) {
			const textContent = el.textContent
			let timeStamp = parseInt(textContent)
			if (textContent.length === 10) {
				timeStamp = timeStamp * 1000
			}
			el.textContent = dayjs(timeStamp).format(fmt)
		}
	})
}

export default dayjs
