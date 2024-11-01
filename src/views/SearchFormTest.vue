<template>
    <CommonForm :fields="formFields" />
</template>

<script setup>
import CommonForm from '@/components/common/SearchForm.vue';

const formFields = [
    [
        { label: '고용 보험 여부', name: 'employmentInsurance', type: 'text', props: { placeholder: '입력하세요' } },
        { label: '운전 면허 종류', name: 'licenseType', type: 'select', options: ['종류1', '종류2'], props: { placeholder: '선택하세요' } },
        { label: '택시 자격 여부', name: 'taxiQualification', type: 'checkbox', props: {} },
        { label: '택시 자격 번호', name: 'taxiNumber', type: 'text', props: { placeholder: '번호를 입력하세요' } }
    ],
    [
        { label: '택시 자격 발급일', name: 'issueDate', type: 'date', props: { placeholder: '날짜 선택' } },
        { label: '면허 유효 시작일', name: 'licenseStartDate', type: 'date', props: { placeholder: '날짜 선택' } },
        { label: '면허 유효 만료일', name: 'licenseEndDate', type: 'date', props: { placeholder: '날짜 선택' } },
        { label: '운전 면허 발급지', name: 'licensePlace', type: 'text', props: { placeholder: '입력하세요' } }
    ]
];
</script>
