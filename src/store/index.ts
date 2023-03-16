import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // store持久化本地缓存插件

const store = createPinia()
store.use(piniaPluginPersistedstate)

export default store
