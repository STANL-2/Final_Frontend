<template>
    <div>
        <ViewTable :headers="headers" :tableData="tableData"/>
    </div>
</template>

<script>
import ViewTable from '@/components/common/ViewTable.vue';

export default {
    components: {
        ViewTable,
    },
    data() {
        return {
            headers: ['구분', '면적(㎡)', '층수', '구조', '비고', '야호', '하이', '헤'],
            tableData: [
                { 구분: 'A', '면적(㎡)': 50, 층수: 1, 구조: '철근콘크리트', 비고: '테스트', 야호: '헤헤', 하이: '헤헤', 헤: '헤헤' },
                { 구분: 'B', '면적(㎡)': 75, 층수: 2, 구조: '목조', 비고: '테스트2', 야호: '헬로', 하이: '헤헤', 헤: '헤헤' },
            ],
        };
    },
};
</script>