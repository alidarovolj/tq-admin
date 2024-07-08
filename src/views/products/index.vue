<script setup>
import {ref, watch, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import TableComponent from "@/components/TableComponent.vue";
import {useProductsStore} from "@/stores/products.js";
import {storeToRefs} from "pinia";

const route = useRoute();
const router = useRouter();

const products = useProductsStore()
const {productsList} = storeToRefs(products)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Фото", fn: "image_url", type: "image"},
  {name: "Название", fn: "title", type: "string"},
  {name: "Описание", fn: "description", type: "string"},
  {name: "Категория", fn: "category.title", type: "string"}
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
    await products.getProductsList()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await products.getProductsList(route.query.page, route.query.perPage)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Продукты
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех продуктов вашей компании, включая их названия, описания и категории.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <RouterLink
              to="/products/create"
              type="button"
              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Добавить продукт
          </RouterLink>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="productsList"
          @call_to_refresh="fetchData"
      />
    </div>
  </div>
</template>
