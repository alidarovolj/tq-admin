import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useNewsStore = defineStore('news', () => {
    const newsListWithPG = ref(null);
    const createdNews = ref(null);
    const editedNews = ref(null);
    const detailNews = ref(null);
    const removedNews = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        newsListWithPG,
        createdNews,
        editedNews,
        detailNews,
        removedNews,
        async getNewsListWithPG() {
            try {
                const response = await api(`/new-news`, "GET", {}, route.query);
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
        async getDetailNews(id) {
            try {
                const response = await api(`/new-news/${id}`, "GET", {}, route.query);
                const data = response.data;
                detailNews.value = data;
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
                const response = await api(`/admin/new-news`, "POST", {
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
        async editNews(id, form) {
            try {
                const response = await api(`/admin/new-news/${id}`, "PUT", {
                    body: JSON.stringify(form),
                }, route.query);
                const data = response.data;
                editedNews.value = data;
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
        async removeNews(id, form) {
            try {
                const response = await api(`/admin/new-news/${id}`, "DELETE", {
                    body: JSON.stringify(form),
                }, route.query);
                const data = response.data;
                removedNews.value = data;
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
