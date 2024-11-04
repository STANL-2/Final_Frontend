<template>
    <ViewTable
    :headers="tableHeaders"
    :data="tableData"
    :selectable="true"
    buttonLabel="조회"
    buttonHeader="상세조회"
    :buttonAction="handleView"
    buttonField="code"
    />
    </template>
    <script setup>
    import ViewTable from '@/components/common/ListTable.vue';
    const tableHeaders = [
    { field: 'code', label: 'Code', width: '25%' },
    { field: 'name', label: 'Name', width: '25%' },
    { field: 'category', label: 'Category', width: '25%' },
    { field: 'quantity', label: 'Quantity', width: '25%' }
    ];
    const tableData = [
    { code: 'A001', name: 'Product A', category: 'Category 1', quantity: 100 },
    { code: 'B002', name: 'Product B', category: 'Category 2', quantity: 200 },
    { code: 'C003', name: 'Product C', category: 'Category 3', quantity: 300 },
    ];
    function handleView(rowData) {
    console.log('View button clicked for:', rowData);
    }
    </script>