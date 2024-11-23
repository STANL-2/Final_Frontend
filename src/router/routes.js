import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        component: () => import('@/layouts/NoneLayout.vue'), // 로그인 레이아웃
        children: [
            {
                path: '',
                component: () => import('@/views/Login.vue') // 로그인 페이지
            }
        ]
    },
    {
        path: '/',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'dashboard',
                component: () => import ('@/views/DashBoard.vue')
            }
        ]
    },
    {
        path: '/center',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'list',
                component: () => import('@/views/center/CenterList.vue')
            }
        ]
    },
    {
        path: '/contract',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'list',
                component: () => import('@/views/contract/ContractList.vue')
            }
        ]
    },
    {
        path: '/customer',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'list',
                component: () => import('@/views/customer/CustomerList.vue')
            }
        ]
    },
    {
        path: '/employee',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'list',
                component: () => import('@/views/employee/EmployeeList.vue')
            }
        ]
    },
    {
        path: '/evaluation',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'list',
                component: () => import('@/views/evaluation/EvaluationList.vue')
            }
        ]
    },
    {
        path: '/notice',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'list',
                component: () => import('@/views/notice/NoticeList.vue')
            }
        ]
    },
    {
        path: '/order',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'list',
                component: () => import('@/views/order/OrderList.vue')
            }
        ]
    },
    {
        path: '/problem',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'list',
                component: () => import('@/views/problem/ProblemList.vue')
            }
        ]
    },
    {
        path: '/product',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'list',
                component: () => import('@/views/product/ProductList.vue')
            }
        ]
    },
    {
        path: '/promotion',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'list',
                component: () => import('@/views/promotion/PromotionList.vue')
            }
        ]
    },
    {
        path: '/purchase-order',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'list',
                component: () => import('@/views/purchase-order/PuchaseOrderList.vue')
            }
        ]
    },
    {
        path: '/sales-history',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'list',
                component: () => import('@/views/sales-history/SalesHistoryList.vue')
            }
        ]
    },
    {
        path: '/schedule',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('@/views/schedule/Schedule.vue')
            }
        ]
    },
    {
        path: '/sample',
        // component: () => import('@/layouts/MainLayout.vue'), // 메인 레이아웃
        children: [
            {
                path: 'searchform',
                component: () => import('@/views/sample/SearchFormTest.vue')
            },
            {
                path: 'tabledata',
                component: () => import('@/views/sample/TableDataTest.vue')
            },
            {
                path: 'tableform',
                component: () => import('@/views/sample/TableFormTest.vue')
            },
            {
                path: 'tableview',
                component: () => import('@/views/sample/TableViewTest.vue')
            },
            {
                path: 'dashboard',
                component: () => import('@/views/sample/DashBoard.vue')
            },
            {
                path: 'ckeditor',
                component: () => import('@/views/sample/CKEditorTest.vue')
            },
            {
                path: 'f12',
                component: () => import('@/views/sample/F12.vue')
            },
            {
                path: 'sample-api',
                component: () => import('@/views/sample/SampleApiTest.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
