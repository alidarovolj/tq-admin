import {createRouter, createWebHistory} from 'vue-router'

import loginView from '@/views/login/index.vue'
import usersView from '@/views/users/index.vue'
import dashboardView from '@/views/dashboard/index.vue'
import newsView from "@/views/news/index.vue";
import newsCreate from "@/views/news/create/index.vue";
import newsEdit from "@/views/news/edit/index.vue";
import productsNews from "@/views/products/index.vue"
import ordersView from "@/views/orders/index.vue";
import feedbackView from "@/views/feedback/index.vue";

const routes = [
    {
        path: '/login',
        name: "Login",
        component: loginView
    },
    {
        path: '/orders',
        name: "Orders",
        component: ordersView
    },
    {
        path: '/messages',
        name: "Messages",
        component: feedbackView
    },
    {
        path: '/products',
        name: "Products",
        component: productsNews
    },
    {
        path: '/',
        name: "UsersMain",
        component: usersView,
        meta: {requiresAuth: true}
    },
    {
        path: '/users',
        name: "Users",
        component: usersView,
        meta: {requiresAuth: true}
    },
    {
        path: '/news',
        name: "News",
        component: newsView,
        meta: {requiresAuth: true}
    },
    {
        path: '/news/create',
        name: "NewsCreate",
        component: newsCreate,
        meta: {requiresAuth: true}
    },
    {
        path: '/news/edit/:id',
        name: "NewsEdit",
        component: newsEdit,
        meta: {requiresAuth: true}
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        next('/login');
    } else {
        next();
    }
});

export default router
