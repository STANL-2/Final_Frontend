<template>
    <PageLayout>
        <SearchForm :fields="formFields" />
    </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/common/layouts/PageLayout.vue';
import SearchForm from '@/components/common/SearchForm.vue';


const formFields = [
    {
        label: '고객 보딩 여부',
        type: 'input',
        model: 'customerBoarding',
        placeholder: '보딩 여부 입력',
        showDivider: true
    },
    {
        label: '운전 면허 종류',
        type: 'select',
        model: 'driverLicenseType',
        options: ['선택하세요', 'A', 'B', 'C'],
        showDivider: false
    },
    {
        label: '택시 자격 발급일',
        type: 'calendar',
        model: 'issueDate',
        showIcon: true,
        iconDisplay: 'input',
        selectionMode: 'multiple',
        manualInput: false,
        showDivider: true
    },
    {
        label: '면허 유효 시작일',
        type: 'inputWithButton',
        model: 'validFrom',
        placeholder: '유효 시작일 입력',
        showDivider: false
    },
    {
        label: '고객 보딩 여부',
        type: 'input',
        model: 'customerBoarding',
        placeholder: '보딩 여부 입력',
        showDivider: true
    },
    {
        label: '운전 면허 종류',
        type: 'select',
        model: 'driverLicenseType',
        options: ['선택하세요', 'A', 'B', 'C'],
        showDivider: false
    },
    {
        label: '택시 자격 발급일',
        type: 'calendar',
        model: 'issueDate',
        showIcon: true,
        iconDisplay: 'input',
        selectionMode: 'multiple',
        manualInput: false,
        showDivider: true
    },
    {
        label: '면허 유효 시작일',
        type: 'inputWithButton',
        model: 'validFrom',
        placeholder: '유효 시작일 입력',
        showDivider: false
    },

    {
        type: 'radio',
        label: '구독 여부',
        model: 'subscription',
        options: ['예', '아니오'],
        default: '아니오'
    }
]
</script>
