export const asideMenu = [
    { 
        key: '0', label: '고객 관리',
        children: [
            { key: '0-0', label: '고객정보', url: '/customer/list' },
            { key: '0-1', label: '문제사항', url: '/problem/list' },

            // 아래는 개발을 위한 페이지 바로가기
            // 고객정보 CRUD
            { key: '0-2', label: '고객정보 상세조회', url: '/customer/detail' },
            { key: '0-3', label: '고객정보 등록', url: '/customer/register' },
            { key: '0-4', label: '고객정보 수정', url: '/customer/modify' },
            { key: '0-5', label: '고객정보 삭제', url: '/customer/delete' },

            // 문제사항 CRUD
            { key: '0-6', label: '문제사항 상세조회', url: '/problem/detail' },
            { key: '0-7', label: '문제사항 등록', url: '/problem/register' },
            { key: '0-8', label: '문제사항 수정', url: '/problem/modify' },
            { key: '0-9', label: '문제사항 삭제', url: '/problem/delete' }
        ]
    },
    { 
        key: '1', label: '사원 관리',
        children: [
            { key: '1-0', label: '사원 정보', url: '/member/list' },
            { key: '1-1', label: '판매내역', url: '/salesHistory/list' },
            { key: '1-2', label: '평가서', url: '/evaluation/list' },

            // 아래는 개발을 위한 페이지 바로가기
            // 사원정보 CRUD
            { key: '1-3', label: '사원 상세조회', url: '/member/detail' },
            { key: '1-4', label: '사원 등록', url: '/member/register' },
            { key: '1-5', label: '사원 수정', url: '/member/modify' },
            { key: '1-6', label: '사원 삭제', url: '/member/delete' },

            // 판매내역 CRUD
            { key: '1-7', label: '사원 판매내역 상세조회', url: '/salesHistory/detail' },
            { key: '1-8', label: '사원 판매내역 등록', url: '/salesHistory/register' },
            { key: '1-9', label: '사원 판매내역 수정', url: '/salesHistory/modify' },
            { key: '1-10', label: '사원 판매내역 삭제', url: '/salesHistory/delete' },

            // 평가서 CRUD
            { key: '1-11', label: '평가서 상세조회', url: '/evaluation/detail' },
            { key: '1-12', label: '평가서 등록', url: '/evaluation/register' },
            { key: '1-13', label: '평가서 수정', url: '/evaluation/modify' },
            { key: '1-14', label: '평가서 삭제', url: '/evaluation/delete' }
        ]
    },
    { 
        key: '2', label: '계약서 및 수주 관리',
        children: [
            { key: '2-0', label: '계약서', url: '/contract/list' },
            { key: '2-1', label: '수주서', url: '/order/list' },

            // 아래는 개발을 위한 페이지 바로가기
            // 계약서 CRUD
            { key: '2-2', label: '계약서 상세조회', url: '/contract/detail' },
            { key: '2-3', label: '계약서 등록', url: '/contract/register' },
            { key: '2-4', label: '계약서 수정', url: '/contract/modify' },
            { key: '2-5', label: '계약서 삭제', url: '/contract/delete' },

            // 수주서 CRUD
            { key: '2-6', label: '수주서 상세조회', url: '/order/detail' },
            { key: '2-7', label: '수주서 등록', url: '/order/register' },
            { key: '2-8', label: '수주서 수정', url: '/order/modify' },
            { key: '2-9', label: '수주서 삭제', url: '/order/delete' }
        ]
    },
    { 
        key: '3', label: '매장 관리',
        children: [
            { key: '3-0', label: '영업매장', url: '/center/list' },
            { key: '3-1', label: '제품', url: '/product/list' },
            { key: '3-2', label: '발주서', url: '/purchase-order/list' },
            { key: '3-3', label: '판매내역', url: '/salesHistory/list' },

            // 아래는 개발을 위한 페이지 바로가기
            // 영업매장 CRUD
            { key: '3-4', label: '영업매장 상세조회', url: '/center/detail' },
            { key: '3-5', label: '영업매장 등록', url: '/center/register' },
            { key: '3-6', label: '영업매장 수정', url: '/center/modify' },
            { key: '3-7', label: '영업매장 삭제', url: '/center/delete' },

            // 제품 CRUD
            { key: '3-8', label: '제품 상세조회', url: '/product/detail' },
            { key: '3-9', label: '제품 등록', url: '/product/register' },
            { key: '3-10', label: '제품 수정', url: '/product/modify' },
            { key: '3-11', label: '제품 삭제', url: '/product/delete' },

            // 발주서 CRUD
            { key: '3-12', label: '발주서 상세조회', url: '/purchase-order/detail' },
            { key: '3-13', label: '발주서 등록', url: '/purchase-order/register' },
            { key: '3-14', label: '발주서 수정', url: '/purchase-order/modify' },
            { key: '3-15', label: '발주서 삭제', url: '/purchase-order/delete' },

            // 판매내역 CRUD
            { key: '3-16', label: '판매내역 상세조회', url: '/salesHistory/detail' },
            { key: '3-17', label: '판매내역 등록', url: '/salesHistory/register' },
            { key: '3-18', label: '판매내역 수정', url: '/salesHistory/modify' },
            { key: '3-19', label: '판매내역 삭제', url: '/salesHistory/delete' }
        ]
    },
    { 
        key: '4', label: '공지 및 프로모션',
        children: [
            { key: '4-0', label: '공지사항', url: '/notice/list' },
            { key: '4-1', label: '프로모션', url: '/promotion/list' },

            // 아래는 개발을 위한 페이지 바로가기
            // 공지사항 CRUD
            { key: '4-2', label: '공지사항 상세조회', url: '/notice/detail' },
            { key: '4-3', label: '공지사항 등록', url: '/notice/register' },
            { key: '4-4', label: '공지사항 수정', url: '/notice/modify' },
            { key: '4-5', label: '공지사항 삭제', url: '/notice/delete' },

            // 프로모션 CRUD
            { key: '4-6', label: '프로모션 상세조회', url: '/promotion/detail' },
            { key: '4-7', label: '프로모션 등록', url: '/promotion/register' },
            { key: '4-8', label: '프로모션 수정', url: '/promotion/modify' },
            { key: '4-9', label: '프로모션 삭제', url: '/promotion/delete' }
        ]
    },
    { 
        key: '5', label: '일정 관리',
        children: [
            { key: '5-0', label: '일정', url: '/schedule' },            
        ]
    },
    {
        key: '6', label: '샘플',
        children: [
            { key: '6-0', label: 'SearchForm', url: '/sample/searchform' },
            { key: '6-1', label: 'ListTable', url: '/sample/tabledata' },
            { key: '6-2', label: 'ViewForm', url: '/sample/tableform' },
            { key: '6-3', label: 'ViewTable', url: '/sample/tableview' },
            { key: '6-4', label: 'DashBoard', url: '/sample/dashboard' },
            { key: '6-5', label: 'Login', url: '/'},
            { key: '6-6', label: 'CKEditor', url: '/sample/ckeditor'},
            { key: '6-7', label: '개발자도구', url: '/sample/f12'},
            { key: '6-8', label: '샘플 Api', url: '/sample/sample-api'}
        ]
    }
];
