<template>
    <main class="dashboard">
        <div>
            <BigCard :chart-data="[bigCardChartData, secondChartData, thirdChartData]" />
        </div>
        <div class="small-cards">
            <div class="sell-card card">
                <Card>
                    <div class="card-content">
                        <div class="card-name">영업실적</div>
                        <div class="gauge-chart-container">
                            <GaugeChart :value="gaugeChartValue" /> <!-- GaugeChart에 value 데이터 전달 -->
                        </div>
                    </div>
                </Card>
            </div>
            <div class="plan-card card">
                <Card>
                    <div class="card-content">
                        <div class="card-name">일정표</div>
                        <DashTimeLine :resources="resources" :events="events" />
                    </div>
                </Card>
            </div>
            <div class="customer-card card">
                <Card>
                    <div class="card-content">
                        <div class="card-name">나의 고객</div>
                        <div class="customer-rank">
                            <CustomerRank :customers="customers" /> <!-- CustomerRank 컴포넌트에 고객 데이터를 props로 전달 -->
                        </div>
                    </div>
                </Card>
            </div>
        </div>

        <div class="card-news card">
                <Card>
                    <div class="card-content">
                        <div class="card-name">자동차 기사</div>
                        <div class="news-list">
                            <NaverNews/> 
                        </div>
                    </div>
                </Card>
            </div>
    </main>
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
    background-color: #F1F1FD;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px; /* 섹션 간의 간격 추가 */
}

.small-cards {
    display: flex;
    flex-wrap: wrap; /* 작은 화면에서 줄바꿈을 허용 */
    gap: 20px; /* 카드 사이의 간격 */
}

.card {
    flex: 1;
    min-width: 280px; /* 카드의 최소 너비 설정 */
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card:not(:last-child) {
    margin-right: 0; /* 기본 마진을 제거하고 gap으로 간격 설정 */
}

.card-name {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
    color: #333;
}

.gauge-chart-container,
.customer-rank,
.news-list {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 120px;
    width: 100%;
}

.sell-card {
    flex: 2;
    min-width: 300px; /* 최소 너비를 설정해 카드 크기를 조정 */
}

.plan-card {
    flex: 3;
    min-width: 300px;
}

.customer-card {
    flex: 1;
    min-width: 250px;
}

.card-news {
    flex: 2;
    min-width: 300px;
}

/* 카드 내용 스타일 */
.card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

/* 뉴스 목록 스타일링 */
.news-list {
    width: 100%;
    max-height: 200px; /* 뉴스 목록 최대 높이 설정 */
    overflow-y: auto; /* 스크롤을 허용하여 많은 뉴스가 있는 경우 대응 */
}

.news-list::-webkit-scrollbar {
    width: 8px;
}

.news-list::-webkit-scrollbar-thumb {
    background-color: #cccccc;
    border-radius: 4px;
}
</style>