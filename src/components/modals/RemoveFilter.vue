<script setup>
import {ref} from "vue";
import {XMarkIcon} from '@heroicons/vue/24/outline'
import {useModalsStore} from "@/stores/modals.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useFiltersStore} from "@/stores/filters.js";

const loading = ref(false)

const modals = useModalsStore()
const filters = useFiltersStore()
const notifications = useNotificationStore();

const removeFilter = async () => {
  loading.value = true

  await filters.removeFilter(modals.modal.modalData.id)
  if (filters.removedFilter !== false) {
    notifications.showNotification("success", "Пользователь успешно удален", "Пользователь успешно удален из системы и не сможет войти в нее.");
    await filters.getFiltersList()
    modals.modal.show = false;
  } else {
    notifications.showNotification("error", "Ошибка", users.removedUser.message);
  }
  loading.value = false
}
</script>

<template>
  <div>
    <div>
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <XMarkIcon aria-hidden="true" class="h-6 w-6 text-red-600"/>
      </div>
      <div class="mt-3 text-center sm:mt-5">
        <p class="text-base font-semibold leading-6 text-gray-900">
          Хотите удалить фильтр?
        </p>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            Фильтр будет удален из системы и не сможет быть восстановлен.
          </p>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          type="button"
          @click="removeFilter"
      >
        Подтвердить
      </button>
      <div
          v-else
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2">
        <span class="spinner"></span>
      </div>
      <button
          ref="cancelButtonRef"
          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          type="button"
          @click="modals.modal.show = false">
        Отменить
      </button>
    </div>
  </div>
</template>