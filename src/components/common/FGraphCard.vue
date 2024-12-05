<template>
    <div class="chart-container" v-for="(chartData, index) in chartDataList" :key="index">
        <canvas :ref="el => { if (el) chartCanvasRefs[index] = el; }"></canvas>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, defineProps, defineExpose } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
    chartDataList: {
        type: Array,
        required: true,
    },
    chartOptions: {
        type: Object,
        default: () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
        }),
    },
});

const chartInstances = []; // 차트 인스턴스 배열 (반응형 필요 없음)
const chartCanvasRefs = []; // Canvas 참조 배열 (반응형 필요 없음)

// 차트 생성 또는 업데이트
const updateCharts = () => {
    props.chartDataList.forEach((chartData, index) => {
        const canvas = chartCanvasRefs[index];
        if (!canvas) {
            console.warn(`Canvas not found for chart index ${index}`);
            return;
        }

        // 차트가 이미 존재하면 업데이트
        if (chartInstances[index]) {
            const chart = chartInstances[index];
            chart.data = chartData;
            chart.update();
        } else {
            // 새로운 차트 생성
            const ctx = canvas.getContext('2d');
            const chartInstance = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    ...props.chartOptions, // 부모 컴포넌트에서 받은 chartOptions 사용
                },
            });
            chartInstances[index] = chartInstance;
        }
    });

    // 필요 없는 차트 제거
    while (chartInstances.length > props.chartDataList.length) {
        const removedChart = chartInstances.pop();
        if (removedChart) removedChart.destroy();
    }
};

const destroyCharts = () => {
    // chartInstances 배열의 모든 차트 인스턴스 제거
    if (chartInstances.length > 0) {
        chartInstances.forEach((chart) => chart.destroy());
        chartInstances.length = 0; // 배열을 비움
    }
    chartCanvasRefs.length = 0;
};

// watch로 데이터 변경 감지
watch(
    () => props.chartDataList,
    (newData) => {
        if (newData && newData.length > 0) {
            updateCharts();
        } else {
            destroyCharts();
        }
    },
    { immediate: true, deep: true }
);

defineExpose({
    destroyCharts,
});

onMounted(() => {
    updateCharts();
});

onBeforeUnmount(() => {
    destroyCharts();
});
</script>

<style scoped>
.chart-container {
    position: relative;
    width: 100%;
    height: 400px;
    background: #FFFFFF;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    padding: 20px;
    overflow: hidden;
}
</style>
