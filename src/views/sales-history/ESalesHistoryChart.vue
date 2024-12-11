<template>
    <PageLayout>
        <div class="component-wrapper">

            <div class="top">
                <div class="path">
                    <PagePath />
                </div>
                <div class="button-row">
                    <CommonButton label="초기화" icon="pi pi-refresh" color="#F1F1FD" textColor="#6360AB"
                        @click="refresh" />
                </div>
            </div>
            <!-- 첫 번째 행: 검색 조건 -->
            <SSearchForm :fields="[firstRowFields]" ref="searchFormRef" />

            <TabView class="horizontal-tabs" @tab-change="handleTabChange">
                <TabPanel v-for="(field, index) in secondRowFields" :key="field.model" :header="field.label">
                    <!-- <p class="m-0">{{ field.label }}</p> -->
                    <div class="flex-container">
                        <div v-for="(field2, index) in thirdRowFields" :key="index" class="form-row button-row">
                            <SCommonButton :key="field2.model" :label="field2.label"
                                @click="handleButtonComparisonClick(field2)" />
                        </div>
                    </div>
                    <div>
                        <BigCard ref="chartRef" :chart-data="[bigCardChartData, secondChartData]" />
                    </div>
                </TabPanel>
            </TabView>
        </div>

    </PageLayout>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import PageLayout from '@/components/common/layouts/PageLayout.vue';
import SSearchForm from '@/components/common/SSearchForm.vue';
import SCommonButton from '@/components/common/Button/SCommonButton.vue';
import BigCard from '@/components/common/SGraphCard.vue';
import { $api } from '@/services/api/api';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import PagePath from '@/components/common/PagePath.vue';
import DOMEventService from '@/services/DOMEventService';

// SearchForm.vue 검색조건 값
const firstRowFields = ref([
    {
        label: '분류',
        type: 'select',
        model: 'period',
        value: '',
        // options: ['일별', '월별', '연도별'],
        // options: ['','월별', '연도별'],
        options: ['일별', '월별'],
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

const loading = ref(false); // 로딩 상태
const method = ref(null);
let saveButton;
let saveDaily;
const chartRef = ref(null);
let count = 0;

const searchParams = ref({
    startDate: null,
    endDate: null
});

const searchCriteria = ref({});

const refresh = () => {
    searchCriteria.value = ref({});
    // SearchForm 초기화
    if (searchFormRef.value) {
        searchFormRef.value.initializeFormData();
    }
    // chartRef.value가 배열이므로 각 차트의 destroyCharts 메서드를 호출하여 차트를 제거
    if (Array.isArray(chartRef.value)) {
        chartRef.value.forEach(chart => {
            if (chart.destroyCharts) {
                chart.destroyCharts(); // 각 차트의 destroyCharts 호출
            }
        });
    }
    // loadData();
}

const handleButtonComparisonClick = async (field2) => {

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
        '일별': 'daily',
        '월별': 'month',
        '연도별': 'year',
    };
    const searchType = searchTypeMap[period];

    const requestBody = {
        groupBy: 'employee',
        month: searchType === 'month' ? 'month' : null,
        year: searchType === 'year' ? 'year' : null,
        startDate: searchCriteria.value.salesHistorySearchDate_start || null,
        endDate: searchCriteria.value.salesHistorySearchDate_end + 1 || null,
        orderBy: orderByValue(saveButton),
        period: searchType,
    };

    if (field2.model === 'best') {
        await loadBestData(requestBody, field2.label); // 최고 데이터 로드
    } else {
        await loadComparisonData(requestBody, field2.label); // 기존 평균 로직
    }
};

const handleTabChange = (event) => {
    const selectedField = secondRowFields.value[event.index]; // 선택된 탭에 해당하는 field를 가져옴
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
        '일별': 'daily',
        '월별': 'month',
        '연도별': 'year',
    };


    if (searchTypeMap[period] == 'daily') {
        saveDaily = 'daily';
    }
    else {
        saveDaily = null;
    }

    const searchType = searchTypeMap[period] || null; // 매핑되지 않은 값은 null


    // 데이터 로드 및 차트 업데이트
    await loadData(method.value, searchType, field.model, field.label);
};


const loadData = async (method = 'POST', searchType = null, fieldModel = null, fieldLabel = null) => {
    loading.value = true; // 로딩 시작
    try {

        // 별도로 날짜 처리
        const startDate = searchCriteria.value.salesHistorySearchDate_start || null;

        if (searchCriteria.value.salesHistorySearchDate_end) {
            // salesHistoryDate_end 값을 Date 객체로 변환
            let date = new Date(searchCriteria.value.salesHistorySearchDate_end);

            // 1일을 더하기
            date.setDate(date.getDate() + 1);

            // 새로운 날짜를 YYYY-MM-DD 형식으로 변환
            searchCriteria.value.salesHistorySearchDate_end = date.toISOString().split('T')[0]; // "2024-12-12"
        }
        const endDate = searchCriteria.value.salesHistorySearchDate_end || null;

        searchParams.value = {
            startDate,
            endDate,
            period: saveDaily
        }


        let response;

        // GET 요청
        const subUrl = ref(null);
        if (searchType != null)
            subUrl.value = `employee/statistics/search/${searchType}`;
        else
            subUrl.value = `employee/statistics/search`;
        const queryString = `?startDate=${encodeURIComponent(searchParams.value.startDate)}&endDate=${encodeURIComponent(searchParams.value.endDate)}&period=${encodeURIComponent(searchParams.value.period)}`;
        if (searchType == null && searchParams.value.startDate == null && searchParams.value.endDate == null) {
            console.warn('검색조건을 입력해주세요');
            DOMEventService.dispatchApiError("검색 조건을 입력해주세요.");
            throw new Error('Non formData');
        }
        response = await $api.salesHistory.getParams(subUrl.value, queryString);


        if (response && response.result) {
            const result = response.result;

            if (Array.isArray(result)) {
                // 데이터 매핑
                const mappedData = result.map((item) => ({
                    label: item.month || item.year || item.createdAt || '',
                    value: item[fieldModel] || 0,
                }));

                // 차트 업데이트
                updateChartData(mappedData, fieldLabel);
            } else {
                const mappedData = Object.entries(result).map(([key, value]) => ({
                    label: result.month || result.year || result.createdAt || '',  // 키를 label로 사용
                    value: result[fieldModel] || 0,  // 값이 없으면 0으로 처리
                }));
                updateChartData(mappedData, fieldLabel);
            }
            count = 0;}
        // } else if (searchType == null && searchParams.value.startDate == null && searchParams.value.endDate == null) {
        //     console.warn('검색조건을 입력해주세요');
        //     if (count > 0) {
        //         DOMEventService.dispatchApiError("검색 조건을 입력해주세요.");
        //         throw new Error('Non formData');
        //     }
        //     count++;}
        else {
            DOMEventService.dispatchApiError("검색 결과가 없습니다.");
            throw new Error('Unsupported method');
        }

    } catch (error) {
        console.error('데이터 로드 실패:', error.message);
    } finally {
        loading.value = false; // 로딩 종료
    }
};

const updateChartData = (mappedData, fieldLabel, isComparison = false) => {

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

    isComparison = false;

};

const loadComparisonData = async (requestBody, fieldLabel) => {
    loading.value = true;
    try {
        const response = await $api.salesHistory.post(requestBody, 'statistics/average');

        if (response && response.result) {
            const result = response.result;

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


        const response = await $api.salesHistory.post(requestBody, `statistics/best`);

        if (response && response.result) {
            const result = response.result;


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
    // loadData('POST');
});

const searchFormRef = ref(null);
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
            label: '',
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
.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* 세로 가운데 정렬 */
    width: 100%;
    /* 부모 요소 기준 크기 */
    box-sizing: border-box;
    /* 테두리 포함 크기 계산 */
}

.path {
    /* 나머지 요소를 오른쪽으로 밀어냄 */
    margin-bottom: 10px;
    display: flex;
}

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