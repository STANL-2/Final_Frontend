<template>
    <header>
        <nav class="menu-bar">
            <div class="start">
                <RouterLink to="/" class="nav-link" active-class="router-link-active"
                    exact-active-class="router-link-exact-active">
                    <img src="../assets/header/gradation.png" class="garadation" />
                    <text class="title-1">영업관리</text>
                </RouterLink>
            </div>

            <div class="end">
                <!-- 로그인 유저 -->
                <div class="name">반갑습니다. {{ userStore.name }} 사원님</div>
                <div class="right-logo">
                    <img src="../assets/header/alarm.png" class="alarm" />
                    <img src="../assets/header/organization-logo.png" class="organization-logo" />
                    <img src="../assets/header/logout-logo.png" class="logout-logo" @click="logout" />
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
    userStore.logout();
    router.replace('/');
}
</script>

<style scoped>
.menu-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 65px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
}

.start {
    .nav-link {
        display: flex;
        align-items: center;
        color: #6360AB;
        text-decoration: none;
    }

    .router-link-exact-active {
        color: #6360AB;
        font-weight: bold;
    }
}

.start,
.end {
    display: flex;
    align-items: center;
}

.title-1 {
    font-size: 20px;
    color: #6360AB;
    font-family: 'Pretendard';
    font-weight: 900;
}

.garadation {
    width: 90px;
    height: 65px;
    margin-right: 20px;
}

.name {
    font-size: 14px;
    color: #777777;
    padding-right: 20px;
}

.right-logo {
    display: flex;
    gap: 20px;
    flex-direction: row;
}

.alarm {
    padding: 20px 0px 20px 20px;
    border-left: 2px solid #CCCCCC;
    display: flex;
    align-items: center;
    justify-content: center;
}

.organization-logo {
    padding: 20px 0px 20px 20px;
    border-left: 2px solid #CCCCCC;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logout-logo {
    padding: 20px 20px 20px 20px;
    border-left: 2px solid #CCCCCC;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
