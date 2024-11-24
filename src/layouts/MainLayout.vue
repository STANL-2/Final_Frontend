<template>
    <div class="header">
        <PageHeader />
    </div>

    <!-- 사이드바 열고 닫기 버튼 -->
    <!-- <button class="toggle-button" @click="toggleSidebar">Toggle Sidebar</button> -->

    <main class="main">
        <!-- <div class="aside">
        <PageAside />
        </div> -->
        <div class="aside" :class="{ hidden: isSidebarCollapsed }">
            <PageAside />
        </div>
        <div class="body">
            <div class="path">
                <PagePath />
            </div>
            <div class="body-content">
                <RouterView />
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import PagePath from '@/components/common/PagePath.vue';
import PageAside from '@/components/PageAside.vue';


const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<style scoped>
.main {
    display: flex;
    flex-direction: row;
}

.body {
    flex: 1;
    padding: 1rem;
}

.path {
    margin-bottom: 1rem;
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