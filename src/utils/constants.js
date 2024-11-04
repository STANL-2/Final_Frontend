export const asideMenu = [
    { key: '0', label: '공지사항', url: '/notice',
        children: [
            { key: '0-0', label: '공지 1', url: '/notice/1' },
            { key: '0-1', label: '고비 2', url: '/notice/2' }
        ]
    },
    { key: '1', label: '샘플', url: '/sample',
        children: [
            { key: '1-0', label: 'SearchForm', url: '/sample/searchform' },
            { key: '1-1', label: 'ViewTable', url: '/sample/tabledata' },
            { key: '1-1', label: 'ViewForm', url: '/sample/tableform' }
        ]
    },
    { key: '2', label: '로그인 페이지로 이동', url: '/login',
        children: [
            { key: '2-0', label: '로그인 페이지로 이동', url: '/login' },
            { key: '2-1', label: '내아 2', url: '/niatchi/2' }
        ]
    }
];
