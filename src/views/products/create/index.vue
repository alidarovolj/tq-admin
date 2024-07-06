<script setup>
import {ref, watch, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useProductsStore} from "@/stores/products.js";
import {storeToRefs} from "pinia";
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions
} from "@headlessui/vue";
import {
  XMarkIcon,
  CheckIcon,
  ChevronUpDownIcon,
  PlusIcon,
  ArrowLongLeftIcon
} from "@heroicons/vue/24/outline/index.js";
import {useCategoriesStore} from "@/stores/categories.js";
import {useFiltersStore} from "@/stores/filters.js";
import UploadImage from "@/components/UploadImage.vue";
import {useNotificationStore} from "@/stores/notifications.js";

const route = useRoute();
const router = useRouter();

const newElementForm = ref({
  filter_id: null,
  value: ""
})

const newVariant = ref(null)

const selectedCategory = ref(null);
const selectedFilter = ref(null);

const currentLanguage = ref('ru')

const products = useProductsStore()
const categories = useCategoriesStore()
const {categoriesList} = storeToRefs(categories)
const filters = useFiltersStore()
const {filtersList} = storeToRefs(filters)
const notifications = useNotificationStore()

const form = ref({
  title: "",
  title_kz: "",
  title_en: "",
  description: "",
  description_kz: "",
  description_en: "",
  category_id: null,
  image_url: "",
  product_variants: [],
  filter_data: []
});

const v$ = useVuelidate({
  title: {required},
  title_kz: {required},
  title_en: {required},
  description: {required},
  description_kz: {required},
  description_en: {required},
  category_id: {required},
  image_url: {required}
}, form);

const options = ref({
  debug: 'info',
  placeholder: 'Акриловая водно-дисперсионная краска предназначенная для окрашивания интерьеров и фасадов...'
})

const options_kz = ref({
  debug: 'info',
  placeholder: 'Интерьер мен қасбеттерді бояуға арналған акрилді су-дисперсиялық бояу...'
})

const options_en = ref({
  debug: 'info',
  placeholder: 'Acrylic water-dispersion paint intended for painting interiors and facades...'
})

const newElement = () => {
  form.value.filter_data.push({
    filter_id: selectedFilter.value.id,
    value: newElementForm.value.value
  })
  newElementForm.value.value = ""
  newElementForm.value.filter_id = null
  selectedFilter.value = null
}

const page = ref(route.query.page || 1);
const perPage = ref(route.query.perPage || 10);

const updateQueryParams = async () => {
  await router.push({query: {...route.query, page: page.value, perPage: perPage.value}});
};

onMounted(() => {
  updateQueryParams();
});

watch([page, perPage], updateQueryParams, {deep: true});

const getFilterTitleById = (filterId) => {
  const filter = filtersList.value.data.find(filter => filter.id === filterId);
  return filter ? filter.title : 'Unknown Filter';
};

const createProduct = async () => {
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    return;
  }
  await products.createProduct(form.value);
  if (products.createdProduct !== false) {
    notifications.showNotification("success", "Пользователь успешно создан!", "Пользователь успешно создан, его можно увидеть в списке пользователей.");
    router.push('/products')
  } else {
    notifications.showNotification("error", "Ошибка создания пользователя!", "Попробуйте позже.");
  }
};

const fetchData = async () => {
  try {
    await categories.getCategoriesList()
    await filters.getFiltersList()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(selectedCategory, () => {
  form.value.category_id = selectedCategory.value.id;
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div>
        <div>
          <div>
            <div>
              <RouterLink
                  to="/products"
                  class="flex gap-2 items-center mb-5">
                <div>
                  <ArrowLongLeftIcon class="w-5 h-5"/>
                </div>
                <p>
                  Назад
                </p>
              </RouterLink>
              <div class="flex justify-between mb-5">
                <p class="font-semibold text-xl">
                  Создание продукта
                </p>
                <button
                    type="button"
                    class="inline-flex w-max justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                    @click="createProduct"
                >
                  Создать
                </button>
              </div>
              <p class="text-sm mb-3">
                Заполните все поля для создания нового продукта.
              </p>
            </div>
            <div class="flex gap-3 mb-3 text-sm">
              <p
                  @click="currentLanguage = 'ru'"
                  :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'ru' },
                      { '!border !border-red-500': v$.title.$error || v$.description.$error }
                  ]"
                  class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                Русский
              </p>
              <p
                  @click="currentLanguage = 'kz'"
                  :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'kz' },
                      { '!border !border-red-500': v$.title_kz.$error || v$.description_kz.$error }
                  ]"
                  class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                Казахский
              </p>
              <p
                  @click="currentLanguage = 'en'"
                  :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'en' },
                      { '!border !border-red-500': v$.title_en.$error || v$.description_en.$error }
                  ]"
                  class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                Английский
              </p>
            </div>
            <div v-if="currentLanguage === 'ru'">
              <div
                  :class="{ '!border !border-red-500': v$.title.$error }"
                  class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                <label
                    for="name"
                    class="block text-xs font-medium text-gray-900">
                  Название
                </label>
                <input
                    v-model="form.title"
                    type="text"
                    name="name"
                    id="name"
                    class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Универсальная краска матовая"
                />
              </div>
              <div
                  :class="{ '!border-red-500': v$.description.$error }"
                  class="mb-3 text-xs p-3 border rounded-md">
                <label
                    for="name"
                    class="block font-medium text-gray-900 mb-2">
                  Описание
                </label>
                <QuillEditor
                    :options="options"
                    v-model:content="form.description"
                    contentType="html"
                />
              </div>
            </div>
            <div v-else-if="currentLanguage === 'kz'">
              <div
                  :class="{ '!border !border-red-500': v$.title_kz.$error }"
                  class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                <label
                    for="name"
                    class="block text-xs font-medium text-gray-900">
                  Название
                </label>
                <input
                    v-model="form.title_kz"
                    type="text"
                    name="name"
                    id="name"
                    class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Күңгірт әмбебап бояу"
                />
              </div>
              <div
                  :class="{ '!border-red-500': v$.description_kz.$error }"
                  class="mb-3 text-xs p-3 border rounded-md">
                <label
                    for="name"
                    class="block font-medium text-gray-900 mb-2">
                  Описание
                </label>
                <QuillEditor
                    :options="options_kz"
                    v-model:content="form.description_kz"
                    contentType="html"
                />
              </div>
            </div>
            <div v-else>
              <div
                  :class="{ '!border !border-red-500': v$.title_en.$error }"
                  class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                <label
                    for="name"
                    class="block text-xs font-medium text-gray-900">
                  Название
                </label>
                <input
                    v-model="form.title_en"
                    type="text"
                    name="name"
                    id="name"
                    class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Universal paint matte"
                />
              </div>
              <div
                  :class="{ '!border-red-500': v$.description_en.$error }"
                  class="mb-3 text-xs p-3 border rounded-md">
                <label
                    for="name"
                    class="block font-medium text-gray-900 mb-2">
                  Описание
                </label>
                <QuillEditor
                    :options="options_en"
                    v-model:content="form.description_en"
                    contentType="html"
                />
              </div>
            </div>
            <div class="mb-3">
              <UploadImage
                  :class="{ '!border !border-red-500': v$.image_url.$error }"
                  type="products"
                  @photoUploaded="(image) => form.image_url = image"
              />
              <img
                  v-if="form.image_url"
                  class="h-20 w-max object-contain"
                  :class="{ 'mt-5' : form.image_url }"
                  :src="form.image_url"
                  alt="">
            </div>
            <div
                class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                  for="name"
                  class="block text-xs font-medium text-gray-900">
                Доступный вес
              </label>
              <div class="flex gap-2">
                <input
                    v-model="newVariant"
                    type="number"
                    name="name"
                    id="name"
                    class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="10кг"
                />
                <button
                    v-if="newVariant"
                    @click="form.product_variants.push(newVariant); newVariant = null;"
                    type="button"
                    class="rounded bg-mainColor px-2 py-1 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                  Добавить
                </button>
              </div>
            </div>
            <div v-if="form.product_variants.length > 0" class="my-3 text-xs">
              <p class="block font-medium text-gray-900">
                Доступные веса
              </p>
              <div class="flex flex-wrap gap-2">
                <div
                    v-for="(weight, ind) of form.product_variants"
                    :key="ind"
                    class="flex items-center bg-gray-100 p-2 gap-1 rounded-md">
                  <p>
                    {{ weight }}кг
                  </p>
                  <XMarkIcon
                      @click="form.product_variants.splice(ind, 1)"
                      class="w-5 h-5 text-red-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <Listbox
                as="div"
                class="mb-3"
                v-model="selectedCategory"
            >
              <ListboxLabel class="block text-xs font-medium text-gray-900">
                Категория
              </ListboxLabel>
              <div class="relative mt-2">
                <ListboxButton
                    :class="{ '!border !border-red-500': v$.category_id.$error }"
                    class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <span
                                v-if="selectedCategory"
                                class="block truncate">
                              {{ selectedCategory.title }}
                            </span>
                  <span v-else>
                              Выберите категорию
                            </span>
                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            </span>
                </ListboxButton>

                <transition
                    leave-active-class="transition ease-in duration-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0">
                  <ListboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <ListboxOption
                        as="template"
                        v-for="(category, index) in categoriesList.data"
                        :key="index"
                        :value="category"
                        v-slot="{ active, selected }">
                      <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                                    {{ category.title }}
                                  </span>

                        <span
                            v-if="selected"
                            :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                                    <CheckIcon class="h-5 w-5" aria-hidden="true"/>
                                  </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
            <div class="text-xs mb-3">
              <Listbox
                  as="div"
                  v-model="selectedFilter">
                <ListboxLabel class="block font-medium leading-6 text-gray-900">
                  Фильтры
                </ListboxLabel>
                <div class="relative mt-2">
                  <ListboxButton
                      class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                              <span
                                  v-if="selectedFilter"
                                  class="inline-flex w-full truncate">
                                <span class="truncate">{{ selectedFilter.title }}</span>
                                <span class="ml-2 truncate text-gray-500">{{ selectedFilter.measure }}</span>
                              </span>
                    <span v-else>
                                Выберите фильтр
                              </span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
                              </span>
                  </ListboxButton>

                  <transition leave-active-class="transition ease-in duration-100"
                              leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <ListboxOptions
                        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ListboxOption
                          as="template"
                          v-for="(item, index) of filtersList.data"
                          :key="index"
                          :value="item"
                          v-slot="{ active, selected }">
                        <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                          <div class="flex">
                                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'truncate']">
                                        {{ item.title }}
                                      </span>
                            <span :class="[active ? 'text-indigo-200' : 'text-gray-500', 'ml-2 truncate']">
                                        {{ item.measure }}
                                      </span>
                          </div>

                          <span
                              v-if="selected"
                              :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                                      <CheckIcon class="h-5 w-5" aria-hidden="true"/>
                                    </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
              <div
                  v-if="selectedFilter"
                  class="mt-2 flex items-center gap-2">
                <div
                    class="w-full rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label for="name" class="block text-xs font-medium text-gray-900">
                    Введите значение для фильтра
                  </label>
                  <input
                      v-model="newElementForm.value"
                      type="text"
                      name="name"
                      id="name"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Цвет краски, мм, кг и т.д."
                  />
                </div>
                <p
                    v-if="newElementForm.value.length > 0"
                    @click="newElement"
                    class="rounded-full cursor-pointer bg-mainColor p-1.5 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  <PlusIcon
                      class="h-5 w-5"
                      aria-hidden="true"
                  />
                </p>
              </div>
              <div v-if="form.filter_data.length > 0" class="mt-3">
                <p class="block text-xs font-medium text-gray-900">
                  Выбранные фильтры
                </p>
                <div class="flex flex-wrap gap-2">
                  <div
                      v-for="(filter, ind) of form.filter_data"
                      :key="ind"
                      class="flex items-center bg-gray-100 p-2 gap-1 rounded-md">
                    <p>
                      {{ getFilterTitleById(filter.filter_id) }}:
                    </p>
                    <p>
                      {{ filter.value }}
                    </p>
                    <XMarkIcon
                        @click="form.filter_data.splice(ind, 1)"
                        class="w-5 h-5 text-red-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
