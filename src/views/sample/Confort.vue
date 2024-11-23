<template>
    <div>
        <h1>네비게이션</h1>
        <br><br>
        <div v-for="section in sections" :key="section.label" class="section">
            <h2>{{ section.label }}</h2>
            <div class="button-container">
                <button
                    v-for="route in section.routes"
                    :key="route.path"
                    @click="navigateTo(route.path)"
                >
                    {{ route.label }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const sections = ref([
    {
        label: "Authentication",
        routes: [{ path: "/", label: "Login" }],
    },
    {
        label: "Dashboard",
        routes: [{ path: "/dashboard", label: "Dashboard" }],
    },
    {
        label: "Centers",
        routes: [
            { path: "/center/list", label: "Center List" },
            { path: "/center/detail", label: "Center Detail" },
            { path: "/center/Edetail", label: "Edit Center Detail" },
            { path: "/center/modify", label: "Modify Center" },
            { path: "/center/register", label: "Register Center" },
        ],
    },
    {
        label: "Contracts",
        routes: [
            { path: "/contract/list", label: "Contract List" },
            { path: "/contract/detail", label: "Contract Detail" },
            { path: "/contract/Edetail", label: "Edit Contract Detail" },
            { path: "/contract/modify", label: "Modify Contract" },
            { path: "/contract/register", label: "Register Contract" },
        ],
    },
    {
        label: "Customers",
        routes: [
            { path: "/customer/list", label: "Customer List" },
            { path: "/customer/detail", label: "Customer Detail" },
            { path: "/customer/modify", label: "Modify Customer" },
            { path: "/customer/register", label: "Register Customer" },
        ],
    },
    {
        label: "Employees",
        routes: [
            { path: "/employee/list", label: "Employee List" },
            { path: "/employee/detail", label: "Employee Detail" },
        ],
    },
    {
        label: "Evaluations",
        routes: [
            { path: "/evaluation/list", label: "Evaluation List" },
            { path: "/evaluation/detail", label: "Evaluation Detail" },
            { path: "/evaluation/modify", label: "Modify Evaluation" },
            { path: "/evaluation/register", label: "Register Evaluation" },
        ],
    },
    {
        label: "Notices",
        routes: [
            { path: "/notice/list", label: "Notice List" },
            { path: "/notice/detail", label: "Notice Detail" },
            { path: "/notice/Edetail", label: "Edit Notice Detail" },
            { path: "/notice/modify", label: "Modify Notice" },
            { path: "/notice/register", label: "Register Notice" },
        ],
    },
    {
        label: "Orders",
        routes: [
            { path: "/order/list", label: "Order List" },
            { path: "/order/detail", label: "Order Detail" },
            { path: "/order/modify", label: "Modify Order" },
            { path: "/order/register", label: "Register Order" },
        ],
    },
    {
        label: "Problems",
        routes: [
            { path: "/problem/list", label: "Problem List" },
            { path: "/problem/detail", label: "Problem Detail" },
            { path: "/problem/modify", label: "Modify Problem" },
            { path: "/problem/register", label: "Register Problem" },
        ],
    },
    {
        label: "Products",
        routes: [
            { path: "/product/list", label: "Product List" },
            { path: "/product/detail", label: "Product Detail" },
        ],
    },
    {
        label: "Promotions",
        routes: [
            { path: "/promotion/list", label: "Promotion List" },
            { path: "/promotion/detail", label: "Promotion Detail" },
            { path: "/promotion/Edetail", label: "Edit Promotion Detail" },
            { path: "/promotion/modify", label: "Modify Promotion" },
            { path: "/promotion/register", label: "Register Promotion" },
        ],
    },
    {
        label: "Purchase Orders",
        routes: [
            { path: "/purchase-order/list", label: "Purchase Order List" },
            { path: "/purchase-order/detail", label: "Purchase Order Detail" },
            { path: "/purchase-order/modify", label: "Modify Purchase Order" },
            { path: "/purchase-order/register", label: "Register Purchase Order" },
        ],
    },
    {
        label: "Sales Histories",
        routes: [
            { path: "/sales-history/list", label: "Sales History List" },
            { path: "/sales-history/detail", label: "Sales History Detail" },
        ],
    },
    {
        label: "Schedules",
        routes: [
            { path: "/schedule", label: "Schedule" },
            { path: "/schedule/detail", label: "Schedule Detail" },
            { path: "/schedule/modify", label: "Modify Schedule" },
            { path: "/schedule/register", label: "Register Schedule" },
        ],
    },
    {
        label: "Samples",
        routes: [
            { path: "/sample/searchform", label: "Sample Search Form" },
            { path: "/sample/tabledata", label: "Sample Table Data" },
            { path: "/sample/tableform", label: "Sample Table Form" },
            { path: "/sample/tableview", label: "Sample Table View" },
            { path: "/sample/dashboard", label: "Sample Dashboard" },
            { path: "/sample/ckeditor", label: "Sample CKEditor" },
            { path: "/sample/f12", label: "Sample F12" },
            { path: "/sample/sample-api", label: "Sample API" },
            { path: "/sample", label: "Sample Confort" },
        ],
    },
]);

const navigateTo = (path) => {
    router.push(path);
};
</script>

<style scoped>
.section {
    margin-bottom: 20px;
}

.section h2 {
    margin-bottom: 10px;
    color: #6360AB;
}

.button-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

button {
    padding: 10px 20px;
    background-color: #6360AB;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #4d498a;
}
</style>
