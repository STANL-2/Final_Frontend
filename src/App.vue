<template>
  <component :is="layout">
    <Toast position="top-center" />
    <RouterView />
  </component>

  <Toast position="top-center" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import NoneLayout from '@/layouts/NoneLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import DOMEventService from '@/services/DOMEventService';
import useToastMessage from '@/hooks/useToastMessage';
import Toast from 'primevue/toast';
import { useUserStore } from '@/stores/user.js';

const route = useRoute();
const { showError, showSuccess } = useToastMessage();
const userStore = useUserStore();

const accessToken = userStore.accessToken;
const userInfo = userStore.isLoggined;

console.log("accessToken",accessToken);
console.log("userInfo",userInfo);

// 알림 초기화
const alarms = ref([]); // 알림 목록 상태
const eventSource = ref(null); // SSE 연결 객체

// 경로에 따라 레이아웃을 동적으로 변경
const layout = computed(() => {
    if (route.path.match('/')) {
    return NoneLayout;
  }
  return MainLayout; // 기본 레이아웃은 로그인 레이아웃
});

// SSE 연결 함수
const connectToSSE = () => {
  if (!accessToken){
    console.error("로그인 토큰이 없습니다. SSE 연결 실패");
    return;
  }
  // SSE 연결 생성
  eventSource.value = new EventSource(`http://localhost:8080/api/v1/alarm/connect`);

  // 이벤트 수신 시 알림 추가
  eventSource.value.onmessage = (event) => {
    const newAlarm = JSON.parse(event.data); // 알림 데이터 파싱
    console.log("새 알림 수신:", newAlarm);
    // 알림 추가
    alarms.value = [...alarms.value, newAlarm];
  };

  // 오류 시 연결 종료
  eventSource.value.onerror = (error) => {
    console.error("SSE 연결 오류:", error);
    eventSource.value.close();
  };
};

// SSE 연결 해제 함수
const disconnectFromSSE = () => {
  if (eventSource.value) {
    eventSource.value.close(); // 연결 종료
    eventSource.value = null;
    console.log("SSE 연결이 종료되었습니다.");
  }
};

// 로그인 상태 확인 후 SSE 연결
const checkLoginStatus = () => {

  if (accessToken && userInfo) {
    console.log("로그인 상태 확인됨. SSE 연결 시작.");
    connectToSSE(); // 로그인된 사용자 ID로 SSE 연결
  } else {
    console.log("로그아웃 상태. SSE 연결 해제.");
    disconnectFromSSE(); // 로그인 안 됐을 경우 SSE 해제
  }
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
    checkLoginStatus();
});

onUnmounted(() => {
    DOMEventService.unsubscribeApiError(handleApiError);
    DOMEventService.unsubscribeApiSuccess(handleApiSuccess);
    disconnectFromSSE();
});
</script>
