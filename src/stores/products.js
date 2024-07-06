import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";


export const useProductsStore = defineStore('products', () => {
    const route = useRoute();
    const productsList = ref(null);
    const createdProduct = ref(null);
    const notifications = useNotificationStore()

    return {
        productsList,
        createdProduct,
        async getProductsList(page, perPage) {
            try {
                let response = null
                if(page && perPage) {
                    response = await api(`/api/admin/products?page=${page}&perPage=${perPage}`, "GET");
                } else {
                    response = await api(`/api/admin/products/`, "GET");
                }
                const data = response.data;

                productsList.value = data
            } catch (e) {
                if (e.response.status !== 500) {
                    notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                } else {
                    notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                }
            }
        },
        async createProduct(form) {
            try {
                const response = await api(`api/admin/products`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                createdProduct.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        createdProduct.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        createdProduct.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    createdProduct.value = false;
                }
            }
        },
    };
});
