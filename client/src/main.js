import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import 'animate.css';
import 'virtual:windi.css';

import App from '@/App.vue';
import store from '@/store';
import router from '@/router';

import '@/app.scss';

const app = createApp(App);

app.use(store).use(router);

app.mount('#app');
