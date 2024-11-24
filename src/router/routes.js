import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import useToastMessage from '@/hooks/useToastMessage';

const routes = [
    {
        path: '/',
        children: [
            {
                path: '',
                component: () => import('@/views/Login.vue'),   // 로그인 페이지
                meta: { requiresAuth: false }                   // 로그인은 인증 불필요
            }
        ]
    },
    {
        path: '/',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'dashboard',
                component: () => import ('@/views/DashBoard.vue'),
                meta: { requiresAuth: true }
            }
        ]
    },
    {
        path: '/center',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: 'list',
                component: () => import('@/views/center/CenterList.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/center/CenterDetail.vue')
            },
            {
                path: 'Elist',
                component: () => import('@/views/center/edit/ECenterList.vue')
            },
            {
                path: 'Edetail',
                component: () => import('@/views/center/edit/ECenterDetail.vue')
            },
            {
                path: 'modify',
                component: () => import('@/views/center/edit/ECenterModify.vue')
            },
            {
                path: 'register',
                component: () => import('@/views/center/edit/ECenterRegister.vue')
            },
        ]
    },
    {
        path: '/contract',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: 'list',
                component: () => import('@/views/contract/ContractList.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/contract/ContractDetail.vue')
            },
            {
                path: 'Elist',
                component: () => import('@/views/contract/edit/EContractList.vue')
            },
            {
                path: 'Edetail',
                component: () => import('@/views/contract/edit/EContractDetail.vue')
            },
            {
                path: 'modify',
                component: () => import('@/views/contract/edit/EContractModify.vue')
            },
            {
                path: 'register',
                component: () => import('@/views/contract/edit/EContractRegister.vue')
            }
        ]
    },
    {
        path: '/customer',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: 'list',
                component: () => import('@/views/customer/CustomerList.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/customer/CustomerDetail.vue')
            },
            {
                path: 'modify',
                component: () => import('@/views/customer/CustomerModify.vue')
            },
            {
                path: 'register',
                component: () => import('@/views/customer/CustomerRegister.vue')
            }
        ]
    },
    {
        path: '/employee',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: 'list',
                component: () => import('@/views/employee/EmployeeList.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/employee/EmployeeDetail.vue')
            }
        ]
    },
    {
        path: '/evaluation',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: 'list',
                component: () => import('@/views/evaluation/EvaluationList.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/evaluation/EvaluationDetail.vue')
            },
            {
                path: 'modify',
                component: () => import('@/views/evaluation/EvaluationModify.vue')
            },
            {
                path: 'register',
                component: () => import('@/views/evaluation/EvaluationRegister.vue')
            }
        ]
    },
    {
        path: '/notice',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: 'list',
                component: () => import('@/views/notice/NoticeList.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/notice/NoticeDetail.vue')
            },
            {
                path: 'Elist',
                component: () => import('@/views/notice/edit/ENoticeList.vue')
            },
            {
                path: 'Edetail',
                component: () => import('@/views/notice/edit/ENoticeDetail.vue')
            },
            {
                path: 'modify',
                component: () => import('@/views/notice/edit/ENoticeModify.vue')
            },
            {
                path: 'register',
                component: () => import('@/views/notice/edit/ENoticeRegister.vue')
            }
        ]
    },
    {
        path: '/order',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: 'list',
                component: () => import('@/views/order/OrderList.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/order/OrderDetail.vue')
            },
            {
                path: 'modify',
                component: () => import('@/views/order/OrderModify.vue')
            },
            {
                path: 'register',
                component: () => import('@/views/order/OrderRegister.vue')
            }
        ]
    },
    {
        path: '/problem',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: 'list',
                component: () => import('@/views/problem/ProblemList.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/problem/ProblemDetail.vue')
            },
            {
                path: 'modify',
                component: () => import('@/views/problem/ProblemModify.vue')
            },
            {
                path: 'register',
                component: () => import('@/views/problem/ProblemRegister.vue')
            }
        ]
    },
    {
        path: '/product',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: 'list',
                component: () => import('@/views/product/ProductList.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/product/ProductDetail.vue')
            }
        ]
    },
    {
        path: '/promotion',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: 'list',
                component: () => import('@/views/promotion/PromotionList.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/promotion/PromotionDetail.vue')
            },
            {
                path: 'Elist',
                component: () => import('@/views/promotion/edit/EPromotionList.vue')
            },
            {
                path: 'Edetail',
                component: () => import('@/views/promotion/edit/EPromotionDetail.vue')
            },
            {
                path: 'modify',
                component: () => import('@/views/promotion/edit/EPromotionModify.vue')
            },
            {
                path: 'register',
                component: () => import('@/views/promotion/edit/EPromotionRegister.vue')
            }
        ]
    },
    {
        path: '/purchase-order',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: 'list',
                component: () => import('@/views/purchase-order/PuchaseOrderList.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/purchase-order/PuchaseOrderDetail.vue')
            },
            {
                path: 'modify',
                component: () => import('@/views/purchase-order/PuchaseOrderModify.vue')
            },
            {
                path: 'register',
                component: () => import('@/views/purchase-order/PuchaseOrderRegister.vue')
            }
        ]
    },
    {
        path: '/sales-history',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: 'list',
                component: () => import('@/views/sales-history/SalesHistoryList.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/sales-history/SalesHistoryDetail.vue')
            }
        ]
    },
    {
        path: '/schedule',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
        children: [
            {
                path: '',
                component: () => import('@/views/schedule/Schedule.vue')
            },
            {
                path: 'detail',
                component: () => import('@/views/schedule/ScheduleDetail.vue')
            },
            {
                path: 'modify',
                component: () => import('@/views/schedule/ScheduleModify.vue')
            },
            {
                path: 'register',
                component: () => import('@/views/schedule/ScheduleRegister.vue')
            }
        ]
    },
    {
        path: '/sample',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true, auth: 'GOD' },
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
            },
            {
                path: '',
                component: () => import('@/views/sample/Confort.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 통합 네비게이션 가드 설정
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const { isLoggined, auth } = userStore;
    const { showError } = useToastMessage();


    if (to.meta.requiresAuth) {
        if (!isLoggined) {
            showError('접근 차단', '로그인이 필요합니다.');
            return next('/'); // 로그인 페이지로 이동
        }

        if (to.meta.auth && to.meta.auth !== auth) {
            showError('접근 차단', `해당 페이지는 ${to.meta.auth} 권한이 필요합니다.`);
            return next(from.fullPath || '/'); // 이전 페이지로 이동 또는 기본 경로
        }
    }

    next(); // 정상 접근 허용
});

export default router;
