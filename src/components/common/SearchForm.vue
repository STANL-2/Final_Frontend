<template>
    <div class="form-container">
        <div class="form-item">
            <label for="employmentInsurance">고용 보험 여부</label>
            <InputText id="employmentInsurance" placeholder="입력하세요" />
        </div>
        <div class="form-item">
            <label for="licenseType">운전 면허 종류</label>
            <Dropdown id="licenseType" :options="licenseTypes" placeholder="선택하세요" />
        </div>
        <div class="form-item">
            <label>택시 임시 자격 여부</label>
            <div class="checkbox-group">
                <Checkbox inputId="regular" value="정규 면허" v-model="selectedLicenseType" />
                <label for="regular">정규 면허</label>
                <Checkbox inputId="temporary" value="임시 면허" v-model="selectedLicenseType" />
                <label for="temporary">임시 면허</label>
            </div>
        </div>
        <div class="form-item">
            <label for="taxiNumber">택시 자격 번호</label>
            <InputText id="taxiNumber" placeholder="입력하세요" />
        </div>

        <div class="form-item">
            <label for="issueDate">택시 자격 발급일</label>
            <Calendar id="issueDate" placeholder="날짜 선택" />
        </div>
        <div class="form-item">
            <label>택시 자격 발급 여부</label>
            <div class="checkbox-group">
                <Checkbox inputId="issued" value="지급" v-model="selectedIssueStatus" />
                <label for="issued">지급</label>
                <Checkbox inputId="notIssued" value="미지급" v-model="selectedIssueStatus" />
                <label for="notIssued">미지급</label>
            </div>
        </div>
        <div class="form-item">
            <label for="licenseValidityStart">면허 유효 시작일</label>
            <Calendar id="licenseValidityStart" placeholder="날짜 선택" />
        </div>
        <div class="form-item">
            <label for="licenseValidityEnd">면허 유효 만료일</label>
            <Calendar id="licenseValidityEnd" placeholder="날짜 선택" />
        </div>

        <div class="form-item">
            <label for="licenseNumber">운전 면허번호</label>
            <InputText id="licenseNumber" placeholder="입력하세요" />
        </div>
        <div class="form-item">
            <label for="licenseIssuer">운전 면허 발급처</label>
            <InputText id="licenseIssuer" placeholder="입력하세요" />
        </div>
        <div class="form-item">
            <label for="licenseIssueDate">운전 면허 발급일</label>
            <Calendar id="licenseIssueDate" placeholder="날짜 선택" />
        </div>
        <div class="form-item">
            <label for="licenseExpiration">면허 유효 마감일</label>
            <Calendar id="licenseExpiration" placeholder="날짜 선택" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';

const licenseTypes = [
    { label: '종류1', value: 'type1' },
    { label: '종류2', value: 'type2' }
];

const selectedLicenseType = ref([]);
const selectedIssueStatus = ref([]);
</script>

<style scoped>
.form-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4열 레이아웃 */
    gap: 1rem;
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
}

.form-item {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 4px;
    font-weight: bold;
    color: #333;
}

.checkbox-group {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.p-inputtext,
.p-dropdown,
.p-calendar {
    width: 100%;
}
</style>
