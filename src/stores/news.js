import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useNewsStore = defineStore('news', () => {
    const newsListWithPG = ref(null);
    const newsCategories = ref(null);
    const createdNews = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        newsListWithPG,
        newsCategories,
        createdNews,
        async getNewsListWithPG() {
            try {
                const response = await api(`/api/admin/news`, "GET", {}, route.query);
                const data = response.data;
                newsListWithPG.value = data;
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
        async getNewsCategories() {
            try {
                const response = await api(`/api/admin/news/categories/all`, "GET", {}, route.query);
                const data = response.data;
                newsCategories.value = data;
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
        async createNews(form) {
            try {
                const response = await api(`/api/admin/news`, "POST", {
                    body: JSON.stringify(form),
                }, route.query);
                const data = response.data;
                createdNews.value = data;
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
    };
});
