export const asideMenu = [
    { 
        key: '0', label: '고객 관리', url: '/sample',
        children: [
            { key: '0-0', label: '고객정보', url: '/customer/list' },
            { key: '0-1', label: '문제사항', url: '/problem/list' }
        ]
    },
    { 
        key: '1', label: '사원 관리', url: '/sample',
        children: [
            { key: '1-0', label: '사원 정보', url: '/employee/list' },
            { key: '1-1', label: '판매내역', url: '/sales-history/list' },
            { key: '1-2', label: '평가서', url: '/evaluation/list' }
        ]
    },
    { 
        key: '2', label: '계약서 및 수주 관리', url: '/sample',
        children: [
            { key: '2-0', label: '계약서', url: '/contract/list' },
            { key: '2-1', label: '수주서', url: '/order/list' },
            { key: '2-2', label: '계약 진행현황', url: '/contract/progress' }
        ]
    },
    { 
        key: '3', label: '매장 관리', url: '/sample',
        children: [
            { key: '3-0', label: '영업매장', url: '/center/list' },
            { key: '3-1', label: '제품', url: '/product/list' },
            { key: '3-2', label: '발주서', url: '/purchase-order/list' },
            { key: '3-3', label: '판매내역', url: '/sales-history/list' }
        ]
    },
    { 
        key: '4', label: '공지 및 프로모션', url: '/sample',
        children: [
            { key: '4-0', label: '공지사항', url: '/notice/list' },
            { key: '4-1', label: '프로모션', url: '/promotion/list' }
        ]
    },
    { 
        key: '5', label: '일정 관리', url: '/sample',
        children: [
            { key: '5-0', label: '일정', url: '/schedule' },           
        ]
    }
];
