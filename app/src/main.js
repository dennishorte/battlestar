import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import authUtil from '@/modules/auth/util.js'
authUtil.initialize()

// Global Styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'mana-font/css/mana.min.css'

import '@/assets/css/tyrants.css'

const app = createApp(App)
app.use(router)
app.use(store)

app.config.compilerOptions.whitespace = 'preserve'
app.config.unwrapInjectedRef = true

// Function for fetching and programatically acting on modals.
import Modal from 'bootstrap/js/dist/modal'
app.config.globalProperties.$modal = (elemId, opts={}) => {
  const elem = document.getElementById(elemId)
  return new Modal(elem, opts)
}

// Standardized handling for axios requests
import axiosWrapper from './util/axiosWrapper.js'
app.config.globalProperties.$post = axiosWrapper.post

app.mount('#app')
