<template>
    <PageLayout>
        <!-- 기초 정보 -->
        <div>
            <div class="subtitle">
                <div class="line"></div>
                <div class="subtitle-text">
                    고객 정보
                </div>
            </div>
        </div>

        <div class="customer-info">
            <div class="row" v-for="(item, index) in customerInfo" :key="index">
                <div class="label">{{ item.firstLabel }}</div>
                <div class="value">{{ item.firstValue }}</div>
                <div class="label">{{ item.secondLabel }}</div>
                <div class="value">{{ item.secondValue }}</div>
                <div class="label">{{ item.thirdLabel }}</div>
                <div class="value">{{ item.thirdValue }}</div>
            </div>

            <div class="flex-row items-center mb-s content-end">
                <div class="ml-xs">
                    <CommonButton label="삭제" @click="goDelete" />
                </div>
                <div class="ml-xs">
                    <CommonButton label="수정" @click="goModify"/>
                </div>
                <div class="ml-xs">
                    <CommonButton label="목록" color="#F1F1FD" textColor="#6360AB" @click="goList"/>
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

            <ViewTable :headers="tableHeaders" :data="tableData" :loading="loading" :totalRecords="totalRecords"
                :rows="rows" :rowsPerPageOptions="[5, 10, 20, 50]" :selectable="true" :selection.sync="selectedItems"
                buttonLabel="조회" buttonHeader="상세조회" :buttonAction="handleView" buttonField="code" @page="onPage"
                @sort="onSort" @filter="onFilter">
                <template #body-status="{ data }">
                    <div class="custom-tag-wrapper">
                        <div :class="['custom-tag', getCustomTagClass(data.status)]">
                            {{ getStatusLabel(data.status) }}
                        </div>
                    </div>
                </template>
            </ViewTable>






        





        





            

        </div>



    </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/common/layouts/PageLayout.vue';
import ViewTable from '@/components/common/ListTable.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import ContractDetail from '@/views/contract/ContractDetail.vue';
import { ref, onMounted } from 'vue';
import { $api } from '@/services/api/api';

// 기본 정보
const customerInfo = ref([]);

// 계약 정보
const tableHeaders = [
    { field: 'contractId', label: '계약 번호', width: ''},
    { field: 'centerName', label: '매장', width: ''},
    { field: 'contractCarName', label: '모델명', width: ''},
    { field: 'contractTTL', label: '계약명', width: ''},
    { field: 'contractTotalSale', label: '계약금', width: ''},
    { field: 'contractState', label: '계약상태', width: ''}
];

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

function handleView(rowData) {
    // 상세 데이터 설정 및 모달 열기
    selectedDetail.value = rowData; // 클릭된 행 데이터 전달
    showDetailModal.value = true;
}


// 기본 정보
const getCustomerInfo = async () => {
    try {
        const response = await $api.customer.get('', 'CUS_000000001');      // 추후에 수정
        const result = response.result;

        customerInfo.value = [
            {
                firstLabel: '고객번호', firstValue: result.customerId,
                secondLabel: '성명', secondValue: result.name,
                thirdLabel: '나이', thirdValue: result.age
            },
            {
                firstLabel: '성별', firstValue: result.sex,
                secondLabel: '휴대전화', secondValue: result.phone,
                thirdLabel: '이메일', thirdValue: result.email
            },
            {
                firstLabel: '비상연락처', firstValue: result.emergePhone,
                secondLabel: '', secondValue: '',
                thirdLabel: '', thirdValue: ''
            }
        ];
    } catch (error) {
        console.error('GET 요청 실패: ', error);
    }
};

// 고객 계약 정보 로드
const loadData = async () => {
    try {
        console.log('#@#$@#$@#$@#$@#$@#');
        
        const query = {
            page: first.value / rows.value,
            size: rows.value
        }

        const queryString = `?${new URLSearchParams(query).toString()}`;

        const response = await $api.customer.getParams(
            'contract/'+'CUS_000000001' + '?',    // 추후에 수정
            queryString
        );

        const result = response?.result;

        console.log(result);

        if (result && Array.isArray(result.content)) {
            tableData.value = result.content; // 테이블 데이터 업데이트
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

.customer-info {
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
</style>
