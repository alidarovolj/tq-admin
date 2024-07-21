import {createApp} from 'vue'
import './assets/css/style.css'
import './assets/css/fonts.css'
import {createPinia} from 'pinia'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from './router'

const pinia = createPinia()

createApp(App)
    .use(PrimeVue)
    .use(router)
    .use(pinia)
    .mount('#app')
