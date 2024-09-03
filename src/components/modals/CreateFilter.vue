<script setup>
import {ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useFiltersStore} from "@/stores/filters.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useModalsStore} from "@/stores/modals.js";

const loading = ref(false);

const currentLanguage = ref('ru')

const modals = useModalsStore()
const filters = useFiltersStore()
const notifications = useNotificationStore()

const form = ref({
  title: {
    ru: "",
    kz: "",
    en: ""
  },
  values: [{
    ru: "",
    kz: "",
    en: ""
  }]
});

const v$ = useVuelidate({
  title: {
    ru: {required}
  }
}, form);

const createFilter = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    loading.value = false;
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    return;
  }
  await filters.createFilter(form.value);
  if (filters.createdFilter !== false) {
    await filters.getFiltersListWithPG()
    notifications.showNotification("success", "Фильтр успешно создан!", "Фильтр успешно создан, его можно увидеть в списке фильтров.");
    modals.modal.show = false;
  } else {
    notifications.showNotification("error", "Ошибка создания фильтра!", "Попробуйте позже.");
  }
  loading.value = false;
};
</script>

<template>
  <div>
    <div>
      <div>
        <div>
          <div>
            <div>
              <p class="font-semibold text-xl mb-5">
                Создание фильтра
              </p>
              <p class="text-sm mb-3">
                Заполните все поля для создания нового фильтра.
              </p>
            </div>
            <div class="rounded-md px-3 pb-1.5 pt-2.5 border mb-3">
              <div class="flex gap-3 mb-3 text-sm">
                <p
                    :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'ru' },
                      { '!border !border-red-500': v$.title.ru.$error }
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
                      :class="{ '!border !border-red-500': v$.title.ru.$error }"
                      class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                    <label
                        class="block text-xs font-medium text-gray-900"
                        for="name">
                      Название
                    </label>
                    <input
                        id="name"
                        v-model="form.title.ru"
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
                      Название <span v-if="currentLanguage === 'kz'">(каз)</span>
                    </label>
                    <input
                        id="name"
                        v-model="form.title.kz"
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
                      Название <span v-if="currentLanguage === 'en'">(англ)</span>
                    </label>
                    <input
                        id="name"
                        v-model="form.title.en"
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
                      @click="form.values.push({ ru: '', kz: '', en: '' })">
                    Добавить
                  </p>
                </div>
                <div
                    v-for="(item, index) of form.values"
                    :key="index"
                    :class="{ 'mb-2' : index !== form.values.length - 1 }">
                  <div
                      class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                    <label
                        class="block text-xs font-medium text-gray-900"
                        for="name">
                      Значение <span v-if="currentLanguage === 'kz'">(каз)</span><span v-if="currentLanguage === 'en'">(англ)</span>
                    </label>
                    <input
                        v-if="currentLanguage === 'ru'"
                        id="name"
                        v-model="form.values[index].ru"
                        class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        name="name"
                        placeholder="Введите значение"
                        type="text"
                    />
                    <input
                        v-else-if="currentLanguage === 'kz'"
                        id="name"
                        v-model="form.values[index].kz"
                        class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        name="name"
                        placeholder="Мән енгізіңіз"
                        type="text"
                    />
                    <input
                        v-else
                        id="name"
                        v-model="form.values[index].en"
                        class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        name="name"
                        placeholder="Enter value"
                        type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                  v-if="!loading"
                  class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                  type="button"
                  @click="createFilter"
              >
                Создать
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
        </div>
      </div>
    </div>
  </div>
</template>
