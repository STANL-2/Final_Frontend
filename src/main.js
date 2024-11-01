import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router/routes';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';
import Chart from 'chart.js/auto';
import PrimeVue from 'primevue/config';
import FullCalendar from '@fullcalendar/vue3';
import { AgGridVue } from 'ag-grid-vue3';

import '@/assets/main.css';
import '@/assets/utils.css';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.config.globalProperties.$Chart = Chart;

// use()
app.use(pinia);
app.use(router);
app.use(CkeditorPlugin);
app.use(PrimeVue);
app.component('FullCalendar', FullCalendar);
app.component('AgGridVue', AgGridVue);

app.mount('#app');