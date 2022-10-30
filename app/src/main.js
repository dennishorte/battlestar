import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import authUtil from '@/modules/auth/util.js'
authUtil.initialize()

// Global Styles
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import '@/assets/css/tyrants.css'

const app = createApp(App)
app.use(router)
app.use(store)

app.config.unwrapInjectedRef = true

app.mount('#app')
