<script setup>
import {storeToRefs} from "pinia";
import {ref, nextTick, onMounted, watch} from "vue";
import TableComponent from "@/components/TableComponent.vue";
import {useRoute} from "vue-router";
import {useProductsStore} from "@/stores/products.js";

const products = useProductsStore()
const { productsList } = storeToRefs(products)
const route = useRoute()

const tableData = ref([
  { name: "ID", fn: "id", type: "string"},
  { name: "Name", fn: "name", type: "string"},
  { name: "Email", fn: "email", type: "string"},
  { name: "Phone number", fn: "phone_number", type: "string"}
])

onMounted(async () => {
  await nextTick()
  await products.getProductsList()
})

watch(route.query, async () => {
  await products.getProductsList(route.query.page, route.query.perPage)
})
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
            Список всех продуктов в вашем аккаунте, включая их название, цену и описание.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
              type="button"
              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Добавить продукт
          </button>
        </div>
      </div>
      <TableComponent :tableData="tableData" :fetchedData="productsList" />
    </div>
  </div>
</template>