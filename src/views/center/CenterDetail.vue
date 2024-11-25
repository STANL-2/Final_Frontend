<template>
    <Modal 
        :visible="modelValue" 
        header="매장 상세 조회" 
        width="70rem" 
        @click="onClose">
        
        <!-- 상세 조회 상단 (수정/삭제 버튼) -->
        <div class="flex-row content-end mb-s">
            <div class="ml-xs"><CommonButton label="수정" /></div>
            <div class="ml-xs"><CommonButton label="삭제" color="#F1F1FD" textColor="#6360AB" /></div>
        </div>

        <div class="viewform">
            <ViewForm :data="centerData" />
        </div>

        <div class="table-wrapper width-s ml-l">
            <ViewTable 
            v-if="tableData && tableData.length > 0"
            :headers="memberHeaders" 
            :data="tableData" 
            />

        </div>

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

// ViewForm에 전달할 데이터
const centerData = ref([]);
const tableData = ref([]);
const memberDataRecords = ref(0);
const rows = ref(5); // 페이지 당 행 수
const first = ref(0); // 첫 번째 행 위치

const props = defineProps({
    modelValue: Boolean, // v-model로 바인딩
    details: Object, // 부모로부터 넘어오는 상세 데이터
});

const emit = defineEmits(['update:modelValue']); // 부모에게 상태 전달

// 로컬 상태로 데이터를 관리
const centerDetails = ref({ ...props.details }); // 초기 데이터를 복사
const memberDetails = ref({ ...props.details }); // 초기 데이터를 복사

// Watch: props.details 업데이트 시 API 호출
watch(
    () => props.details,
    (newDetails, oldDetails) => {
        if (newDetails?.centerId && newDetails.centerId !== oldDetails?.centerId) {
            console.log('props.details 업데이트 감지. API 호출:', newDetails.centerId);
            getDetailRequest(newDetails.centerId);
        }
    }
);

const memberHeaders = [
    { field: 'name', label: '이름', width: '20%' },
    { field: 'email', label: '이메일', width: '30%' },
    { field: 'position', label: '직급', width: '20%' },
];

// 모달 닫기
function onClose() {
    console.log('onClose 호출됨');
    emit('update:modelValue', false);
}

// 데이터 요청 (필요 시 호출)
const getDetailRequest = async (centerId) => {
    try {
        const response = await $api.center.get('', centerId);
        centerDetails.value = response.result;

        centerData.value = [
            {
                label: '매장 번호',
                value: centerDetails.value.centerId,
                secondLabel: '매장 이름',
                secondValue: centerDetails.value.name,
            },
            {
                label: '매장 주소',
                value: centerDetails.value.address,
                secondLabel: '사원 수',
                secondValue: centerDetails.value.memberCount,
            },
            {
                label: '전화번호',
                value: centerDetails.value.phone,
                secondLabel: '운영 시간',
                secondValue: centerDetails.value.operatingAt,
            },
        ];

        const responseMember = await $api.member.get('', centerId);
        memberDetails.value = response.result;

        // 데이터를 가공하여 memberData에 저장
        tableData.value = responseMember.result.map((item) => ({
            name: item.name || 'N/A',        // 이름 필드
            email: item.email || 'N/A',     // 이메일 필드
            position: item.position || 'N/A', // 직급 필드
        }));

        memberDataRecords.value = responseMember.result.totalElements;

        console.log('가공된 memberData:', tableData.value);
    } catch (error) {
        console.error('데이터 요청 실패:', error);
    }
};

// 컴포넌트 마운트 시 API 호출
onMounted(() => {
    if (props.details?.centerId) {
        getDetailRequest(props.details.centerId);
    } else {
        console.error('centerId가 유효하지 않습니다.');
    }
});
</script>

<style scoped>
.viewform {
    display: flex;
    width: 50%;
    margin-bottom: 2rem;
}
</style>
