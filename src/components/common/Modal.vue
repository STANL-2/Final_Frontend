<template>
    <Dialog v-model:visible="localVisible" modal :header="header" :style="{ width: '50rem' }" @hide="hide">
        <slot></slot>
    </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    header: {
        type: String,
        default: 'Modal Header',
    },
});

const emit = defineEmits(['update:modelValue']);
const localVisible = ref(props.modelValue);

// 부모 컴포넌트의 modelValue가 바뀌면 localVisible도 업데이트
watch(
    () => props.modelValue,
    (newVal) => {
        localVisible.value = newVal;
    }
);

// localVisible이 바뀔 때마다 부모 컴포넌트에 상태를 업데이트
const hide = () => {
    localVisible.value = false;
    emit('update:modelValue', false);
};

watch(localVisible, (newVal) => {
    emit('update:modelValue', newVal);
});
</script>
