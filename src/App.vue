<template>
  <div class="header">
    <PageHeader />
  </div>

  <main class="main">
    <div class="aside">
      <PageAside />
    </div>
    <div class="body">
      <RouterView />
    </div>
  </main>

</template>

<script setup>
import { RouterView } from 'vue-router';
import PageHeader from './components/PageHeader.vue';
import PageAside from './components/PageAside.vue';
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user';

const router = useRouter();
const userStore = useUserStore();


</script>

<style scoped>
.main {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
}

.aside {
  flex: 3; /* aside 비율 30% */
}

.body {
  flex: 7; /* body 비율 70% */
  padding: 1rem;
}
</style>
