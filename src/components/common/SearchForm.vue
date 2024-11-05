<template>
    <div class="search-container">
        <div class="form-row">
            <div class="form-group">
                <div class="label">고객 보딩 여부</div>
                <input type="text" v-model="customerBoarding" class="form-input">
            </div>

            <div class="form-group">
                <div class="label">운전 면허 종류</div>
                <select v-model="driverLicenseType" class="form-select">
                    <option value="선택하세요">선택하세요</option>
                </select>
            </div>

            <div class="form-group">
                <div class="label">택시 자격 번호</div>
                <input type="text" v-model="licenseNumber" class="form-input">
            </div>

            <div class="form-group">
                <div class="label">택시 자격 번호</div>
                <input type="text" v-model="licenseNumber" class="form-input">
            </div>
        </div>

        <Divider />

        <div class="form-row">
            <div class="form-group">
                <div class="label">택시 자격 발급일</div>
                <div class="date-range">
                    <Calendar v-model="icondisplay" showIcon iconDisplay="input" />
                    <span class="date-separator">~</span>
                    <Calendar v-model="icondisplay" showIcon iconDisplay="input" class="small-calendar"/>
                </div>
            </div>

            <div class="form-group">
                <div class="label">면허 유효 시작일</div>
                <div class="search-input">
                    <input type="text" v-model="validFrom" class="form-input">
                    <button class="search-button">
                        <span class="search-icon pi pi-search"></span>
                    </button>
                </div>
            </div>

            <div class="form-group">
                <div class="label">면허 유효 마감일</div>
                <input type="text" v-model="validTo" class="form-input">
            </div>

            <div class="form-group">
                <div class="label">면허 유효 마감일</div>
                <input type="text" v-model="validTo" class="form-input">
            </div>
        </div>

        <Divider />

        <div class="form-row">
            <div class="form-group">
                <div class="label">운전 면허번호</div>
                <input type="text" v-model="licenseNumber" class="form-input">
            </div>

            <div class="form-group">
                <div class="label">운전 면허 발급처</div>
                <input type="text" v-model="licenseIssuer" class="form-input">
            </div>

            <div class="form-group">
                <div class="label">운전 면허 발급일</div>
                <div class="search-input">
                    <input type="text" v-model="licenseDate" class="form-input">
                    <button class="search-button">
                        <span class="search-icon pi pi-search"></span>
                    </button>
                </div>
            </div>

            <div class="form-group">
                <div class="label">면허유효 시작일</div>
                <input type="text" v-model="validFrom" class="form-input">
            </div>
        </div>

        <Divider />

        <div class="form-row">
            <div class="form-group">
                <div class="label">면허 유효 마감일</div>
                <input type="text" v-model="validTo" class="form-input">
            </div>
        
        </div>

        <!-- 나머지 코드 -->
    </div>
</template>

<script setup>
import { ref } from 'vue'

const customerBoarding = ref('')
const driverLicenseType = ref('선택하세요')
const licenseNumber = ref('')
const licenseIssuer = ref('')
const licenseDate = ref('')
const validFrom = ref('')
const validTo = ref('')
const issueDateFrom = ref('')
const issueDateTo = ref('')
</script>

<style scoped>
.search-container {
    border-top: 1.5px solid #EEEEEE;
    border-bottom: 1.5px solid #EEEEEE;
    background-color: #F8F8F8;
    padding: 0 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.form-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin: 10px 0;
}

.form-group {
    display: flex;
    align-items: center;
}

.label {
    min-width: 130px;
    /* 고정된 넓이 */
    font-size: 13px;
    color: #333;
    text-align: left;
    padding-right: 8px;
    /* 레이블과 입력 필드 간격 조정 */
}

.form-input,
.form-select {
    flex: 1;
    /* 입력 필드가 가능한 넓이를 차지 */
    height: 25px;
    border: 1px solid #ddd;
    padding: 0 8px;
    font-size: 13px;
    box-sizing: border-box;
}

.form-select {
    background-color: white;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M2 4l4 4 4-4z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
}

.date-range {
    display: flex;
    align-items: center;
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

/* 포커스 스타일 제거 */
.form-input:focus,
.form-select:focus {
    outline: none;
}

.p-divider {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}

/* Calendar 높이 조정 */
.p-calendar {
    height: 25px !important;
}

.p-calendar .p-inputtext {
    height: 25px !important;
    padding: 0 8px;
    font-size: 13px;
    box-sizing: border-box;
}

.p-calendar .p-datepicker-trigger {
    height: 25px !important;
    display: flex;
    align-items: center;
}

/* 캘린더 팝업 크기 조절 */
.p-datepicker {
    font-size: 12px; /* 텍스트 크기 */
    width: 200px !important; /* 캘린더 팝업 너비 조정 */
}

.p-datepicker-calendar {
    width: 180px !important; /* 캘린더 내부의 날짜 셀 영역 너비 조정 */
}

.p-datepicker .p-datepicker-header {
    font-size: 12px !important; /* 헤더 텍스트 크기 */
}

.p-datepicker .p-datepicker-month, .p-datepicker .p-datepicker-year {
    font-size: 12px !important;
}

.p-datepicker td {
    height: 1.5rem; /* 각 날짜 셀의 높이 조정 */
    width: 1.5rem; /* 각 날짜 셀의 너비 조정 */
    padding: 0.25rem; /* 셀 내부 패딩 조정 */
}

/* 캘린더 아이콘과 입력 필드 크기 조정 */
.small-calendar .p-inputtext {
    height: 25px;
    font-size: 13px;
}

.small-calendar .p-datepicker-trigger {
    height: 25px;
    display: flex;
    align-items: center;
}
</style>
