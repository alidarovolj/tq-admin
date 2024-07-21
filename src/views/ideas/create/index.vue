<script setup>
import ColorPicker from 'primevue/colorpicker';
import {ArrowLongLeftIcon, PlusCircleIcon, TrashIcon} from "@heroicons/vue/24/outline/index.js";
import {computed, nextTick, onMounted, ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import UploadImage from "@/components/UploadImage.vue";
import {useIdeasStore} from "@/stores/ideas.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRouter} from "vue-router";

const idea = useIdeasStore()
const notifications = useNotificationStore()
const currentLanguage = ref('ru')
const type = ref(null)
const router = useRouter()

const form = ref({
  title: {
    ru: null,
    kz: null,
    en: null
  },
  idea_color_id: null,
  room_id: null,
  image_url: null,
  values: []
})

const v$ = useVuelidate({
  title: {
    ru: {required}
  },
  idea_color_id: {required},
  room_id: {required},
  image_url: {required}
}, form);

const removeItem = (index, i) => {
  if (form.value.values[index].length === 1) {
    form.value.values.splice(index, 1)
  } else {
    form.value.values[index].splice(i, 1)
  }
}

const pushBlock = (index) => {
  console.log(index)
  if (typeof index === 'object') {
    form.value.values.push([{
      type: null,
    }])
  } else {
    form.value.values[index].push({
      type: null
    })
  }
  type.value = null
}

const selectType = (event, index, i) => {
  form.value.values[index][i].type = type.value
  if (event.target.value === 'colors') {
    form.value.values[index][i].content = {
      colors: [],
    }
    type.value = null
  } else if (event.target.value === 'text') {
    form.value.values[index][i].content = {
      texts: [],
    }
    type.value = null
  } else if (event.target.value === 'photos') {
    form.value.values[index][i].content = {
      photos: [],
    }
    type.value = null
  } else {
    form.value.values[index][i].content = {
      title: '',
      texts: [],
    }
    type.value = null
  }
}

const pushColor = (index, i) => {
  form.value.values[index][i].content.colors.push('ff0000')
}

const pushPhoto = (index, i) => {
  form.value.values[index][i].content.photos.push('')
}

const pushColorCombination = (index, i) => {
  form.value.values[index][i].content.texts.push('')
}

const pushText = (index, i) => {
  form.value.values[index][i].content.texts.push({
    heading: "",
    text: ""
  })
}

const dynamicClass = computed(() => {
  return `border px-5 py-2 rounded-md text-xs bg-[#${form.value.color}]`;
});

const createIdea = async () => {
  await v$.value.$validate();

  if (!v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте все поля на странице.");
    console.log(form.value)
  }

  await idea.createIdea(form.value);
  if (idea.createdIdea !== false) {
    await idea.getIdeasListWithPG()
    notifications.showNotification("success", "Идея успешно создана!", "Идея успешно создана, ее можно увидеть в списке идей.");
    router.push('/ideas')
  } else {
    notifications.showNotification("error", "Ошибка создания идеи!", "Попробуйте позже.");
  }
}

const fetchData = async () => {
  try {
    await idea.getIdeasRoomsList()
    await idea.getIdeasColorsList()
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await nextTick()
  await fetchData()
});
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div>
      <RouterLink
          to="/ideas"
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
          Создание идеи
        </p>
        <button
            type="button"
            class="inline-flex w-max justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
            @click="createIdea"
        >
          Создать
        </button>
      </div>
      <p class="text-sm mb-3">
        Заполните все поля для создания нового продукта.
      </p>
    </div>
    <select
        v-model="form.room_id"
        :class="{ 'border border-red-500' : v$.room_id.$error }"
        name=""
        class="mb-3 text-xs block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
        id="">
      <option :value="null">Выберите комнату</option>
      <option
          v-for="(room, index) in idea.ideaRooms"
          :key="index"
          :value="room.id">
        {{ room.title }}
      </option>
    </select>
    <div
        v-if="idea.ideaColors"
        :class="{ 'border border-red-500' : v$.idea_color_id.$error }"
        class="border px-5 py-2 rounded-md text-xs mb-3">
      <p class="mb-1">Выберите основной цвет</p>
      <select
          v-model="form.idea_color_id"
          name=""
          class="mb-3 text-xs block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
          id="">
        <option :value="null">Выберите цвет</option>
        <option
            v-for="(color, index) in idea.ideaColors.data"
            :key="index"
            :value="color.id">
          {{ color.title.ru }}
        </option>
      </select>
    </div>
    <UploadImage
        :class="{ 'border border-red-500' : v$.image_url.$error }"
        class="mb-3" @photoUploaded="(event) => form.image_url = event" type="ideas"/>
    <div class="rounded-md px-3 pb-1.5 pt-2.5 border mb-3">
      <div class="flex gap-3 mb-3 text-sm">
        <p
            @click="currentLanguage = 'ru'"
            :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'ru' },
                      { '!border !border-red-500': v$.title.ru.$error }
                  ]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
          Русский
        </p>
        <p
            @click="currentLanguage = 'kz'"
            :class="[{ 'bg-mainColor text-white': currentLanguage === 'kz' }]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
          Казахский
        </p>
        <p
            @click="currentLanguage = 'en'"
            :class="[{ 'bg-mainColor text-white': currentLanguage === 'en' }]"
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
      </div>
      <div v-else-if="currentLanguage === 'kz'">
        <div
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
      </div>
      <div v-else>
        <div
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
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div
          v-for="(value, index) in form.values"
          :key="index">
        <div class="flex justify-between items-center text-xs mb-2">
          <p class="font-semibold">Заполните данные</p>
          <p
              v-if="value.length < 2"
              @click="pushBlock(index)" class="text-mainColor">
            Добавить
          </p>
        </div>
        <div class="flex gap-5">
          <div
              v-for="(item, i) in value"
              :key="i"
              class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-14 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-3">
            <div v-if="item.type" class="w-full mx-auto">
              <div
                  v-if="item.type === 'colors'"
                  class="flex flex-col gap-1">
                <div
                    v-for="(color, j) in item.content.colors"
                    :key="j"
                    class="flex flex-col gap-1 text-xs">
                  <TrashIcon
                      @click="form.values[index][i].content.colors.splice(j, 1)"
                      class="absolute right-2 top-2 w-4 h-4 text-red-500"
                  />
                  <div class="border px-5 py-2 rounded-md">
                    <p class="mb-1">Выберите цвет</p>
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-2 w-full">
                        <p>#</p>
                        <input
                            @change="(event) => form.values[index][i].content.colors[j] = event.target.value"
                            :value="color"
                            type="text"
                            placeholder="#hex код цвета (введите 6 символов)"
                            class="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                        />
                      </div>
                      <ColorPicker
                          :modelValue="color"
                          @change="(event) => form.values[index][i].content.colors[j] = event.value"/>
                    </div>
                  </div>
                </div>
                <button
                    v-if="form.values[index][i].content.colors.length <= 5"
                    @click="pushColor(index, i)"
                    type="button"
                    class="text-gray-400 hover:text-gray-600 transition-all relative block w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-3">
                  <PlusCircleIcon class="w-7 h-7 mx-auto"/>
                </button>
              </div>
              <div
                  v-if="item.type === 'text'"
                  class="flex flex-col gap-1">
                <div
                    v-for="(color, j) in item.content.texts"
                    :key="j"
                    class="flex flex-col gap-1 text-xs relative">
                  <TrashIcon
                      @click="form.values[index][i].content.texts.splice(j, 1)"
                      class="absolute right-2 top-2 w-4 h-4 text-red-500"
                  />
                  <div class="border px-5 py-2 rounded-md">
                    <p class="mb-1">Введите текст</p>
                    <div class="flex items-center">
                      <div class="flex flex-col items-center gap-2 w-full">
                        <input
                            @change="(event) => form.values[index][i].content.texts[j].heading = event.target.value"
                            :value="color.heading"
                            type="text"
                            placeholder="Введите заголовок"
                            class="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                        />
                        <textarea
                            @change="(event) => form.values[index][i].content.texts[j].text = event.target.value"
                            :value="color.text"
                            type="text"
                            placeholder="Введите текст"
                            class="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                    v-if="form.values[index][i].content.texts.length <= 2"
                    @click="pushText(index, i)"
                    type="button"
                    class="text-gray-400 hover:text-gray-600 transition-all relative block w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-3">
                  <PlusCircleIcon class="w-7 h-7 mx-auto"/>
                </button>
              </div>
              <div
                  v-if="item.type === 'photos'"
                  class="flex flex-col gap-1">
                <div
                    v-for="(color, j) in item.content.photos"
                    :key="j"
                    class="flex flex-col gap-1 text-xs relative">
                  <TrashIcon
                      @click="form.values[index][i].content.photos.splice(j, 1)"
                      class="absolute right-2 top-2 w-4 h-4 text-red-500"
                  />
                  <div class="border px-5 py-2 rounded-md">
                    <p class="mb-1">Внесите фотографию</p>
                    <UploadImage @photoUploaded="(event) => form.values[index][i].content.photos[j] = event" type="ideas"/>
                  </div>
                </div>
                <button
                    v-if="form.values[index][i].content.photos.length <= 5"
                    @click="pushPhoto(index, i)"
                    type="button"
                    class="text-gray-400 hover:text-gray-600 transition-all relative block w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-3">
                  <PlusCircleIcon class="w-7 h-7 mx-auto"/>
                </button>
              </div>
              <div
                  v-if="item.type === 'color_combinations'"
                  class="flex flex-col gap-1">
                <div :class="dynamicClass">
                  <p class="text-3xl font-bold mb-5">Цветовые сочетания:</p>
                  <p class="mb-1">Введите заголовок</p>
                  <div class="flex items-center mb-2">
                    <div class="flex flex-col items-center gap-2 w-full">
                        <textarea
                            @change="(event) => form.values[index][i].content.title = event.target.value"
                            type="text"
                            placeholder="Введите заголовок"
                            class="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                        />
                    </div>
                  </div>
                </div>
                <div
                    v-for="(color, j) in item.content.texts"
                    :key="j"
                    class="flex flex-col gap-1 text-xs relative">
                  <TrashIcon
                      @click="form.values[index][i].content.texts.splice(j, 1)"
                      class="absolute right-2 top-2 w-4 h-4 text-red-500"
                  />

                  <div class="border px-5 py-2 rounded-md">
                    <p class="mb-1">Введите текст</p>
                    <div class="flex items-center">
                      <div class="flex flex-col items-center gap-2 w-full">
                        <textarea
                            @change="(event) => form.values[index][i].content.texts[j] = event.target.value"
                            :value="color"
                            type="text"
                            placeholder="Введите текст"
                            class="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                    v-if="form.values[index][i].content.texts.length <= 5"
                    @click="pushColorCombination(index, i)"
                    type="button"
                    class="text-gray-400 hover:text-gray-600 transition-all relative block w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-3">
                  <PlusCircleIcon class="w-7 h-7 mx-auto"/>
                </button>
              </div>
            </div>
            <TrashIcon
                @click="removeItem(index, i)"
                class="absolute right-2 top-2 w-6 h-6 bg-red-500 text-white p-1 rounded"
            />
            <div class="absolute right-5 top-5">
              <label
                  for="location"
                  class="block text-xs font-medium text-gray-900">
                Тип блока
              </label>
              <select
                  @change="(event) => selectType(event, index, i)"
                  v-model="type"
                  id="location"
                  name="location"
                  class="mt-1 block w-full rounded-md border-0 py-1 px-1 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm">
                <option :value="null">Выберите стиль</option>
                <option value="text">Текст</option>
                <option value="colors">Цветовой ряд</option>
                <option value="color_combinations">Цветовые сочетания</option>
                <option value="photos">Фотографии</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <button
          @click="pushBlock"
          type="button"
          class="text-gray-400 hover:text-gray-600 transition-all relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-3">
        <PlusCircleIcon class="w-10 h-10 mx-auto"/>
      </button>
    </div>
  </div>
</template>