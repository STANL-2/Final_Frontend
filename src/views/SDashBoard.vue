<template>
    <div class="dashboard">
        <h1>시스템 관리자 대시보드</h1>
        <div class="card-container">
            <div v-for="domain in GasideMenu" :key="domain.key" class="card">
                <h2>{{ domain.label }}</h2>
                <div v-for="category in domain.children" :key="category.key" class="category">
                    <h3>{{ category.label }}</h3>
                    <div class="button-group">
                        <button v-for="item in category.children" :key="item.key" class="button"
                            @click="navigateTo(item.url)">
                            {{ item.label }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const GasideMenu = [
    {
        key: '0', label: '영업 사원', // depth1
        children: [
            {
                key: '0-0', label: '계약 관리', // depth2
                children: [
                    { key: '0-0-0', label: '계약서', url: '/contract/emlist' }, // depth3
                    { key: '0-0-1', label: '수주서', url: '/order/emList' },
                    { key: '0-0-2', label: '판매내역 리스트', url: '/sales-history/Elist' },
                    { key: '0-0-3', label: '판매내역 통계', url: '/sales-history/Echart' }
                ]
            },
            {
                key: '0-1', label: '고객 관리',
                children: [
                    { key: '0-1-0', label: '고객 정보', url: '/customer/list' },
                    { key: '0-1-1', label: '문제사항', url: '/problem/list' }
                ]
            },
            {
                key: '0-2', label: '일정 관리',
                children: [
                    { key: '0-2-0', label: '일정', url: '/schedule' }
                ]
            },
            {
                key: '0-3', label: '매장 관리',
                children: [
                    { key: '0-3-0', label: '영업 매장', url: '/center/list' },
                    { key: '0-3-1', label: '제품', url: '/product/list' }
                ]
            },
            {
                key: '0-4', label: '공지 및 프로모션',
                children: [
                    { key: '0-4-0', label: '공지사항', url: '/notice/list' },
                    { key: '0-4-1', label: '프로모션', url: '/promotion/list' }
                ]
            },
            {
                key: '0-5', label: '사원 관리',
                children: [
                    { key: '0-5-0', label: '사원 정보', url: '/employee/list' }
                ]
            }
        ]
    },
    {
        key: '1', label: '영업 관리자',
        children: [
            {
                key: '1-0', label: '계약 관리',
                children: [
                    { key: '1-0-0', label: '계약서', url: '/contract/Elist' },
                    { key: '1-0-1', label: '수주서', url: '/order/adList' },
                    { key: '1-0-2', label: '발주서', url: '/purchase-order/adlist' },
                    { key: '1-0-3', label: '판매내역 리스트', url: '/sales-history/Elist' },
                    { key: '1-0-4', label: '판매내역 통계', url: '/sales-history/Echart' }
                ]
            },
            {
                key: '1-1', label: '고객 관리',
                children: [
                    { key: '1-1-0', label: '고객 정보', url: '/customer/list' },
                    { key: '1-1-1', label: '문제사항', url: '/problem/list' }
                ]
            },
            {
                key: '1-2', label: '일정 관리',
                children: [
                    { key: '1-2-0', label: '일정', url: '/schedule' }
                ]
            },
            {
                key: '1-3', label: '매장 관리',
                children: [
                    { key: '1-3-0', label: '영업 매장', url: '/center/list' },
                    { key: '1-3-1', label: '제품', url: '/product/list' },
                    { key: '1-3-2', label: '판매내역 리스트', url: '/sales-history/list' },
                    { key: '1-3-3', label: '판매내역 통계', url: '/sales-history/chart' }
                ]
            },
            {
                key: '1-4', label: '공지 및 프로모션',
                children: [
                    { key: '1-4-0', label: '공지사항', url: '/notice/list' },
                    { key: '1-4-1', label: '프로모션', url: '/promotion/list' }
                ]
            },
            {
                key: '1-5', label: '사원 관리',
                children: [
                    { key: '1-5-0', label: '사원 정보', url: '/employee/list' }
                ]
            }
        ]
    },
    {
        key: '2', label: '영업 담당자',
        children: [
            {
                key: '2-0', label: '계약 관리',
                children: [
                    { key: '2-0-0', label: '계약서', url: '/contract/dlist' },
                    { key: '2-0-1', label: '수주서', url: '/order/dlist' },
                    { key: '2-0-2', label: '발주서', url: '/purchase-order/ddlist' }
                ]
            },
            {
                key: '2-1', label: '고객 관리',
                children: [
                    { key: '2-1-0', label: '고객 정보', url: '/customer/list' },
                    { key: '2-1-1', label: '문제사항', url: '/problem/list' }
                ]
            },
            {
                key: '2-2', label: '일정 관리',
                children: [
                    { key: '2-2-0', label: '일정', url: '/schedule' }
                ]
            },
            {
                key: '2-3', label: '매장 관리',
                children: [
                    { key: '2-3-0', label: '영업 매장', url: '/center/list' },
                    { key: '2-3-1', label: '제품', url: '/product/list' },
                    { key: '2-3-2', label: '판매내역 리스트', url: '/sales-history/list' },
                    { key: '2-3-3', label: '판매내역 통계', url: '/sales-history/chart' }
                ]
            },
            {
                key: '2-4', label: '공지 및 프로모션',
                children: [
                    { key: '2-4-0', label: '공지사항', url: '/notice/Elist' },
                    { key: '2-4-1', label: '프로모션', url: '/promotion/Elist' }
                ]
            },
            {
                key: '2-5', label: '사원 관리',
                children: [
                    { key: '2-5-0', label: '사원 정보', url: '/employee/list' }
                ]
            }
        ]
    },
    {
        key: 3, label: '개발자 도구',
        children: [
            {
                key: '3-0', label: '로그',
                children: [
                    { key: '3-0-0', label: '로그', url: '/log' }
                ]
            },
            {
                key: '3-1', label: '자동 쿼리 생성기',
                children: [
                    { key: '3-1-0', label: '고객 정보', url: '/sample/f12' }
                ]
            },
            {
                key: '3-2', label: '샘플',
                children: [
                    { key: '3-2-0', label: 'CKEditorTest', url: '/sample/ckeditor' },
                    { key: '3-2-1', label: 'Confort', url: '/sample' },
                    { key: '3-2-2', label: 'DashBoard', url: '/sample/dashboard' },
                    { key: '3-2-3', label: 'Sample', url: '/sample' },
                    { key: '3-2-4', label: 'SampleApiTest', url: '/sample/sample-api' },
                    { key: '3-2-5', label: 'SearchFormTest', url: '/sample/searchform' },
                    { key: '3-2-6', label: 'TableDataTest', url: '/sample/tabledata' },
                    { key: '3-2-7', label: 'TableFormTest', url: '/sample/tableform' },
                    { key: '3-2-8', label: 'TableViewTest', url: '/sample/tableview' }
                ]
            }
        ]
    }
];

// 네비게이션 함수
const navigateTo = (url) => {
    if (url) {
        // 예: Vue Router 사용 시
        window.location.href = url;
    }
};
</script>

<style scoped>
.dashboard {
    padding: 12px;
    font-family: Arial, sans-serif;
}

h1 {
    text-align: center;
    margin-bottom: 30px;
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 50px;
    justify-content: center;
}

.card {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 300px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card h2 {
    font-size: 20px;
    margin-bottom: 15px;
    color: #333;
}

.category h3 {
    font-size: 16px;
    margin: 10px 0;
    color: #555;
}

.button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.button {
    background-color: #6360AB;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
}

.button:hover {
    background-color: #4542ab;
}
</style>