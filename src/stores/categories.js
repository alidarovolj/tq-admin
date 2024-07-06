import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from "@/utils/axios.js";
import { useNotificationStore } from "@/stores/notifications.js";
import { useRoute } from "vue-router";

export const useCategoriesStore = defineStore('categories', () => {
    const categoriesList = ref(null);
    const categoriesListWithPG = ref(null);
    const createdCategory = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        categoriesList,
        categoriesListWithPG,
        createdCategory,
        async getCategoriesList() {
            try {
                const response = await api(`/api/admin/categories/all`, "GET", {}, route.query);
                const data = response.data;
                categoriesList.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                }
            }
        },
        async getCategoriesListWithPG() {
            try {
                const response = await api(`/api/admin/categories`, "GET", {}, route.query);
                const data = response.data;
                categoriesListWithPG.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                }
            }
        },
        async createCategory(form) {
            try {
                const response = await api(`/api/admin/categories`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                createdCategory.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                }
            }
        }
    };
});
