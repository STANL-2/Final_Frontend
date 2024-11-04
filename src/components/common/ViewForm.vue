<template>
    <div class="card">
        <DataTable :value="products" editMode="cell" @cell-edit-complete="onCellEditComplete"
            :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }) => ({
                        class: [{ '!py-0': state['d_editing'] }]
                    })
                }
            }"
        >
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" style="width: 25%">
                <template #body="{ data, field }">
                    {{ field === 'price' ? formatCurrency(data[field]) : data[field] }}
                </template>
                <template #editor="{ data, field }">
                    <template v-if="field !== 'price'">
                        <InputText v-model="data[field]" autofocus fluid />
                    </template>
                    <template v-else>
                        <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US" autofocus fluid />
                    </template>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// 테이블 헤더 정의
const columns = [
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    { field: 'quantity', header: 'Quantity' },
    { field: 'price', header: 'Price' }
];

// 더미 데이터 정의
const products = ref([
    { code: 'A001', name: 'Product A', quantity: 100, price: 10.0 },
    { code: 'B002', name: 'Product B', quantity: 200, price: 20.0 },
    { code: 'C003', name: 'Product C', quantity: 300, price: 30.0 },
    { code: 'D004', name: 'Product D', quantity: 400, price: 40.0 },
    { code: 'E005', name: 'Product E', quantity: 500, price: 50.0 }
]);

const onCellEditComplete = (event) => {
    let { data, newValue, field } = event;

    switch (field) {
        case 'quantity':
        case 'price':
            if (isPositiveInteger(newValue)) data[field] = newValue;
            else event.preventDefault();
            break;

        default:
            if (newValue.trim().length > 0) data[field] = newValue;
            else event.preventDefault();
            break;
    }
};

const isPositiveInteger = (val) => {
    let str = String(val);

    str = str.trim();

    if (!str) {
        return false;
    }

    str = str.replace(/^0+/, '') || '0';
    var n = Math.floor(Number(str));

    return n !== Infinity && String(n) === str && n >= 0;
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
</script>

<style scoped>
/* 스타일이 필요할 경우 추가하세요 */
</style>
