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
            </div>
        


        <!-- 계약 정보 -->
        <div class="section">
            <div class="subtitle">
                <div class="line"></div>
                <div class="subtitle-text">
                    계약서
                </div>
            </div>
            <div class="flex-row content-between mt-l">
                <div class="list ml-l">전체목록</div>
                <div class="flex-row items-center mb-s mr-xl">
                    <div class="ml-xs">
                        <CommonButton label="엑셀다운" @click="exportCSV($event)" icon="pi pi-download" />
                    </div>
                </div>
            </div>
            <ViewTable
                :headers="customerContractHeaders"
                :data="customerContractData"
                :loading="loading"
                :totalRecords="totalRecords"
                :rows="rows"
                :rowsPerPageOptions="[5, 10, 20, 50]"
                :selectable="true"
                buttonLabel="상세보기"
                buttonHeader="계약 상태"
                :buttonAction="handleView"
                buttonField="계약 번호"
                @page="onPage"
                @sort="onSort"
                @filter="onFilter"
            />
        </div>

        <ProductDetail
            v-model="showDetailModal"
            :showModal="showDetailModal"
            :details="selectedDetail"
            @close="showDetailModal = false"
        />


    </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/common/layouts/PageLayout.vue';
import ViewTable from '@/components/common/ListTable.vue';
import ProductDetail from '@/views/product/ProductDetail.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import { ref, onMounted } from 'vue';
import { $api } from '@/services/api/api';

// 기본 정보
const customerInfo = ref([]);

// 학력 정보
const customerContractHeaders = ['계약 번호', '매장', '계약형태', '계약명', '계약금', '계약상태', '상세보기'];
const customerContractData = ref([]);

const totalRecords = ref(0);
const loading = ref(false);
const rows = ref(5);
const first = ref(0);
const sortField = ref(null);
const sortOrder = ref(null);
const showDetailModal = ref(false);
const selectedDetail = ref(null);

const handleView = (rowData) => {
    selectedDetail.value = rowData;
    showDetailModal.value = true;
};

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
const getCustomerContract = async () => {
    try {
        const response = await $api.customer.getParams(
            'contract/' + 'CUS_000000001'+'?',    // 추후에 수정
            {
                page: page,
                size: size
            }
        ); 
        const result = response.result;
    
        console.log('aslkdjflskjdlfjskdfjlsdk');
        console.log(result);

        customerContractData.value = result.map((customerContract) => ({
            '계약 번호': customerContract.contractId,
            '매장': customerContract.centerName,
            '계약형태': customerContract.contractCarName,
            '계약명': customerContract.contractTTL || '-',
            '계약금': customerContract.contractTotalSale || '-',
            '계약상태': customerContract.contractState || '-'
        }));

        totalRecords.value = response.result.totalElements;
    } catch (error) {
        console.error('고객 계약 정보 요청 실패:', error);
    }
};

// 페이지네이션
const onPage = (event) => {
    first.value = event.first;
    rows.value = event.rows;
    getCustomerContract();
};

// 정렬
const onSort = (event) => {
    sortField.value = event.sortField;
    sortOrder.value = event.sortOrder;
    getCustomerContract();
};


onMounted(() => {
    getCustomerInfo();
    getCustomerContract();
});
</script>

<style scoped>
.section {
    margin-bottom: 30px; /* 각 섹션 간 간격 */
}

.section-text {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
}

.customer-info{
    margin-top: 20px;
    margin-bottom: 30px;
}

.subtitle {
    display: flex;
    align-items: center;    /* 수직 중앙 정렬 */
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
    height: 35px;   /* 각 행의 높이를 고정 */
    border-bottom: 0.5px solid #EEEEEE;   /* 행 간의 구분선을 적용 */
    border-top: 0.5px solid #EEEEEE;   /* 행 간의 구분선을 적용 */
}

.label,
.value {
    border-right: 1px solid #EEEEEE;    /* 좌우 구분선 추가 */
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
