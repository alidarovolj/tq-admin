import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";


export const useProductsStore = defineStore('products', () => {
    const productsList = ref(null);
    const notifications = useNotificationStore()

    return {
        productsList,
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
        }
    };
});
