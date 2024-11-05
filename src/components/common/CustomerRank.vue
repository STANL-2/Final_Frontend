<template>
    <div class="customer-rank">
        <ul class="customer-list">
            <li class="customer-item" v-for="(customer, index) in customers" :key="index">
                <span class="customer-idx">{{ index + 1 }}.</span> <!-- 순서 출력 -->
                <span class="customer-name">{{ customer.name }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    customers: {
        type: Array,
        required: true
    }
});
</script>

<style scoped>
.customer-rank {
    display: flex;
    height: 100%; /* 카드 내에서 사용하는 경우 높이를 카드 크기에 맞춤 */
}

.customer-item {
    display: flex;
    align-items: center;
}

.customer-idx,
.customer-name {
    font-size: 20px;
    line-height: 30px;
    color: #000000;
    font-family: 'Pretendard', sans-serif;
}
</style>
