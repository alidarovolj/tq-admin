<script setup>
import {
  CheckIcon,
  CircleStackIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  RectangleStackIcon,
  TrashIcon,
  UserMinusIcon,
  UserPlusIcon,
  UsersIcon,
  XMarkIcon
} from "@heroicons/vue/24/outline"
import PaginationBlock from "@/components/PaginationBlock.vue";
import {useRoute, useRouter} from "vue-router";
import {nextTick, onMounted, ref, watch} from "vue";
import {formatDate} from "@/utils/formatDate.js";

const searchValue = ref('')

const props = defineProps(['tableData', 'fetchedData', 'edit', 'makeAdmin', 'changePassword', 'removeItem', 'setActive', 'search', 'changePrice', 'changeRemains']);
const emit = defineEmits(['call_to_refresh', 'editValue', 'setAdmin', 'changePassword', 'removeItem', 'setActive', 'changePrice', 'changeRemains']);

const route = useRoute();
const router = useRouter();

const updateData = (data) => {
  emit('call_to_refresh', {page: route.query.page || 1, perPage: route.query.perPage || 10});
};

const getNestedProperty = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const handleSearch = () => {
  router.push({
    query: {
      ...route.query,
      searchKeyword: searchValue.value,
    }
  });
};

onMounted(async () => {
  await nextTick()
  if (route.query.searchKeyword) {
    searchValue.value = route.query.searchKeyword
  }
});

watch(() => route.query.searchKeyword, () => {
  updateData();
});
</script>

<template>
  <div class="mt-8">
    <div v-if="fetchedData" class="flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div
            v-if="search"
            class="sm:px-6 lg:px-8 mb-5 w-1/3">
          <div>
            <label
                class="block text-sm font-medium leading-6 text-gray-900"
                for="email">
              Поиск по имени/названию
            </label>
            <form
                @submit.prevent="handleSearch"
                class="mt-2 flex rounded-md shadow-sm">
              <div class="relative flex flex-grow items-stretch focus-within:z-10">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UsersIcon
                      aria-hidden="true"
                      class="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                    id="search"
                    v-model="searchValue"
                    class="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="search"
                    placeholder="Поиск..."
                    type="text"
                />
              </div>
              <button
                  class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  type="submit">
                <MagnifyingGlassIcon aria-hidden="true" class="-ml-0.5 h-5 w-5 text-gray-400"/>
                Найти
              </button>
            </form>
          </div>
        </div>
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
            <tr>
              <th
                  v-for="(item, index) in tableData"
                  :key="index"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                  scope="col">
                {{ item.name }}
              </th>
              <th
                  v-if="edit || makeAdmin || changePassword || removeItem || setActive || changePrice || changeRemains"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                  scope="col">
                <p>
                  Действия
                </p>
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
              >
                <p
                    v-if="it.type === 'string' && getNestedProperty(item, it.fn)"
                    v-html="getNestedProperty(item, it.fn)">
                </p>
                <div
                    v-else-if="it.type === 'array'">
                  <p
                      v-for="(it, ind) of getNestedProperty(item, it.fn)"
                      :key="ind"
                  >
                    {{ it.product }}
                  </p>
                </div>
                <p
                    v-else-if="it.type === 'string' && !getNestedProperty(item, it.fn)"
                    class="text-red-500">
                  Нет данных
                </p>
                <div
                    v-else-if="it.type === 'boolean'"
                    class="text-xs"
                >
                  <p
                      v-if="getNestedProperty(item, it.fn)"
                      class="bg-green-100 text-green-500 w-max px-4 py-2 rounded-xl">
                    Активирован
                  </p>
                  <p
                      v-else
                      class="bg-red-100 text-red-500 w-max px-4 py-2 rounded-xl">
                    Деактивирован
                  </p>
                </div>
                <div
                    v-else-if="it.type === 'time'"
                    class="text-xs"
                >
                  <p>
                    {{ formatDate(getNestedProperty(item, it.fn)) }}
                  </p>
                </div>
                <div v-else>
                  <img
                      v-if="!getNestedProperty(item, it.fn)"
                      alt=""
                      class="w-10 h-10 min-h-10 min-w-10 object-contain"
                      src="@/assets/img/logos/main.png"
                  />
                  <img
                      v-else
                      :src="getNestedProperty(item, it.fn)"
                      alt=""
                      class="w-10 h-10 min-h-10 min-w-10 object-contain"
                  />
                </div>
              </td>
              <td
                  v-if="edit || makeAdmin || changePassword || removeItem || setActive || changePrice || changeRemains"
                  class="pl-4 py-5 relative whitespace-nowrap pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8 flex gap-1">
                <p
                    v-if="edit"
                    class="text-mainColor cursor-pointer w-max"
                    @click="emit('editValue', item)">
                  <PencilSquareIcon class="w-5 h-5"/>
                </p>
                <p
                    v-if="setActive"
                    class="text-mainColor cursor-pointer w-max"
                    @click="emit('setActive', item)">
                  <CheckIcon v-if="!item[setActive]" class="w-5 h-5"/>
                  <XMarkIcon v-else class="w-5 h-5"/>
                </p>
                <p
                    v-if="makeAdmin"
                    class="text-mainColor cursor-pointer w-max"
                    @click="emit('setAdmin', item)">
                  <UserPlusIcon v-if="!item[makeAdmin]" class="w-5 h-5"/>
                  <UserMinusIcon v-else class="w-5 h-5"/>
                </p>
                <p
                    v-if="changePrice"
                    class="text-mainColor cursor-pointer w-max"
                    @click="emit('changePrice', item)">
                  <CircleStackIcon class="w-5 h-5"/>
                </p>
                <p
                    v-if="changeRemains"
                    class="text-mainColor cursor-pointer w-max"
                    @click="emit('changeRemains', item)">
                  <RectangleStackIcon class="w-5 h-5"/>
                </p>
                <p
                    v-if="changePassword"
                    class="text-mainColor cursor-pointer w-max"
                    @click="emit('changePassword', item)">
                  <KeyIcon class="w-5 h-5"/>
                </p>
                <p
                    v-if="removeItem"
                    class="text-mainColor cursor-pointer w-max"
                    @click="emit('removeItem', item)">
                  <TrashIcon class="w-5 h-5"/>
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
