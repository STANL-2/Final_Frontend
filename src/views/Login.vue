<template>
    <h2>로그인</h2>
    <form @submit.prevent="login">
        <div>
            <label for="login-id">아이디</label>
            <input id="login-id" v-model="loginId" type="text" placeholder="아이디를 입력하세요" autocomplete="username"/>
        </div>
        <div>
            <label for="password">비밀번호</label>
            <input id="password" v-model="password" type="password" placeholder="비밀번호를 입력하세요" autocomplete="current-password"/>
        </div>
        <button type="submit">로그인</button>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { $api } from '@/services/api/api';

const userStore = useUserStore();
const router = useRouter();

const loginId = ref('');
const password = ref('');

const goHome = () => {
    router.replace('/');
};

const login = async () => {

    userStore.logout();

    const userTokens = await $api.member.post(
        {
            loginId: loginId.value,
            password: password.value,
        },
        'signin', // 서브 URL
    );

    // userStore에 발급된 토큰 저장
    userStore.saveTokens(userTokens.jwt);

    goHome();
}

</script>

<style scoped></style>
