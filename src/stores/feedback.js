import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useFeedbackStore = defineStore('feedback', () => {
    const feedbackList = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        feedbackList,
        async getFeedbackList() {
            try {
                const response = await api(`/feedback`, "GET", {}, route.query);
                const data = response.data;
                feedbackList.value = data;
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
