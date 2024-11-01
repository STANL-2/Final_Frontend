<template>
    <header>
        <nav class="menu-bar">
            <div class="start">
                <RouterLink to="/">
                    <img src="../assets/header/gradation.png" class="garadation" />
                    <title-1>영업관리</title-1>
                </RouterLink>
            </div>

            <div class="end">
                <!-- 로그인 유저 -->                
                    <div class="name">반갑습니다. {{ userStore.name }} 사원님</div>
                    <div class="right-logo">
                    <img src="../assets/header/settings-logo.png" class="settings-logo" />
                    <img src="../assets/header/logout-logo.png" class="logout-logo" @click="logout"/>
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
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);

    .start,
    .end {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .start {
        .router-link-active {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 20px;
            color: #6360AB;
            font-family: 'Pretendard';
            font-weight: 900;
            /* 폰트 black */
        }
    }

    .garadation {
        width: 90px;
        height: 65px;
        margin-right: 20px;
    }

    .name {
        font-size: 20px;
        color: #777777;
        padding-right: 20px;
    }

    .right-logo {
        display: flex;
        gap: 20px;
        flex-direction: row;
    }
    .settings-logo{
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
}
</style>



/* 반갑습니다. 유혜진 사원님 */

position: absolute;
width: 153px;
height: 10px;
left: 1127px;
top: 27px;

font-family: 'Inter';
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 17px;
/* leading-trim and text-edge are draft CSS properties.