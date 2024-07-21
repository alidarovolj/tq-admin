<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {ArrowLongLeftIcon} from "@heroicons/vue/24/outline/index.js";
import Editor from '@tinymce/tinymce-vue'

const route = useRoute();
const router = useRouter();

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
});

const v$ = useVuelidate({
  title: {
    ru: {required},
  },
  description: {
    ru: {required},
  },
  image_url: {required},
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
  } catch (error) {
    console.error(error);
  }
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
                  to="/news"
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
                  Создание новости
                </p>
                <button
                    type="button"
                    class="inline-flex w-max justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                    @click="createNews"
                >
                  Создать
                </button>
              </div>
              <p class="text-sm mb-3">
                Заполните все поля для создания новой новости.
              </p>
            </div>
            <main id="sample">
              <Editor
                  api-key="wbs5iypxhs4wvkwvvz760zl88zept4h3f91k4cxa8k57uwy4"
                  :init="{
        plugins: 'lists link image table code help wordcount'
      }"
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
