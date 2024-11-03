<template>
    <CommonForm :fields="formFields" />
</template>

<script setup>
import CommonForm from '@/components/common/SearchForm.vue';

const formFields = [
    [
        { label: '고용 보험 여부', name: 'employmentInsurance', type: 'input', props: { type: 'text' } },
        { 
            label: '운전 면허 종류', 
            name: 'licenseType', 
            type: 'select', 
            props: { 
                options: [
                    { label: '종류1', value: 'type1' },
                    { label: '종류2', value: 'type2' }
                ],
                optionLabel: 'label', 
                optionValue: 'value' 
            }
        },
        { label: '택시 자격 여부', name: 'taxiQualification', type: 'checkbox', props: {} },
        { label: '택시 자격 번호', name: 'taxiNumber', type: 'input', props: { type: 'text' } }
    ],
    [
        { label: '택시 자격 발급일', name: 'issueDate', type: 'date', props: {} },
        { label: '면허 유효 시작일', name: 'licenseStartDate', type: 'date', props: {} },
        { label: '면허 유효 만료일', name: 'licenseEndDate', type: 'date', props: {} },
        { label: '운전 면허 발급지', name: 'licensePlace', type: 'input', props: { type: 'text' } }
    ],

    [
        { label: '택시 자격 발급일', name: 'issueDate', type: 'date', props: {} },
        { label: '면허 유효 시작일', name: 'licenseStartDate', type: 'date', props: {} },
        { label: '면허 유효 만료일', name: 'licenseEndDate', type: 'date', props: {} },
        { label: '운전 면허 발급지', name: 'licensePlace', type: 'input', props: { type: 'text' } }
    ],
];

</script>
