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
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0px; /* 간격을 없앰 */
    border: 1px solid #EEEEEE; /* 외곽선 추가 */
}

.row {
    /* position: relative; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 30px; /* 각 행의 높이를 고정 */
    border-bottom: 1px solid #EEEEEE; /* 행 간의 구분선을 적용 */
}

.label, .value {
    border-right: 1px solid #EEEEEE; /* 좌우 구분선 추가 */
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 8px;
    line-height: 10px;
    display: flex;
    padding: 5px; /* 패딩 추가로 텍스트 간격 확보 */
}

/* 각 label 셀의 스타일 */
.label {
    width: 25%; /* 너비 고정 */
    color: #777777; /* 회색 텍스트 */
    background: #F8F8F8; /* 배경색 추가 */
    display: flex;
    justify-content: center;
}

/* 각 value 셀의 스타일 */
.value {
    width: 75%; /* 너비 고정 */
    color: #000000; /* 검정색 텍스트 */
}

/* 마지막 요소의 오른쪽 경계선 제거 */
.row .label:last-child,
.row .value:last-child {
    border-right: none;
}
</style>
