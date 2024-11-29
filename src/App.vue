<template>
  <component :is="layout">
    <Toast position="top-center" />
    <RouterView />
  </component>

  <Toast position="top-center" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import NoneLayout from '@/layouts/NoneLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import DOMEventService from '@/services/DOMEventService';
import useToastMessage from '@/hooks/useToastMessage';
import Toast from 'primevue/toast';
import { useUserStore } from '@/stores/user';
import { EventSourcePolyfill } from 'event-source-polyfill';


// pinia에 있는 유저 정보
const userStore = useUserStore();   
const eventSource = ref(null);

// SSE 연결 함수
const connectToSSE = () => {
  const jwtToken = userStore.accessToken;

  // SSE 연결 생성
  eventSource.value = new EventSourcePolyfill('http://localhost:8080/api/v1/alarm/connect', {
    headers: {
      Authorization: `Bearer ${jwtToken}`
    }
  });

  // 이벤트 수신 시 알림 추가
  eventSource.value.onmessage = (event) => {
    const newAlarm = JSON.parse(event.data); // 알림 데이터 파싱
    console.log("새로운 알람을 받았습니다: ", newAlarm);

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
    console.log("SSE 연결이 종료되었습니다.");
  }
};

// 로그인 상태 확인 후 SSE 연결
const checkLoginStatus = () => {
  const accessToken = userStore.accessToken;

  if (accessToken) {
    console.log('로그인 상태 성공!');
    connectToSSE(); // 로그인된 사용자 ID로 SSE 연결
  } else {
    console.log('로그인 상태 실패!');
    disconnectFromSSE(); // 로그인 안 됐을 경우 SSE 해제
  }
};

const route = useRoute();
const { showError, showSuccess } = useToastMessage();

// 경로에 따라 레이아웃을 동적으로 변경
const layout = computed(() => {
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

// 컴포넌트 언마운트 시 SSE 연결 해제
onBeforeUnmount(() => {
  disconnectFromSSE();
});

onMounted(() => {
  DOMEventService.subscribeApiError(handleApiError);
  DOMEventService.subscribeApiSuccess(handleApiSuccess);
  // 컴포넌트 마운트 시 로그인 상태 확인 및 SSE 연결 설정
  checkLoginStatus();
});

onUnmounted(() => {
  DOMEventService.unsubscribeApiError(handleApiError);
  DOMEventService.unsubscribeApiSuccess(handleApiSuccess);
});
</script>