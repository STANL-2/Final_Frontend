<template>
  <div class="header">
    <PageHeader />
  </div>

  <button class="toggle-button" @click="toggleSidebar">Toggle Sidebar</button>

  <main class="main">
    <!-- <div class="aside">
      <PageAside />
    </div> -->
    <div class="aside" :class="{ hidden: isSidebarCollapsed }">
      <PageAside />
    </div>
    <div class="body">
      <RouterView />
    </div>
  </main>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import PageHeader from './components/PageHeader.vue';
import PageAside from './components/PageAside.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user';

const router = useRouter();
const userStore = useUserStore();
const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<style scoped>
.main {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
}

.body {
  flex: 7; /* body 비율 70% */
  padding: 1rem;
}





.aside {
  transition: width 0.3s ease;
  width: 260px;
}

.aside.hidden {
  width: 0;
  overflow: hidden;
}
.toggle-button {
  margin: 10px;
  padding: 5px 10px;
  font-size: 1rem;
  background-color: #6360AB;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
