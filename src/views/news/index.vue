<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import TableComponent from "@/components/TableComponent.vue";
import {useNewsStore} from "@/stores/news.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const news = useNewsStore()
const {newsListWithPG} = storeToRefs(news)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Картинка", fn: "image_url", type: "image"},
  {name: "Название", fn: "title.ru", type: "string"},
  {name: "Категория", fn: "category.ru", type: "string"},
  {name: "Дата", fn: "created_at", type: "time"}
])

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
    await news.getNewsListWithPG()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Новости
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех новостей вашей компании, включая их названия, описания и категории.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <RouterLink
              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              to="/news/create"
              type="button">
            Добавить новость
          </RouterLink>
        </div>
      </div>
      <TableComponent
          :edit="true"
          :fetchedData="newsListWithPG"
          :remove-item="true"
          :tableData="tableData"
          @call_to_refresh="fetchData"
          @editValue="(data) => router.push('/news/edit/' + data.id)"
          @removeItem="(data) => modals.showModal('RemoveNews', data)"
      />
    </div>
  </div>
</template>
