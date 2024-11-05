<template>
    <div class="search-container">
        <div class="form-row">
            <!-- 각 필드를 반복하여 렌더링, 필요한 경우 Divider도 포함 -->
            <template v-for="(field, index) in fields" :key="index">
                <div class="form-group">
                    <div class="label">{{ field.label }}</div>

                    <!-- 필드 타입에 따른 조건부 렌더링 -->
                    <template v-if="field.type === 'input'">
                        <input type="text" v-model="formData[field.model]" :placeholder="field.placeholder"
                            class="form-input" />
                    </template>

                    <template v-else-if="field.type === 'select'">
                        <select v-model="formData[field.model]" class="form-select">
                            <option v-for="(option, idx) in field.options" :key="idx" :value="option">{{ option }}
                            </option>
                        </select>
                    </template>

                    <template v-else-if="field.type === 'calendar'">
                        <Calendar v-model="formData[field.model]" :showIcon="field.showIcon"
                            :iconDisplay="field.iconDisplay" :selectionMode="field.selectionMode"
                            :manualInput="field.manualInput" class="small-calendar" />
                    </template>

                    <template v-else-if="field.type === 'inputWithButton'">
                        <div class="search-input">
                            <input type="text" v-model="formData[field.model]" :placeholder="field.placeholder"
                                class="form-input" />
                            <button class="search-button">
                                <span class="search-icon pi pi-search"></span>
                            </button>
                        </div>
                    </template>
                </div>

            </template>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Divider from 'primevue/divider' // Divider 컴포넌트 import
import Calendar from 'primevue/calendar' // Calendar 컴포넌트 import

// Props 정의: 뷰 컴포넌트에서 필드 설정을 전달받음
const props = defineProps({
    fields: {
        type: Array,
        required: true,
        default: () => []
    }
})

// formData 객체에 각 필드의 초기값을 reactive로 설정
const formData = reactive(
    Object.fromEntries(props.fields.map(field => [field.model, field.default || '']))
)
</script>

<style scoped>
*,
*::before,
*::after {
    box-sizing: border-box;
}

html,
body {
    overflow-x: hidden;
}

.search-container {
    max-width: 100%;
    overflow-x: hidden;
    border-top: 1.5px solid #EEEEEE;
    border-bottom: 1.5px solid #EEEEEE;
    background-color: #F8F8F8;
    padding: 0 5px;
}

.form-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* 항상 4열 고정 */
    gap: 1rem;
    margin: 10px 0;
}

.form-group {
    display: flex;
    align-items: center;
    width: 100%;
}

.label {
    min-width: 100px;
    font-size: 13px;
    color: #333;
    text-align: left;
    padding-right: 8px;
}

.form-input,
.form-select {
    flex: 1;
    height: 25px;
    border: 1px solid #ddd;
    padding: 0 8px;
    font-size: 13px;
    box-sizing: border-box;
}

.form-select {
    background-color: white;
    appearance: none;
    background-repeat: no-repeat;
    background-position: right 8px center;
}

.date-range {
    display: flex;
    align-items: center;
    width: 100%;
}

.date-separator {
    margin: 0 5px;
}

.search-input {
    position: relative;
    width: 100%;
}

.search-button {
    position: absolute;
    right: 0;
    top: 0;
    width: 25px;
    height: 25px;
    background: #6360AB;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.search-icon {
    color: white;
    font-size: 14px;
}

.form-input:focus,
.form-select:focus {
    outline: none;
}

.p-divider {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}

.p-calendar .p-inputtext {
    height: 25px !important;
    font-size: 13px;
}

.p-calendar {
    height: 25px !important;
    font-size: 13px;
}

.p-calendar .p-datepicker-trigger,
.small-calendar .p-datepicker-trigger {
    height: 25px;
    display: flex;
    align-items: center;
}

/* 반응형 디자인: 화면이 작을 때는 열 개수를 줄입니다 */
@media (max-width: 1024px) {
    .form-row {
        grid-template-columns: repeat(2, 1fr);
        /* 중간 화면에서는 2열 */
    }
}

@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
        /* 작은 화면에서는 1열 */
    }
}
</style>
