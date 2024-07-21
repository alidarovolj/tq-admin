<script setup>
import {ref, watch, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import TableComponent from "@/components/TableComponent.vue";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import {useIdeasStore} from "@/stores/ideas.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const ideas = useIdeasStore()
const {ideasListWithPG} = storeToRefs(ideas)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Картинка", fn: "image_url", type: "image"},
  {name: "Название", fn: "title", type: "string"},
  {name: "Комната", fn: "room_title.ru", type: "string"},
  {name: "Тип цвета", fn: "color_title.ru", type: "string"}
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
    await ideas.getIdeasListWithPG()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await ideas.getIdeasListWithPG(route.query.page, route.query.perPage)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Идеи
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех идей вашей компании, включая их названия, описания и категории.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <RouterLink
              to="/ideas/create"
              type="button"
              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Добавить идею
          </RouterLink>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="ideasListWithPG"
          :remove-item="true"
          @removeItem="(data) => modals.showModal('RemoveIdea', data)"
          @call_to_refresh="fetchData"
      />
    </div>
  </div>
</template>
