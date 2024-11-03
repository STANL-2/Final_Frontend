<template>
    <div class="loading-view">
        <ProgressSpinner />
        <Typography color="darkgray" class="mt-m">데이터를 가져오는 중입니다...</Typography>
    </div>
</template>

<script setup>
import ProgressSpinner from 'primevue/progressspinner';
import Typography from '../Typography.vue';
</script>

<style scoped>
.loading-view {
    margin: 64px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>