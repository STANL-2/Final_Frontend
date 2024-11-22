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
            },
            {
                path: 'scheduleTest',
                component: () => import('@/views/sample/scheduleTest.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
