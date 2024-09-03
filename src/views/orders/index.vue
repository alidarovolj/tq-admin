<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import TableComponent from "@/components/TableComponent.vue";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import {useOrdersStore} from "@/stores/orders.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const orders = useOrdersStore()
const {ordersList} = storeToRefs(orders)

const tableData = ref([
  {name: "Номер заказа", fn: "order_number", type: "string"},
  {name: "Заказчик", fn: "name", type: "string"},
  {name: "Тип доставки", fn: "delivery_type", type: "string"},
  {name: "Адрес", fn: "delivery_address", type: "string"},
  {name: "Телефон", fn: "phone", type: "string"},
  {name: "Продукты", fn: "product", type: "array"}
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
    await orders.getOrdersList()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await orders.getOrdersList(route.query.page, route.query.perPage)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Заказы
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех заказов вашей компании, включая их статусы, даты и суммы.
          </p>
        </div>
      </div>
      <TableComponent
          :fetchedData="ordersList"
          :search="true"
          :tableData="tableData"
          @call_to_refresh="fetchData"
      />
    </div>
  </div>
</template>
