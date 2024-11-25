<template>
    <PageLayout>
        <!-- SearchForm -->
        <div class="component-wrapper width-s ml-l">
            <SearchForm :fields="formFields" @open-modal="handleOpenModal" ref="searchFormRef" />
        </div>
        <div class="flex-row content-end mr-xl"><CommonButton label="조회"/></div>
        <div class="flex-row content-between mt-l">
            <div class="list ml-l">전체목록</div>
            <div class="flex-row items-center mb-s mr-xl">
                <div><CommonButton label="추가" icon="pi pi-plus" /></div>
                <div class="ml-xs"><CommonButton label="엑셀다운" @click="exportCSV($event)" icon="pi pi-download" /></div>
                <div class="ml-xs"><CommonButton label="인쇄" icon="pi pi-print" /></div>
                <div class="ml-xs"><CommonButton label="초기화" icon="pi pi-refresh" color="#F1F1FD" textColor="#6360AB" /></div>
            </div>
        </div>

        <!-- ViewTable -->
        <div class="table-wrapper width-s ml-l">
            <ViewTable 
                :headers="tableHeaders" 
                :data="tableData" 
                :loading="loading" 
                :totalRecords="totalRecords" 
                :rows="rows" 
                :rowsPerPageOptions="[5, 10, 20, 50]"
                :selectable="true" 
                buttonLabel="조회" 
                buttonHeader="상세조회"
                :buttonAction="handleView" 
                buttonField="code"
                @page="onPage" 
                @sort="onSort" 
                @filter="onFilter" 
            />

            <ProductDetail
            v-model="showDetailModal"
            :showModal="showDetailModal"
            :details="selectedDetail"
            @close="showDetailModal = false"
        />
        </div>
    </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PageLayout from '@/components/common/layouts/PageLayout.vue';
import ViewTable from '@/components/common/ListTable.vue';
import ProductDetail from '@/views/product/ProductDetail.vue';
import SearchForm from '@/components/common/NoticeSearchForm.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import { $api } from '@/services/api/api';

const formFields = [
    [
        {
            type: 'input',
            label: '제품번호',
            model: 'productId',
            showDivider: false
        },
        {
            type: 'input',
            label: '모델명',
            model: 'name',
            showDivider: true
        },
        {
            type: 'input',
            label: '일련번호',
            model: 'serialNumber',
            showDivider: false
        }
    ]
];

const tableHeaders = [
    { field: 'productId', label: '제품번호', width: '17%' },
    { field: 'name', label: '모델명', width: '10%' },
    { field: 'serialNumber', label: '일련번호', width: '30%' },
    { field: 'cost', label: '차량가액', width: '20%' },
    { field: 'stock', label: '재고 수', width: '10%' }
];

// 상태 변수
const tableData = ref([]); // 테이블 데이터
const showDetailModal = ref(false); // 상세조회 모달 표시 여부
const selectedDetail = ref(null); // 선택된 상세 데이터

const totalRecords = ref(0); // 전체 데이터 개수
const loading = ref(false); // 로딩 상태
const rows = ref(5); // 페이지 당 행 수
const first = ref(0); // 첫 번째 행 위치
const filters = ref({}); // 필터
const sortField = ref(null); // 정렬 필드
const sortOrder = ref(null); // 정렬 순서

function handleView(rowData) {
    // 상세 데이터 설정 및 모달 열기
    selectedDetail.value = rowData; // 클릭된 행 데이터 전달
    showDetailModal.value = true;
}

// 데이터 로드 함수
const loadData = async () => {
    loading.value = true; // 로딩 시작
    try {
        const response = await $api.product.get(
            '',
            '',
        );
        console.log('GET 요청 응답 결과');
        console.log(response);

        tableData.value = response.result.content; // 테이블 데이터 업데이트
        totalRecords.value = response.result.totalElements; // 전체 데이터 개수 업데이트
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    } finally {
        loading.value = false; // 로딩 종료
    }
};

const exportCSV = async () => {
    loading.value = true;
    try {
        const blob = await $api.product.get('excel', '', {
            responseType: 'blob'
        });

        // 이미 blob이 반환되었으므로 바로 URL 생성
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'productExcel.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('파일 다운로드 완료');
    } catch (error) {
        console.error('다운로드 에러:', error);
        DOMEventService.dispatchApiError('엑셀 다운로드 중 오류가 발생했습니다.');
    } finally {
        loading.value = false;
    }
};

// 페이지 로드 시 데이터 로드
onMounted(() => {
    loadData();
});

// 페이지네이션 이벤트 처리
function onPage(event) {
    first.value = event.first;
    rows.value = event.rows;
    loadData(); // 데이터 다시 로드
}

// 정렬 이벤트 처리
function onSort(event) {
    sortField.value = event.sortField;
    sortOrder.value = event.sortOrder;
    loadData(); // 데이터 다시 로드
}

// 필터 이벤트 처리
function onFilter(event) {
    filters.value = event.filters;
    loadData(); // 데이터 다시 로드
}


// 모달에서 쓰이는 값들
const showModal = ref(false);
const selectedRow = ref(null);
const selectedCode = ref('');
const searchFormRef = ref(null);
const selectedFieldIndex = ref(null);
const searchQuery = ref('');

function handleOpenModal(fieldIndex) {
    console.log(`Opening modal for field: ${fieldIndex}`);
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

// 여기에 검색어 조회 API 로직 작성
function searchStore() {
    // 입력된 값 출력
    console.log('검색어:', searchQuery.value);

    // 추가적인 검색 로직을 여기에 추가할 수 있습니다.
    if (searchQuery.value) {
        alert(`검색어: ${searchQuery.value}`);
    }
    // 검색어 초기화
    searchQuery.value = '';
}
</script>

<style scoped>
.list{
    font-size: 1.5rem;
    font-weight:bold;
}
</style>


