<script setup>
import {ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useModalsStore} from "@/stores/modals.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useBrandsStore} from "@/stores/brands.js";

const loading = ref(false);

const modals = useModalsStore()
const notifications = useNotificationStore();
const brands = useBrandsStore()

const form = ref({
  title: {
    ru: "",
    kz: "",
    en: ""
  }
});

const v$ = useVuelidate({
  title: {
    ru: {required}
  },
}, form);

const createBrands = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }
  await brands.createBrand(form.value);
  if (brands.createdBrand !== false) {
    notifications.showNotification("success", "Бренд успешно создан!", "Бренд успешно создан, его можно увидеть в списке брендов.");
    await brands.getBrandsList();
    modals.modal.show = false;
  } else {
    notifications.showNotification("error", "Ошибка создания бренда!", brands.createdBrand.message);
  }
  loading.value = false;
};
</script>

<template>
  <div>
    <div>
      <div>
        <div>
          <p class="font-semibold text-xl mb-5">
            Создание бренда
          </p>
          <p class="text-sm mb-3">
            Заполните все поля для создания нового бренда.
          </p>
        </div>
        <div
            :class="{ '!border !border-red-500': v$.title.ru.$error }"
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
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
              placeholder="Remalux"
              type="text"
          />
        </div>
        <div
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              class="block text-xs font-medium text-gray-900"
              for="name">
            Название (каз)
          </label>
          <input
              id="name"
              v-model="form.title.kz"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name="name"
              placeholder="Remalux"
              type="text"
          />
        </div>
        <div
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              class="block text-xs font-medium text-gray-900"
              for="name">
            Название (англ)
          </label>
          <input
              id="name"
              v-model="form.title.en"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name="name"
              placeholder="Remalux"
              type="text"
          />
        </div>
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
              v-if="!loading"
              class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
              type="button"
              @click="createBrands"
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
</template>