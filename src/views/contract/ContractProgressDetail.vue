<template>
    <div>
        <Modal v-model="visible" header="진행현황" width="30rem" height="20rem" @cancel="closeModal">
            <div class="content-wrapper">
                <h1>{{ contractId }}</h1>
            </div>
            <ScrollPanel
                style="width: 100%; height: 700px; border: 1px solid #e0e0e0; padding: 30px 0 30px 30px; border-radius: 25px;"
                :pt="{
                    wrapper: { style: { 'border-right': '10px solid #6360AB' } },
                    bary: 'hover:surface-300 opacity-100 border-noround'
                }">
                <Timeline :value="events" align="alternate">
                    <template #opposite="slotProps">
                        <small :class="getStatusClass(slotProps.item)">
                            {{ formatDate(slotProps.item.date) }}
                        </small>
                    </template>
                    <template #content="slotProps">
                        <Card>
                            <template #title>
                                <span :class="getStatusClass(slotProps.item)">
                                    {{ slotProps.item.status }}
                                </span>
                            </template>
                            <template #content>
                                <p>{{ getStatusDescription(slotProps.item) }}</p>
                            </template>
                        </Card>
                    </template>
                </Timeline>
            </ScrollPanel>
            <template #footer>
                <CommonButton label="닫기" @click="closeModal" />
            </template>
        </Modal>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted, watch } from "vue";
import Modal from '@/components/common/Modal.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
// import { apiContractService, apiOrderService, apiPurchaseOrderService } from '@/services'; // Adjust import path as needed

const visible = ref(false);

const props = defineProps({
    contractId: {
        type: String,
        required: true
    },
    contractDate: {
        type: String,
        required: true
    }
});


const emit = defineEmits(['update:visible']);

const detailInfo = ref(null);
const loading = ref(false);

const events = computed(() => {
    if (!detailInfo.value) return [];

    const result = detailInfo.value.result || {};
    return [
        { 
            status: '계약 생성', 
            date: result.createdAt || new Date(), 
            icon: 'pi pi-file', 
            color: '#9C27B0',
            approved: false
        },
        { 
            status: '검토 중', 
            date: result.updatedAt || new Date(), 
            icon: 'pi pi-spinner', 
            color: '#673AB7',
            approved: false
        },
        { 
            status: '승인 대기', 
            date: result.approvalRequestedAt || new Date(), 
            icon: 'pi pi-check-circle', 
            color: '#FF9800',
            approved: false
        },
        { 
            status: '최종 승인', 
            date: result.approvedAt || new Date(), 
            icon: 'pi pi-check', 
            color: '#607D8B',
            approved: result.status === 'APPROVED'
        }
    ];
});

async function fetchContractDetails() {
    if (!props.contractId) return;

    loading.value = true;
    try {
        const response = await apiContractService.get('', props.contractId, '');
        detailInfo.value = response;
    } catch (error) {
        console.error('Failed to fetch contract details:', error);
    } finally {
        loading.value = false;
    }
}

function formatDate(date) {
    return new Date(date).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusClass(item) {
    return {
        'approved-status': item.approved,
        'pending-status': !item.approved
    };
}

function getStatusDescription(item) {
    const descriptions = {
        '계약 생성': '계약 문서가 시스템에 최초 등록되었습니다.',
        '검토 중': '관련 부서에서 계약 내용을 검토 중입니다.',
        '승인 대기': '최종 승인을 기다리고 있는 상태입니다.',
        '최종 승인': '모든 절차가 완료되고 최종 승인되었습니다.'
    };
    return descriptions[item.status] || '상태 설명이 없습니다.';
}

function closeModal() {
    emit('update:visible', false);
}

watch(() => [props.contractId, props.contractDate], ([newId, newDate]) => {
    if (newId && newDate) {
        console.log(`계약서 ID: ${newId}, 계약 일자: ${newDate}`);
        fetchProgressDetails(newId);
    }
});

onMounted(() => {
    if (props.visible) {
        fetchContractDetails();
    }
});
</script>

<style scoped>
.content-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
}

h1 {
    font-size: 2rem;
    color: #333;
}

.approved-status {
    color: #4CAF50 !important; /* Green color for approved status */
    font-weight: bold;
}

.pending-status {
    color: #9E9E9E !important; /* Grey color for pending status */
}
</style>