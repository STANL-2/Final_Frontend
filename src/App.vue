<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AuthLayout from '@/layouts/NoneLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';

const route = useRoute();

// 경로에 따라 레이아웃을 동적으로 변경
const layout = computed(() => {
  if (route.path.startsWith('/sample')) {
    return MainLayout;
  }
  return AuthLayout; // 기본 레이아웃은 로그인 레이아웃
});
</script>
