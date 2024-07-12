<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useProductsStore} from "@/stores/products.js";
import {storeToRefs} from "pinia";
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {ArrowLongLeftIcon, PlusIcon, XMarkIcon} from "@heroicons/vue/24/outline/index.js";
import {useCategoriesStore} from "@/stores/categories.js";
import {useFiltersStore} from "@/stores/filters.js";
import UploadImage from "@/components/UploadImage.vue";
import {useNotificationStore} from "@/stores/notifications.js";

const route = useRoute();
const router = useRouter();

const newElementsForm = ref([])
const newElementForm = ref({
  filter_id: null,
  value: {
    ru: "",
    kz: "",
    en: ""
  }
})

const newVariant = ref(null)

const currentLanguage = ref('ru')
const currentLanguageFilters = ref('ru')

const products = useProductsStore()
const categories = useCategoriesStore()
const {categoriesList} = storeToRefs(categories)
const filters = useFiltersStore()
const {filtersList, filtersListByCategory} = storeToRefs(filters)
const notifications = useNotificationStore()

const form = ref({
  title: {
    ru: "",
    kz: "",
    en: ""
  },
  description: {
    ru: "",
    kz: "",
    en: ""
  },
  category_id: null,
  image_url: "",
  product_variants: [],
  filter_data: []
});

const v$ = useVuelidate({
  title: {
    ru: {required},
    kz: {required},
    en: {required}
  },
  description: {
    ru: {required},
    kz: {required},
    en: {required}
  },
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

const newElement = (index) => {
  form.value.filter_data.push({
    filter_id: newElementsForm.value[index].filter_id,
    value: newElementsForm.value[index].value
  })
  newElementsForm.value[index].value = {
    ru: "",
    kz: "",
    en: ""
  }
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

const editProduct = async () => {
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    return;
  }
  await products.editProduct(route.params.id, form.value);
  if (products.editedProduct !== false) {
    notifications.showNotification("success", "Продукт успешно создан!", "Продукт успешно создан, его можно увидеть в списке продуктов.");
    router.push('/products')
  } else {
    notifications.showNotification("error", "Ошибка создания продукта!", "Попробуйте позже.");
  }
};

const fetchData = async () => {
  try {
    await products.detailProduct(route.params.id);
    form.value.title = products.detailProductResult.title;
    form.value.description = products.detailProductResult.description;
    form.value.image_url = products.detailProductResult.image_url;
    products.detailProductResult.product_variants.forEach(variant => {
      form.value.product_variants.push(variant.id);
    });
    form.value.category_id = products.detailProductResult.category.id;
    await nextTick()
    await filters.getFiltersListByCategory(form.value.category_id);
    newElementsForm.value = [];
    filters.filtersListByCategory.forEach(filter => {
      const elementCopy = JSON.parse(JSON.stringify(newElementForm.value));
      elementCopy.filter_id = filter.id;
      newElementsForm.value.push(elementCopy);
    });
    await nextTick()
    await categories.getCategoriesList()
    await filters.getFiltersList()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(form.value.category_id, async () => {
  await filters.getFiltersListByCategory(form.value.category_id);
  newElementsForm.value = [];
  filters.filtersListByCategory.forEach(filter => {
    const elementCopy = JSON.parse(JSON.stringify(newElementForm.value));
    elementCopy.filter_id = filter.id;
    newElementsForm.value.push(elementCopy);
  });
});
</script>

<template>
  <div>
    <div
        v-if="products.detailProductResult"
        class="px-4 sm:px-6 lg:px-8">
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
                  Редактирование продукта
                </p>
                <button
                    type="button"
                    class="inline-flex w-max justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                    @click="editProduct"
                >
                  Сохранить
                </button>
              </div>
              <p class="text-sm mb-3">
                Заполните все поля для успешного редактирования продукта.
              </p>
            </div>
            <div class="rounded-md px-3 pb-1.5 pt-2.5 border mb-3">
              <div class="flex gap-3 mb-3 text-sm">
                <p
                    @click="currentLanguage = 'ru'"
                    :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'ru' },
                      { '!border !border-red-500': v$.title.ru.$error || v$.description.ru.$error }
                  ]"
                    class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                  Русский
                </p>
                <p
                    @click="currentLanguage = 'kz'"
                    :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'kz' },
                      { '!border !border-red-500': v$.title.kz.$error || v$.description.kz.$error }
                  ]"
                    class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                  Казахский
                </p>
                <p
                    @click="currentLanguage = 'en'"
                    :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'en' },
                      { '!border !border-red-500': v$.title.en.$error || v$.description.en.$error }
                  ]"
                    class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                  Английский
                </p>
              </div>
              <div v-if="currentLanguage === 'ru'">
                <div
                    :class="{ '!border !border-red-500': v$.title.ru.$error }"
                    class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                      for="name"
                      class="block text-xs font-medium text-gray-900">
                    Название
                  </label>
                  <input
                      v-model="form.title.ru"
                      type="text"
                      name="name"
                      id="name"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Универсальная краска матовая"
                  />
                </div>
                <div
                    :class="{ '!border-red-500': v$.description.ru.$error }"
                    class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      for="name"
                      class="block font-medium text-gray-900 mb-2">
                    Описание
                  </label>
                  <QuillEditor
                      :options="options"
                      v-model:content="form.description.ru"
                      contentType="html"
                  />
                </div>
              </div>
              <div v-else-if="currentLanguage === 'kz'">
                <div
                    :class="{ '!border !border-red-500': v$.title.kz.$error }"
                    class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                      for="name"
                      class="block text-xs font-medium text-gray-900">
                    Название
                  </label>
                  <input
                      v-model="form.title.kz"
                      type="text"
                      name="name"
                      id="name"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Күңгірт әмбебап бояу"
                  />
                </div>
                <div
                    :class="{ '!border-red-500': v$.description.kz.$error }"
                    class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      for="name"
                      class="block font-medium text-gray-900 mb-2">
                    Описание
                  </label>
                  <QuillEditor
                      :options="options_kz"
                      v-model:content="form.description.kz"
                      contentType="html"
                  />
                </div>
              </div>
              <div v-else>
                <div
                    :class="{ '!border !border-red-500': v$.title.en.$error }"
                    class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                      for="name"
                      class="block text-xs font-medium text-gray-900">
                    Название
                  </label>
                  <input
                      v-model="form.title.en"
                      type="text"
                      name="name"
                      id="name"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Universal paint matte"
                  />
                </div>
                <div
                    :class="{ '!border-red-500': v$.description.en.$error }"
                    class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      for="name"
                      class="block font-medium text-gray-900 mb-2">
                    Описание
                  </label>
                  <QuillEditor
                      :options="options_en"
                      v-model:content="form.description.en"
                      contentType="html"
                  />
                </div>
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
            <div v-if="categoriesList" class="mb-3">
              <p class="block text-xs font-medium text-gray-900">
                Категория
              </p>
              <select
                  v-model="form.category_id"
                  class="w-full px-4 py-3 rounded-md"
                  name=""
                  id="">
                <option :value="null">Выберите категорию</option>
                <option
                    v-for="(item, index) of categoriesList.data"
                    :key="index"
                    :value="item.id"
                >
                  {{ item.title.ru }}
                </option>
              </select>
            </div>
            <div v-if="filtersListByCategory">
              <div
                  v-if="filtersListByCategory.length > 0 && newElementsForm.length > 0"
                  class="text-xs mb-3">
                <p class="mb-3 block text-xs font-medium text-gray-900">
                  Выберите фильтры для продукта
                </p>
                <div class="flex gap-3 mb-3 text-sm">
                  <p
                      @click="currentLanguageFilters = 'ru'"
                      :class="[
                      { 'bg-mainColor text-white': currentLanguageFilters === 'ru' }
                  ]"
                      class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                    Русский
                  </p>
                  <p
                      @click="currentLanguageFilters = 'kz'"
                      :class="[
                      { 'bg-mainColor text-white': currentLanguageFilters === 'kz' }
                  ]"
                      class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                    Казахский
                  </p>
                  <p
                      @click="currentLanguageFilters = 'en'"
                      :class="[
                      { 'bg-mainColor text-white': currentLanguageFilters === 'en' }
                  ]"
                      class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                    Английский
                  </p>
                </div>
                <div
                    v-for="(item, index) of filtersListByCategory"
                    :key="index"
                    class="flex items-center w-1/2"
                >
                  <div>
                    <div class="mt-2 flex items-center gap-2 w-full">
                      <div
                          v-if="currentLanguageFilters === 'ru'"
                          class="w-full rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                        <label for="name" class="block text-xs font-medium text-gray-900">
                          {{ item.title.ru }}
                        </label>
                        <input
                            v-model="newElementsForm[index].value.ru"
                            type="text"
                            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Цвет краски, мм, кг и т.д."
                        />
                      </div>
                      <div
                          v-else-if="currentLanguageFilters === 'kz'"
                          class="w-full rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                        <label for="name" class="block text-xs font-medium text-gray-900">
                          {{ item.title.kz }}
                        </label>
                        <input
                            v-model="newElementsForm[index].value.kz"
                            type="text"
                            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Бояу түсі, мм, кг және т.б."
                        />
                      </div>
                      <div
                          v-else
                          class="w-full rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                        <label for="name" class="block text-xs font-medium text-gray-900">
                          {{ item.title.en }}
                        </label>
                        <input
                            v-model="newElementsForm[index].value.en"
                            type="text"
                            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Paint color, mm, kg, etc."
                        />
                      </div>
                      <p
                          v-if="newElementsForm[index].value.ru.length > 0 && newElementsForm[index].value.kz.length > 0 && newElementsForm[index].value.en.length > 0"
                          @click="newElement(index)"
                          class="rounded-full cursor-pointer bg-mainColor p-1.5 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        <PlusIcon
                            class="h-5 w-5"
                            aria-hidden="true"
                        />
                      </p>
                    </div>
                  </div>
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
                        {{ getFilterTitleById(filter.filter_id).ru }}:
                      </p>
                      <p>
                        {{ filter.value.ru }}
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
  </div>
</template>
