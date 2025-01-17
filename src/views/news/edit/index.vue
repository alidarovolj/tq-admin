<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {ArrowLongLeftIcon} from "@heroicons/vue/24/outline/index.js";
import Editor from '@tinymce/tinymce-vue'
import {QuillEditor} from "@vueup/vue-quill";
import UploadImage from "@/components/UploadImage.vue";
import {useNewsStore} from "@/stores/news.js";
import {useNotificationStore} from "@/stores/notifications.js";

const route = useRoute();
const router = useRouter();
const news = useNewsStore()
const loading = ref(false);
const notifications = useNotificationStore()

const currentLanguage = ref('ru')

const form = ref({
  title: {
    ru: "",
    kz: "",
    en: ""
  },
  description: {
    ru: "",
    kz: "",
    en: ""
  },
  image_url: "",
  content: {
    ru: "",
    en: "",
    kz: ""
  }
});

const options = ref({
  debug: 'info',
  placeholder: 'Экологически чистые и инновационные краски: тенденции 2024 года'
})

const options_kz = ref({
  debug: 'info',
  placeholder: 'Экологиялық таза және инновациялық бояулар: 2024 жылға арналған трендтер'
})

const options_en = ref({
  debug: 'info',
  placeholder: 'Eco-friendly and innovative paints: trends for 2024'
})

const v$ = useVuelidate({
  title: {
    ru: {required},
  },
  description: {
    ru: {required},
  },
  content: {
    ru: {required},
  },
  image_url: {required}
}, form);

const page = ref(route.query.page || 1);
const perPage = ref(route.query.perPage || 10);

const updateQueryParams = async () => {
  await router.push({query: {...route.query, page: page.value, perPage: perPage.value}});
};

onMounted(() => {
  updateQueryParams();
});

watch([page, perPage], updateQueryParams, {deep: true});

const fetchData = async () => {
  try {
    await nextTick()
    await news.getDetailNews(route.params.id)
    form.value.title = news.detailNews.title
    form.value.content = news.detailNews.content
    form.value.description = news.detailNews.description
    form.value.image_url = news.detailNews.image_url
  } catch (error) {
    console.error(error);
  }
};

const editNews = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }
  await news.editNews(route.params.id, form.value);
  if (news.editedNews !== false) {
    notifications.showNotification("success", "Новость успешно отредактирована!", "Новость успешно отредактирована, ее можно увидеть в списке новостей.");
    await news.getNewsListWithPG();
    await router.push("/news");
  } else {
    notifications.showNotification("error", "Ошибка редактирования новости!", news.editedNews.message);
  }
  loading.value = false;
};

onMounted(fetchData);

watch([page, perPage], fetchData);
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div>
        <div>
          <div>
            <div>
              <RouterLink
                  class="flex gap-2 items-center mb-5"
                  to="/news">
                <div>
                  <ArrowLongLeftIcon class="w-5 h-5"/>
                </div>
                <p>
                  Назад
                </p>
              </RouterLink>
              <div class="flex justify-between mb-5">
                <p class="font-semibold text-xl">
                  Редактирование новости
                </p>
                <button
                    class="inline-flex w-max justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                    type="button"
                    @click="editNews"
                >
                  Сохранить
                </button>
              </div>
              <p class="text-sm mb-3">
                Заполните все поля для создания новой новости.
              </p>
            </div>
            <UploadImage
                :class="{ '!border-red-500': v$.image_url.$error }"
                :preview_image="form.image_url"
                class="mb-3"
                type="news"
                @photoUploaded="(image) => form.image_url = image"
            />
            <div class="rounded-md px-3 pb-1.5 pt-2.5 border mb-3">
              <div class="flex gap-3 mb-3 text-sm">
                <p
                    :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'ru' },
                      { '!border !border-red-500': v$.title.ru.$error || v$.description.ru.$error }
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
              <div v-if="currentLanguage === 'ru'">
                <div
                    :class="{ '!border !border-red-500': v$.title.ru.$error }"
                    class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
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
                      placeholder="Новости в мире красок"
                      type="text"
                  />
                </div>
                <div
                    :class="{ '!border-red-500': v$.description.ru.$error }"
                    class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      class="block font-medium text-gray-900 mb-2"
                      for="name">
                    Описание
                  </label>
                  <QuillEditor
                      v-model:content="form.description.ru"
                      :options="options"
                      contentType="html"
                  />
                </div>
                <div
                    :class="{ '!border-red-500': v$.content.ru.$error }"
                    class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      class="block text-xs font-medium text-gray-900 mb-2"
                      for="name">
                    Контент
                  </label>
                  <main id="sample">
                    <Editor
                        v-model="form.content.ru"
                        :init="{
        plugins: 'lists link image table code help wordcount'
      }"
                        api-key="wbs5iypxhs4wvkwvvz760zl88zept4h3f91k4cxa8k57uwy4"
                    />
                  </main>
                </div>
              </div>
              <div v-else-if="currentLanguage === 'kz'">
                <div
                    class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                      class="block text-xs font-medium text-gray-900"
                      for="name">
                    Название
                  </label>
                  <input
                      id="name"
                      v-model="form.title.kz"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      name="name"
                      placeholder="Бояулар әлеміндегі жаңалықтар"
                      type="text"
                  />
                </div>
                <div class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      class="block font-medium text-gray-900 mb-2"
                      for="name">
                    Описание
                  </label>
                  <QuillEditor
                      v-model:content="form.description.kz"
                      :options="options_kz"
                      contentType="html"
                  />
                </div>
                <div class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      class="block text-xs font-medium text-gray-900 mb-2"
                      for="name">
                    Контент
                  </label>
                  <main id="sample">
                    <Editor
                        v-model="form.content.kz"
                        :init="{
        plugins: 'lists link image table code help wordcount'
      }"
                        api-key="wbs5iypxhs4wvkwvvz760zl88zept4h3f91k4cxa8k57uwy4"
                    />
                  </main>
                </div>
              </div>
              <div v-else>
                <div
                    class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                      class="block text-xs font-medium text-gray-900"
                      for="name">
                    Название
                  </label>
                  <input
                      id="name"
                      v-model="form.title.en"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      name="name"
                      placeholder="News in the world of paints"
                      type="text"
                  />
                </div>
                <div class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      class="block font-medium text-gray-900 mb-2"
                      for="name">
                    Описание
                  </label>
                  <QuillEditor
                      v-model:content="form.description.en"
                      :options="options_en"
                      contentType="html"
                  />
                </div>

                <div class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      class="block text-xs font-medium text-gray-900 mb-2"
                      for="name">
                    Контент
                  </label>
                  <main id="sample">
                    <Editor
                        v-model="form.content.en"
                        :init="{
        plugins: 'lists link image table code help wordcount'
      }"
                        api-key="wbs5iypxhs4wvkwvvz760zl88zept4h3f91k4cxa8k57uwy4"
                    />
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
