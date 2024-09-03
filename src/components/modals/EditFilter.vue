<script setup>
import {nextTick, onMounted, ref} from "vue";
import {TrashIcon} from "@heroicons/vue/24/outline"
import {useVuelidate} from "@vuelidate/core";
import {minLength, required} from "@vuelidate/validators";
import {useNotificationStore} from "@/stores/notifications.js";
import {useModalsStore} from "@/stores/modals.js";
import {useFiltersStore} from "@/stores/filters.js";
import {storeToRefs} from "pinia";

const notifications = useNotificationStore();
const modals = useModalsStore()
const filters = useFiltersStore()
const {filterDetail} = storeToRefs(filters)
const currentLanguage = ref('ru');

const loading = ref(false);

const formEdit = ref({
  title: {
    ru: "",
    kz: "",
    en: ""
  },
  values: []
});

const v$Edit = useVuelidate({
  title: {
    ru: {required},
  },
  values: {required, minLength: minLength(1)}
}, formEdit);

const editFilter = async () => {
  loading.value = true;
  await v$Edit.value.$validate();

  if (v$Edit.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }
  await filters.editFilter(modals.modal.modalData.id, formEdit.value);
  if (filters.editedFilter !== false) {
    notifications.showNotification("success", "Фильтр успешно отредактирован!", "Фильтр успешно отредактирован, его можно увидеть в списке фильтров.");
    await filters.getFiltersListWithPG()
    modals.modal.show = false;
  } else {
    notifications.showNotification("error", "Ошибка редактирования фильтра!", filters.editedFilter.message);
  }
  loading.value = false;
};

onMounted(async () => {
  await nextTick()
  await filters.getDetailFilter(modals.modal.modalData.id)
  formEdit.value.title = filterDetail.value.title
  filterDetail.value.values.forEach((item) => {
    formEdit.value.values.push(item.values)
  })
  // await filters.getFiltersListWithPG()
})
</script>

<template>
  <div>
    <div>
      <p class="font-semibold text-xl mb-5">
        Редактирование фильтра
      </p>
      <p class="text-sm mb-3">
        Заполните все поля для завершения редактирования фильтра.
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
                      { 'bg-mainColor text-white': currentLanguage === 'kz' }
                  ]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
            @click="currentLanguage = 'kz'">
          Казахский
        </p>
        <p
            :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'en' }
                  ]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
            @click="currentLanguage = 'en'">
          Английский
        </p>
      </div>
      <div class="mb-3">
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
      <div>
        <div class="flex justify-between mb-2 text-xs">
          <p>Введите значения</p>
          <p
              class="text-mainColor cursor-pointer"
              @click="formEdit.values.push({ ru: '', kz: '', en: '' })">
            Добавить
          </p>
        </div>
        <div
            v-for="(item, index) of formEdit.values"
            :key="index"
            :class="{ 'mb-2' : index !== formEdit.values.length - 1 }"
            class="flex gap-2 items-center">
          <div
              class="w-full rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
            <label
                class="block text-xs font-medium text-gray-900"
                for="name">
              Значение <span v-if="currentLanguage === 'kz'">(каз)</span><span
                v-if="currentLanguage === 'en'">(англ)</span>
            </label>
            <input
                v-if="currentLanguage === 'ru'"
                id="name"
                v-model="formEdit.values[index].ru"
                class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                name="name"
                placeholder="Введите значение"
                type="text"
            />
            <input
                v-else-if="currentLanguage === 'kz'"
                id="name"
                v-model="formEdit.values[index].kz"
                class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                name="name"
                placeholder="Мән енгізіңіз"
                type="text"
            />
            <input
                v-else
                id="name"
                v-model="formEdit.values[index].en"
                class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                name="name"
                placeholder="Enter value"
                type="text"
            />
          </div>
          <TrashIcon
              class="w-5 h-5 cursor-pointer text-mainColor"
              @click="formEdit.values.splice(index, 1)"
          />
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          type="button"
          @click="editFilter"
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