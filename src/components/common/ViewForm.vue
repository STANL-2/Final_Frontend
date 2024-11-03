<template>
    <h1>11111</h1>
    <div class="form-container">
        <!-- 상단 Divider -->
        <Divider class="thick-divider" />

        <div v-for="(row, rowIndex) in fields" :key="rowIndex">
            <div class="form-row">
                <div class="form-column" v-for="(field, colIndex) in row" :key="colIndex">
                    <label class="label-box ml-xl" :for="field.name">{{ field.label }}</label>
                    <!-- 필드의 타입에 따라 컴포넌트 렌더링 -->
                    <component
                        :is="getComponentType(field.type)"
                        v-bind="field.props"
                        v-model="formValues[field.name]"
                        :appendTo="'body'" 
                    >
                        <template v-if="field.slotContent" v-slot>
                            <component :is="field.slotContent"></component>
                        </template>
                    </component>
                </div>
            </div>
            <!-- 각 행 아래에 얇은 Divider 추가 -->
            <Divider v-if="rowIndex < fields.length - 1" class="thin-divider" />
        </div>

        <!-- 하단 Divider -->
        <Divider class="thick-divider" />
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';

const props = defineProps({
    fields: {
        type: Array,
        required: true,
        default: () => []
    }
});

const formValues = reactive({});

// 필드 타입에 따라 PrimeVue 컴포넌트를 반환하는 함수
function getComponentType(type) {
    switch (type) {
        case 'input':
            return InputText;
        case 'select':
            return Dropdown;
        case 'checkbox':
            return Checkbox;
        case 'date':
            return Calendar;
        default:
            return InputText; // 기본적으로 InputText 반환
    }
}
</script>

<style scoped>
/* 컨테이너 전체 스타일 */
.form-container {
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
    border-radius: 8px;
    position: relative; /* Dropdown 컨테이너가 상대적 위치 */
    overflow: visible; /* 자식 요소가 잘리지 않도록 */
}

/* 각 행의 레이아웃: 한 줄에 4개의 필드 */
.form-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

/* 각 필드 항목을 정렬 */
.form-column {
    display: flex;
    align-items: center;
}

/* 마지막 열의 오른쪽에 추가 마진 */
.form-column:last-child {
    margin-right: 40px;
}

.label-box {
    white-space: nowrap;
    width: 7.5rem;
    color: #777777;
    margin-right: 2rem;
}

/* Divider 스타일 */
.thick-divider {
    border-top: 2px solid #e0e0e0;
    margin: 0.5rem 0;
}

.thin-divider {
    border-top: 0.5px solid #e0e0e0;
    margin: 0.5rem 0;
}

/* 입력 필드 및 컴포넌트의 전체 너비 설정 */
.p-inputtext,
.p-dropdown,
.p-calendar,
.p-checkbox {
    width: 100%;
}

/* PrimeVue 기본 스타일 커스터마이징 */
.p-inputtext,
.p-dropdown,
.p-calendar .p-inputtext,
.p-checkbox-box {
    height: 30px !important; /* 통일된 높이 */
    font-size: 0.875rem;
    border: 1px solid #cccccc;
    box-sizing: border-box;
}

.p-dropdown, .p-checkbox-box {
    padding: none !important;
}

.p-dropdown .p-dropdown-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Dropdown 패널이 다른 요소 위에 나타나도록 설정 */
.p-dropdown-panel {
    z-index: 1000 !important;
    max-height: 200px; /* 드롭다운 패널의 최대 높이 */
    overflow: auto; /* 드롭다운이 잘리지 않도록 오버플로우 설정 */
}

/* Calendar의 전체 wrapper의 border 제거 */
.p-calendar {
    border: none !important;
    box-shadow: none !important;
}

/* Calendar의 input field border 제거 */
.p-calendar .p-inputtext {
    border: none !important;
    box-shadow: none !important;
    background-color: transparent;
}

/* Checkbox의 높이 줄이기 */
.p-checkbox-box {
    display: flex;
    align-items: center;
    height: 18px !important; /* 체크박스 높이 조정 */
    width: 18px !important; /* 체크박스 너비 조정 */
}

/* label과 checkbox를 나란히 정렬 */
.checkbox-group label {
    margin-left: 4px;
    font-size: 0.5rem;
}
</style>
