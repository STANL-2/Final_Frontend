<template>
    <Dialog 
        v-model:visible="localVisible" 
        modal 
        :header="header" 
        :style="{ width: dialogWidth }" 
        @hide="hide"
    >
        <slot></slot>
        <!-- footer 슬롯을 이용해 하단에 버튼 배치 -->
        <template #footer>
            <div class="dialog-footer">
                <CommonButton label="확인" @click="confirmAction" />
                <CommonButton label="취소" color="#ffffff" textColor="#6360AB" borderColor="#6360AB" @click="hide" />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import CommonButton from './button/CommonButton.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    header: {
        type: String,
        default: 'Modal Header',
    },
    width: {
        type: String,
        default: '40rem', // 기본 너비값 설정
    },
});

const emit = defineEmits(['update:modelValue']);
const localVisible = ref(props.modelValue);

// 유동적으로 전달된 너비 값 설정
const dialogWidth = props.width;

watch(
    () => props.modelValue,
    (newVal) => {
        localVisible.value = newVal;
    }
);

const hide = () => {
    localVisible.value = false;
    emit('update:modelValue', false);
};

const confirmAction = () => {
    hide(); // 모달 닫기
};
</script>

<style scoped>
.dialog-footer {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding-top: 1rem;
}
</style>

<style>
.p-dialog .p-dialog-footer {
    justify-content: center !important;
}
</style>
