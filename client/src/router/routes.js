import { useChatStore } from '@/store/chat';

export default [
    {
        path: '',
        name: 'index',
        component: () => import('@/pages/ChatPage.vue'),
        beforeEnter: (to, from, next) => {
            if (!useChatStore().isLoggedIn) {
                return next({ name: 'login' });
            }

            next();
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue'),
        beforeEnter: (to, from, next) => {
            if (useChatStore().isLoggedIn) {
                return next({ name: 'index' });
            }

            next();
        },
    },
];
