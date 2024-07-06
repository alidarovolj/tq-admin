<script setup>
import { ref } from 'vue';
import axios from 'axios';

const fileInput = ref(null);
const isLoading = ref(false);
const emit = defineEmits(['photoUploaded']);
const props = defineProps(['type']);

const uploadPhoto = async () => {
  const file = fileInput.value.files[0];
  if (!file) return;

  isLoading.value = true;
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', props.type);

  try {
    const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/admin/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Authorization": "Bearer " + localStorage.getItem('token')
      },
    });

    emit('photoUploaded', response.data.image_url);
  } catch (error) {
    console.error('Error uploading photo:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="text-xs rounded-md px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
    <p class="block font-medium text-gray-900 mb-2">
      Загрузите фотографию
    </p>
    <div>
      <input
          type="file"
          ref="fileInput"
          @change="uploadPhoto"
      />
    </div>
    <div v-if="isLoading" class="preloader">
      Загрузка...
    </div>
  </div>
</template>

<style scoped>
.preloader {
  color: gray;
  font-size: 12px;
}
</style>