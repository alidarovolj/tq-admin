<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import TableComponent from "@/components/TableComponent.vue";
import {useFiltersStore} from "@/stores/filters.js";

const route = useRoute();
const router = useRouter();

const filters = useFiltersStore()
const {filtersListWithPG} = storeToRefs(filters)
const modals = useModalsStore()

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Название", fn: "title.ru", type: "string"},
])

const page = ref(route.query.page || 1);
const perPage = ref(route.query.perPage || 10);

const updateQueryParams = async () => {
  await router.push({query: {...route.query, page: page.value, perPage: perPage.value}});
};

const setActive = (data) => {
  modals.showModal('SetActiveCategory', data)
};

onMounted(() => {
  updateQueryParams();
});

watch([page, perPage], updateQueryParams, {deep: true});

const fetchData = async () => {
  try {
    await filters.getFiltersListWithPG()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await filters.getFiltersListWithPG(route.query.page, route.query.perPage)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Фильтры
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех фильтров вашей компании, а также возможность добавления новых фильтров.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
              @click="modals.showModal('CreateFilter')"
              type="button"
              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Добавить фильтр
          </button>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="filtersListWithPG"
          :remove-item="true"
          :edit="true"
          @editValue="(data) => modals.showModal('EditFilter', data)"
          @remove-item="(data) => modals.showModal('RemoveFilter', data)"
          @call_to_refresh="fetchData"
      />
    </div>
  </div>
</template>
