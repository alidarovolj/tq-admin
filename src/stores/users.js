import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from "@/utils/axios.js";
import { useNotificationStore } from "@/stores/notifications.js";
import { useRoute } from "vue-router";

export const useUsersStore = defineStore('users', () => {
    const userProfile = ref(null);
    const userList = ref(null);
    const createdUser = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        userProfile,
        userList,
        createdUser,
        async getProfile() {
            try {
                const response = await api(`/api/auth/me`, "GET", {}, route.query);
                const data = response.data;
                userProfile.value = data;
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
        async getUserList() {
            try {
                const response = await api(`/api/admin/users`, "GET", {}, route.query);
                const data = response.data;
                userList.value = data;
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
        async createUser(form) {
            try {
                const response = await api(`/api/admin/users`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                createdUser.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        createdUser.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        createdUser.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    createdUser.value = false;
                }
            }
        }
    };
});
