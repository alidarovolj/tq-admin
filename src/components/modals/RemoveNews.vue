<script setup>
import {ref} from "vue";
import {XMarkIcon} from '@heroicons/vue/24/outline'
import {useModalsStore} from "@/stores/modals.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useNewsStore} from "@/stores/news.js";

const loading = ref(false)

const modals = useModalsStore()
const news = useNewsStore()
const notifications = useNotificationStore();

const removeNews = async () => {
  loading.value = true

  await news.removeNews(modals.modal.modalData.id)
  if (news.removedNews !== false) {
    notifications.showNotification("success", "Новость успешно удалена", "Новость успешно удалена из системы.");
    await news.getNewsListWithPG()
    modals.modal.show = false;
  } else {
    notifications.showNotification("error", "Ошибка", news.removedNews.message);
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
          Хотите удалить новость?
        </p>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            Новостная категория будет удалена из системы и не сможет быть восстановлена.
          </p>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          type="button"
          @click="removeNews"
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