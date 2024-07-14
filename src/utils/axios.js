import { ref } from "vue";
import { stringify } from "qs";
import { defu } from "defu";
import axios from "axios";
import { useRouter } from "vue-router";
import {useNotificationStore} from "@/stores/notifications.js";

export async function api(url, method, options = {}, query = {}) {
    const token = ref(localStorage.getItem('token'));
    const router = useRouter()
    const notifications = useNotificationStore();

    const defaultPage = query.page || 1;
    const defaultPerPage = query.perPage || 10;

    const params = {
        ...query,
        page: defaultPage,
        perPage: defaultPerPage,
        ...options.params,
    };

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
        paramsSerializer: {
            serialize: (params) =>
                stringify(params, {
                    encode: false,
                    allowDots: true,
                    skipNulls: true
                })
        }
    };

    const defaults = {
        baseURL: import.meta.env.VITE_APP_BASE_URL,
        headers: headers,
        watch: false,
        method: method,
        url: url,
        params, // добавляем параметры в запрос
    };

    if (options.body) {
        defaults.data = JSON.parse(options.body);
    }

    const config = defu(options, headers);

    try {
        const response = await axios(defaults, config);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            notifications.showNotification("error", "Токен не получен или истек", "Пожалуйста, авторизуйтесь снова");
            localStorage.removeItem("token");
            router.push('/login');
        } else {
            console.error(error);
            throw error;
        }
    }
}
