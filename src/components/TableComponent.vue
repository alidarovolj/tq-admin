<script setup>
import { PencilSquareIcon } from "@heroicons/vue/24/outline"
import PaginationBlock from "@/components/PaginationBlock.vue";
import {useRoute} from "vue-router";

const props = defineProps(['tableData', 'fetchedData', 'edit']);
const emit = defineEmits(['call_to_refresh', 'editValue']);

const route = useRoute();

const updateData = (data) => {
  emit('call_to_refresh', {page: route.query.page || 1, perPage: route.query.perPage || 10});
};

// Function to access nested properties
const getNestedProperty = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};
</script>

<template>
  <div class="mt-8">
    <div v-if="fetchedData" class="flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
            <tr>
              <th
                  v-for="(item, index) in tableData"
                  :key="index"
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                {{ item.name }}
              </th>
              <th
                  v-if="edit"
                  scope="col"
                  class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span class="sr-only">
                      Edit
                    </span>
              </th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
            <tr
                v-for="(item, index) in fetchedData.data.slice().reverse()"
                :key="index"
                class="even:bg-gray-50">
              <td
                  v-for="(it, ind) in tableData"
                  :key="ind"
                  class="whitespace-nowrap pl-4 py-5 text-sm text-gray-500"
                  v-html="getNestedProperty(item, it.fn)"
              >
              </td>
              <td
                  v-if="edit"
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                <p
                    @click="emit('editValue', item)"
                    class="text-mainColor cursor-pointer w-max">
                  <PencilSquareIcon class="w-5 h-5" />
                </p>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="fetchedData.meta">
        <PaginationBlock :metaData="fetchedData.meta" @updatePage="updateData"/>
      </div>
    </div>
    <div v-else class="p-3 border rounded-lg">
      <div class="flex flex-col gap-2">
        <div v-for="(item, index) of 5" :key="index" class="w-full">
          <div :class="{ 'p-2 bg-gray-100 rounded' : index === 0 }" class="w-full flex gap-3 animate-pulse">
            <div :class="{ 'bg-gray-400' : index === 0 }" class="w-full h-6 bg-gray-200 rounded"></div>
            <div :class="{ 'bg-gray-400' : index === 0 }" class="w-full h-6 bg-gray-200 rounded"></div>
            <div :class="{ 'bg-gray-400' : index === 0 }" class="w-full h-6 bg-gray-200 rounded"></div>
            <div :class="{ 'bg-gray-400' : index === 0 }" class="w-full h-6 bg-gray-200 rounded"></div>
            <div :class="{ 'bg-gray-400' : index === 0 }" class="w-full h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div class="flex animate-pulse justify-between mt-5">
          <div class="flex gap-5 items-center">
            <div class="w-20 h-6 bg-gray-200 rounded"></div>
            <div class="w-14 h-3 bg-gray-200 rounded"></div>
          </div>
          <div class="w-20 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>
