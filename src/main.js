import {createApp} from 'vue'
import './assets/css/style.css'
import './assets/css/fonts.css'
import {createPinia} from 'pinia'
import App from './App.vue'
import router from './router'

const pinia = createPinia()

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
