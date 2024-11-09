<template>
    <div class="search-container">
        <div class="form-row">
            <template v-for="(field, index) in fields" :key="index">
                <div class="form-group">
                    <div class="label">{{ field.label }}</div>

                    <!-- 필드 타입에 따른 조건부 렌더링 -->
                    <template v-if="field.type === 'input'">
                        <input type="text" v-model="formData[`${field.model}_${index}`]"
                            :placeholder="field.placeholder" class="form-input" />
                    </template>

                    <template v-else-if="field.type === 'select'">
                        <select v-model="formData[`${field.model}_${index}`]" class="form-select">
                            <option v-for="(option, idx) in field.options" :key="idx" :value="option">
                                {{ option }}
                            </option>
                        </select>
                    </template>

                    <template v-else-if="field.type === 'calendar'">
                        <Calendar v-model="formData[`${field.model}_${index}`]" :showIcon="field.showIcon"
                            :iconDisplay="field.iconDisplay" :selectionMode="field.selectionMode"
                            :manualInput="field.manualInput" class="small-calendar" />
                    </template>

                    <template v-if="field.type === 'inputWithButton'">
                        <div class="search-input">
                            <input type="text" disabled v-model="formData[`validFrom_${index}`]" :placeholder="field.placeholder"
                                class="form-input" />
                            <button class="search-button" @click="openModal(index)">
                                <span class="search-icon pi pi-search"></span>
                            </button>
                        </div>
                    </template>

                    <template v-else-if="field.type === 'radio'">
                        <div class="radio-group">
                            <label v-for="(option, idx) in field.options" :key="idx" class="radio-label">
                                <input type="radio" :name="`${field.model}_${index}`" :value="option"
                                    v-model="formData[`${field.model}_${index}`]" />
                                {{ option }}
                            </label>
                        </div>
                    </template>

                    <template v-else-if="field.type === 'checkbox'">
                        <div class="checkbox-group">
                            <label v-for="(option, idx) in field.options" :key="idx" class="checkbox-label">
                                <input type="checkbox" :value="option" v-model="formData[`${field.model}_${index}`]" />
                                {{ option }}
                            </label>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, defineExpose, onMounted } from 'vue';
import Calendar from 'primevue/calendar';

const emit = defineEmits(['open-modal']);
const props = defineProps({
    fields: {
        type: Array,
        required: true,
        default: () => []
    }
});

// formData를 ref 객체로 정의
const formData = ref({});

// 컴포넌트 초기화 시 모든 필드 초기화
function initializeFormData() {
    formData.value = {};
    props.fields.forEach((field, index) => {
        if (field.type === 'inputWithButton') {
            formData.value[`validFrom_${index}`] = field.default || '';
        }
    });
}

// 컴포넌트가 로드될 때 formData 초기화
onMounted(() => {
    initializeFormData();
});

// 모달 열기 메서드
function openModal(index) {
    // 모달 열기 전에 해당 인덱스의 필드 초기화
    formData.value[`validFrom_${index}`] = '';
    console.log(`Modal opened for index ${index}, field reset`);
    emit('open-modal', index);
}

// 부모 컴포넌트에서 호출하여 input 필드 값을 업데이트하는 메서드
function updateFieldValue(index, value) {
    console.log(`Updating field at index ${index} with value:`, value);
    formData.value[`validFrom_${index}`] = value;
    console.log('Updated formData:', formData.value);
}

// expose로 부모 컴포넌트에서 접근 가능하도록 설정
defineExpose({
    updateFieldValue
});
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
    min-width: 120px;
    font-size: 13px;
    color: #333;
    text-align: left;
    padding-right: 8px;
    padding-left: 30px;
}

.form-input,
.form-select {
    flex: 1;
    height: 25px;
    border: 1px solid #ddd;
    padding: 0 8px;
    font-size: 13px;
    box-sizing: border-box;
    border-radius: 0px;
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

.radio-group {
    display: flex;
    gap: 10px;
}

.radio-label {
    display: flex;
    align-items: center;
    font-size: 13px;
    cursor: pointer;
}

.radio-label input[type='radio'] {
    margin-right: 5px;
}
</style>
