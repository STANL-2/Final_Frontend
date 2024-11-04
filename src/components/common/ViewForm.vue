<template>
    <div class="info-card">
        <div class="row" v-for="(item, index) in data" :key="index">
            <div class="label">{{ item.label }}</div>
            <div class="value">{{ item.value }}</div>
            <div class="label">{{ item.secondLabel }}</div>
            <div class="value">{{ item.secondValue }}</div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 부모 컴포넌트에서 데이터를 prop으로 받음
const props = defineProps({
    data: {
        type: Array,
        required: true
    }
});
</script>

<style scoped>
.info-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* width: 1106px; */
    width: 100%;
    height: 56.72px;
}

.row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid #e0e0e0;
    padding: 10px 0;
}

.label {
    width: 20%;
    color: #888;
    font-weight: bold;
}

.value {
    width: 30%;
    text-align: left;
    color: #000;
}
</style>
