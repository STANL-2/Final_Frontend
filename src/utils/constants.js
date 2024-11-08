export const asideMenu = [
    { key: '0', label: '고객 관리', url: '/customer',
        children: [
            { key: '0-0', label: '고객정보 조회', url: '/customer/list' },
            { key: '0-1', label: '고객정보 등록', url: '/customer/register' },
            { key: '0-2', label: '고객정보 수정', url: '/customer/edit' },
            { key: '0-3', label: '고객정보 상세보기', url: '/customer/detail' }
        ]
    },
    { key: '1', label: '영업매장 관리', url: '/store',
        children: [
            { key: '1-0', label: '영업매장 조회', url: '/store/list' },
            { key: '1-1', label: '영업매장 등록', url: '/store/register' },
            { key: '1-2', label: '영업매장 수정', url: '/store/edit' },
            { key: '1-3', label: '영업매장 상세보기', url: '/store/detail' }
        ]
    },
    { key: '2', label: '영업통계', url: '/sales/statistics' },
    { key: '3', label: '서류 관리', url: '/document',
        children: [
            { key: '3-0', label: '전체 조회', url: '/document/list' },
            { key: '3-1', label: '내 계약서 관리', url: '/document/my-contract' },
            { key: '3-2', label: '매장 별 계약서 관리', url: '/document/store-contract' }
        ]
    },
    { key: '4', label: '일정표', url: '/calendar' },
    { key: '5', label: '제품', url: '/product',
        children: [
            { key: '5-0', label: '제품 조회', url: '/product/list' },
            { key: '5-1', label: '제품 상세보기', url: '/product/detail' }
        ]
    },
    { key: '6', label: '프로모션', url: '/promotion',
        children: [
            { key: '6-0', label: '프로모션 조회', url: '/promotion/list' },
            { key: '6-1', label: '프로모션 등록', url: '/promotion/register' },
            { key: '6-2', label: '프로모션 수정', url: '/promotion/edit' },
            { key: '6-3', label: '프로모션 상세보기', url: '/promotion/detail' }
        ]
    },
    { key: '7', label: '문제사항', url: '/issue',
        children: [
            { key: '7-0', label: '문제사항 조회', url: '/issue/list' },
            { key: '7-1', label: '문제사항 등록', url: '/issue/register' },
            { key: '7-2', label: '문제사항 수정', url: '/issue/edit' },
            { key: '7-3', label: '문제사항 상세보기', url: '/issue/detail' }
        ]
    },
    { key: '8', label: '공지사항', url: '/notice',
        children: [
            { key: '8-0', label: '공지사항 조회', url: '/notice/list' },
            { key: '8-1', label: '공지사항 등록', url: '/notice/register' },
            { key: '8-2', label: '공지사항 수정', url: '/notice/edit' },
            { key: '8-3', label: '공지사항 상세보기', url: '/notice/detail' }
        ]
    },
    { key: '9', label: '샘플', url: '/sample',
        children: [
            { key: '9-0', label: 'SearchForm', url: '/sample/searchform' },
            { key: '9-1', label: 'ListTable', url: '/sample/tabledata' },
            { key: '9-2', label: 'ViewForm', url: '/sample/tableform' },
            { key: '9-3', label: 'ViewTable', url: '/sample/tableview' },
            { key: '9-4', label: 'DashBoard', url: '/sample/dashboard' },
            { key: '9-5', label: 'Login', url: '/login'},
            { key: '9-6', label: 'CKEditor', url: '/sample/ckeditor'},
            { key: '9-7', label: 'ToastUIEditor', url: '/sample/toastui'}
        ]
    }
];
