<template>
    <Dialog v-model:visible="localVisible" modal :header="header" :style="{ width: '50rem' }" @hide="hide">
        <slot></slot>
    </Dialog>
</template>

<script>
import { defineProps, defineEmits, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';

export default {
    components: { Dialog },
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        },
        header: {
            type: String,
            default: 'Modal Header',
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
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

        return {
            localVisible,
            hide,
        };
    },
};
</script>
