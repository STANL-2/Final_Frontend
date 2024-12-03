<template>
    <PageLayout>
        <div class="component-wrapper">
            <!-- SearchForm -->
            <div class="component-wrapper">
                <CSearchForm :fields="formFields"  @open-modal="handleOpenModal" ref="searchFormRef" @keyup.enter="select" />
                <div class="select">
                    <CommonButton label="조회" @click="select" />
                </div>
            </div>
            <!-- 두 번째 행: 버튼 -->
            <div class="form-row button-row">
                <SCommonButton v-for="field in secondRowFields" :key="field.model" :label="field.label"
                    @click="handleButtonClick(field)" />
            </div>

            <!-- 세 번째 행: 버튼 -->
            <div class="form-row button-row">
                <SCommonButton v-for="field2 in thirdRowFields" :key="field2.model" :label="field2.label"
                    @click="handleButtonComparisonClick(field2)" />
            </div>
        </div>


        
        <div>
            <BigCard :chart-data="[bigCardChartData, secondChartData]" />
        </div>

        <Modal
    v-model="showModal"
    :header="modalType === 'centerList' ? '매장 검색' : 
             modalType === 'memberList' ? '사원 검색' : 
             modalType === 'productList' ? '제품 검색' : 
             modalType === 'customerList' ? '고객 검색' : '검색'"
    width="30rem"
    height="none"
    @confirm="confirmSelection"
    @cancel="resetModalState"
>
    <!-- 검색 입력 -->
    <div class="flex-row content-center mb-m">
        <label class="mr-m">
            {{ modalType === 'centerList' ? '매장명:' : 
            modalType === 'memberList' ? '사원명:' : 
            modalType === 'productList' ? '제품명:' : 
            modalType === 'customerList' ? '고객명:' : '' }}
        </label>
        <InputText
            type="text"
            v-model="searchQuery"
            @keyup.enter="searchStore"
        />
        <button class="search-button" @click="searchStore">
            <span class="search-icon pi pi-search"></span>
        </button>
    </div>

    <!-- 검색 결과 테이블 -->
    <table>
        <thead>
            <tr>
                <th v-for="header in dynamicHeaders" :key="header">{{ header }}</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="(row, index) in modalTableData"
                :key="index"
                @click="selectStore(row, index)"
                :class="{ selected: selectedRow === index }"
            >
                <td v-if="modalType === 'centerList'">{{ row.centerId }}</td>
                <td v-if="modalType === 'memberList'">{{ row.memberId }}</td>
                <td v-if="modalType === 'productList'">{{ row.productId }}</td>
                <td v-if="modalType === 'customerList'">{{ row.customerId }}</td>
                <td>{{ row.name }}</td>
            </tr>
        </tbody>
    </table>

        <!-- 모달 하단 버튼 -->
        <template #footer>
            <CommonButton label="확인" @click="confirmSelection" />
            <CommonButton
                label="취소"
                color="#ffffff"
                textColor="#6360AB"
                borderColor="#6360AB"
                @click="resetModalState"
            />
        </template>
    </Modal>
    </PageLayout>
</template>


<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import PageLayout from '@/components/common/layouts/PageLayout.vue';
import SCommonButton from '@/components/common/Button/SCommonButton.vue';
import BigCard from '@/components/common/SGraphCard.vue';
import { $api } from '@/services/api/api';
import CSearchForm from '@/components/common/CSearchForm.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import Modal from '@/components/common/Modal.vue';

// SearchForm.vue 검색조건 값
const formFields = [
    [
    {
        label: '분류',
        type: 'select',
        model: 'period',
        value: '',
        options: ['일별', '월별', '연도별'],
        showDivider: false,
    },
    {
        label: '조회기간',
        type: 'calendar',
        model: 'salesHistoryDate',
        showIcon: true,
        manualInput: false,
    },
    {
        label: '담당자명',
        type: 'inputWithButton',
        model: 'memberList',
        showDivier: false,
    },
    {
        label: '매장명',
        type: 'inputWithButton',
        model: 'centerList',
        showDivider: false,
    },
    {
        label: '매장/사원',
        type: 'select',
        model: 'groupBy',
        options: ['매장', '사원'],
        showDivider: false,
    }
    ],
];

const secondRowFields = ref([
    {
        label: '수당',
        type: 'button',
        model: 'totalIncentive',
        value: '',
    },
    {
        label: '실적',
        type: 'button',
        model: 'totalPerformance',
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
    }
]);

const loading = ref(false); // 로딩 상태
let saveButton;

let saveStartDate;
let saveEndDate;

const searchCriteria = ref({});

const refresh = () => {
    searchCriteria.value = ref({});
    loadData();
}

// 조회 버튼 클릭 시
const select = () => {
    const formData = searchFormRef.value?.formData;
    const formDataIds = searchFormRef.value?.formDataIds;

    if (!formData || !formDataIds) {
        console.error('formData를 가져올 수 없습니다.');
        return;
    }

    // 검색 조건 생성
if (formDataIds && Object.keys(formDataIds).length > 0) {
    // formDataIds가 존재하고 값이 있을 경우
    Object.entries(formDataIds).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            // 배열 필드인 경우 배열 병합 처리
            if (Array.isArray(searchCriteria.value[key])) {
                searchCriteria.value[key] = searchCriteria.value[key].concat(value);
            } else {
                searchCriteria.value[key] = value; // 배열이 아닌 경우 값 설정
            }
        }
    });
}

if (formData && Object.keys(formData).length > 0) {
    // formData에 값이 있을 경우
    Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            // 배열 필드인 경우 배열 병합 처리
            if (Array.isArray(searchCriteria.value[key])) {
                if (!searchCriteria.value[key].includes(value)) {
                    searchCriteria.value[key].push(value); // 중복 방지 후 값 추가
                }
            } else if (searchCriteria.value[key] !== undefined) {
                if (!Array.isArray(searchCriteria.value[key])) {
                    // 기존 값이 배열이 아니면 배열로 변환
                    searchCriteria.value[key] = [searchCriteria.value[key]];
                }
                if (!searchCriteria.value[key].includes(value)) {
                    searchCriteria.value[key].push(value);
                }
            } else {
                searchCriteria.value[key] = value; // 새로운 값 설정
            }
            }
        });
    }

        const period = formData.period || ''; // '일별', '월별', '연도별' 중 하나
        const searchTypeMap = {
            '일별': '',
            '월별': 'month',
            '연도별': 'year',
        };

        const searchType = searchTypeMap[period] || null; // 매핑되지 않은 값은 null

        // 데이터 로드 및 차트 업데이트
        loadData(searchType);
};

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
        '일별': null,
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
    };

    console.log("Comparison Request Body:", requestBody);
    if (field2.model === 'best') {
        console.log("최고 데이터 요청:", requestBody);
        await loadBestData(requestBody, field2.label, searchType); // 최고 데이터 로드
    } else {
        console.log("평균 데이터 요청:", requestBody);
        await loadComparisonData(requestBody, field2.label); // 기존 평균 로직
    }
    
};

const handleButtonClick = async (field) => {

    if (loading.value) return;

    loading.value = true;
    try{
    const formData = searchFormRef.value?.formData;
    const formDataIds = searchFormRef.value?.formDataIds;

    console.log("formDataIds: ", formDataIds);
    console.log("formData: ", formData);

    if (!formData || !formDataIds) {
        console.error('formData를 가져올 수 없습니다.');
        return;
    }

        // 검색 조건 생성
    if (formDataIds && Object.keys(formDataIds).length > 0) {
        // formDataIds가 존재하고 값이 있을 경우
        Object.entries(formDataIds).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                // 배열 필드인 경우 배열 병합 처리
                if (Array.isArray(searchCriteria.value[key])) {
                    searchCriteria.value[key] = searchCriteria.value[key].concat(value);
                } else {
                    searchCriteria.value[key] = value; // 배열이 아닌 경우 값 설정
                }
            }
        });
    }

    if (formData && Object.keys(formData).length > 0) {
        // formData에 값이 있을 경우
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                // 배열 필드인 경우 배열 병합 처리
                if (Array.isArray(searchCriteria.value[key])) {
                    if (!searchCriteria.value[key].includes(value)) {
                        searchCriteria.value[key].push(value); // 중복 방지 후 값 추가
                    }
                } else if (searchCriteria.value[key] !== undefined) {
                    if (!Array.isArray(searchCriteria.value[key])) {
                        // 기존 값이 배열이 아니면 배열로 변환
                        searchCriteria.value[key] = [searchCriteria.value[key]];
                    }
                    if (!searchCriteria.value[key].includes(value)) {
                        searchCriteria.value[key].push(value);
                    }
                } else {
                    searchCriteria.value[key] = value; // 새로운 값 설정
                }
                }
            });
    }
    saveButton = field.model;

    const period = formData.period || ''; // '일별', '월별', '연도별' 중 하나
    const searchTypeMap = {
        '일별': '',
        '월별': 'month',
        '연도별': 'year',
    };

    const searchType = searchTypeMap[period] || null; // 매핑되지 않은 값은 null

    console.log('searchCriteria:', searchCriteria.value);

    // 데이터 로드 및 차트 업데이트
    await loadData(searchType, field.model, field.label);
    } finally{
        loading.value = false;
    }
};


const loadData = async (searchType = null, fieldModel = null, fieldLabel = null, groupBy = 'employee') => {
    loading.value = true; // 로딩 시작
    try {

        if((searchCriteria.value.salesHistoryDate_start != saveStartDate) || (searchCriteria.value.salesHistoryDate_end != saveEndDate)){
            saveStartDate = searchCriteria.value.salesHistoryDate_start;
            saveEndDate = searchCriteria.value.salesHistoryDate_end;
        }
        // 검색 조건 필터링 및 유효한 값만 유지
        const filteredCriteria = Object.fromEntries(
            Object.entries(searchCriteria.value).filter(([key, value]) => {
                // null, undefined, 빈 문자열, 빈 배열, 빈 객체는 필터링
                if (value === null || value === undefined || value === '') return false;
                if (Array.isArray(value) && value.length === 0) return false;
                if (typeof value === 'object' && Object.keys(value).length === 0) return false;
                return key !== 'salesHistoryDate_start' && key !== 'salesHistoryDate_end' && key !== 'period'; // 날짜 제외
            })
        );

        // 배열 필드 강제 처리
        const ensureArrayFields = (criteria) => {
            const arrayFields = ['memberList', 'centerList', 'productList']; // 배열로 처리할 필드 정의
            arrayFields.forEach((field) => {
                if (!Array.isArray(criteria[field])) {
                    criteria[field] = criteria[field] ? [criteria[field]] : []; // 값이 있으면 배열로, 없으면 빈 배열로 처리
                }
            });
            return criteria;
        };
        

        // 필터링된 조건에 배열 처리 추가
        const preparedCriteria = ensureArrayFields(filteredCriteria);

        // 최종 요청 본문
        const searchParams = {
            ...preparedCriteria,
            startDate: saveStartDate || null,
            endDate: saveEndDate || null,
            orderBy: fieldModel || '',
            groupBy: searchCriteria.value.groupBy || '',
        };

        console.log("searchParams: ", searchParams);

        const queryString = ref('');
        // 쿼리 문자열 생성
        if(groupBy === 'employee' || groupBy === ''){
            if(searchType != '')
                queryString.value = `statistics/search/${searchType}`;
            else{
                queryString.value = `statistics/search`;
            }
            // queryString.value = `statistics/search`;
        }
        else if(groupBy === 'center'){
            queryString.value = `statistics/center/search/${searchType}`;
        }
        console.log("API 호출 URL:", queryString.value); // 디버깅용

        console.log("검색 인자: ", searchParams);

        // API 호출
        const response = await $api.salesHistory.post(searchParams, queryString.value);

        if (response && response.result) {
            const result = response.result.content;

            console.log("result: ", result);
            // 데이터 매핑
            const mappedData = result.map((item) => ({
                label: item.month || item.year || item.date || '',
                value: item[fieldModel] || 0,
            }));

            console.log("mappedData:", mappedData);

            // 차트 업데이트
            updateChartData(mappedData, fieldLabel);

            searchCriteria.value = ref({});
        } else {
                throw new Error('Unsupported method');
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
                type: 'line',
            },
        ],
    };

    console.log("Updated Chart Data:", targetChartData.value);
};

const loadComparisonData = async (requestBody, fieldLabel) => {
    loading.value = true;
    try {
        const response = await $api.salesHistory.post(requestBody, 'statistics/average/employee');

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
        const response = await $api.salesHistory.post(requestBody, `statistics/all/${searchType}`);

        if (response && response.result) {
            const result = response.result;

            console.log("Response Result:", result);
            console.log("saveButton: ", saveButton);

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

// 검색창 모달
const showModal = ref(false);
const searchQuery = ref('');
const modalTableData = ref([]);
const selectedRow = ref(null);
const selectedStoreCode = ref('');
const modalType = ref(''); // 현재 열려 있는 모달의 유형
const searchFormRef = ref(null);

const dynamicHeaders = computed(() => {
    if (modalType.value === 'centerList') {
        return ['매장코드', '매장명'];
    } else if (modalType.value === 'memberList') {
        return ['사원코드', '사원명'];
    } else if (modalType.value === 'productList') {
        return ['제품코드', '제품명']; // 가정
    } else if (modalType.value === 'customerList') {
        return ['고객이름', '담당자']; // 가정
    } else {
        return [];
    }
});

function handleOpenModal(fieldModel) {
    if (fieldModel === 'centerList') {
        modalType.value = 'centerList';
    } else if (fieldModel === 'memberList') {
        modalType.value = 'memberList';
    } else if (fieldModel === 'productList') {
        modalType.value = 'productList'; // 추가로 필요한 경우
    } else if (fieldModel === 'customerList') {
        modalType.value = 'customerList'; // 추가로 필요한 경우
    } else {
        console.warn(`알 수 없는 fieldModel: ${fieldModel}`);
        return;
    }
    showModal.value = true; // 모달 열기
    selectedRow.value = null; // 선택 초기화
}

// 테이블 행 선택
function selectStore(row, index) {
    selectedRow.value = index; // 선택된 행의 인덱스 저장

    switch (modalType.value) {
        case 'centerList':
            selectedStoreCode.value = row.centerId; // 매장 코드 저장
            console.log("선택된 매장 코드:", selectedStoreCode.value);
            break;
        case 'memberList':
            selectedStoreCode.value = row.memberId; // 사원 코드 저장
            console.log("선택된 사원 코드:", selectedStoreCode.value);
            break;
        case 'productList':
            selectedStoreCode.value = row.productId; // 제품 코드 저장
            console.log("선택된 제품 코드:", selectedStoreCode.value);
            break;
        case 'customerList':
            selectedStoreCode.value = row.customerId; // 고객 코드 저장
            console.log("선택된 고객 코드:", selectedStoreCode.value);
            break;
        default:
            console.warn(`알 수 없는 modalType: ${modalType.value}`);
    }
}


function confirmSelection() {
    if (selectedRow.value === null) {
        alert('항목을 선택하세요.');
        return;
    }

    const selectedData = modalTableData.value[selectedRow.value];

    switch (modalType.value) {
        case 'centerList':
            searchFormRef.value.updateFieldValue('centerList', selectedData.name, selectedData.centerId);
            break;
        case 'memberList':
            searchFormRef.value.updateFieldValue('memberList', selectedData.name, selectedData.memberId);
            break;
        case 'productList':
            searchFormRef.value.updateFieldValue('productList', selectedData.name, selectedData.productId);
            break;
        case 'customerList':
            searchFormRef.value.updateFieldValue('customerList', selectedData.name, selectedData.customerId);
            break;
        default:
            console.warn(`알 수 없는 modalType: ${modalType.value}`);
    }

    showModal.value = false; // 모달 닫기
}




// 모달 상태 초기화
function resetModalState() {
    showModal.value = false;
    selectedRow.value = null;
    searchQuery.value = ''; // 검색어 초기화
    modalTableData.value = []; // 모달 테이블 데이터 초기화
    selectedStoreCode.value = ''; // 선택된 매장 코드 초기화
}

async function searchStore() {
    try {
        console.log("검색어:", searchQuery.value);

        const query = modalType.value === 'centerList'
            ? { name: searchQuery.value }
            : { employeeName: searchQuery.value };


        const endpoint = modalType.value === 'centerList'
            ? $api.center
            : modalType.value === 'memberListName'
            ? $api.member
            : modalType.value === 'productList'
            ? $api.product // 가정
            : modalType.value === 'customerList'
            ? $api.customer // 가정
            : null;

        if (!endpoint) {
            console.error('유효하지 않은 modalType:', modalType.value);
            return;
        }

        const response = await endpoint.getParams('search', `?name=${searchQuery.value}`);
        console.log("API 응답 데이터:", response);

        let result = [];
        if (modalType.value === 'centerList') {
            result = response.result.content || [];
        } else if (modalType.value === 'memberList') {
            result = response.result || [];
        } else if (modalType.value === 'productList') {
            result = response.result.content || []; // 가정
        } else if (modalType.value === 'customerList') {
            result = response.result.content || []; // 가정
        }

        if (Array.isArray(result)) {
            modalTableData.value = result;
            console.log("Modal Table Data:", modalTableData.value);
        } else {
            console.warn("API 응답 데이터가 배열이 아닙니다.");
            modalTableData.value = [];
        }
    } catch (error) {
        console.error("데이터 로드 실패:", error.message);
        alert("데이터를 가져오는 데 실패했습니다. 관리자에게 문의하세요.");
    } finally {
        loading.value = false;
    }
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
</style>