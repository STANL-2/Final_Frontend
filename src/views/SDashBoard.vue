<template>
    <div class="dashboard">
        <!-- Top Summary Section -->
        <div class="summary">
            <div class="summary-item">계약서 <span>6건</span></div>
            <div class="summary-item">영수증 <span>7건</span></div>
            <div class="summary-item">현황 <span>10건</span></div>
            <div class="summary-item">문서함 <span>3건</span></div>
        </div>

        <!-- Middle Content Section -->
        <div class="content">
            <div class="content-item text-content">
                <p>문서 내용 표시</p>
            </div>
            <div class="content-item blank-content"></div>
            <div class="content-item grid-content">
                <div class="grid">
                    <div class="grid-item"></div>
                    <div class="grid-item"></div>
                    <div class="grid-item"></div>
                    <div class="grid-item"></div>
                    <div class="grid-item"></div>
                    <div class="grid-item"></div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>PPL 및 메시지 표시</p>
        </div>
    </div>
</template>

<script setup>
import BigCard from '@/components/common/GraghCard.vue';
import Card from '@/components/common/Card.vue';
import GaugeChart from '@/components/common/Chart/GaugeChart.vue';
import CustomerRank from '@/components/common/CustomerRank.vue';
import DashTimeLine from '@/components/common/DashTimeLine.vue';
import NaverNews from '@/components/NaverNews.vue';
import { ref, onMounted } from 'vue';
import { $api } from '@/services/api/api';


const chartData = ref([]);
const loading = ref(false);


const bigCardChartData = ref({
    labels: [],
    datasets: [
        {
            label: '수당',
            data: [],
            yAxisID: 'y',
            borderColor: 'rgba(82, 77, 249, 0.8)',
            backgroundColor: 'rgba(82, 77, 249, 0.3)',
            pointBackgroundColor: 'rgba(82, 77, 249, 1)',
            pointBorderColor: '#FFFFFF',
            pointRadius: 5,
            fill: true,
            tension: 0.4,
            type: 'line', // 라인 차트
        },
    ],
    gradientColors: ['rgba(82, 77, 249, 0.7)', 'rgba(82, 77, 249, 0.1)', 'rgba(255, 255, 255, 0)'],
});

const secondChartData = ref({
    labels: [],
    datasets: [
        {
            label: '실적',
            data: [],
            yAxisID: 'y1',
            borderColor: 'rgba(52, 115, 235, 0.8)', // 선명한 블루
            backgroundColor: 'rgba(52, 115, 235, 0.2)', // 블루 배경색

            type: 'bar', // 바 차트
            barThickness: 15, // 바의 두께
        },
    ],
    gradientColors: [
        'rgba(52, 115, 235, 0.8)', // 상단 진한 블루
        'rgba(52, 115, 235, 0.3)', // 중간 블루
        'rgba(52, 115, 235, 0)',   // 하단 투명
    ],
});

const thirdChartData = ref({
    labels: [],
    datasets: [
        {
            label: '매출액',
            data: [],
            yAxisID: 'y2',
            borderColor: 'rgba(46, 204, 113, 1)',
            backgroundColor: 'rgba(46, 204, 113, 0.6)',
            pointBackgroundColor: 'rgba(46, 204, 113, 1)',
            pointBorderColor: '#FFFFFF',
            pointRadius: 5,
            type: 'line', // 라인 차트
            tension: 0.4,
        },
    ],
    gradientColors: ['rgba(46, 204, 113, 0.7)', 'rgba(46, 204, 113, 0.1)', 'rgba(255, 255, 255, 0)'],
});


// 1번 차트 그림 value
const gaugeChartValue = 40; // Gauge Chart에 전달할 값

// 2번 차트 그림 value
const resources = [
    { id: 'a', title: 'Resource A' },
    { id: 'b', title: 'Resource B' },
    { id: 'c', title: 'Resource C' }
];

const events = [
    { id: '1', resourceId: 'a', start: '2024-11-07T09:00:00', end: '2024-11-05T10:00:00', title: 'Meeting' },
    { id: '2', resourceId: 'b', start: '2024-11-07T12:00:00', end: '2024-11-05T14:00:00', title: 'Lunch Break' },
    { id: '3', resourceId: 'c', start: '2024-11-07T15:00:00', end: '2024-11-05T17:00:00', title: 'Work Session' }
];

// 3번 차트 고객 value
const customers = [
    { name: '기우석' },
    { name: '김민석' },
    { name: '방동호' },
    { name: '송의혁' },
    { name: '유혜진' },
];

const loadData = async () => {
    loading.value = true; // 로딩 시작
    try {

        let currentTime = new Date();
        let startTime = new Date();
        startTime.setFullYear(startTime.getFullYear() - 1);

        const searchParams = ref({
            startDate: startTime.toISOString(),
            endDate: currentTime.toISOString(),
        });

        // API 호출
        const response = await $api.salesHistory.post(
            {
                "startDate": searchParams.value.startDate || '',
                "endDate": searchParams.value.endDate || '',
                "period": 'month',
            }
            ,'statistics/search',

        );

        const result = response?.result; // 응답 데이터 접근

        console.log(response?.result);
        console.log(result.content);        


        if (result && Array.isArray(result.content)) {
            chartData.value = result.content;

            // 데이터 매핑
            bigCardChartData.value = {
                ...bigCardChartData.value,
                labels: chartData.value.map((item) => item.period || ''),
                datasets: [
                    {
                        ...bigCardChartData.value.datasets[0],
                        data: chartData.value.map((item) => item.totalIncentive || 0),
                    },
                ],
            };
            
            secondChartData.value = {
                ...secondChartData.value,
                labels: chartData.value.map((item) => item.period || ''),
                datasets: [
                    {
                        ...secondChartData.value.datasets[0],
                        data: chartData.value.map((item) => item.totalPerformance || 0),
                    },
                ],
            };

            thirdChartData.value = {
                ...thirdChartData.value,
                labels: chartData.value.map((item) => item.period || ''),
                datasets: [
                    {
                        ...thirdChartData.value.datasets[0],
                        data: chartData.value.map((item) => item.totalSales || 0),
                    },
                ],
            };

            console.log("bigCardChartData:", bigCardChartData.value);
            console.log("secondChartData:", secondChartData.value);
            console.log("thirdChartData:", thirdChartData.value);


        } else {
            console.warn("API 응답이 예상한 구조와 다릅니다:", response);
            throw new Error("API 응답 데이터 구조 오류");
        }
    } catch (error) {
        console.error("데이터 로드 실패:", error.message);
        // alert("데이터를 가져오는 데 실패했습니다. 관리자에게 문의하세요.");
    } finally {
        loading.value = false; // 로딩 종료
    }


};

onMounted(() => {
    loadData();
});
</script>

<style scoped>
.dashboard {
    padding: 20px;
    background-color: #f9f9f9;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Summary Section */
.summary {
    display: flex;
    justify-content: space-around;
    background-color: #ffffff;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-item {
    flex: 1;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.summary-item span {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    color: #666;
}

/* Content Section */
.content {
    display: flex;
    gap: 20px;
}

.content-item {
    flex: 1;
    background-color: #ffffff;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.text-content {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #555;
}

.blank-content {
    background-color: #f0f0f0;
}

.grid-content .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.grid-item {
    height: 50px;
    background-color: #e0e0e0;
    border: 1px solid #ccc;
}

/* Footer Section */
.footer {
    text-align: center;
    font-size: 14px;
    color: #777;
    padding: 10px;
}
</style>