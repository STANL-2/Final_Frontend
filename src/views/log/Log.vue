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
        <div class="component-wrapper table-container">
            <LogViewTable :headers="tableHeaders" :data="tableData" :loading="loading" :totalRecords="totalRecords"
                :rows="rows" :rowsPerPageOptions="[5, 10, 20, 50]" :selectable="true" :selection="selectedRows"
                buttonLabel="조회" buttonHeader="상세조회" :buttonAction="handleView" @update:selection="updateSelectedRows"
                buttonField="code" @page="onPage" @sort="onSort" @filter="onFilter">
                <template #body-status="{ data }">
                    <div class="custom-tag-wrapper">
                        <div :class="['custom-tag', getCustomTagClass(data.status)]">
                            {{ getStatusLabel(data.status) }}
                        </div>
                    </div>
                </template>
            </LogViewTable>
        </div>

        <!-- 모달 -->
        <Modal v-model="showModal" width="40rem" height="none" header="로그 상세 보기">
            <Modal v-model="showModal" width="40rem" height="none" header="로그 상세 보기">
                <div>
                    <table class="log-detail-table">
            <tbody>
                <tr>
                    <td><strong>로그 번호:</strong></td>
                    <td>{{ selectedDetail.logId }}</td>
                </tr>
                <tr>
                    <td><strong>트랜잭션 번호:</strong></td>
                    <td>{{ selectedDetail.transactionId }}</td>
                </tr>
                <tr>
                    <td><strong>요청 시간:</strong></td>
                    <td>{{ selectedDetail.requestTime }}</td>
                </tr>
                <tr>
                    <td><strong>요청 메소드:</strong></td>
                    <td>{{ selectedDetail.method }}</td>
                </tr>
                <tr>
                    <td><strong>URI:</strong></td>
                    <td>{{ selectedDetail.uri }}</td>
                </tr>
                <tr>
                    <td><strong>쿼리 스트링:</strong></td>
                    <td>{{ selectedDetail.queryString }}</td>
                </tr>
                <tr>
                    <td><strong>유저 소프트웨어:</strong></td>
                    <td>{{ selectedDetail.userAgent }}</td>
                </tr>
                <tr>
                    <td><strong>IP 주소:</strong></td>
                    <td>{{ selectedDetail.ipAddress }}</td>
                </tr>
                <tr>
                    <td><strong>호스트명:</strong></td>
                    <td>{{ selectedDetail.hostName }}</td>
                </tr>
                <tr>
                    <td><strong>원격포트:</strong></td>
                    <td>{{ selectedDetail.remotePort }}</td>
                </tr>
                <tr>
                    <td><strong>상태:</strong></td>
                    <td>{{ getStatusLabel(selectedDetail.status) }}</td>
                </tr>
                <tr>
                    <td><strong>에러 메시지:</strong></td>
                    <td>{{ selectedDetail.errorMessage }}</td>
                </tr>
            </tbody>
        </table>
                </div>
            </Modal>
        </Modal>
    </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PageLayout from '@/components/common/layouts/PageLayout.vue';
import LogViewTable from '@/components/common/LogListTable.vue';
import CSearchForm from '@/components/common/CSearchForm.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import Modal from '@/components/common/Modal.vue';
import { $api } from '@/services/api/api';

// SearchForm.vue 검색조건 값
const formFields = [
    [
        {
            label: '로그 번호',
            type: 'input',
            model: 'logId',
            showDivider: false
        },
        {
            label: '요청 시간',
            type: 'calendar',
            model: 'requestTime',
            showIcon: true,
            manualInput: false,
            showDivider: false
        },
        {
            label: '요청 메소드',
            type: 'select',
            model: 'method',
            options: ['GET', 'POST', 'PUT', 'DELETE'],
            showDivider: false
        }
    ],
    [
        {
            label: 'URI',
            type: 'input',
            model: 'uri',
            showDivider: false
        },
        {
            label: 'IP 주소',
            type: 'input',
            model: 'ipAddress',
            showDivider: false
        },
        {
            label: '상태',
            type: 'select',
            model: 'status',
            options: ['SUCCESS', 'ERROR'],
            showDivider: false
        }
    ]
];

// table 헤더 값
const tableHeaders = ref([
    { field: 'logId', label: '로그 번호', width: '12%' }, // 짧고 고유한 ID
    { field: 'requestTime', label: '요청 시간', width: '18%' }, // 날짜 형식
    { field: 'method', label: '요청메소드', width: '12%' }, // HTTP 메서드 (GET, POST 등)
    { field: 'uri', label: 'URI', width: '30%' }, // 상대적으로 긴 문자열
    { field: 'ipAddress', label: 'IP 주소', width: '15%' }, // 짧은 문자열
    { field: 'status', label: '상태', width: '10%' } // 숫자 값
]);

// 상태 변수
const selectedDetail = ref(null); // 선택된 상세 데이터
const tableData = ref([]); // 테이블 데이터
const totalRecords = ref(0); // 전체 데이터 개수
const loading = ref(false); // 로딩 상태
const rows = ref(10); // 페이지 당 행 수
const first = ref(0); // 첫 번째 행 위치
const filters = ref({}); // 필터
const sortField = ref(null); // 정렬 필드
const sortOrder = ref(null); // 정렬 순서
const selectedRows = ref([]);
const searchCriteria = ref({});

const refresh = () => {
    searchCriteria.value = ref({});
    loadData();
}

function getStatusLabel(status) {
    switch (status) {
        case "SUCCESS":
            return "SUCCESS";
        case "ERROR":
            return "ERROR";
        default:
            return "알 수 없음";
    }
}

// 상태에 따라 표시할 색상 반환
function getCustomTagClass(status) {
    switch (status) {
        case "SUCCESS":
            return "info"; // 초록색
        case "ERROR":
            return "danger"; // 빨간색
        default:
            return "warning"; // 기본 색상
    }
}



const select = () => {
    const formData = searchFormRef.value?.formData;
    console.log('1');
    console.log(formData);

    if (!formData) {
        console.error('formData를 가져올 수 없습니다.');
        return;
    }
    console.log('2');

    // 검색 조건 생성
    searchCriteria.value = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );
    console.log('3');
    console.log(searchCriteria.value);
    // 검색 실행
    loadData();
};



// 데이터 로드 함수
const loadData = async () => {
    loading.value = true; // 로딩 시작
    try {
        // 쿼리 파라미터 설정
        const query = {
            page: first.value / rows.value, // 현재 페이지 번호
            size: rows.value, // 한 페이지 데이터 수
            // sortField: sortField.value || null, // 정렬 필드
            // sortOrder: sortOrder.value || null, // 정렬 순서

        };

        // 쿼리 문자열 생성
        const queryString = `?${new URLSearchParams(query).toString()}`;
        console.log("API 호출 URL:", queryString); // 디버깅용

        // API 호출
        const response = await $api.log.getParams('', queryString);

        // API 응답 데이터 확인
        console.log("API 응답 데이터:", response);

        const result = response?.result; // 응답 데이터 접근
        if (result && Array.isArray(result.content)) {
            tableData.value = result.content; // 테이블 데이터 업데이트
            totalRecords.value = result.totalElements; // 전체 데이터 수
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

const exportCSV = async () => {
    loading.value = true;
    try {
        const blob = await $api.contract.get('excel', '', {
            responseType: 'blob'
        });

        // 이미 blob이 반환되었으므로 바로 URL 생성
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'contractExcel.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('파일 다운로드 완료');
    } catch (error) {
        console.error('다운로드 에러:', error);
        alert('엑셀 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        loading.value = false;
    }
};

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

const showModal = ref(false);

function handleView(rowData) {
    selectedDetail.value = rowData; // 클릭된 행 데이터를 전달
    showModal.value = true; // 모달 열기
}

onMounted(() => {
    loadData();
});
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
    width: 70px;
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

.select {
    display: flex;
    justify-content: right;
    margin-top: 16px;
    margin-bottom: 24px;
}

.log-detail-container {
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.log-detail-container h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    color: #333;
}

.log-detail-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.log-detail-table td {
    padding: 0.8rem;
    border: 1px solid #ddd;
    font-size: 0.9rem;
    vertical-align: top;
}

.log-detail-table td:first-child {
    background-color: #f5f5f5;
    font-weight: bold;
    width: 25%;
    text-align: right;
    color: #555;
}
</style>