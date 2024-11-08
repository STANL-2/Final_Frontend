import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router/routes';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Chart from 'chart.js/auto';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Tree from 'primevue/tree';
import FullCalendar from '@fullcalendar/vue3';
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';
import SummernoteEditor from 'vue3-summernote-editor';

// jQuery 및 Bootstrap 추가
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// PrimeVue 및 기타 컴포넌트 설정
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Divider from 'primevue/divider';
import ProgressSpinner from 'primevue/progressspinner';
import ConfirmDialog from 'primevue/confirmdialog';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import '@/assets/main.css';
import '@/assets/utils.css';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.config.globalProperties.$Chart = Chart;

app.use(pinia);
app.use(router);
app.use(CkeditorPlugin);
app.use(PrimeVue);
app.component('Button', Button);
app.component('Card', Card);
app.component('Tree', Tree);
app.component('FullCalendar', FullCalendar);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('InputText', InputText);
app.component('Calendar', Calendar);
app.component('Checkbox', Checkbox);
app.component('Dropdown', Dropdown);
app.component('InputGroup', InputGroup);
app.component('InputGroupAddon', InputGroupAddon);
app.component('Divider', Divider);
app.component('ProgressSpinner', ProgressSpinner);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Dialog', Dialog);
app.component('SummernoteEditor', SummernoteEditor);

app.mount('#app');
