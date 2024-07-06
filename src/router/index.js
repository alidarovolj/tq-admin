import {createWebHistory, createRouter} from 'vue-router'

import loginView from '@/views/login/index.vue'
import usersView from '@/views/users/index.vue'
import dashboardView from '@/views/dashboard/index.vue'
import productsView from "@/views/products/index.vue";
import productCreate from "@/views/products/create/index.vue";
import categoriesView from "@/views/categories/index.vue";

const routes = [
    {
        path: '/login',
        name: "Login",
        component: loginView
    },
    {
        path: '/',
        name: "Dashboard",
        component: dashboardView,
        meta: {requiresAuth: true}
    },
    {
        path: '/users',
        name: "Users",
        component: usersView,
        meta: {requiresAuth: true}
    },
    {
        path: '/categories',
        name: "Categories",
        component: categoriesView,
        meta: {requiresAuth: true}
    },
    {
        path: '/products',
        name: "Products",
        component: productsView,
        meta: {requiresAuth: true}
    },
    {
        path: '/products/create',
        name: "ProductsCreate",
        component: productCreate,
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
