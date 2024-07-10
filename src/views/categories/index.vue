<script setup>
import {ref, watch, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import TableComponent from "@/components/TableComponent.vue";
import {storeToRefs} from "pinia";
import {useCategoriesStore} from "@/stores/categories.js";

const route = useRoute();
const router = useRouter();

const categories = useCategoriesStore()
const {categoriesListWithPG} = storeToRefs(categories)

const form = ref({
  title: "",
  description: "",
  category_id: null,
  image_url: "",
  product_variants: [],
  filter_data: []
});

const v$ = useVuelidate({
  title: {required},
  description: {required},
  category_id: {required},
  image_url: {required}
}, form);

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Название", fn: "title.ru", type: "string"},
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
    await categories.getCategoriesListWithPG()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await categories.getCategoriesListWithPG(route.query.page, route.query.perPage)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Категории
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех категорий вашей компании, а также возможность добавления новых категорий.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
              @click="productCreateModal = true"
              type="button"
              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Добавить категорию
          </button>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="categoriesListWithPG"
          @call_to_refresh="fetchData"
      />
    </div>
<!--    <TransitionRoot-->
<!--        as="template"-->
<!--        :show="productCreateModal">-->
<!--      <Dialog-->
<!--          class="relative z-10"-->
<!--          @close="productCreateModal = false">-->
<!--        <TransitionChild-->
<!--            as="template"-->
<!--            enter="ease-out duration-300"-->
<!--            enter-from="opacity-0"-->
<!--            enter-to="opacity-100"-->
<!--            leave="ease-in duration-200"-->
<!--            leave-from="opacity-100"-->
<!--            leave-to="opacity-0">-->
<!--          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>-->
<!--        </TransitionChild>-->

<!--        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">-->
<!--          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">-->
<!--            <TransitionChild-->
<!--                as="template"-->
<!--                enter="ease-out duration-300"-->
<!--                enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"-->
<!--                enter-to="opacity-100 translate-y-0 sm:scale-100"-->
<!--                leave="ease-in duration-200"-->
<!--                leave-from="opacity-100 translate-y-0 sm:scale-100"-->
<!--                leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">-->
<!--              <DialogPanel-->
<!--                  class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">-->
<!--                <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">-->
<!--                  <button-->
<!--                      type="button"-->
<!--                      class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"-->
<!--                      @click="productCreateModal = false">-->
<!--                    <span class="sr-only">Close</span>-->
<!--                    <XMarkIcon class="h-6 w-6" aria-hidden="true"/>-->
<!--                  </button>-->
<!--                </div>-->
<!--                <div>-->
<!--                  <div>-->
<!--                    <div>-->
<!--                      <div>-->
<!--                        <p class="font-semibold text-xl mb-5">-->
<!--                          Создание продукта-->
<!--                        </p>-->
<!--                        <p class="text-sm mb-3">-->
<!--                          Заполните все поля для создания нового продукта.-->
<!--                        </p>-->
<!--                      </div>-->
<!--                      <div-->
<!--                          :class="{ '!border !border-red-500': v$.title.$error }"-->
<!--                          class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">-->
<!--                        <label-->
<!--                            for="name"-->
<!--                            class="block text-xs font-medium text-gray-900">-->
<!--                          Название-->
<!--                        </label>-->
<!--                        <input-->
<!--                            v-model="form.title"-->
<!--                            type="text"-->
<!--                            name="name"-->
<!--                            id="name"-->
<!--                            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"-->
<!--                            placeholder="Иван Иванов"-->
<!--                        />-->
<!--                      </div>-->
<!--                      <div-->
<!--                          :class="{ '!border !border-red-500': v$.description.$error }"-->
<!--                          class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">-->
<!--                        <label-->
<!--                            for="name"-->
<!--                            class="block text-xs font-medium text-gray-900">-->
<!--                          Описание-->
<!--                        </label>-->
<!--                        <textarea-->
<!--                            v-model="form.description"-->
<!--                            name="name"-->
<!--                            id="name"-->
<!--                            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"-->
<!--                            placeholder="Иван Иванов"-->
<!--                        />-->
<!--                      </div>-->
<!--                      <Listbox-->
<!--                          as="div"-->
<!--                          class="mb-2"-->
<!--                          v-model="selectedCategory">-->
<!--                        <ListboxLabel class="block text-xs font-medium text-gray-900">-->
<!--                          Категория-->
<!--                        </ListboxLabel>-->
<!--                        <div class="relative mt-2">-->
<!--                          <ListboxButton-->
<!--                              class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">-->
<!--                            <span-->
<!--                                v-if="selectedCategory"-->
<!--                                class="block truncate">-->
<!--                              {{ selectedCategory.title }}-->
<!--                            </span>-->
<!--                            <span v-else>-->
<!--                              Выберите категорию-->
<!--                            </span>-->
<!--                            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">-->
<!--                            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>-->
<!--                            </span>-->
<!--                          </ListboxButton>-->

<!--                          <transition-->
<!--                              leave-active-class="transition ease-in duration-100"-->
<!--                              leave-from-class="opacity-100"-->
<!--                              leave-to-class="opacity-0">-->
<!--                            <ListboxOptions-->
<!--                                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">-->
<!--                              <ListboxOption-->
<!--                                  as="template"-->
<!--                                  v-for="(category, index) in categoriesListWithPG.data"-->
<!--                                  :key="index"-->
<!--                                  :value="category"-->
<!--                                  v-slot="{ active, selected }">-->
<!--                                <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">-->
<!--                                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">-->
<!--                                    {{ category.title }}-->
<!--                                  </span>-->

<!--                                  <span-->
<!--                                      v-if="selected"-->
<!--                                      :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">-->
<!--                                    <CheckIcon class="h-5 w-5" aria-hidden="true"/>-->
<!--                                  </span>-->
<!--                                </li>-->
<!--                              </ListboxOption>-->
<!--                            </ListboxOptions>-->
<!--                          </transition>-->
<!--                        </div>-->
<!--                      </Listbox>-->
<!--                      <div class="text-xs">-->
<!--                        <p class="block font-medium text-gray-900 mb-2">Фильтры</p>-->
<!--                        <fieldset>-->
<!--                          <div class="space-y-2">-->
<!--                            <div-->
<!--                                v-for="(item, index) of filtersList.data"-->
<!--                                :key="index"-->
<!--                                class="relative flex items-start">-->
<!--                              <div class="flex h-6 items-center">-->
<!--                                <input-->
<!--                                    :id="item.id"-->
<!--                                    :aria-describedby="item.title"-->
<!--                                    :name="item.id"-->
<!--                                    type="checkbox"-->
<!--                                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"-->
<!--                                />-->
<!--                              </div>-->
<!--                              <div class="ml-3 leading-6">-->
<!--                                <label-->
<!--                                    :for="item.id"-->
<!--                                    class="font-medium text-gray-900">-->
<!--                                  {{ item.title }}-->
<!--                                </label>-->
<!--                                {{ ' ' }}-->
<!--                                <span-->
<!--                                    :id="item.title"-->
<!--                                    class="text-gray-500">-->
<!--                                  {{ item.measure }}-->
<!--                                </span>-->
<!--                              </div>-->
<!--                            </div>-->
<!--                          </div>-->
<!--                        </fieldset>-->
<!--                      </div>-->
<!--                      <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">-->
<!--                        <button-->
<!--                            type="button"-->
<!--                            class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"-->
<!--                            @click="createUser"-->
<!--                        >-->
<!--                          Создать-->
<!--                        </button>-->
<!--                        <button-->
<!--                            type="button"-->
<!--                            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"-->
<!--                            @click="userCreateModal = false"-->
<!--                            ref="cancelButtonRef">-->
<!--                          Отменить-->
<!--                        </button>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </DialogPanel>-->
<!--            </TransitionChild>-->
<!--          </div>-->
<!--        </div>-->
<!--      </Dialog>-->
<!--    </TransitionRoot>-->
  </div>
</template>
