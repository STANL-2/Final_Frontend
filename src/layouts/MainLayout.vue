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

    <Toast position="top-center" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import PagePath from '@/components/common/PagePath.vue';
import PageAside from '@/components/PageAside.vue';
import useToastMessage from '@/hooks/useToastMessage';
import DOMEventService from '@/services/DOMEventService';
import Toast from 'primevue/toast';

import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const { showError, showSuccess } = useToastMessage();
const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

function handleApiError(customEvent) {
    showError('오류 발생', customEvent.detail);
}

function handleApiSuccess(customEvent) {
    showSuccess('성공', customEvent.detail);
}

onMounted(() => {
    DOMEventService.subscribeApiError(handleApiError);
    DOMEventService.subscribeApiSuccess(handleApiSuccess);
});

onUnmounted(() => {
    DOMEventService.unsubscribeApiError(handleApiError);
    DOMEventService.unsubscribeApiSuccess(handleApiSuccess);
});
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