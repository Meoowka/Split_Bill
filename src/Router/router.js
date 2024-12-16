import {createRouter, createWebHistory} from "vue-router";
import mainPages from "../Pages/mainPages.vue";
import userPages from "../Pages/userPages.vue";
import productPages from "../Pages/productPages.vue";
import resultBill from "../Pages/resultBill.vue";

const routes = [
    {
        path: '/',
        component: mainPages
    },
    {
        path: '/users',
        component: userPages
    },
    {
        path: '/products',
        component: productPages
    },
    {
        path: '/bill',
        component: resultBill
    }

]


const router = createRouter({
    routes: routes,
    history: createWebHistory()
})

export default router;