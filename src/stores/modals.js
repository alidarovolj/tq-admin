import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useModalsStore = defineStore('modals', () => {
    const modal = ref({
        show: false,
        type: '',
        title: '',
        message: ''
    });

    const showModal = (type, title, message) => {
        modal.value = {
            show: true,
            type,
            title,
            message
        };
    };

    return {
        modal,
        showModal
    };
});
