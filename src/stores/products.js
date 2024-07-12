import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";


export const useProductsStore = defineStore('products', () => {
    const route = useRoute();
    const productsList = ref(null);
    const createdProduct = ref(null);
    const editedProduct = ref(null);
    const detailProductResult = ref(null);
    const notifications = useNotificationStore()

    return {
        productsList,
        createdProduct,
        editedProduct,
        detailProductResult,
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
        async detailProduct(id, form) {
            try {
                const response = await api(`api/admin/products/${id}`, "GET");
                const data = response.data;
                detailProductResult.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        detailProductResult.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        detailProductResult.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    detailProductResult.value = false;
                }
            }
        },
        async editProduct(id, form) {
            try {
                const response = await api(`api/admin/products/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                editedProduct.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        editedProduct.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        editedProduct.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    editedProduct.value = false;
                }
            }
        },
    };
});
