<script setup>
import {ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useModalsStore} from "@/stores/modals.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useUsersStore} from "@/stores/users.js";

const loading = ref(false);

const modals = useModalsStore()
const notifications = useNotificationStore();
const users = useUsersStore();

const form = ref({
  password: "",
  password_confirmation: ""
});

const v$ = useVuelidate({
  password: {required},
  password_confirmation: {required}
}, form);

const changePassword = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }
  await users.changePassword(modals.modal.modalData.id, form.value);
  if (form.value.password === form.value.password_confirmation) {
    if (users.changedPassword !== false) {
      notifications.showNotification("success", "Пароль пользователя успешно изменен!", "Теперь пользователь сможет войти в систему с новым паролем.");
      await users.getUserList()
      modals.modal.show = false;
    } else {
      notifications.showNotification("error", "Ошибка смены пароля", users.createdUser.message);
    }
  } else {
    notifications.showNotification("error", "Ошибка смены пароля!", "Пароли не совпадают.");
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
            Смена пароля
          </p>
          <p class="text-sm mb-3">
            Пожалуйста, заполните все поля для создания нового пользователя.
          </p>
        </div>
        <div
            :class="{ '!border !border-red-500': v$.password.$error }"
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              class="block text-xs font-medium text-gray-900"
              for="name">
            Пароль
          </label>
          <input
              id="password"
              v-model="form.password"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name="password"
              placeholder="••••••••••"
              type="password"
          />
        </div>
        <ul class="list-disc pl-5 mb-5 text-xs">
          <li :class="{ 'text-green-600' : form.password.length >= 8 }">Длина пароля должна быть не менее 8
            символов
          </li>
          <li :class="{ 'text-green-600' : /[A-Z]/.test(form.password) }">Латинские заглавные буквы</li>
          <li :class="{ 'text-green-600' : /[a-z]/.test(form.password) }">Латинские строчные буквы</li>
          <li :class="{ 'text-green-600' : /[0-9]/.test(form.password) }">Цифры 0-9</li>
        </ul>
        <div
            :class="{ '!border !border-red-500': v$.password_confirmation.$error }"
            class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              class="block text-xs font-medium text-gray-900"
              for="name">
            Подтверждение пароля
          </label>
          <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name="password_confirmation"
              placeholder="••••••••••"
              type="password"
          />
        </div>
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
              v-if="!loading"
              class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
              type="button"
              @click="changePassword"
          >
            Сменить
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