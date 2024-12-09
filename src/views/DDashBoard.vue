<template>
    <main class="dashboard">
        <div class="summary-cards">
            <DashBoardCard class="summary-card custom-summary-card">
                <div class="summary-icon-and-title">
                    <div class="summary-icon">📄</div>
                    <div class="summary-title">이번달 계약 건수</div>
                </div>
                <div class="summary-value">{{ contractCount }}건</div>
            </DashBoardCard>
            <DashBoardCard class="summary-card">
                <div class="summary-icon-and-title">
                    <div class="summary-icon">📋</div>
                    <div class="summary-title">이번달 수주 건수</div>
                </div>
                <div class="summary-value">{{ orderReceiptCount }}건</div>
            </DashBoardCard>
            <DashBoardCard class="summary-card">
                <div class="summary-icon-and-title">
                    <div class="summary-icon">📦</div>
                    <div class="summary-title">이번달 발주 건수</div>
                </div>
                <div class="summary-value">{{ purchaseOrderCount }}건</div>
            </DashBoardCard>
            <DashBoardCard class="summary-card">
                <div class="summary-icon-and-title">
                    <div class="summary-icon">💰</div>
                    <div class="summary-title">이번달 판매내역</div>
                </div>
                <div class="summary-value">{{ thisMonthSales }}원</div>
            </DashBoardCard>
        </div>

        <div class="chart-and-customer">
            <div class="chart">
                <BigCard :chart-data="[bigCardChartData, secondChartData, thirdChartData]" />
            </div>

            <!-- 내 고객 정보 -->
            <DashBoardCard>
                <div class="customer-info">
                    <div class="content-title">이번달 판매시원 순위</div>
                    <CustomerRank :customers="customers" />
                </div>
            </DashBoardCard>
        </div>

        <div class="small-cards">
            <div class="announcement-card card">
                <DashBoardCard>
                    <div class="card-content">
                        <div class="content-title">공지사항</div>
                        <ul class="announcement-list">
                            <li v-for="announcement in announcements" :key="announcement.id">
                                {{ announcement.title }}
                            </li>
                        </ul>
                    </div>
                </DashBoardCard>
            </div>
            <div class="news-card">
                <DashBoardCard>
                    <div class="card-content">
                        <div class="content-title">뉴스기사</div>
                        <ul class="news-list">
                            <li v-for="news in newsArticles" :key="news.id">
                                {{ news.title }}
                            </li>
                        </ul>
                    </div>
                </DashBoardCard>
            </div>
        </div>
    </main>
</template>


<script setup>
import BigCard from '@/components/common/GraghCard.vue';
import DashBoardCard from '@/components/common/DashBoardCard.vue';
import CustomerRank from '@/components/common/CustomerRank.vue';
import { ref, onMounted } from 'vue';
import { $api } from '@/services/api/api';

// New reactive references for summary cards
const contractCount = ref(0);
const orderReceiptCount = ref(0);
const purchaseOrderCount = ref(0);
const thisMonthSales = ref(0);
const announcements = ref([]);
const newsArticles = ref([]);
const customers = ref([]);

const chartData = ref([]);
const loading = ref(false);

const fetchDashBoardInfo = async () => {

    try {
        const response = await $api.dashBoard.get(
            'admin',
            ''
        );

        console.log("response", response);

        if (response?.result) {
            const {
                unreadContract,
                unreadOrder,
                unreadPurchaseOrder,
                memberList,
                totalPrice,
                noticeList
            } = response.result;

            contractCount.value = unreadContract || 0;
            orderReceiptCount.value = unreadOrder || 0;
            purchaseOrderCount.value = unreadPurchaseOrder || 0;
            thisMonthSales.value = totalPrice || 0;
            customers.value = Object.values(memberList || {}).map((name, index) => ({
                id: index,
                name: name
            }));

            console.log("customers", customers.value);

            // Handle announcements
            announcements.value = noticeList?.map((notice, index) => ({
                id: index,
                title: notice.title,
                content: notice.content
            })) || [];
        }
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
    }

}

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

const loadData = async () => {
    loading.value = true; // 로딩 시작
    try {

        let currentTime = new Date();
        let startTime = new Date();
        startTime.setFullYear(startTime.getFullYear() - 1);

        console.log("startTime: " + startTime + '\ncurrentTime: ' + currentTime);

        const searchParams = ref({
            startDate: startTime.toISOString(),
            endDate: currentTime.toISOString(),
        });

        const query = {
            startDate: searchParams.value.startDate || '',
            endDate: searchParams.value.endDate || '',
        };

        const queryString = `?${new URLSearchParams(query).toString()}`;
        console.log("API 호출 URL:", queryString); // 디버깅용

        // API 호출
        const response = await $api.salesHistory.getParams('employee/statistics/search/month', queryString);

        const result = response?.result; // 응답 데이터 접근

        if (result && Array.isArray(result)) {
            chartData.value = result;

            // 데이터 매핑
            bigCardChartData.value = {
                ...bigCardChartData.value,
                labels: chartData.value.map((item) => item.month || ''),
                datasets: [
                    {
                        ...bigCardChartData.value.datasets[0],
                        data: chartData.value.map((item) => item.incentive || 0),
                    },
                ],
            };

            secondChartData.value = {
                ...secondChartData.value,
                labels: chartData.value.map((item) => item.month || ''),
                datasets: [
                    {
                        ...secondChartData.value.datasets[0],
                        data: chartData.value.map((item) => item.performance || 0),
                    },
                ],
            };

            thirdChartData.value = {
                ...thirdChartData.value,
                labels: chartData.value.map((item) => item.month || ''),
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
        alert("데이터를 가져오는 데 실패했습니다. 관리자에게 문의하세요.");
    } finally {
        loading.value = false; // 로딩 종료
    }
};

const loadAnnouncements = async () => {
    try {
        const response = await $api.dashboard.getAnnouncements();
        announcements.value = response?.result || [];
    } catch (error) {
        console.error("Announcements load failed:", error);
    }
};

const loadNewsArticles = async () => {
    try {
        const response = await $api.dashboard.getNewsArticles();
        newsArticles.value = response?.result || [];
    } catch (error) {
        console.error("News articles load failed:", error);
    }
};


onMounted(async () => {
    fetchDashBoardInfo();
});

</script>

<style scoped>
.dashboard {
    background-color: #F1F1FD;
    border-radius: 1rem;
    padding: 2.5rem;
    width: 1480px;
}

.summary-cards {
    display: flex;
    gap: 30px;
    margin-bottom: 25px;
}

.summary-card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    width: 50rem;
    height: 10rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}


.summary-icon-and-title {
    display: flex;
    gap: 25px;
    margin-bottom: 0.3rem;
}

.summary-icon {
    font-size: 36px;
}

.summary-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-top: 11px;
}

.content-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    padding-left: 0.5rem;
    padding-top: 0rem;
}

.chart-and-customer {
    display: flex;
    align-items: stretch;
    gap: 30px;
}

.summary-value {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    display: flex;
    justify-content: center;

    height: 80%;
    /* 카드 전체 높이에 맞추기 */
}

.chart {
    width: 71rem;
}

.customer-info {
    width: 328px;
}


.small-cards {
    display: flex;
    gap: 2rem;
    margin-top: 25px;
}

.card-content {
    width: 40.7rem;
    height: 18rem;
}

.announcement-list,
.news-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.announcement-list li,
.news-list li {
    font-size: 14px;
    color: #555555;
    margin-bottom: 5px;
    padding: 5px 10px;
    border-radius: 5px;
    transition: background-color 0.2s ease;
}

.announcement-list li:hover,
.news-list li:hover {
    background-color: #F1F1FD;
    cursor: pointer;
}
</style>