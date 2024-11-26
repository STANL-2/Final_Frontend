<template>
    <div class="login-page">
        <div class="background">
            <div class="login-container">
                <form @submit.prevent="login">
                    <div>
                        <input id="login-id" v-model="loginId" type="text" placeholder="아이디" autocomplete="username" />
                        <p v-if="showError && !loginId" class="error-message">아이디를 입력해주세요.</p>
                    </div>
                    <div>
                        <input id="password" v-model="password" type="password" placeholder="비밀번호"
                            autocomplete="current-password" />
                        <p v-if="showError && !password" class="error-message">비밀번호를 입력해주세요.</p>
                    </div>
                    <button type="submit">로그인</button>
                    <div class="button-container">
                        <button type="button" class="secondary-button">임시 비밀번호 발급하기</button>
                    </div>

                    <!-- 서버 응답 오류 메시지 -->
                    <p v-if="serverError" class="server-error">{{ serverError }}</p>
                </form>
            </div>
            <img class="car-image" src="@/assets/login/loginCar.png" alt="Car" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { $api } from '@/services/api/api';

const userStore = useUserStore();
const router = useRouter();

const loginId = ref('');
const password = ref('');
const showError = ref(false);
const serverError = ref('');

const goHome = () => {
    router.replace('/dashboard');
};

const login = async () => {
    // 입력 필드가 비어 있는지 검사
    if (!loginId.value || !password.value) {
        showError.value = true;
        return;
    }
    showError.value = false;
    serverError.value = '';

    try {
        // 로그인 시도
        const userTokens = await $api.auth.post(
            {
                loginId: loginId.value,
                password: password.value,
            },
            'signin'
        );

        userStore.saveTokens(userTokens.result);
        userStore.saveUserInfo(userTokens.result);
        goHome();
    } catch (error) {
        // 서버에서 오류가 발생했을 때 메시지 표시
        serverError.value = '아이디(로그인 전용 아이디 또는 이메일)가 잘못되었거나, 비밀번호가 올바르지 않습니다.';
    }
};
</script>

<style scoped>
.login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    overflow: hidden;
    background-color: #ffffff;
}

.background {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/login/loginBg.png');
    background-size: contain;
    background-position: bottom;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 50px;
}

.car-image {
    position: absolute;
    right: 10rem;
    bottom: 4rem;
    width: 700px;
    height: auto;
    animation: drive-away 6s ease-in-out infinite;
}

/* 왼쪽 아래 대각선으로 이동 후 다시 나타나는 애니메이션 */
@keyframes drive-away {

    /* 처음 위치에서 멈춤 */
    0%,
    20% {
        transform: translate(1200px, -800px) scale(0.6);
        opacity: 0;
    }

    /* 반대쪽에서 빠르게 다시 나타남 */
    65% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
    }

    /* 원래 위치로 돌아옴 */
    90% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}


.login-container {
    margin-left: 10rem;
    margin-bottom: 10rem;
    max-width: 18rem;
}

form {
    display: flex;
    flex-direction: column;
}

input {
    margin-top: 15px;
    padding: 10px;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    background-color: #eeeeee;
    font-size: 14px;
    width: 18rem;
}

button {
    padding: 12px;
    border: none;
    border-radius: 4px;
    background-color: #3b3b7b;
    color: white;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #2d2d5f;
}

.button-container {
    display: flex;
    justify-content: flex-end; /* 버튼을 오른쪽으로 고정 */
}

.secondary-button {
    display: inline-block;
    min-width: 8rem; /* 고정된 최소 너비 설정 */
    height: 2rem;
    font-size: 11px;
    border: 1px solid #eeeeee;
    background-color: #ffffff;
    color: #777777;
    padding: 5px;
    cursor: pointer;
    text-align: center;
    flex-shrink: 0; /* 글씨 길이에 따라 버튼 크기 변경 방지 */
    transition: background-color 0.3s ease;
}

.secondary-button:hover {
    background-color: #eeeeee;
}

.error-message {
    color: red;
    font-size: 12px;
}

.server-error {
    color: red;
    font-size: 12px;
    margin-top: 5px;
}
</style>