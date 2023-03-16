import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import svgLoader from 'vite-svg-loader'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd())
	return {
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src')
			}
		},
		plugins: [
			vue(),
			svgLoader(),
			Components({
				dts: true, // ts 支持
				resolvers: [
					AntDesignVueResolver({
						importStyle: false, // 是否自动随引入加载对应的组件样式，禁用，因为某些二级组件(如 DateRangePicker )没办法准确地识别正确路径，手动引入全局样式
						resolveIcons: true // 是否使用@ant-design/icons-vue图标库
					})
				]
			})
		],
		css: {
			preprocessorOptions: {
				less: {
					javascriptEnabled: true, // 必须开启，不然ant样式库引入时会报错
					modifyVars: {
						'primary-color': '#2A8DFF'
					}
				}
			}
		},
		// server: {
		// 	proxy: {
		// 		[env.VITE_API]: {
		// 			target: env.VITE_PROXY,
		// 			changeOrigin: true
		// 		}
		// 	}
		// }
	}
})
