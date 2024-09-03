<script setup>
import {onMounted, ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useNotificationStore} from "@/stores/notifications.js";
import {useUsersStore} from "@/stores/users.js";
import {useModalsStore} from "@/stores/modals.js";
import {useAddressesStore} from "@/stores/addresses.js";
import {storeToRefs} from "pinia";

const notifications = useNotificationStore();
const users = useUsersStore();
const modals = useModalsStore()
const addresses = useAddressesStore()
const {citiesList} = storeToRefs(addresses)

const loading = ref(false);

const formEdit = ref({
  name: "",
  city_id: "",
  delivery_address: "",
  company_name: "",
  delivery_type: ""
});

const v$Edit = useVuelidate({
  name: {required},
  city_id: {required},
  delivery_address: {required},
  company_name: {required},
  delivery_type: {required}
}, formEdit);

const editUser = async () => {
  loading.value = true;
  await v$Edit.value.$validate();

  if (v$Edit.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }
  await users.editUser(modals.modal.modalData.id, formEdit.value);
  if (users.editedUser !== false) {
    notifications.showNotification("success", "Пользователь успешно отредактирован!", "Пользователь успешно отредактирован, его можно увидеть в списке пользователей.");
    await users.getUserList()
    modals.modal.show = false;
  } else {
    notifications.showNotification("error", "Ошибка создания пользователя!", users.editedUser.message);
  }
  loading.value = false;
};

onMounted(async () => {
  await addresses.getCities()
  formEdit.value.name = modals.modal.modalData.name;
  formEdit.value.city_id = modals.modal.modalData.city;
  formEdit.value.delivery_address = modals.modal.modalData.delivery_address;
  formEdit.value.company_name = modals.modal.modalData.company_name;
  formEdit.value.delivery_type = modals.modal.modalData.delivery_type;
})
</script>

<template>
  <div>
    <div>
      <p class="font-semibold text-xl mb-5">
        Редактирование пользователя
      </p>
      <p class="text-sm mb-3">
        Заполните все поля для завершения редактирования пользователя.
      </p>
    </div>
    <div
        :class="{ '!border !border-red-500': v$Edit.name.$error }"
        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label
          class="block text-xs font-medium text-gray-900"
          for="name">
        Имя
      </label>
      <input
          id="name"
          v-model="formEdit.name"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          name="name"
          placeholder="Иван Иванов"
          type="text"
      />
    </div>
    <div
        v-if="citiesList"
        :class="{ '!border !border-red-500' : v$Edit.city_id.$error }"
        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label
          for="city"
          class="block text-xs font-medium text-gray-900">
        Город
      </label>
      <select
          v-model="formEdit.city_id"
          :class="{ 'border-red-500' : v$Edit.city_id.$error }"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          name="city"
          id="city">
        <option :value="null">Выберите город</option>
        <option
            v-for="(city, index) of addresses.citiesList.data"
            :key="index"
            :value="city.id">
          {{ city.name }}
        </option>
      </select>
    </div>
    <div
        :class="{ '!border !border-red-500': v$Edit.company_name.$error }"
        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label
          class="block text-xs font-medium text-gray-900"
          for="name">
        Название компании
      </label>
      <input
          id="name"
          v-model="formEdit.company_name"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          name="name"
          placeholder="TQ"
          type="text"
      />
    </div>
    <div
        :class="{ '!border !border-red-500': v$Edit.delivery_type.$error }"
        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label
          class="block text-xs font-medium text-gray-900"
          for="name">
        Тип доставки
      </label>
      <input
          id="name"
          v-model="formEdit.delivery_type"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          name="name"
          placeholder="Через менеджера"
          type="text"
      />
    </div>
    <div
        :class="{ '!border !border-red-500': v$Edit.delivery_address.$error }"
        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label
          class="block text-xs font-medium text-gray-900"
          for="name">
        Адрес доставки
      </label>
      <input
          id="name"
          v-model="formEdit.delivery_address"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          name="name"
          placeholder="Алматы, ул. Абая 123"
          type="text"
      />
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          type="button"
          @click="editUser"
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