<template>
    <PageLayout>
        <div class="component-wrapper">
            <div class="button-row">
                <CommonButton label="초기화" icon="pi pi-refresh" color="#F1F1FD" textColor="#6360AB" @click="refresh" />
            </div>
            <!-- 첫 번째 행: 검색 조건 -->
            <SSearchForm :fields="[firstRowFields]" ref="searchFormRef" />

            <TabView class="horizontal-tabs" @tab-change="handleTabChange">
                <TabPanel v-for="(field, index) in secondRowFields" :key="field.model" :header="field.label">
                    <!-- 테이블: POST 요청 데이터 -->
                    <div class="component-wrapper" v-if="method === 'POST'">
                        <div class="flex-row content-between">
                            <div>전체목록</div>
                            <div class="flex-row items-center mb-s">
                                <div class="ml-xs">
                                    <SCommonButton label="인쇄" icon="pi pi-print" @click="printSelectedRows" />
                                </div>
                                <div class="ml-xs">
                                    <SCommonButton label="엑셀다운" @click="exportCSV($event)" icon="pi pi-download" />
                                </div>
                            </div>
                        </div>
                        <ViewTable :headers="tableHeaders" :data="tableData" :loading="loading"
                            :totalRecords="totalRecords" :rows="rows" :rowsPerPageOptions="[5, 10, 20, 50]"
                            :selectable="true" :selection="selectedRows" @update:selection="updateSelectedRows"
                            buttonLabel="조회" buttonHeader="상세조회" :buttonAction="handleView" buttonField="code"
                            @page="onPage" @sort="onSort" @filter="onFilter"></ViewTable>
                    </div>
                    <div v-if="method === 'GET'">
                        <!-- <p class="m-0">{{ field.label }}</p> -->
                        <div class="flex-container">
                            <div v-for="(field2, index) in thirdRowFields" :key="index" class="form-row button-row">
                                <SCommonButton :key="field2.model" :label="field2.label"
                                    @click="handleButtonComparisonClick(field2)" />
                            </div>
                        </div>
                        <div>
                            <BigCard :chart-data="[bigCardChartData, secondChartData]" />
                        </div>
                        <!-- 차트: GET 요청 데이터 -->
                    </div>
                </TabPanel>
            </TabView>
        </div>

    </PageLayout>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import PageLayout from '@/components/common/layouts/PageLayout.vue';
import ViewTable from '@/components/common/ListTable.vue';
import SSearchForm from '@/components/common/SSearchForm.vue';
import SCommonButton from '@/components/common/Button/SCommonButton.vue';
import BigCard from '@/components/common/SGraphCard.vue';
import { $api } from '@/services/api/api';
import CommonButton from '@/components/common/Button/CommonButton.vue';

// SearchForm.vue 검색조건 값
const firstRowFields = ref([
    {
        label: '분류',
        type: 'select',
        model: 'period',
        value: '',
        // options: ['일별', '월별', '연도별'],
        // options: ['','월별', '연도별'],
        options: ['', '월별'],
        showDivider: false,
    },
    {
        label: '조회기간',
        type: 'calendar',
        model: 'salesHistorySearchDate',
        showIcon: true,
        manualInput: false,
    },
]);

const secondRowFields = ref([
    {
        label: '판매내역',
        type: 'button',
        model: 'salesHistory',
        value: '',
    },
    {
        label: '수당',
        type: 'button',
        model: 'incentive',
        value: '',
    },
    {
        label: '실적',
        type: 'button',
        model: 'performance',
        value: '',
    },
    {
        label: '매출액',
        type: 'button',
        model: 'totalSales',
        value: '',
    },
]);

const thirdRowFields = ref([
    {
        label: '최고',
        type: 'button',
        model: 'best',
        value: '',
    },
    {
        label: '평균',
        type: 'button',
        model: 'average',
        value: '',
    },
]);

// table 헤더 값
const tableHeaders = ref([
    { field: 'salesHistoryId', label: '판매내역 번호', width: '20%' },
    { field: 'salesHistoryIncentive', label: '수당', width: '15%' },
    { field: 'salesHistoryNumberOfVehicles', label: '판매 대수', width: '5%' },
    { field: 'salesHistoryTotalSales', label: '매출액', width: '15%' },
    { field: 'createdAt', label: '작성 일시', width: '20%' },
    { field: 'contractId', label: '계약서 번호', width: '25%' },
    { field: 'customerId', label: '고객명', width: '10%' },
    { field: 'productId', label: '제품 번호', width: '20%' },
    { field: 'centerId', label: '매장명', width: '20%' },
    // { field: 'memberId', label: '담당자', width: '20%' },
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
const method = ref(null);
let saveButton;
const searchParams = ref({
    startDate: null,
    endDate: null
});

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

const handleButtonComparisonClick = async (field2) => {
    console.log(`${field2.model} 비교 버튼 클릭됨`);

    const formData = searchFormRef.value?.formData;

    if (!formData) {
        console.error('FormData를 가져올 수 없습니다.');
        return;
    }

    searchCriteria.value = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );

    const period = formData.period || '';
    const searchTypeMap = {
        '': 'daily',
        '월별': 'month',
        '연도별': 'year',
    };
    const searchType = searchTypeMap[period];

    const requestBody = {
        groupBy: 'employee',
        month: searchType === 'month' ? 'month' : null,
        year: searchType === 'year' ? 'year' : null,
        startDate: searchCriteria.value.salesHistorySearchDate_start || null,
        endDate: searchCriteria.value.salesHistorySearchDate_end || null,
        orderBy: orderByValue(saveButton),
        period: searchType,
    };

    console.log("Comparison Request Body:", requestBody);
    if (field2.model === 'best') {
        console.log("최고 데이터 요청:", requestBody);
        await loadBestData(requestBody, field2.label); // 최고 데이터 로드
    } else {
        console.log("평균 데이터 요청:", requestBody);
        await loadComparisonData(requestBody, field2.label); // 기존 평균 로직
    }
};

const handleTabChange = (event) => {
    const selectedField = secondRowFields.value[event.index]; // 선택된 탭에 해당하는 field를 가져옴
    const selectedTab = event.index; // 선택된 탭 인덱스

    if (selectedTab === 0) {
        method.value = 'POST';  // 판매내역 탭
    } else if ([1, 2, 3].includes(selectedTab)) {
        method.value = 'GET';  // 다른 탭들
    }
    handleButtonClick(selectedField); // 선택된 field를 전달하여 처리
};

const handleButtonClick = async (field) => {
    // FormData 가져오기
    const formData = searchFormRef.value?.formData;

    if (!formData) {
        console.error('FormData를 가져올 수 없습니다.');
        return;
    }

    // 검색 조건 생성 및 설정
    searchCriteria.value = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );

    saveButton = field.model;

    const period = formData.period || ''; // '일별', '월별', '연도별' 중 하나
    const searchTypeMap = {
        '': '',
        '월별': 'month',
        '연도별': 'year',
    };

    const searchType = searchTypeMap[period] || null; // 매핑되지 않은 값은 null

    console.log('searchCriteria:', searchCriteria.value);

    // 데이터 로드 및 차트 업데이트
    await loadData(method.value, searchType, field.model, field.label);
};


const loadData = async (method = 'POST', searchType = null, fieldModel = null, fieldLabel = null) => {
    loading.value = true; // 로딩 시작
    try {
        searchParams.value = {
            startDate: searchCriteria.value.salesHistorySearchDate_start || null,
            endDate: searchCriteria.value.salesHistorySearchDate_end || null,
        }

        let response;

        if (method === 'POST') {
            // POST 요청
            const queryString = `?page=${first.value / rows.value}&size=${rows.value}&sortField=${sortField.value || 'createdAt'}&sortOrder=${sortOrder.value || 'desc'}`;
            response = await $api.salesHistory.post(searchParams.value, 'employee/search' + queryString);

            if (response && response.result) {
                tableData.value = response.result.content || [];
                totalRecords.value = response.result.totalElements || 0;
            }
        } else if (method === 'GET') {
            // GET 요청
            const subUrl = ref(null);
            if (searchType != null)
                subUrl.value = `employee/statistics/search/${searchType}`;
            else
                subUrl.value = `employee/statistics/search`;
            const queryString = `?startDate=${encodeURIComponent(searchParams.value.startDate)}&endDate=${encodeURIComponent(searchParams.value.endDate)}`;
            response = await $api.salesHistory.getParams(subUrl.value, queryString);

            console.log("queryString: " + queryString);
            console.log("subUrl" + subUrl);

            if (response && response.result) {
                const result = response.result;

                if (Array.isArray(result)) {
                    // 데이터 매핑
                    const mappedData = result.map((item) => ({
                        label: item.month || item.year || item.createdAt || '',
                        value: item[fieldModel] || 0,
                    }));

                    console.log("mappedData:", mappedData);

                    // 차트 업데이트
                    updateChartData(mappedData, fieldLabel);
                } else {
                    const mappedData = Object.entries(result).map(([key, value]) => ({
                        label: result.month || result.year || result.createdAt || '',  // 키를 label로 사용
                        value: result[fieldModel] || 0,  // 값이 없으면 0으로 처리
                    }));
                    updateChartData(mappedData, fieldLabel);
                }
            } else {
                throw new Error('Unsupported method');
            }
        }
    } catch (error) {
        console.error('데이터 로드 실패:', error.message);
    } finally {
        loading.value = false; // 로딩 종료
    }
};

const updateChartData = (mappedData, fieldLabel, isComparison = false) => {
    console.log(`updateChartData 호출: fieldLabel = ${fieldLabel}, isComparison = ${isComparison}, data =`, mappedData);

    const labels = mappedData.map((item) => item.label);
    const data = mappedData.map((item) => item.value);

    const targetChartData = isComparison ? secondChartData : bigCardChartData;

    targetChartData.value = {
        labels,
        datasets: [
            {
                label: fieldLabel,
                data,
                borderColor: isComparison ? 'rgba(46, 204, 113, 0.8)' : 'rgba(82, 77, 249, 0.8)',
                backgroundColor: isComparison ? 'rgba(46, 204, 113, 0.3)' : 'rgba(82, 77, 249, 0.3)',
                pointBackgroundColor: isComparison ? 'rgba(46, 204, 113, 1)' : 'rgba(82, 77, 249, 1)',
                pointBorderColor: '#FFFFFF',
                pointRadius: 5,
                fill: true,
                tension: 0.4,
                type: 'bar',
            },
        ],
    };

    console.log("Updated Chart Data:", targetChartData.value);
};

const loadComparisonData = async (requestBody, fieldLabel) => {
    loading.value = true;
    try {
        const response = await $api.salesHistory.post(requestBody, 'statistics/average');

        if (response && response.result) {
            const result = response.result;

            console.log("Response Result:", result);
            console.log("saveButton: ", saveButton);

            // `saveButton` 값을 기반으로 매핑할 필드 결정
            const fieldMapping = {
                incentive: 'averageTotalIncentive',
                performance: 'averageTotalPerformance',
                totalSales: 'averageTotalSales',
            };

            const mappedKey = fieldMapping[saveButton];
            if (!mappedKey) {
                console.error(`saveButton ${saveButton}에 대한 매핑이 없습니다.`);
                return;
            }

            // result 배열을 매핑
            const mappedData = result.content.map((item) => ({
                label: item.month || item.year || '',
                value: item[mappedKey] || 0, // saveButton에 따라 동적으로 값 설정
            }));

            console.log("Mapped Comparison Data:", mappedData);

            // 비교 차트 데이터 업데이트
            updateChartData(mappedData, fieldLabel, true);
        } else {
            console.warn("Response 결과가 비어 있습니다.");
        }
    } catch (error) {
        console.error('Comparison 데이터 로드 실패:', error.message);
    } finally {
        loading.value = false;
    }
};

const loadBestData = async (requestBody, fieldLabel, searchType) => {
    loading.value = true;
    try {

        console.log

        const response = await $api.salesHistory.post(requestBody, `statistics/best`);

        if (response && response.result) {
            const result = response.result;

            console.log("Response Result:", result);

            // `saveButton` 값을 기반으로 매핑할 필드 결정
            const fieldMapping = {
                incentive: 'totalIncentive',
                performance: 'totalPerformance',
                totalSales: 'totalSales',
            };

            const mappedKey = fieldMapping[saveButton];
            if (!mappedKey) {
                console.error(`saveButton ${saveButton}에 대한 매핑이 없습니다.`);
                return;
            }

            // result 배열을 매핑
            const mappedData = result.content.map((item) => ({
                label: item.month || item.year || '',
                value: item[mappedKey] || 0, // saveButton에 따라 동적으로 값 설정
            }));

            console.log("Mapped Comparison Data:", mappedData);

            // 비교 차트 데이터 업데이트
            updateChartData(mappedData, fieldLabel, true);
        } else {
            console.warn("Response 결과가 비어 있습니다.");
        }
    } catch (error) {
        console.error('Comparison 데이터 로드 실패:', error.message);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadData('POST');
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

const bigCardChartData = ref({
    labels: [],
    datasets: [
        {
            label: '수당',
            data: [],
            yAxisID: 'y',
            borderColor: 'rgba(82, 77, 249, 0.8)',
            backgroundColor: 'rgba(82, 77, 249, 0.3)',
            pointBackgroundColor: 'rgba(82, 77, 249, 1)',
            pointBorderColor: '#FFFFFF',
            pointRadius: 5,
            fill: true,
            tension: 0.4,
            type: 'line', // 라인 차트
        },
    ],
    gradientColors: ['rgba(82, 77, 249, 0.7)', 'rgba(82, 77, 249, 0.1)', 'rgba(255, 255, 255, 0)'],
});

const secondChartData = ref({
    labels: [],
    datasets: [
        {
            label: '실적',
            data: [],
            yAxisID: 'y1',
            borderColor: 'rgba(52, 115, 235, 0.8)', // 선명한 블루
            backgroundColor: 'rgba(52, 115, 235, 0.2)', // 블루 배경색

            type: 'bar', // 바 차트
            barThickness: 15, // 바의 두께
        },
    ],
    gradientColors: [
        'rgba(52, 115, 235, 0.8)', // 상단 진한 블루
        'rgba(52, 115, 235, 0.3)', // 중간 블루
        'rgba(52, 115, 235, 0)',   // 하단 투명
    ],
});

const thirdChartData = ref({
    labels: [],
    datasets: [
        {
            label: '매출액',
            data: [],
            yAxisID: 'y2',
            borderColor: 'rgba(46, 204, 113, 1)',
            backgroundColor: 'rgba(46, 204, 113, 0.6)',
            pointBackgroundColor: 'rgba(46, 204, 113, 1)',
            pointBorderColor: '#FFFFFF',
            pointRadius: 5,
            type: 'line', // 라인 차트
            tension: 0.4,
        },
    ],
    gradientColors: ['rgba(46, 204, 113, 0.7)', 'rgba(46, 204, 113, 0.1)', 'rgba(255, 255, 255, 0)'],
});

const orderByValue = (saveButton) => {
    switch (saveButton) {
        case 'incentive':
            return 'total_incentive';
        case 'performance':
            return 'total_performance';
        case 'totalSales':
            return 'total_sales';
        default:
            return ''; // 기본값 처리
    }
};

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

.button-row {
    display: flex;
    gap: 10px;
    /* 버튼 간 간격 */
    margin-top: 20px;
    /* 버튼 행 위쪽 간격 */
    justify-content: flex-start;
    /* 버튼을 왼쪽 정렬 */
}

.common-button {
    background-color: #6360AB;
    /* 기본 배경색 */
    color: #fff;
    /* 텍스트 색상 */
    border: none;
    /* 테두리 제거 */
    padding: 8px 16px;
    /* 버튼 내부 여백 */
    font-size: 14px;
    /* 텍스트 크기 */
    cursor: pointer;
    /* 마우스 커서 */
    border-radius: 4px;
    /* 모서리 둥글게 */
    text-align: center;
    /* 텍스트 정렬 */
    display: inline-block;
    /* 인라인 블록 레이아웃 */
    box-sizing: border-box;
    /* 크기 계산에 패딩 포함 */
}

.common-button:hover {
    background-color: #4e4c96;
    /* 호버 시 배경색 */
}

.button-row {
    display: flex;
    gap: 10px;
    /* 버튼 간 간격 */
    margin-bottom: 20px;
    /* 버튼 행 위쪽 간격 */
    justify-content: end;
    /* 버튼을 왼쪽 정렬 */
}

.flex-container {
    display: flex;
    align-items: center;
    /* 세로로 중앙 정렬 */
    justify-content: end;
    gap: 16px;
    /* 요소 간의 간격 */
}
</style>