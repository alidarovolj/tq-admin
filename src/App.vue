<script setup>
import {computed} from 'vue';
import {useRoute} from 'vue-router';
import Notifications from "@/components/Notifications.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import ModalDialog from "@/components/ModalDialog.vue";

const route = useRoute();

const showLayout = computed(() => route.fullPath !== '/login');
</script>

<template>
  <div class="min-h-screen h-screen">
    <template v-if="showLayout">
      <AppLayout>
        <RouterView/>
      </AppLayout>
    </template>
    <template v-else>
      <RouterView/>
    </template>
    <Notifications/>
    <ModalDialog/>
  </div>
</template>

<style scoped>
</style>
