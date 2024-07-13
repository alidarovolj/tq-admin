<script setup>
import {nextTick, onMounted, ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useNotificationStore} from "@/stores/notifications.js";
import {useModalsStore} from "@/stores/modals.js";
import {useCategoriesStore} from "@/stores/categories.js";

const notifications = useNotificationStore();
const categories = useCategoriesStore();
const modals = useModalsStore()

const loading = ref(false);

const formEdit = ref({
  title: {
    ru: "",
    kz: "",
    en: ""
  }
});

const v$Edit = useVuelidate({
  title: {
    ru: {required},
    kz: {required},
    en: {required}
  },
}, formEdit);

const editCategory = async () => {
  loading.value = true;
  await v$Edit.value.$validate();

  if (v$Edit.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }
  await categories.editCategory(modals.modal.modalData.id, formEdit.value);
  if (categories.editedCategory !== false) {
    notifications.showNotification("success", "Категория успешно отредактирована!", "Категория успешно отредактирована, ее можно увидеть в списке категорий.");
    await categories.getCategoriesList();
    modals.modal.show = false;
  } else {
    notifications.showNotification("error", "Ошибка редактирования категории!", categories.editedCategory.message);
  }
  loading.value = false;
};

onMounted(async () => {
  await nextTick()
  formEdit.value.title = modals.modal.modalData.title;
})
</script>

<template>
  <div>
    <div>
      <p class="font-semibold text-xl mb-5">
        Редактирование категории
      </p>
      <p class="text-sm mb-3">
        Заполните все поля для завершения редактирования категории.
      </p>
    </div>
    <div
        :class="{ '!border !border-red-500': v$Edit.title.ru.$error }"
        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label
          for="name"
          class="block text-xs font-medium text-gray-900">
        Название
      </label>
      <input
          v-model="formEdit.title.ru"
          type="text"
          name="name"
          id="name"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Краски"
      />
    </div>
    <div
        :class="{ '!border !border-red-500': v$Edit.title.kz.$error }"
        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label
          for="name"
          class="block text-xs font-medium text-gray-900">
        Название (каз)
      </label>
      <input
          v-model="formEdit.title.kz"
          type="text"
          name="name"
          id="name"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Бояулар"
      />
    </div>
    <div
        :class="{ '!border !border-red-500': v$Edit.title.en.$error }"
        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label
          for="name"
          class="block text-xs font-medium text-gray-900">
        Название (англ)
      </label>
      <input
          v-model="formEdit.title.en"
          type="text"
          name="name"
          id="name"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Paints"
      />
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          @click="editCategory"
      >
        Сохранить
      </button>
      <div
          v-else
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2">
        <span class="spinner"></span>
      </div>
      <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          @click="modals.modal.show = false"
          ref="cancelButtonRef">
        Отменить
      </button>
    </div>
  </div>
</template>