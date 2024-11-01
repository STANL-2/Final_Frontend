<template>

  <main>
    <!-- <RouterView /> -->
    <TableDataTest />
  </main>

</template>

<script setup>
import { RouterView } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';
import DOMEventService from './services/DOMEventService';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user';
import TableDataTest from './views/SearchFormTest.vue';
import Table from './views/TableDataTest.vue';

const router = useRouter();
const userStore = useUserStore();


</script>

<style scoped>
main {
  flex-grow: 1;
  overflow-y: auto;
}
</style>
