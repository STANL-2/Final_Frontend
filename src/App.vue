<template>
  <component :is="layout">
    <Toast position="top-center" />
    <RouterView />
  </component>

  <Toast position="top-center" />
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import NoneLayout from '@/layouts/NoneLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import DOMEventService from '@/services/DOMEventService';
import useToastMessage from '@/hooks/useToastMessage';
import Toast from 'primevue/toast';

const route = useRoute();
const { showError, showSuccess } = useToastMessage();

// 경로에 따라 레이아웃을 동적으로 변경
const layout = computed(() => {
  // if (route.path.startsWith('/sample')) {
    if (route.path.match('/')) {
    return NoneLayout;
  }
  return MainLayout; // 기본 레이아웃은 로그인 레이아웃
});

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
