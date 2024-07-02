<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Notifications from "@/components/Notifications.vue";
import AppLayout from "@/layouts/AppLayout.vue";

const route = useRoute();

const showLayout = computed(() => route.path !== '/login');
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
  </div>
</template>

<style scoped>
</style>
