import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/tools/reset.css' // 初始化样式
import ElementPlus from 'element-plus' // 使用element-plus
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())

app.use(router).mount('#app')
