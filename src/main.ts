import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'ant-design-vue/dist/antd.less'
import './assets/style/tailwind.css'
import './assets/style/global.less'
// import { mockXHR } from '../mock'

// mock
// if (process.env.NODE_ENV === 'development') {
//   mockXHR()
// }

console.log('test')

const app = createApp(App)

app.use(store).use(router).mount('#app')
