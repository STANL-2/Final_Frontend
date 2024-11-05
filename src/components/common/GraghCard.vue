<template>
    <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { Chart, registerables } from 'chart.js';

// Chart.js 모듈 등록
Chart.register(...registerables);

const chartCanvas = ref(null);

// 부모 컴포넌트에서 데이터를 prop으로 받음
const props = defineProps({
    chartData: {
        type: Array,
        required: true
    }
});

onMounted(() => {
    const ctx = chartCanvas.value.getContext('2d');

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
        },
        events: ['click'], // 클릭 이벤트에만 반응하도록 설정
        interaction: {
            mode: 'index',
            intersect: false, // 교차하지 않더라도 가까운 요소에 반응하도록 설정
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#A2A3A5',
                    font: {
                        family: 'Poppins',
                        size: 14,
                    },
                },
            },
            y: {
                grid: {
                    color: '#ECE9F1',
                },
                ticks: {
                    color: '#A2A3A5',
                    font: {
                        family: 'Poppins',
                        size: 14,
                    },
                    stepSize: 400,
                },
            },
        },
        elements: {
            line: {
                borderJoinStyle: 'round',
            },
        },
    };

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: props.chartData[0].labels,
            datasets: props.chartData.flatMap((data, index) => {
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, data.gradientColors[0]);
                gradient.addColorStop(0.3, data.gradientColors[1]);
                gradient.addColorStop(1, data.gradientColors[2]);
                data.datasets[0].backgroundColor = gradient;
                return data.datasets;
            }),
        },
        options: chartOptions,
    });
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