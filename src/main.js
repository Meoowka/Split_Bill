import { createApp } from 'vue'
import App from './App.vue'
import router from "./Router/router.js";
import {appStore} from "./Store/Store.js";

const app = createApp(App)

app
    .use(appStore)
    .use(router)
    .mount('#app')
