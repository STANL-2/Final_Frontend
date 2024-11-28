<template>
    <PageLayout>
        <!-- SearchForm -->
        <div class="component-wrapper width-s ml-l">
            <SearchForm :fields="formFields" @open-modal="handleOpenModal" ref="searchFormRef" />
        </div>
        <div class="flex-row content-end mr-m">
            <CommonButton label="조회" @click="handleSearch"/>
        </div>
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

            <CenterDetail
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
import CenterDetail from '@/views/center/CenterDetail.vue';
import SearchForm from '@/components/common/NoticeSearchForm.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import { $api } from '@/services/api/api';

const formFields = [
    [
        {
            type: 'input',
            label: '매장번호',
            model: 'productId',
            showDivider: false
        },
        {
            type: 'input',
            label: '지점 이름',
            model: 'name',
            showDivider: true
        },
        {
            type: 'input',
            label: '주소',
            model: 'address',
            showDivider: false
        }
    ]
];

const tableHeaders = [
    { field: 'centerId', label: '매장번호', width: '17%' },
    { field: 'name', label: '매장명', width: '10%' },
    { field: 'address', label: '주소', width: '30%' },
    { field: 'memberCount', label: '사원수', width: '20%' },
    { field: 'operatingAt', label: '운영시간', width: '10%' }
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

const searchParams = ref({
    centerId: '',
    name: '',
    address: ''
});

function handleView(rowData) {
    // 상세 데이터 설정 및 모달 열기
    selectedDetail.value = rowData; // 클릭된 행 데이터 전달
    showDetailModal.value = true;
}

const handleSearch = async () => {
    console.log('handleSearch 호출됨');

    // SearchForm에서 데이터를 가져옴
    if (!searchFormRef.value) {
        console.error('searchFormRef가 초기화되지 않았습니다.');
        return;
    }

    const formData = searchFormRef.value.getFormData();
    console.log('SearchForm에서 반환된 데이터:', formData);

    // 검색 파라미터 매핑
    searchParams.value = {
        centerId: formData.centerId || '',
        name: formData.name || '',
        address: formData.address || ''
    };

    console.log('매핑된 검색 파라미터:', searchParams.value);

    // 데이터 로드 호출
    await loadData();
};

// 데이터 로드 함수
const loadData = async () => {
    loading.value = true; // 로딩 시작
    try {

        const query = {
            page: Math.floor(first.value / rows.value), // 현재 페이지 번호
            size: rows.value, // 한 페이지 데이터 수
            centerId: searchParams.value.centerId || '',
            name: searchParams.value.name || '',
            address: searchParams.value.address || '',
            sortField: sortField.value || null, // 정렬 필드
            sortOrder: sortOrder.value || null, // 정렬 순서
        };

        // 쿼리 문자열 생성
        const queryString = `?${new URLSearchParams(query).toString()}`;
        console.log("API 호출 URL:", queryString); // 디버깅용
        // API 호출
        const response = await $api.center.getParams('search', queryString);

        const result = response?.result; // 응답 데이터 접근

        if (result && Array.isArray(result.content)) {
            tableData.value = result.content; // 테이블 데이터 업데이트
            totalRecords.value = result.totalElements; // 전체 데이터 수
            
            console.log(tableData.value);
        } else {
            console.warn("API 응답이 예상한 구조와 다릅니다:", response);
            throw new Error("API 응답 데이터 구조 오류");
        }
    } catch (error) {
        console.error("데이터 로드 실패:", error.message);
        alert("데이터를 가져오는 데 실패했습니다. 관리자에게 문의하세요.");
    } finally {
        loading.value = false; // 로딩 종료
    }
};

function onPage(event) {
    first.value = event.first;
    rows.value = event.rows;
    loadData(); // 데이터 다시 로드
    // 페이지네이션 이벤트 처리
    first.value = event.first; // 시작 인덱스
    rows.value = event.rows; // 한 페이지당 데이터 수
    loadData(); // 데이터 로드
}
// 정렬 이벤트 처리
function onSort(event) {
    sortField.value = event.sortField;
    sortOrder.value = event.sortOrder;
    loadData(); // 데이터 다시 로드
    // 정렬 이벤트 처리
    sortField.value = event.sortField; // 정렬 필드
    sortOrder.value = event.sortOrder > 0 ? 'asc' : 'desc'; // 정렬 순서
    loadData(); // 데이터 로드
}

const exportCSV = async () => {
    loading.value = true;
    try {
        const blob = await $api.center.get('excel', '', {
            responseType: 'blob'
        });

        // 이미 blob이 반환되었으므로 바로 URL 생성
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'centerExcel.xlsx');
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


</script>

<style scoped>
.list{
    font-size: 1.5rem;
    font-weight:bold;
}
</style>


