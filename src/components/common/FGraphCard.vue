<template>
    <div class="chart-container" v-for="(chartData, index) in chartDataList" :key="index">
        <canvas :ref="el => { if (el) chartCanvasRefs[index] = el; }"></canvas>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, defineProps } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
    chartDataList: {
        type: Array,
        required: true,
    },
});

const chartInstances = []; // 차트 인스턴스 배열 (반응형 필요 없음)
const chartCanvasRefs = []; // Canvas 참조 배열 (반응형 필요 없음)

// 차트 생성 또는 업데이트
const updateCharts = () => {
    props.chartDataList.forEach((chartData, index) => {
        const canvas = chartCanvasRefs[index];
        if (!canvas) {
            console.error(`Canvas not found for chart index ${index}`);
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
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: true } },
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

// watch로 데이터 변경 감지
watch(
    () => props.chartDataList,
    (newData) => {
        console.log("chartDataList 변경 감지:", newData);
        if (newData && newData.length > 0) {
            updateCharts();
        }
    },
    { immediate: true, deep: true }
);

onMounted(() => {
    updateCharts();
});

onBeforeUnmount(() => {
    chartInstances.forEach((chart) => chart.destroy());
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
