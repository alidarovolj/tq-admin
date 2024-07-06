import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from "@/utils/axios.js";
import { useNotificationStore } from "@/stores/notifications.js";
import { useRoute } from "vue-router";

export const useFiltersStore = defineStore('filters', () => {
    const filtersList = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        filtersList,
        async getFiltersList() {
            try {
                const response = await api(`/api/filters/all`, "GET", {}, route.query);
                const data = response.data;
                filtersList.value = data;
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
