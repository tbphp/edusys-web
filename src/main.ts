import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { registerTimeDirective } from './utils/dayjs'
import 'ant-design-vue/dist/antd.less'
import './assets/style/tailwind.css'
import './assets/style/global.less'

const app = createApp(App)
registerTimeDirective(app)

app.use(store).use(router).mount('#app')
