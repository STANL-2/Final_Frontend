<template>
    <PageLayout>
        <!-- 기초 정보 -->
        <div>
            <div class="subtitle">
                <div class="line"></div>
                <div class="subtitle-text">
                    고객 정보 수정
                </div>
            </div>
        </div>

        <div class="customer-info-modify">

            <div class="row" v-for="(item, index) in customerInfo" :key="index">
                <div class="label">{{ item.firstLabel }}</div>
                <div class="value">
                    <input
                        v-if="item.firstEditable"
                        type="text"
                        v-model="item.firstValue"
                        class="input-field"
                    />
                    <span v-else>{{ item.firstValue }}</span>
                </div>
                <div class="label">{{ item.secondLabel }}</div>
                <div class="value">
                    <input
                        v-if="item.secondEditable"
                        type="text"
                        v-model="item.secondValue"
                        class="input-field"
                    />
                    <span v-else>{{ item.secondValue }}</span>
                </div>
                <div class="label">{{ item.thirdLabel }}</div>
                <div class="value">
                    <input
                        v-if="item.thirdEditable"
                        type="text"
                        v-model="item.thirdValue"
                        class="input-field"
                    />
                    <span v-else>{{ item.thirdValue }}</span>
                </div>
            </div>

            <div class="flex-row items-center mb-s content-end">
                <div class="ml-xs">
                    <CommonButton label="수정 완료" @click="goModify" />
                </div>
            </div>
        </div>



        <!-- 계약 정보 -->
        <div class="section">
            <div class="subtitle">
                <div class="line"></div>
                <div class="subtitle-text">
                    계약서
                </div>
            </div>

            <div class="component-wrapper">
                <ViewTable :headers="tableHeaders" :data="tableData" :loading="loading" :totalRecords="totalRecords"
                    :rows="rows" :rowsPerPageOptions="[5, 10, 20, 50]" :selectable="true"
                    :selection.sync="selectedItems" buttonLabel="조회" buttonHeader="상세조회" :buttonAction="handleView"
                    buttonField="code" @page="onPage" @sort="onSort" @filter="onFilter">
                    <template #body-status="{ data }">
                        <div class="custom-tag-wrapper">
                            <div :class="['custom-tag', getCustomTagClass(data.status)]">
                                {{ getStatusLabel(data.status) }}
                            </div>
                        </div>
                    </template>
                </ViewTable>
            </div>






















        </div>



    </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/common/layouts/PageLayout.vue';
import ViewTable from '@/components/common/ListTable.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import { ref, onMounted } from 'vue';
import { $api } from '@/services/api/api';

// 기본 정보
const customerInfo = ref([
    {
        firstLabel: '성명',
        firstValue: '',
        firstEditable: true,
        secondLabel: '나이',
        secondValue: '',
        secondEditable: true,
        thirdLabel: '휴대전화',
        thirdValue: '',
        thirdEditable: true,
    },
    {
        firstLabel: '이메일',
        firstValue: '',
        firstEditable: true,
        secondLabel: '비상연락처',
        secondValue: '',
        secondEditable: true,
        thirdLabel: '',
        thirdValue: '',
        thirdEditable: false,
    }
]);

// 계약 헤더
const tableHeaders = [
    { field: 'contractId', label: '계약 번호', width: '' },
    { field: 'centerName', label: '매장', width: '' },
    { field: 'contractCarName', label: '모델명', width: '' },
    { field: 'contractTTL', label: '계약명', width: '' },
    { field: 'contractTotalSale', label: '계약금', width: '' },
    { field: 'status', label: '계약상태', width: '' }
];

const tableData = ref([]); // 테이블 데이터
const selectedItems = ref([]);
const totalRecords = ref(0); // 전체 데이터 개수
const loading = ref(false); // 로딩 상태
const rows = ref(10); // 페이지 당 행 수
const first = ref(0); // 첫 번째 행 위치
const sortField = ref(null); // 정렬 필드
const sortOrder = ref(null); // 정렬 순서
const sex = ref('');

const getModifyCustomer = async () => {
    const payload = {
            name: customerInfo.value[0].firstValue,
            age: customerInfo.value[0].secondValue,
            phone: customerInfo.value[0].thirdValue,
            email: customerInfo.value[1].firstValue,
            emergePhone: customerInfo.value[1].secondValue,
        };

        try{
            const response = await $api.customer.put(
                {
                    name: payload.name,
                    age: payload.age,
                    sex: sex.value,
                    phone: payload.phone,
                    email: payload.email,
                    emergePhone: payload.emergePhone
                },
                'CUS_000000001'             // 추후에 변경 예정
            )

            console.log(response);
        }catch{
            console.log('put 도중에 에러가 발생하였습니다.')
        }
}

function goModify() {
    getModifyCustomer();

    // 추후에 다음 페이지로 이동
}

function goList() {
    // 목록으로 이동
    console.log('목록 버튼 클릭됨');
    router.push('/customer-list'); // 적절한 경로로 이동
}

function getStatusLabel(status) {
    switch (status) {
        case "WAIT":
            return "대기";
        case "APPROVE":
            return "승인";
        case "CANCEL":
            return "취소";
        default:
            return "알 수 없음";
    }
}

// 상태에 따라 표시할 색상 반환
function getCustomTagClass(status) {
    switch (status) {
        case "WAIT":
            return "success"; // 노란색
        case "APPROVE":
            return "info"; // 초록색
        case "CANCEL":
            return "danger"; // 빨간색
        default:
            return "warning"; // 기본 색상
    }
}


// 기본 정보
const getCustomerInfo = async () => {
    try {
        const response = await $api.customer.get('', 'CUS_000000001');      // 추후에 수정
        const result = response.result;

        customerInfo.value = [
            {
                firstLabel: '성명',
                firstValue: result.name,
                firstEditable: true,
                secondLabel: '나이',
                secondValue: result.age,
                secondEditable: true,
                thirdLabel: '휴대전화',
                thirdValue: result.phone,
                thirdEditable: true,
            },
            {
                firstLabel: '이메일',
                firstValue: result.email,
                firstEditable: true,
                secondLabel: '비상연락처',
                secondValue: result.emergePhone,
                secondEditable: true,
                thirdLabel: '',
                thirdValue: '',
                thirdEditable: false,
            },
        ];
        sex.value = result.sex;
    } catch (error) {
        console.error('GET 요청 실패: ', error);
    }
};

// 고객 계약 정보 로드
const loadData = async () => {
    try {

        const query = {
            page: Math.floor(first.value / rows.value),
            size: rows.value,
        }

        const queryString = `?${new URLSearchParams(query).toString()}`;

        const response = await $api.customer.getParams(
            'contract/' + 'CUS_000000001' + '',                 // 추후에 수정
            queryString
        );

        const result = response?.result;

        if (result && Array.isArray(result.content)) {
            // API 데이터 변환: contractStatus -> status
            tableData.value = result.content.map(item => ({
                ...item,
                status: item.contractState // contractStatus를 status로 매핑
            }));

            totalRecords.value = result.totalElements; // 전체 데이터 수
        } else {
            console.warn("API 응답이 예상한 구조와 다릅니다:", response);
            throw new Error("API 응답 데이터 구조 오류");
        }

        totalRecords.value = response.result.totalElements;
    } catch (error) {
        console.error('고객 계약 정보 요청 실패:', error);
    }
};

// 상세 조회 메서드
function handleView(rowData) {
    console.log('상세 조회 버튼 클릭됨:', rowData);
    alert(`상세 조회 데이터: ${JSON.stringify(rowData)}`);
}

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


onMounted(() => {
    getCustomerInfo();
    loadData();
});
</script>

<style scoped>
.section {
    margin-bottom: 30px;
    /* 각 섹션 간 간격 */
}

.section-text {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
}

.customer-info-modify {
    margin-top: 20px;
    margin-bottom: 30px;
}

.subtitle {
    display: flex;
    align-items: center;
    /* 수직 중앙 정렬 */
}

.line {
    width: 5px;
    height: 24px;
    background-color: #333333;
    margin-right: 10px;
}

.subtitle-text {
    font-size: 16px;
    font-weight: bold;
    color: #000;
}

.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 35px;
    /* 각 행의 높이를 고정 */
    border-bottom: 0.5px solid #EEEEEE;
    /* 행 간의 구분선을 적용 */
    border-top: 0.5px solid #EEEEEE;
    /* 행 간의 구분선을 적용 */
}

.label,
.value {
    border-right: 1px solid #EEEEEE;
    /* 좌우 구분선 추가 */
    font-family: 'Pretendard';
    font-size: 12px;
    line-height: 1.5;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 5px;
    box-sizing: border-box;
}

/* 각 label 셀의 스타일 */
.label {
    width: 25%;
    color: #777777;
    background: #F8F8F8;
    display: flex;
    justify-content: center;
}

/* 각 value 셀의 스타일 */
.value {
    width: 75%;
    color: #000000;
}

table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    margin-top: 10px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px 16px;
    text-align: center;
    font-size: 13px;
}

th {
    background-color: #F8F8F8;
    color: #777777;
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
    color: aqua;
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
</style>
