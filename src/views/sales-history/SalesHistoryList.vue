<template>
    <PageLayout>
        <!-- SearchForm -->
        <div class="component-wrapper">
            <CSearchForm :fields="formFields" @open-modal="handleOpenModal" ref="searchFormRef" />
            <div class="select">
                <CommonButton label="조회" @click="select" />
            </div>
        </div>

        <div class="flex-row content-between">
            <div>전체목록</div>
            <div class="flex-row items-center mb-s">
                <div class="ml-xs">
                    <CommonButton label="인쇄" icon="pi pi-print" @click="printSelectedRows" />
                </div>
                <div class="ml-xs">
                    <CommonButton label="엑셀다운" @click="exportCSV($event)" icon="pi pi-download" />
                </div>
                <div class="ml-xs">
                    <CommonButton label="초기화" icon="pi pi-refresh" color="#F1F1FD" textColor="#6360AB"
                        @click="refresh" />
                </div>
            </div>
        </div>

        <!-- ViewTable -->
        <div class="component-wrapper">
            <ViewTable :headers="tableHeaders" :data="tableData" :loading="loading" :totalRecords="totalRecords"
                :rows="rows" :rowsPerPageOptions="[5, 10, 20, 50]" :selectable="true" :selection="selectedRows"
                @update:selection="updateSelectedRows" buttonLabel="조회" buttonHeader="상세조회" :buttonAction="handleView"
                buttonField="code" @page="onPage" @sort="onSort" @filter="onFilter">
            </ViewTable>
        </div>
    </PageLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import PageLayout from '@/components/common/layouts/PageLayout.vue';
import ViewTable from '@/components/common/ListTable.vue';
import CSearchForm from '@/components/common/CSearchForm.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import { $api } from '@/services/api/api';

const selectedRows = ref([]);

const updateSelectedRows = (newSelection) => {
    selectedRows.value = newSelection;
    console.log('선택된 항목 업데이트:', selectedRows.value);
};

const printSelectedRows = () => {
    if (selectedRows.value.length === 0) {
        alert('인쇄할 행을 선택하세요.');
        return;
    }

    const headersToPrint = tableHeaders.value.filter(
        (header) => header.excludeFromPrint !== true
    );

    const printContent = document.createElement('div');
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const headerRow = document.createElement('tr');
    headersToPrint.forEach((header) => {
        const th = document.createElement('th');
        th.innerText = header.label;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    selectedRows.value.forEach((row) => {
        const tr = document.createElement('tr');
        headersToPrint.forEach((header) => {
            const td = document.createElement('td');
            td.innerText = row[header.field] || '';
            td.style.border = '1px solid #ddd';
            td.style.padding = '8px';
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    printContent.appendChild(table);

    // iframe 생성
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-10000px';
    printFrame.style.left = '-10000px';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
        frameDoc.open();
        frameDoc.write('<html><head><title>Print</title></head><body>');
        frameDoc.write(printContent.innerHTML);
        frameDoc.write('</body></html>');
        frameDoc.close();

        // 인쇄 호출
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
    }

    // iframe 제거
    document.body.removeChild(printFrame);
};

// SearchForm.vue 검색조건 값
const formFields = ref([
    [
        {
            label: '고객 번호',
            type: 'input',
            model: 'customerId',
            value: '',
            showDivider: false
        },
        {
            label: '고객명',
            type: 'input',
            model: 'name',
            value: '',
            showDivider: false
        },
        {
            label: '연락처',
            type: 'input',
            model: 'phone',
            value: '',
            showDivider: false
        },
        {
            label: '성별',
            type: 'radio',
            model: 'sex',
            options: ['남성', '여성'],
            value: '',
            showDivider: false
        }
    ]
]);

// table 헤더 값
const tableHeaders = ref([
    { field: 'customerId', label: '고객 번호', width: '25%' },
    { field: 'name', label: '고객명', width: '20%' },
    { field: 'sex', label: '성별', width: '15%' },
    { field: 'phone', label: '연락처', width: '20%' },
    { field: 'memberId', label: '담당자', width: '20%' }
]);

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

function handleView(rowData) {
    // 상세 데이터 설정 및 모달 열기
    selectedDetail.value = rowData; // 클릭된 행 데이터 전달    
    showDetailModal.value = true;
}

const searchCriteria = ref({});

const refresh = () => {
    searchCriteria.value = ref({});
    loadData();
}


// 조회 버튼 클릭 시
const select = () => {
    const formData = searchFormRef.value?.formData;

    if (!formData) {
        console.error('formData를 가져올 수 없습니다.');
        return;
    }

    // 검색 조건 생성
    searchCriteria.value = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );
    // 검색 실행
    loadData();
};


// 데이터 로드 함수
const loadData = async () => {
    loading.value = true; // 로딩 시작
    try {
        // 검색 조건 필터링 및 유효한 값만 유지
        const filteredCriteria = Object.fromEntries(
            Object.entries(searchCriteria.value).filter(([key, value]) => {
                // null, undefined, 빈 문자열, 빈 배열, 빈 객체는 필터링
                if (value === null || value === undefined || value === '') return false;
                if (Array.isArray(value) && value.length === 0) return false;
                if (typeof value === 'object' && Object.keys(value).length === 0) return false;
                return true;
            })
        );

        // 쿼리 파라미터 생성
        const query = {
            page: first.value / rows.value, // 현재 페이지
            size: rows.value, // 페이지 크기
            ...filteredCriteria // 필터링된 검색 조건 병합
        };

        const queryString = `?${new URLSearchParams(query).toString()}`;

        // API 호출
        const response = await $api.salesHistory.getParams('search', queryString);

        // 응답 데이터
        const result = response?.result; 
        if (result && Array.isArray(result.content)) {
            // 테이블 데이터 업데이트
            tableData.value = result.content; 
            // 전체 데이터 수
            totalRecords.value = result.totalElements; 
        } else {
            console.warn('API 응답이 예상한 구조와 다릅니다:', response);
            throw new Error('API 응답 데이터 구조 오류');
        }
    } catch (error) {
        console.error('데이터 로드 실패:', error.message);
        alert('데이터를 가져오는 데 실패했습니다. 관리자에게 문의하세요.');
    } finally {
        loading.value = false; // 로딩 종료
    }
};


onMounted(() => {
    loadData();
});


const exportCSV = async () => {
    loading.value = true;
    try {
        const blob = await $api.salesHistory.get('excel', '', {
            responseType: 'blob'
        });

        // 이미 blob이 반환되었으므로 바로 URL 생성
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'customerExcel.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('다운로드 에러:', error);
        alert('엑셀 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        loading.value = false;
    }
};


// 페이지네이션 이벤트 처리
function onPage(event) {
    first.value = event.first; // 시작 인덱스
    rows.value = event.rows; // 한 페이지당 데이터 수
    loadData(); // 데이터 로드
}
// 정렬 이벤트 처리

function onSort(event) {
    sortField.value = event.sortField; // 정렬 필드
    sortOrder.value = event.sortOrder > 0 ? 'asc' : 'desc'; // 정렬 순서
    loadData(); // 데이터 로드
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


</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px 16px;
    text-align: center;
}

th {
    background-color: #F8F8F8;
    color: #777;
}

/* 선택된 행 스타일 */
tr.selected {
    background-color: #e0e0e0;
    /* 선택된 행의 배경색 */
}

tr:hover {
    cursor: pointer;
    background-color: #f0f0f0;
}

.p-inputtext {
    height: 27px !important;
    border-radius: 0px;
}

.select {
    display: flex;
    justify-content: right;
    margin-top: 16px;
}

.search-button {
    right: 0;
    top: 0;
    width: 27px;
    height: 27px;
    background: #6360AB !important;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.search-icon {
    color: white;
    font-size: 14px;
}

.component-wrapper {
    margin-bottom: 8rem;
}

.custom-tag-wrapper {
    display: flex;
    justify-content: center;
    /* 수평 가운데 정렬 */
    align-items: center;
    /* 수직 가운데 정렬 */
    height: 100%;
    /* 부모 높이에 맞게 정렬 */
}

.custom-tag {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
    color: white;
    width: 50px;
}

.custom-tag.success {
    background-color: #caf1d8;
    color: #188a42;
}

.custom-tag.warning {
    background-color: #feddc7;
    color: #ae510f;
}

.custom-tag.danger {
    background-color: #ffd0ce;
    color: #b32b23;
}

.custom-tag.info {
    background-color: #d0e1fd;
    color: #295bac;
}

.radio-group {
    display: flex;
    gap: 16px;
    /* 라디오 버튼 간 간격 */
}

.radio-option {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #555;
}

.radio-option input {
    margin-right: 8px;
}

.modal-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-label {
    font-weight: bold;
    font-size: 14px;
    color: #333;
}

.form-input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
}

.p-ripple-disabled {
    height: none;
}
</style>