<template>
    <PageLayout>
        <!-- SearchForm -->
        <div class="component-wrapper">
            <SearchForm :fields="formFields" @open-modal="handleOpenModal" ref="searchFormRef" />
        </div>

        <div class="flex-row content-between">
            <div>전체목록</div>
            <div class="flex-row items-center mb-s">
                <div><CommonButton label="등록" icon="pi pi-plus" @click="openRegisterModal"/></div>
                <div class="ml-xs"><CommonButton label="인쇄" icon="pi pi-print" /></div>
                <div class="ml-xs"><CommonButton label="엑셀다운" @click="exportToXLSX" icon="pi pi-download" /></div>
                <div class="ml-xs"><CommonButton label="초기화" icon="pi pi-refresh" color="#F1F1FD" textColor="#6360AB" /></div>
            </div>
        </div>

        <!-- ViewTable -->
        <div class="component-wrapper">
            <ViewTable 
                :headers="tableHeaders" 
                :data="tableData" 
                :loading="loading" 
                :totalRecords="totalRecords" 
                :rows="rows" 
                :rowsPerPageOptions="[5, 10, 20, 50]"
                :selectable="true" 
                :selection.sync="selectedItems"
                buttonLabel="조회" 
                buttonHeader="상세조회"
                :buttonAction="handleView" 
                buttonField="code"
                @page="onPage" 
                @sort="onSort" 
                @filter="onFilter" 
            />

            <ContractDetail
                v-model="showDetailModal"
                :showModal="showDetailModal"
                :details="selectedDetail"
                @close="showDetailModal = false"
            />
        </div>

        <EContractRegister 
            v-model:visible="showRegisterModal" 
            @close="closeRegisterModal" 
        />
        <!-- 모달 -->
        <Modal v-model="showModal" header="매장코드 검색" width="30rem" height="none" @confirm="confirmSelection" @cancel="resetModalState">
            <div class="flex-row content-center mb-m">
                <label class="mr-m">매장명: </label>
                <!-- Enter 키 입력 시 searchStore 함수 호출 -->
                <InputText type="text" v-model="searchQuery" @keyup.enter="searchStore" />
                <button class="search-button" @click="searchStore">
                    <span class="search-icon pi pi-search"></span>
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th v-for="header in headers" :key="header">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in modalTableData" :key="index" @click="selectStore(row, index)"
                        :class="{ selected: selectedRow === index }">
                        <td>{{ row.매장코드 }}</td>
                        <td>{{ row.매장명 }}</td>
                    </tr>
                </tbody>
            </table>

            <template #footer>
                <CommonButton label="확인" @click="confirmSelection" />
                <CommonButton label="취소" color="#ffffff" textColor="#6360AB" borderColor="#6360AB"
                    @click="resetModalState" />
            </template>
        </Modal>
    </PageLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as XLSX from 'xlsx'; // XLSX 라이브러리 추가
import PageLayout from '@/components/common/layouts/PageLayout.vue';
import ViewTable from '@/components/common/ListTable.vue';
import ContractDetail from '@/views/contract/ContractDetail.vue';
import Modal from '@/components/common/Modal.vue';
import SearchForm from '@/components/common/SearchForm.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import { $api } from '@/services/api/api';
import EContractRegister from './edit/EContractRegister.vue';

// 모달 테이블 값
const headers = ['매장코드', '매장명'];
const modalTableData = [
    { 매장코드: 'A', '매장명': 50 },
    { 매장코드: 'B', '매장명': 75 },
];

// SearchForm.vue 검색조건 값
const formFields = [
    [
        {
            label: '사원 검색',
            type: 'inputWithButton',
            model: 'employeeSearch',
            showDivider: false
        },
        {
            label: '매장 검색',
            type: 'inputWithButton',
            model: 'storeSearch',
            showDivider: false
        },
        {
            label: '제품명',
            type: 'input',
            model: 'carName',
            showDivider: false
        },
        {
            type: 'select',
            label: '승인여부',
            model: 'approvalStatus',
            options: ['대기', '승인', '취소']
        }
        
    ],
    [
        {
            label: '고객명',
            type: 'input',
            model: 'customerName',
            showDivider: true
        },
        {
            label: '고객 구분',
            type: 'radio',
            model: 'customerType',
            options: ['개인', '법인'],
            showDivider: false
        },
        {
            label: '구매 조건',
            type: 'radio',
            model: 'purchaseCondition',
            options: ['일시불', '할부', '리스'],
            showDivider: false
        },
        {
            label: '고객 상호',
            type: 'input',
            model: 'customerBusinessName',
            showDivider: false
        }
    ],
    [
        {
            label: '계약서명',
            type: 'input',
            model: 'contractName',
            showDivider: true
        },
        {
            label: '계약일',
            type: 'calendar', // 쌍으로 처리
            model: 'contractDate', // 시작과 종료를 모두 포함
            showIcon: true,
            manualInput: false,
        }
    ]
];

// table 헤더 값
const tableHeaders = [
    { field: 'contractId', label: '계약서 번호', width: '15%' },
    { field: 'title', label: '계약서명', width: '25%' },
    { field: 'carName', label: '제품명', width: '13%' },
    { field: 'customerName', label: '고객명', width: '13%' },
    { field: 'customerClassifcation', label: '고객 구분', width: '10%' },
    { field: 'customerPurchaseCondition', label: '구분 조건', width: '10%' },
    { field: 'companyName', label: '고객 상호', width: '10%' },
    { field: 'status', label: '승인 상태', width: '5%' },
];

// 상태 변수
const tableData = ref([]); // 테이블 데이터
const selectedItems = ref([]);
const showDetailModal = ref(false); // 상세조회 모달 표시 여부
const selectedDetail = ref(null); // 선택된 상세 데이터
const totalRecords = ref(0); // 전체 데이터 개수
const loading = ref(false); // 로딩 상태
const rows = ref(10); // 페이지 당 행 수
const first = ref(0); // 첫 번째 행 위치
const filters = ref({}); // 필터
const sortField = ref(null); // 정렬 필드
const sortOrder = ref(null); // 정렬 순서

// 엑셀 다운로드 함수
function exportToXLSX() {
    // 선택된 데이터가 있으면 그 데이터를 사용, 없으면 전체 데이터를 사용
    console.log("선택된 값: " + selectedItems.value);
    const dataToExport = selectedItems.value.length > 0 ? selectedItems.value : tableData.value;

    if (!dataToExport || dataToExport.length === 0) {
        alert('엑셀로 내보낼 데이터가 없습니다.');
        return;
    }

    try {
        // JSON 데이터를 엑셀 워크시트로 변환
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);

        // 엑셀 헤더 추가
        XLSX.utils.sheet_add_aoa(worksheet, [tableHeaders.map((header) => header.label)], { origin: 'A1' });

        // 엑셀 워크북 생성 및 워크시트 추가
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // 파일 다운로드
        XLSX.writeFile(workbook, 'table-data.xlsx');
        console.log('엑셀 다운로드 성공:', dataToExport);
    } catch (error) {
        console.error('엑셀 다운로드 중 오류 발생:', error);
        alert('엑셀 내보내기 중 문제가 발생했습니다.');
    }
}


function handleView(rowData) {
    // 상세 데이터 설정 및 모달 열기
    selectedDetail.value = rowData; // 클릭된 행 데이터 전달
    showDetailModal.value = true;
}

// 데이터 로드 함수
const loadData = async () => {
    loading.value = true; // 로딩 시작
    try {
        const response = await $api.contract.get(
        '',    
        {
            params: {
                page: first.value / rows.value, // 현재 페이지 계산
                size: rows.value, // 페이지 크기
                sort: sortField.value ? `${sortField.value},${sortOrder.value > 0 ? 'asc' : 'desc'}` : null,
            },
        }); // API 요청
        tableData.value = response.result.content; // 데이터 업데이트
        totalRecords.value = response.data.result.totalElements;
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    } finally {
        loading.value = false; // 로딩 종료
    }
};

onMounted(() => {
    loadData();
});

// 페이지네이션 이벤트 처리
function onPage(event) {
    first.value = event.first; // 시작 인덱스
    rows.value = event.rows; // 페이지 크기
    loadData(); // 데이터 로드
}

// 정렬 이벤트 처리

function onSort(event) {
    sortField.value = event.sortField;
    sortOrder.value = event.sortOrder;
    loadData();
}

// 필터 이벤트 처리
function onFilter(event) {
    filters.value = event.filters;
    loadData(); // 데이터 다시 로드
}

// 등록 모달 상태 변수
const showRegisterModal = ref(false);

// 등록 버튼 클릭 시 모달 열기
function openRegisterModal() {
    showRegisterModal.value = true;
}

// 모달 닫기
function closeRegisterModal() {
    showRegisterModal.value = false;
}

watch(showRegisterModal, (newValue) => {
    console.log('showRegisterModal 상태 변경:', newValue);
});

// 검색창 모달
const showModal = ref(false);
const selectedRow = ref(null);
const selectedCode = ref('');
const searchFormRef = ref(null);
const selectedFieldIndex = ref(null);
const searchQuery = ref('');

function handleOpenModal(fieldIndex) {
    selectedFieldIndex.value = fieldIndex; // 필드 인덱스 저장
    showModal.value = true;
}

function selectStore(row, index) {
    selectedRow.value = index;
    selectedCode.value = row.매장코드;
}

function confirmSelection() {
    if (selectedFieldIndex.value !== null) {
        searchFormRef.value.updateFieldValue(selectedFieldIndex.value, selectedCode.value);
    }
    closeModal();
}

function resetModalState() {
    closeModal();
}

function closeModal() {
    showModal.value = false;
    selectedRow.value = null;
    selectedCode.value = '';
}

function searchStore() {
    if (searchQuery.value) {
        alert(`검색어: ${searchQuery.value}`);
    }
    searchQuery.value = '';
}
</script>

<style scoped>
.component-wrapper {
    margin-bottom: 8rem;
}
</style>
