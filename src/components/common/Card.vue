<template>
    <div class="card-wrapper">
        <Card>
            <template #content>
                <slot />
            </template>
        </Card>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
</script>

<style scoped>
.card-wrapper {
    background: #FFFFFF;
    border-radius: 3px;
}

.p-card {
    height: 250px;
}
</style>