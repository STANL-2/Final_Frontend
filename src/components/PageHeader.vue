<template>
    <header>
        <nav class="menu-bar">
            <div class="start">
                <RouterLink to="/dashboard" class="nav-link" active-class="router-link-active"
                    exact-active-class="router-link-exact-active">
                    <img src="../assets/header/gradation.png" class="garadation" />
                    <span class="title">영업관리</span>
                </RouterLink>
            </div>

            <div class="end">
                <!-- 로그인 유저 -->
                <div class="name">반갑습니다. {{ userStore.name }} {{ userStore.role }}님</div>
                <div class="right-logo">
                    <i class="pi pi-user profile" @click="goMypage"></i>
                    <div class="alarm-container">
                        <i class="pi pi-bell alarm" @click="toggleAlarmDropdown"></i>
                        <span v-if="totalUnreadAlarms > 0" class="alarm-badge">
                            {{ totalUnreadAlarms }}
                        </span>
                        <!-- Alarm Dropdown -->
                        <div v-if="showAlarmDropdown" class="alarm-dropdown">
                            <div class="alarm-categories">
                                <div v-for="(category, index) in alarmCategories" :key="index" class="alarm-category"
                                    @click="navigateToAlarmCategory(category.name)">
                                    <div class="category-info">
                                        <span class="category-name">{{ category.name }}</span>
                                        <span v-if="category.unreadCount > 0" class="category-unread-count">
                                            {{ category.unreadCount }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <i class="pi pi-sitemap organization-logo" @click="showOrganizationModal"></i>
                    <i class="pi pi-sign-out logout-logo" @click="logout"></i>
                </div>
            </div>
        </nav>
    </header>

    <Modal v-model="showOrganizationChart" header="조직도" width="70rem" height="100rem">
        <!-- Custom Modal -->
        <div v-if="showOrganizationChart" class="modal-overlay">
            <div class="modal">
                <div class="aside">
                    <Tree :value="organization" :filter="true" filterMode="lenient" filterPlaceholder="부서 검색"
                        selectionMode="single" class="tree-component" @node-select="handleNodeSelect" />
                </div>
                <div class="body">
                    <OrganizationEmployee :organizationId="organizationId" @closeModal="closeModal" />
                </div>
            </div>
        </div>
    </Modal>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Modal from './common/Modal.vue';
import Tree from 'primevue/tree';
import ApiService from '@/services/api/config/ApiService';
import OrganizationEmployee from './common/OrganizationEmployee.vue';
import AlarmScheduleDetail from '@/views/alarm/AlarmScheduleDetail.vue';
import AlarmContractDetail from '@/views/alarm/AlarmContractDetail.vue';
import AlarmNoticeDetail from '@/views/alarm/AlarmNoticeDetail.vue';

const userStore = useUserStore();
const router = useRouter();

const showOrganizationChart = ref(false);
const organization = ref([]);

const organizationId = ref('ORG_000000001');

const apiService = new ApiService('api/v1/organization');
const apiAlarmService = new ApiService('api/v1/alarm');

const showAlarmDropdown = ref(false);
const totalUnreadAlarms = ref(0);
const alarmCategories = ref([]);

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

const closeModal = () => {
    showOrganizationChart.value = false;
};

const getOrganizationChart = async () => {
    try {
        const response = await apiService.get('', '');

        const result = response.result;

        organization.value = transformToTree(result);

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
    return tree;
};

// 트리 항목을 선택했을 때 호출되는 함수
const handleNodeSelect = (event) => {
    const selectedNode = event.data.organizationId;
    organizationId.value = selectedNode;
};

const fetchAlarmTypes = async () => {
    try {
        const response = await apiAlarmService.get('', '');

        if (response && response.result) {
            alarmCategories.value = [
                {
                    name: '계약 알림',
                    unreadCount: response.result.contractAlarmCount
                },
                {
                    name: '공지 알림',
                    unreadCount: response.result.noticeAlarmCount
                },
                {
                    name: '일정 알림',
                    unreadCount: response.result.scheduleAlarmCount
                }
            ];

            totalUnreadAlarms.value = alarmCategories.value.reduce(
                (total, category) => total + category.unreadCount,
                0
            );
        }
    } catch (error) {
        console.error('알림 타입 요청 실패: ', error);
    }
};

const navigateToAlarmCategory = (categoryName) => {
    switch (categoryName) {
        case '일정 알림':
            router.push('/alarm/schedule');
            break;
        case '계약 알림':
            router.push('/alarm/contract');
            break;
        case '공지 알림':
            router.push('/alarm/notice');
            break;
    }
    showAlarmDropdown.value = false;
};

const toggleAlarmDropdown = async () => {
    showAlarmDropdown.value = !showAlarmDropdown.value;

    // Fetch alarm types when dropdown is opened
    if (showAlarmDropdown.value) {
        await fetchAlarmTypes();
    }
};

const handleClickOutside = (event) => {
    const alarmContainer = document.querySelector('.alarm-container');
    if (alarmContainer && !alarmContainer.contains(event.target)) {
        showAlarmDropdown.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);

    // Initial fetch of alarm types
    fetchAlarmTypes();
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
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
    border-left: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #777777 !important;
}

.alarm {
    padding: 20px 0px 20px 20px;
    border-left: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #777777 !important;
}

.organization-logo {
    padding: 20px 0px 20px 20px;
    border-left: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #777777 !important;
}

.logout-logo {
    padding: 20px 20px 20px 20px;
    border-left: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #777777 !important;
}

.modal-overlay {
    position: flex;
    height: 55rem;
    /* 지정된 높이 */
}

.modal {
    display: flex;
    flex-direction: row;
}

.modal>div:first-child {
    flex: 2;
}

.modal>div:nth-child(2) {
    flex: 8;
}

.body {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
}

.aside {
    transition: width 0.3s ease;
    width: 260px;
    padding: 1.5rem;

}

.aside.hidden {
    width: 0;
    overflow: hidden;
}

.tree-component {
    display: flex;
    flex-direction: column;
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
    margin-bottom: 1rem;
    /* 검색창과 트리 컴포넌트 사이의 여백 */
}

/* 검색 text 스타일 */
:deep(.tree-component .p-inputtext) {
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 1rem;
    border-radius: 5px;
    color: #777777;
}

/* 돋보기 모양 스타일 */
:deep(.tree-component .p-tree-filter-icon) {
    color: #777777;
    font-size: 1.2rem;
    margin-left: -1.5rem;
}

.alarm-container {
    position: relative;
    display: flex;
    align-items: center;
}

.alarm {
    cursor: pointer;
    position: relative;
}

.alarm-badge {
    position: absolute;
    top: 13px;
    right: -4px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 10px;
}

.alarm-dropdown {
    position: absolute;
    top: 80%;
    left: -5rem;
    width: 14rem;
    max-height: 300px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    overflow-y: auto;
    padding: 10px;
}

.alarm-categories {
    display: flex;
    flex-direction: column;
}

.alarm-category {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.category-info {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}

.category-name {
    font-size: 14px;
    color: #333;
}

.category-unread-count {
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 2px 8px;
    font-size: 12px;
}
</style>