<template>
    <main>
        <div>
            <BigCard :chart-data="[bigCardChartData, secondChartData, thirdChartData]" />
        </div>
        <div class="small-cards">
            <div class="card">
                <Card>
                    <div class="card1-name">영업실적</div>
                    <div class="gauge-chart-container">
                        <GaugeChart :value="gaugeChartValue" /> <!-- GaugeChart에 value 데이터 전달 -->
                    </div>
                </Card>
            </div>
            <div class="card">
                <Card />
            </div>
            <div class="card">
                <Card />
            </div>
        </div>
    </main>
</template>

<script setup>
import BigCard from '@/components/common/GraghCard.vue';
import Card from '@/components/common/Card.vue';
import GaugeChart from '@/components/common/GaugeChart.vue';

const bigCardChartData = {
    labels: Array.from({ length: 30 }, (_, i) => i + 1), // 1일부터 30일까지
    datasets: [
        {
            label: '영업 실적',
            data: [1400, 1500, 1600, 1800, 2000, 2300, 2400, 2600, 2500, 2400, 2200, 2100, 2000, 2200, 2300, 2200, 1800, 1700, 1600, 1900, 2100, 2200, 2100, 2000, 1900, 1800, 1700, 1600, 1800, 1500],
            borderColor: 'rgba(82, 77, 249, 0.8)',
            backgroundColor: 'rgba(82, 77, 249, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(66, 47, 138, 0.5)',
            pointBorderColor: '#FFFFFF',
            pointRadius: 0,
            borderWidth: 3,
        },
    ],
    gradientColors: ['rgba(82, 77, 249, 0.7)', 'rgba(82, 77, 249, 0.1)', 'rgba(255, 255, 255, 0)'],
};

const secondChartData = {
    labels: Array.from({ length: 30 }, (_, i) => i + 1),
    datasets: [
        {
            label: '판매 내역',
            data: [1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100],
            borderColor: 'rgba(52, 152, 219, 0.8)',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(41, 128, 185, 0.5)',
            pointBorderColor: '#FFFFFF',
            pointRadius: 0,
            borderWidth: 3,
        },
    ],
    gradientColors: ['rgba(52, 152, 219, 0.7)', 'rgba(52, 152, 219, 0.1)', 'rgba(255, 255, 255, 0)'],
};

const thirdChartData = {
    labels: Array.from({ length: 30 }, (_, i) => i + 1),
    datasets: [
        {
            label: '수당',
            data: [50, 60, 55, 70, 80, 75, 85, 90, 95, 100, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205],
            borderColor: 'rgba(46, 204, 113, 0.8)',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(39, 174, 96, 0.5)',
            pointBorderColor: '#FFFFFF',
            pointRadius: 0,
            borderWidth: 3,
        },
    ],
    gradientColors: ['rgba(46, 204, 113, 0.7)', 'rgba(46, 204, 113, 0.1)', 'rgba(255, 255, 255, 0)'],
};

// 1번 차트 그림 value
const gaugeChartValue = 40; // Gauge Chart에 전달할 값
</script>

<style scoped>
.small-cards {
    display: flex;
    flex-direction: row;
}

.card {
    width: 100%;
    padding-top: 15px;
}

.card:not(:last-child) {
    margin-right: 30px;
    /* 카드끼리의 간격 */
}

.card1-name {
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px; /* 제목과 차트 사이의 간격 조절 */
}

.gauge-chart-container {
    display: flex;
    justify-content: center;
    align-items: flex-start; /* 차트를 위쪽에 맞추도록 설정 */
    height: 120px; /* 컨테이너 높이를 적절하게 설정 */
    width: 100%;
}
</style>