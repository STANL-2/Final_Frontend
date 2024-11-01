import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore(
    'user',
    () => {
        const id = ref('');
        const name = ref('');
        const jwtToken = ref('');
        const role = ref('');
        const isLoggined = ref(false);

        function loginBySalesRep() {
            id.value = 0;
            name.value = '영업 사원';
            jwtToken.value = 'faketoken';
            role.value = 'SalesRep';
            isLoggined.value = true;
        }

        function loginBySalesManager() {
            id.value = 1;
            name.value = '영업 관리자';
            jwtToken.value = 'faketoken';
            role.value = 'SalesManager';
            isLoggined.value = true;
        }

        function loginBySalesAdmin() {
            id.value = 2;
            name.value = '영업 담당자';
            jwtToken.value = 'faketoken';
            role.value = 'SalesAdmin';
            isLoggined.value = true;
        }

        function loginBySystemAdmin() {
            id.value = 3;
            name.value = '시스템 관리자';
            jwtToken.value = 'faketoken';
            role.value = 'SystemAdmin';
            isLoggined.value = true;
        }

        function logout() {
            id.value = 0;
            name.value = '';
            jwtToken.value = '';
            role.value = '';
            isLoggined.value = false;
        }

        function saveTokens(userToken) {
            jwtToken.value = userToken;
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
            jwtToken,
            role,
            isLoggined,
            loginBySalesRep,
            loginBySalesManager,
            loginBySalesAdmin,
            loginBySystemAdmin,
            logout,
            saveTokens,
            saveUserInfo
        };
    },
    {
        persist: true,
    },
);