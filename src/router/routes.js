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
                    path: 'tableView',
                    component: () => import('@/views/sample/TableViewTest.vue')
                },
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