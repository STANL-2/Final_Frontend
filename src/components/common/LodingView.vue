<template>
    <div class="loading-view">
        <ProgressSpinner />
        <span class="mt-s">데이터를 가져오는 중입니다...</span>
    </div>
</template>

<script setup>
import ProgressSpinner from 'primevue/progressspinner';
</script>

<style scoped>
.loading-view {
    margin: 64px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>