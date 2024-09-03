<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import TableComponent from "@/components/TableComponent.vue";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import {useFeedbackStore} from "@/stores/feedback.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const feedback = useFeedbackStore()
const {feedbackList} = storeToRefs(feedback)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Имя", fn: "name", type: "string"},
  {name: "Email", fn: "email", type: "string"},
  {name: "Телефон", fn: "phone", type: "string"},
  {name: "Содержимое", fn: "note", type: "string"}
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
    await feedback.getFeedbackList()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await feedback.getFeedbackList(route.query.page, route.query.perPage)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Обращения
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех обращений к вашей компании, включая их статусы, даты и суммы.
          </p>
        </div>
      </div>
      <TableComponent
          :fetchedData="feedbackList"
          :tableData="tableData"
          @call_to_refresh="fetchData"
      />
    </div>
  </div>
</template>
