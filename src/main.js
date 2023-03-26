import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import components from '@/components'

const app = createApp(App)

components.forEach((item) => {
    app.component(item.name, item)
  })
  
  // импортируем чтобы сделать глобальный миксин
  // import loginmixins from './mixins/loginmixins'
//   import mixins from '@/mixins'
  
//   mixins.forEach((item) => {
//     app.mixin(item)
//   })
  
//   import Vtooltip from './directives/Vtooltip'
//   app.directive('tooltip', Vtooltip)

app.use(store).mount('#app-slider')
