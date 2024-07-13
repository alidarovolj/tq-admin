<script setup>
import {ArrowLongLeftIcon, PhotoIcon} from "@heroicons/vue/24/outline/index.js";
import {ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";

const currentLanguage = ref('ru')

const form = ref({
  title: {
    ru: null,
    kz: null,
    en: null
  },
  image_url: null,
})

const v$ = useVuelidate({
  title: {
    ru: {required},
    kz: {required},
    en: {required}
  },
  image_url: {required}
}, form);
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div>
      <RouterLink
          to="/ideas"
          class="flex gap-2 items-center mb-5">
        <div>
          <ArrowLongLeftIcon class="w-5 h-5"/>
        </div>
        <p>
          Назад
        </p>
      </RouterLink>
      <div class="flex justify-between mb-5">
        <p class="font-semibold text-xl">
          Создание идеи
        </p>
        <button
            type="button"
            class="inline-flex w-max justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
            @click="createIdea"
        >
          Создать
        </button>
      </div>
      <p class="text-sm mb-3">
        Заполните все поля для создания нового продукта.
      </p>
    </div>
    <button
        type="button"
        class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-3">
      <PhotoIcon class="w-10 h-10 mx-auto"/>
      <span class="mt-2 block text-sm font-semibold text-gray-900">Добавьте фотографию</span>
    </button>
    <div class="rounded-md px-3 pb-1.5 pt-2.5 border mb-3">
      <div class="flex gap-3 mb-3 text-sm">
        <p
            @click="currentLanguage = 'ru'"
            :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'ru' },
                      { '!border !border-red-500': v$.title.ru.$error }
                  ]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
          Русский
        </p>
        <p
            @click="currentLanguage = 'kz'"
            :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'kz' },
                      { '!border !border-red-500': v$.title.kz.$error }
                  ]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
          Казахский
        </p>
        <p
            @click="currentLanguage = 'en'"
            :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'en' },
                      { '!border !border-red-500': v$.title.en.$error }
                  ]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
          Английский
        </p>
      </div>
      <div v-if="currentLanguage === 'ru'">
        <div
            :class="{ '!border !border-red-500': v$.title.ru.$error }"
            class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Название
          </label>
          <input
              v-model="form.title.ru"
              type="text"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Универсальная краска матовая"
          />
        </div>
      </div>
      <div v-else-if="currentLanguage === 'kz'">
        <div
            :class="{ '!border !border-red-500': v$.title.kz.$error }"
            class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Название
          </label>
          <input
              v-model="form.title.kz"
              type="text"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Күңгірт әмбебап бояу"
          />
        </div>
      </div>
      <div v-else>
        <div
            :class="{ '!border !border-red-500': v$.title.en.$error }"
            class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Название
          </label>
          <input
              v-model="form.title.en"
              type="text"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Universal paint matte"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
          type="button"
          class="relative block w-[49%] rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-3">

        <div>
          <label
              for="location"
              class="block text-sm font-medium leading-6 text-gray-900">
            Тип блока
          </label>
          <select
              id="location"
              name="location"
              class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <option value="1">Выберите стиль</option>
            <option value="3">Текст</option>
            <option value="2">Цветовой ряд</option>
            <option value="2">Цветовые сочетания</option>
            <option value="2">Фотографии</option>
          </select>
        </div>

      </button>
    </div>
  </div>
</template>