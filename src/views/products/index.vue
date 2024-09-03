<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import TableComponent from "@/components/TableComponent.vue";
import {useProductsStore} from "@/stores/products.js";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const products = useProductsStore()
const {productsList} = storeToRefs(products)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Название", fn: "name", type: "string"},
  {name: "Цена", fn: "price", type: "string"},
  {name: "Фото", fn: "icon", type: "image"},
  {name: "Статус", fn: "is_active", type: "boolean"},
  {name: "Категория", fn: "category.name", type: "string"}
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
      </div>
      <TableComponent
          :fetchedData="productsList"
          :remove-item="true"
          :search="true"
          :set-active="'is_active'"
          :tableData="tableData"
          @call_to_refresh="fetchData"
          @removeItem="(data) => modals.showModal('RemoveProduct', data)"
          @setActive="(data) => modals.showModal('SetActiveProduct', data)"
      />
    </div>
  </div>
</template>
