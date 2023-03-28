import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import components from '@/components'
import Vue3TouchEvents from "vue3-touch-events";
const app = createApp(App)

components.forEach((item) => {
    app.component(item.name, item)
  })

app
.use(store)
.use(Vue3TouchEvents)
.mount('#app-slider')
