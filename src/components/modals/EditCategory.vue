<script setup>
import {nextTick, onMounted, ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useNotificationStore} from "@/stores/notifications.js";
import {useModalsStore} from "@/stores/modals.js";
import {useCategoriesStore} from "@/stores/categories.js";
import UploadImage from "@/components/UploadImage.vue";
import {useFiltersStore} from "@/stores/filters.js";
import {storeToRefs} from "pinia";

const notifications = useNotificationStore();
const categories = useCategoriesStore();
const modals = useModalsStore()
const filters = useFiltersStore()
const {filtersList} = storeToRefs(filters)
const currentLanguage = ref('ru');

const loading = ref(false);

const formEdit = ref({
  title: {
    ru: "",
    kz: "",
    en: ""
  },
  image_url: "",
  filter_ids: []
});

const v$Edit = useVuelidate({
  title: {
    ru: {required},
    kz: {required},
    en: {required}
  },
  image_url: {required}
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
    await categories.getCategoriesListWithPG()
    modals.modal.show = false;
  } else {
    notifications.showNotification("error", "Ошибка редактирования категории!", categories.editedCategory.message);
  }
  loading.value = false;
};

onMounted(async () => {
  await nextTick()
  formEdit.value.title = modals.modal.modalData.title;
  formEdit.value.image_url = modals.modal.modalData.image_url;
  modals.modal.modalData.category_filters.forEach((filter) => {
    formEdit.value.filter_ids.push(filter.id)
  })
  await filters.getFiltersList()
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
    <div class="rounded-md px-3 pb-1.5 pt-2.5 border mb-3">
      <div class="flex gap-3 mb-3 text-sm">
        <p
            :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'ru' },
                      { '!border !border-red-500': v$Edit.title.ru.$error }
                  ]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
            @click="currentLanguage = 'ru'">
          Русский
        </p>
        <p
            :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'kz' },
                      { '!border !border-red-500': v$Edit.title.kz.$error }
                  ]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
            @click="currentLanguage = 'kz'">
          Казахский
        </p>
        <p
            :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'en' },
                      { '!border !border-red-500': v$Edit.title.en.$error }
                  ]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
            @click="currentLanguage = 'en'">
          Английский
        </p>
      </div>
      <div v-if="currentLanguage === 'ru'">
        <div
            :class="{ '!border !border-red-500': v$Edit.title.ru.$error }"
            class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              class="block text-xs font-medium text-gray-900"
              for="name">
            Название
          </label>
          <input
              id="name"
              v-model="formEdit.title.ru"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name="name"
              placeholder="Название категории"
              type="text"
          />
        </div>
      </div>
      <div v-else-if="currentLanguage === 'kz'">
        <div
            :class="{ '!border !border-red-500': v$Edit.title.kz.$error }"
            class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              class="block text-xs font-medium text-gray-900"
              for="name">
            Название
          </label>
          <input
              id="name"
              v-model="formEdit.title.kz"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name="name"
              placeholder="Санат атауы"
              type="text"
          />
        </div>
      </div>
      <div v-else>
        <div
            :class="{ '!border !border-red-500': v$Edit.title.en.$error }"
            class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              class="block text-xs font-medium text-gray-900"
              for="name">
            Название
          </label>
          <input
              id="name"
              v-model="formEdit.title.en"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name="name"
              placeholder="Name of category"
              type="text"
          />
        </div>
      </div>
    </div>
    <div class="mb-3">
      <UploadImage
          :class="{ '!border !border-red-500': v$Edit.image_url.$error }"
          :preview_image="formEdit.image_url"
          type="products"
          @photoUploaded="(image) => formEdit.image_url = image"
      />
    </div>
    <div v-if="filtersList">
      <fieldset>
        <p class="block text-xs font-medium text-gray-900 mb-3">
          Выберите фильтры
        </p>
        <div class="space-y-2 text-xs">
          <div
              v-for="(item, index) in filtersList.data"
              :key="index"
              class="relative flex items-start">
            <div class="flex h-6 items-center">
              <input
                  :id="item.id"
                  :checked="formEdit.filter_ids.includes(item.id)"
                  :name="item.id"
                  :value="item.id"
                  aria-describedby="comments-description"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  type="checkbox"
                  @click="formEdit.filter_ids.includes(item.id) ? formEdit.filter_ids = formEdit.filter_ids.filter(id => id !== item.id) : formEdit.filter_ids.push(item.id)"
              />
            </div>
            <div class="ml-3 leading-6">
              <label :for="item.id" class="font-medium text-gray-900">{{ item.title.ru }}</label>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          type="button"
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
          ref="cancelButtonRef"
          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          type="button"
          @click="modals.modal.show = false">
        Отменить
      </button>
    </div>
  </div>
</template>