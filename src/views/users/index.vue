<script setup>
import {ref, watch, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUsersStore} from "@/stores/users.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {storeToRefs} from "pinia";
import {useVuelidate} from "@vuelidate/core";
import {required, email} from "@vuelidate/validators";
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from "@headlessui/vue";
import {XMarkIcon} from "@heroicons/vue/24/outline/index.js";
import TableComponent from "@/components/TableComponent.vue";

const route = useRoute();
const router = useRouter();

const userCreateModal = ref(false);
const userEditModal = ref(false);

const users = useUsersStore();
const {userList} = storeToRefs(users);
const notifications = useNotificationStore();

const form = ref({
  name: "",
  phone_number: "",
  email: "",
  password: "",
  password_confirmation: ""
});

const formEdit = ref({
  name: "",
  phone_number: "",
  email: ""
});

const v$ = useVuelidate({
  name: {required},
  phone_number: {required},
  email: {required, email},
  password: {required},
  password_confirmation: {required}
}, form);

const v$Edit = useVuelidate({
  name: {required},
  phone_number: {required},
  email: {required, email}
}, formEdit);

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Имя", fn: "name", type: "string"},
  {name: "Email", fn: "email", type: "string"},
  {name: "Номер телефона", fn: "phone_number", type: "string"}
]);

const page = ref(route.query.page || 1);
const perPage = ref(route.query.perPage || 10);

const updateQueryParams = async () => {
  await router.push({query: {...route.query, page: page.value, perPage: perPage.value}});
};

const editData = (data) => {
  formEdit.value = {
    name: data.name,
    phone_number: data.phone_number,
    email: data.email
  };
  userEditModal.value = true;
};

onMounted(() => {
  updateQueryParams();
});

watch([page, perPage], updateQueryParams, {deep: true});

const fetchData = async () => {
  try {
    await users.getUserList();
  } catch (error) {
    console.error(error);
  }
};

const createUser = async () => {
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    return;
  }
  await users.createUser(form.value);
  if (users.createdUser !== false) {
    notifications.showNotification("success", "Пользователь успешно создан!", "Пользователь успешно создан, его можно увидеть в списке пользователей.");
    userCreateModal.value = false;
  } else {
    notifications.showNotification("error", "Ошибка создания пользователя!", "Попробуйте позже.");
  }
};

const editUser = async () => {
  await v$Edit.value.$validate();

  if (v$Edit.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    return;
  }
  await users.createUser(form.value);
  if (users.editedUser !== false) {
    notifications.showNotification("success", "Пользователь успешно создан!", "Пользователь успешно создан, его можно увидеть в списке пользователей.");
    userEditModal.value = false;
  } else {
    notifications.showNotification("error", "Ошибка создания пользователя!", "Попробуйте позже.");
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await users.getUserList(route.query.page, route.query.perPage);
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Пользователи
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех пользователей вашей учетной записи, включая их имена, должности, адреса электронной почты и
            роли.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
              @click="userCreateModal = true"
              type="button"
              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Добавить пользователя
          </button>
        </div>
      </div>
      <TableComponent
          :edit="true"
          @editValue="editData"
          :tableData="tableData"
          :fetchedData="userList"
          @call_to_refresh="fetchData"
      />
    </div>
  </div>
  <TransitionRoot
      as="template"
      :show="userCreateModal">
    <Dialog
        class="relative z-10"
        @close="userCreateModal = false">
      <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                    type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    @click="userCreateModal = false">
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true"/>
                </button>
              </div>
              <div>
                <div>
                  <div>
                    <div>
                      <p class="font-semibold text-xl mb-5">
                        Создание пользователя
                      </p>
                      <p class="text-sm mb-3">
                        Заполните все поля для создания нового пользователя.
                      </p>
                    </div>
                    <div
                        :class="{ '!border !border-red-500': v$.name.$error }"
                        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                      <label
                          for="name"
                          class="block text-xs font-medium text-gray-900">
                        Имя
                      </label>
                      <input
                          v-model="form.name"
                          type="text"
                          name="name"
                          id="name"
                          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Иван Иванов"
                      />
                    </div>
                    <div
                        :class="{ '!border !border-red-500': v$.phone_number.$error }"
                        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                      <label
                          for="name"
                          class="block text-xs font-medium text-gray-900">
                        Номер телефона
                      </label>
                      <input
                          type="text"
                          v-model="form.phone_number"
                          v-maska
                          data-maska="+7 (###) ###-##-##"
                          name="phone"
                          id="phone"
                          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="+7 (###) ###-##-##"
                      />
                    </div>
                    <div
                        :class="{ '!border !border-red-500': v$.email.$error }"
                        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                      <label
                          for="name"
                          class="block text-xs font-medium text-gray-900">
                        Email
                      </label>
                      <input
                          v-model="form.email"
                          type="email"
                          name="email"
                          id="email"
                          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="example@example.com"
                      />
                    </div>
                    <div
                        :class="{ '!border !border-red-500': v$.password.$error }"
                        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                      <label
                          for="name"
                          class="block text-xs font-medium text-gray-900">
                        Пароль
                      </label>
                      <input
                          v-model="form.password"
                          type="password"
                          name="password"
                          id="password"
                          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="••••••••••"
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
                          for="name"
                          class="block text-xs font-medium text-gray-900">
                        Подтверждение пароля
                      </label>
                      <input
                          v-model="form.password_confirmation"
                          type="password"
                          name="password_confirmation"
                          id="password_confirmation"
                          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="••••••••••"
                      />
                    </div>
                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                          type="button"
                          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                          @click="createUser"
                      >
                        Создать
                      </button>
                      <button
                          type="button"
                          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          @click="userCreateModal = false"
                          ref="cancelButtonRef">
                        Отменить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <TransitionRoot
      as="template"
      :show="userEditModal">
    <Dialog
        class="relative z-10"
        @close="userEditModal = false">
      <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                    type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    @click="userEditModal = false">
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true"/>
                </button>
              </div>
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
                      for="name"
                      class="block text-xs font-medium text-gray-900">
                    Имя
                  </label>
                  <input
                      v-model="formEdit.name"
                      type="text"
                      name="name"
                      id="name"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Иван Иванов"
                  />
                </div>
                <div
                    :class="{ '!border !border-red-500': v$Edit.phone_number.$error }"
                    class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                      for="name"
                      class="block text-xs font-medium text-gray-900">
                    Номер телефона
                  </label>
                  <input
                      type="text"
                      v-model="formEdit.phone_number"
                      v-maska
                      data-maska="+7 (###) ###-##-##"
                      name="phone"
                      id="phone"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="+7 (###) ###-##-##"
                  />
                </div>
                <div
                    :class="{ '!border !border-red-500': v$Edit.email.$error }"
                    class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                      for="name"
                      class="block text-xs font-medium text-gray-900">
                    Email
                  </label>
                  <input
                      v-model="formEdit.email"
                      type="email"
                      name="email"
                      id="email"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="example@example.com"
                  />
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                      type="button"
                      class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                      @click="editUser"
                  >
                    Редактировать
                  </button>
                  <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      @click="userEditModal = false"
                      ref="cancelButtonRef">
                    Отменить
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
