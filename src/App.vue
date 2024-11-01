<template>
  
  <PageHeader />

  <main>
    <RouterView />
  </main>

</template>

<script setup>
import { RouterView } from 'vue-router';
import PageHeader from './components/PageHeader.vue';
import { onMounted, onUnmounted } from 'vue';
import DOMEventService from './services/DOMEventService';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user';

const router = useRouter();
const userStore = useUserStore();


</script>

<style scoped>
main {
  flex-grow: 1;
  overflow-y: auto;
}
</style>
