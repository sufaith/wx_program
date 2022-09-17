import { createApp } from 'vue'
import http from './utils/http'
import localStore from './utils/localStore'
import App from './App.vue'
import router from './router/index'
import 'vfonts/Lato.css'

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

const app = createApp(App)
app.use(router)
app.config.globalProperties.$http = http
app.config.globalProperties.$localStore = localStore
app.mount('#app')
