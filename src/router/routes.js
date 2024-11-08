import { useUserStore } from '@/stores/user';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/sample',
            component: () => import('@/views/sample/Sample.vue'),
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
                    path: 'toastui',
                    component: () => import('@/views/sample/ToastUIEditortest.vue')
                }
            ]
        },
        {
            path: '/',
            component: () => import('@/views/HomeView.vue'),
        },
        {
            path: '/login',
            component: () => import('@/views/Login.vue'),
        },
        {
            path: '/test',
            component: () => import('@/views/sample/TableFormTest.vue')
        }
    ],
});

export default router;