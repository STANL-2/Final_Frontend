import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore(
    'user',
    () => {
        const id = ref('');
        const name = ref('');
        const accessToken = ref('');
        const refreshToken = ref('');
        const role = ref('');
        const isLoggined = ref(false);

        function loginByEMPLOYEE() {
            id.value = 0;
            name.value = '영업 사원';
            accessToken.value = 'faketoken';
            refreshToken.value = 'faketoken';
            role.value = 'SalesRep';
            isLoggined.value = true;
        }

        function loginByADMIN() {
            id.value = 1;
            name.value = '영업 관리자';
            accessToken.value = 'faketoken';
            refreshToken.value = 'faketoken';
            role.value = 'SalesManager';
            isLoggined.value = true;
        }

        function loginByDIRECTOR() {
            id.value = 2;
            name.value = '영업 담당자';
            accessToken.value = 'faketoken';
            refreshToken.value = 'faketoken';
            role.value = 'SalesAdmin';
            isLoggined.value = true;
        }

        function loginByGOD() {
            id.value = 3;
            name.value = '시스템 관리자';
            accessToken.value = 'faketoken';
            refreshToken.value = 'faketoken';
            role.value = 'SystemAdmin';
            isLoggined.value = true;
        }

        function logout() {
            id.value = 0;
            name.value = '';
            accessToken.value = '';
            refreshToken.value = '';
            role.value = '';
            isLoggined.value = false;
        }

        function saveTokens(userToken) {
            accessToken.value = userToken.accessToken;
            refreshToken.value = userToken.refreshToken;
            isLoggined.value = true;
        }

        function saveUserInfo(userInfo) {
            id.value = userInfo.id;
            name.value = userInfo.name;
            role.value = userInfo.role;
        }

        return {
            id,
            name,
            accessToken,
            refreshToken,
            role,
            isLoggined,
            loginByEMPLOYEE,
            loginByADMIN,
            loginByDIRECTOR,
            loginByGOD,
            logout,
            saveTokens,
            saveUserInfo
        };
    },
    {
        persist: true,
    },
);