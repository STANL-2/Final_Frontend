<template>
    <Modal 
        :visible="modelValue" 
        header="제품 상세 조회" 
        width="70rem" 
        @click="onClose">
        
        <!-- 상세 조회 상단 (수정/삭제 버튼) -->
        <div class="flex-row content-end mb-s">
            <div class="ml-xs"><CommonButton label="수정" /></div>
            <div class="ml-xs"><CommonButton label="삭제" color="#F1F1FD" textColor="#6360AB" /></div>
        </div>

        <div class="viewform">
            <ViewForm :data="productData" />
        </div>

        <ViewTable :headers="headers" :tableData="tableData" />

        <template #footer>
            <CommonButton label="닫기" @click="onClose" />
        </template>
    </Modal>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue';
import Modal from '@/components/common/Modal.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import { $api } from '@/services/api/api';
import ViewForm from '@/components/common/ViewForm.vue';
import ViewTable from '@/components/common/ViewTable.vue';

const props = defineProps({
    modelValue: Boolean, // v-model로 바인딩
    details: Object, // 부모로부터 넘어오는 상세 데이터
});

const emit = defineEmits(['update:modelValue']); // 부모에게 상태 전달

// 로컬 상태로 데이터를 관리
const productDetails = ref({ ...props.details }); // 초기 데이터를 복사

// Watch: props.details 업데이트 시 API 호출
watch(
    () => props.details,
    (newDetails, oldDetails) => {
        // 새 값과 이전 값을 비교하여 유의미한 변경만 처리
        if (newDetails?.productId && newDetails.productId !== oldDetails?.productId) {
            console.log('props.details 업데이트 감지. API 호출:', newDetails.productId);
            getDetailRequest(newDetails.productId);
        }
    },
    // { immediate: true } // 컴포넌트 마운트 시에도 실행
);


// 모달 닫기
function onClose() {
    emit('update:modelValue', false); // 부모 컴포넌트에 닫힘 전달
}

// 데이터 요청 (필요 시 호출)
const getDetailRequest = async (productId) => {
    try {
        const response = await $api.product.get('', productId);
        productDetails.value = response.result; // 로컬 상태에 API 결과를 업데이트
        console.log('상세 데이터 응답:', response);

        productData.value = [
        {
            label: '제품 번호',
            value: productDetails.value.productId,
            secondLabel: '모델명',
            secondValue: productDetails.value.name
        },
        {
            label: '일련번호',
            value: productDetails.value.serialNumber,
            secondLabel: '차량가액',
            secondValue: productDetails.value.cost
        },
        {
            label: '재고 수',
            value: productDetails.value.stock,
            secondLabel: '차량 구분',
            secondValue: productDetails.value.vehicleType
        },
        ]

        tableData.value = [
        {
            배기량: mapValue('배기량', productDetails.value.engineCapacity),
            '차체 형상': mapValue('차체_형상', productDetails.value.bodyType),
            차대: mapValue('차대', productDetails.value.chassis),
            '안전 장치': mapValue('안전_장치', productDetails.value.safetyDevice),
            생산년도: mapValue('생산년도', productDetails.value.productYear),
            '생산 공장': mapValue('생산공장', productDetails.value.productPlant),
            '외장 색상': mapValue('외장색상', productDetails.value.externalColor),
            '내장 색상': mapValue('내장색상', productDetails.value.internalColor),
        },
        ]
    } catch (error) {
        console.error('데이터 요청 실패:', error);
    }
};

// ViewForm에 전달할 데이터
const productData = ref([]);

// 매핑 데이터 (사전 사용)
const mappings = {
    차대: {
        A: '승용 경차',
        H: '승용차',
        F: '화물트럭',
        J: '승합차량',
    },
    차체_형상: {
        2: '2도어',
        3: '3도어',
        4: '4도어',
        5: '5도어',
        6: '쿠페',
        7: '왜건',
    },
    안전_장치: {
        1: '장치없음',
        2: '수동안전띠',
        3: '자동안전띠',
        4: '에어백',
    },
    배기량: {
        A: '1800CC',
        B: '2000CC',
        C: '2500CC',
    },
    생산년도: {
        1: '2001',
        A: '2010',
        B: '2011',
        C: '2012',
        D: '2013',
        E: '2014',
        F: '2015',
        G: '2016',
        H: '2017',
        I: '2018',
        J: '2019',
        K: '2020',
        L: '2021',
        M: '2022',
        N: '2023',
        O: '2024',
    },
    생산공장: {
        A: '울산',
        C: '전주',
        U: '울산',
        M: '인도',
        Z: '터키',
        T: '서산',
    },
    외장색상: {
        W: 'White',
        B: 'Black',
        R: 'Red',
        G: 'Green',
    },
    내장색상: {
        G: 'Gray',
        B: 'Black',
        C: 'Cognac',
        R: 'Red'
    },
};

// 값 변환 함수
const mapValue = (category, key) => {
    return mappings[category]?.[key] || key; // 키가 없으면 원본 값을 반환
}

const headers = ['배기량','차체 형상', '차대', '안전 장치', '생산년도', '생산 공장', '외장 색상', '내장 색상', ];

const tableData = ref([]);

onMounted(() => {
    getDetailRequest(props.details?.productId);
});
</script>

<style scoped>
.viewform {
    display: flex;
    width: 50%;
}
</style>