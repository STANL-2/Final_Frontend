import { ref } from 'vue';

export const EasideMenu = [
    {
        key: '0', label: '계약 관리',
        children: [
            { key: '0-0', label: '계약서', url: '/commingsoon' },
            { key: '0-1', label: '수주서', url: '/commingsoon' },
            { key: '0-2', label: '본인 판매내역', url: '/commingsoon' }
        ]
    },
    {
        key: '1', label: '고객 관리',
        children: [
            { key: '1-0', label: '고객 정보', url: '/customer/list' },
            { key: '1-1', label: '문제사항', url: '/problem/list' }
        ]
    },
    {
        key: '2', label: '일정 관리',
        children: [
            { key: '2-0', label: '일정', url: '/schedule' }
        ]
    },
    {
        key: '3', label: '매장 관리',
        children: [
            { key: '3-0', label: '영업매장', url: '/center/list' },
            { key: '3-1', label: '제품', url: '/product/list' }
        ]
    },
    {
        key: '4', label: '공지 및 프로모션',
        children: [
            { key: '4-0', label: '공지사항', url: '/notice/list' },
            { key: '4-1', label: '프로모션', url: '/promotion/list' }
        ]
    },
    {
        key: '5', label: '사원 관리',
        children: [
            { key: '5-0', label: '사원 정보', url: '/employee/list' },
        ]
    }
];



export const AasideMenu = [
    {
        key: '0', label: '계약 관리',
        children: [
            { key: '0-0', label: '계약서', url: '/contract/Elist' },
            { key: '0-1', label: '수주서', url: '/order/adList' },
            { key: '0-2', label: '발주서', url: '/purchase-order/adlist' },
            { key: '0-3', label: '본인 판매내역', url: '/commingsoon' }
        ]
    },
    {
        key: '1', label: '고객 관리',
        children: [
            { key: '1-0', label: '고객 정보', url: '/customer/list' },
            { key: '1-1', label: '문제사항', url: '/problem/list' }
        ]
    },
    {
        key: '2', label: '일정 관리',
        children: [
            { key: '2-0', label: '일정', url: '/schedule' }
        ]
    },
    {
        key: '3', label: '매장 관리',
        children: [
            { key: '3-0', label: '영업매장', url: '/center/list' },
            { key: '3-1', label: '제품', url: '/product/list' },
            { key: '3-2', label: '판매내역 리스트', url: '/sales-history/list' },
            { key: '3-3', label: '판매내역 통계', url: '/commingsoon' }
        ]
    },
    {
        key: '4', label: '공지 및 프로모션',
        children: [
            { key: '4-0', label: '공지사항', url: '/notice/list' },
            { key: '4-1', label: '프로모션', url: '/promotion/list' }
        ]
    },
    {
        key: '5', label: '사원 관리',
        children: [
            { key: '5-0', label: '사원 정보', url: '/employee/list' },
            { key: '5-1', label: '평가서', url: '/evaluation/list' }
        ]
    }
];


export const DasideMenu = [
    {
        key: '0', label: '계약 관리',
        children: [
            { key: '0-0', label: '계약서', url: '/contract/list' },
            { key: '0-1', label: '수주서', url: '/order/list' },
            { key: '0-2', label: '발주서', url: '/purchase-order/list' },
        ]
    },
    {
        key: '1', label: '고객 관리',
        children: [
            { key: '1-0', label: '고객 정보', url: '/customer/list' },
            { key: '1-1', label: '문제사항', url: '/problem/list' }
        ]
    },
    {
        key: '2', label: '일정 관리',
        children: [
            { key: '2-0', label: '일정', url: '/schedule' }
        ]
    },
    {
        key: '3', label: '매장 관리',
        children: [
            { key: '3-0', label: '영업매장', url: '/center/list' },
            { key: '3-1', label: '제품', url: '/product/list' },
            { key: '3-2', label: '판매내역 리스트', url: '/sales-history/list' },
            { key: '3-3', label: '판매내역 통계', url: '/commingsoon' }
        ]
    },
    {
        key: '4', label: '공지 및 프로모션',
        children: [
            { key: '4-0', label: '공지사항', url: '/notice/Elist' },
            { key: '4-1', label: '프로모션', url: '/promotion/Elist' }
        ]
    },
    {
        key: '5', label: '사원 관리',
        children: [
            { key: '5-0', label: '사원 정보', url: '/employee/list' },
            { key: '5-1', label: '평가서', url: '/evaluation/list' }
        ]
    }
];


export const GasideMenu = [
    {
        key: '0', label: '계약 관리',
        children: [
            { key: '0-0', label: '계약서', url: '/contract/list' },
            { key: '0-1', label: '수주서', url: '/order/list' },
            { key: '0-2', label: '발주서', url: '/purchase-order/list' },
        ]
    },
    {
        key: '1', label: '고객 관리',
        children: [
            { key: '1-0', label: '고객 정보', url: '/customer/list' },
            { key: '1-1', label: '문제사항', url: '/problem/list' }
        ]
    },
    {
        key: '2', label: '일정 관리',
        children: [
            { key: '2-0', label: '일정', url: '/schedule' }
        ]
    },
    {
        key: '3', label: '매장 관리',
        children: [
            { key: '3-0', label: '영업매장', url: '/center/list' },
            { key: '3-1', label: '제품', url: '/product/list' },
            { key: '3-2', label: '판매내역 리스트', url: '/sales-history/list' },
            { key: '3-3', label: '판매내역 통계', url: '/commingsoon' }
        ]
    },
    {
        key: '4', label: '공지 및 프로모션',
        children: [
            { key: '4-0', label: '공지사항', url: '/notice/Elist' },
            { key: '4-1', label: '프로모션', url: '/promotion/Elist' }
        ]
    },
    {
        key: '5', label: '사원 관리',
        children: [
            { key: '5-0', label: '사원 정보', url: '/employee/list' },
            { key: '5-1', label: '평가서', url: '/evaluation/list' }
        ]
    }
];

export const asideMenu = ref([]);


// 권한에 따라 메뉴를 선택하는 함수
export function getMenuByRole(role) {
    switch (role) {
        case 'ADMIN':
            return AasideMenu;
        case 'DIRECTOR':
            return DasideMenu;
        case 'GOD':
            return GasideMenu;
        default:
            return EasideMenu;
    }
}