<template>
    <header>
        <nav class="menu-bar">
            <div class="start">
                <RouterLink to="/dashboard" class="nav-link" active-class="router-link-active"
                    exact-active-class="router-link-exact-active">
                    <img src="../assets/header/gradation.png" class="garadation" />
                    <text class="title">영업관리</text>
                </RouterLink>
            </div>

            <div class="end">
                <!-- 로그인 유저 -->
                <div class="name">반갑습니다. {{ userStore.name }} {{ userStore.role }}님</div>
                <div class="right-logo">
                    <img src="../assets/header/profile.png" class="profile" @click="goMypage"/>
                    <img src="../assets/header/alarm.png" class="alarm" />
                    <img src="../assets/header/organization-logo.png" class="organization-logo" @click="showOrganizationModal" />
                    <img src="../assets/header/logout-logo.png" class="logout-logo" @click="logout" />
                </div>
            </div>
        </nav>
    </header>

    <Modal v-model="showOrganizationChart" header="조직도" width="40rem">
            <!-- Custom Modal -->
            <div v-if="showOrganizationChart" class="modal-overlay">
                    <div class="modal">
                        <Tree 
                            :value="organization" 
                            :filter="true" 
                            filterMode="lenient"
                            filterPlaceholder="부서 검색" 
                            selectionMode="single" 
                            class="tree-component"/>

                            사원 리스트 들어갈 곳!
                    </div>
                </div>
        </Modal>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Modal from '@/components/common/Modal.vue';
import Tree from 'primevue/tree';
import ApiService from '@/services/api/config/ApiService';


const userStore = useUserStore();
const router = useRouter();

const showOrganizationChart = ref(false);
const organization = ref([]);

const apiService = new ApiService('api/v1/organization', userStore);

const goMypage = () => {
    router.push('/mypage');
}

const logout = () => {
    userStore.logout();
    router.replace('/');
}

const showOrganizationModal = async () => {
    showOrganizationChart.value = true;
    await getOrganizationChart();
};

const getOrganizationChart = async () => {
    try {
        const response = await apiService.get('', '');
        
        const result = response.result;

        organization.value = transformToTree(result);

        console.log(organization.value);


    } catch (error) {
        console.error('부서 요청 실패: ', error);
    }
};

const transformToTree = (data) => {
    const map = {};
    const tree = [];

    // 각 항목을 map에 저장하고 children 속성 초기화
    data.forEach((item) => {
        map[item.organizationId] = { 
            label: item.name, 
            data: item, 
            children: item.children || [] 
        };
    });

    // 부모 자식 관계 형성
    data.forEach((item) => {
        if (!item.parent) {
            tree.push(map[item.organizationId]);
        } else if (map[item.parent]) {
            map[item.parent].children.push(map[item.organizationId]);
        }
    });

    console.log('변환된 트리 데이터:', tree);
    return tree;
};
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

.title {
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

.profile {
    padding: 20px 0px 20px 20px;
    border-left: 2px solid #CCCCCC;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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
    cursor: pointer;
}

.logout-logo {
    padding: 20px 20px 20px 20px;
    border-left: 2px solid #CCCCCC;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.modal {
    display: flex;
    flex-direction: row;
}

/* 검색 필드 스타일 */
:deep(.tree-component .p-tree-filter-container) {
    display: flex;
    align-items: center;
    background-color: #F3F3F3;
    border-radius: 10px;
    padding: 0.5rem 1rem;
    width: 100%;
    height: 43px;
    margin-bottom: 1rem; /* 검색창과 트리 컴포넌트 사이의 여백 */
}

/* 검색 text 스타일 */
:deep(.tree-component .p-inputtext){
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 1rem;
    border-radius: 5px;
    color: #777777;
}

/* 돋보기 모양 스타일 */
:deep(.tree-component .p-tree-filter-icon){
    color: #777777;
    font-size: 1.2rem;
    margin-left: -1.5rem;
}

</style>