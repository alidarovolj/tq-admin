<script setup>
import {useVuelidate} from '@vuelidate/core';
import {required} from '@vuelidate/validators';
import {ref} from "vue";
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import router from "@/router/index.js";

const notifications = useNotificationStore();

const form = ref({
  phone: null,
  password: null,
});

const v$ = useVuelidate({
  phone: {required},
  password: {required},
}, form);

const authorizeUser = async () => {
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Ошибка авторизации!", "Проверьте правильность введенных данных и попробуйте снова.");
    return;
  }

  try {
    const response = await api(`/auth/login`, "POST", {
      body: JSON.stringify(form.value)
    });

    const data = response.data;
    console.log(data)
    if (data.data.token) {
      notifications.showNotification("success", "Успешная авторизация!", "Вы успешно авторизовались в системе, дождитесь перенаправления на главную страницу.");
      localStorage.setItem("token", data.data.token);
      await router.push({name: "Users"});
    } else {
      notifications.showNotification("error", "Токен не получен", "Попробуйте позже.");
    }
  } catch (e) {
    notifications.showNotification("error", "Ошибка авторизации!", "Проверьте правильность введенных данных и попробуйте снова.");
  }
}
</script>

<template>
  <div class="min-h-full h-full">
    <div class="flex min-h-full h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Logo" class="mx-auto h-auto w-full" src="../../assets/img/logos/main.png"/>
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Войдите в свой аккаунт
        </h2>
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit.prevent="authorizeUser">
          <div>
            <label class="block text-sm font-medium leading-6 text-gray-900" for="phone">Номер телефона</label>
            <div class="mt-2">
              <input
                  id="phone"
                  v-model="form.phone"
                  :class="{ '!border !border-red-500': v$.phone.$error }"
                  class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="phone"
                  placeholder="Введите телефон"
                  type="text"
              />
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium leading-6 text-gray-900" for="password">Пароль</label>
              <div class="text-sm">
                <a class="font-semibold text-linkColor hover:text-mainColor transition-all" href="#">Забыли пароль?</a>
              </div>
            </div>
            <div class="mt-2">
              <input
                  id="password"
                  v-model="form.password"
                  :class="{ '!border !border-red-500': v$.password.$error }"
                  class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="password"
                  placeholder="Введите пароль"
                  type="password"
              />
            </div>
          </div>
          <div>
            <button class="flex w-full justify-center rounded-md bg-mainColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    type="submit">
              Авторизоваться
            </button>
          </div>
        </form>
        <p class="mt-10 text-center text-sm text-gray-500">
          Забыли пароль? <a class="font-semibold leading-6 text-linkColor hover:text-mainColor transition-all" href="#">Восстановите
          его здесь</a>
        </p>
      </div>
    </div>
  </div>
</template>
