<template>
    <div class="card custom-datatable">
        <DataTable
            :value="data"
            tableStyle="min-width: 100%"
            showGridlines
            :selection="selectedItems"
            @update:selection="selectedItems = $event"
        >
            <!-- 첫 번째 체크박스 컬럼 조건부 추가 -->
            <Column 
                v-if="selectable" 
                selectionMode="multiple" 
                headerStyle="width: 3rem; text-align: center" 
                bodyStyle="text-align: center; vertical-align: middle" 
                class="checkbox-cell" 
            ></Column>
            
            <!-- 동적 컬럼 생성 -->
            <Column
                v-for="(header, index) in headers"
                :key="index"
                :field="header.field"
                :header="header.label"
                sortable
                :style="{ width: header.width || 'auto' }"
                :headerStyle="{ width: header.width || 'auto', textAlign: 'center' }"
                :bodyStyle="{ width: header.width || 'auto', textAlign: 'center', verticalAlign: 'middle' }"
            >
                <!-- 각 컬럼에 데이터 표시 -->
                <template #body="{ data }">
                    {{ data[header.field] }}
                </template>
            </Column>

            <!-- 버튼 컬럼 조건부 추가 -->
            <Column
                v-if="buttonLabel && buttonAction && buttonField"
                :header="buttonHeader || buttonLabel"
                :style="{ width: buttonColumnWidth || 'auto' }"
                headerStyle="text-align: center"
                bodyStyle="text-align: center; vertical-align: middle"
            >
                <template #body="{ data }">
                    <div class="button-cell">
                        <button @click="buttonAction(data)" class="custom-button">{{ buttonLabel }}</button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    headers: {
        type: Array,
        default: () => []
    },
    data: {
        type: Array,
        default: () => []
    },
    selectable: {
        type: Boolean,
        default: true
    },
    buttonLabel: {
        type: String,
        default: null // 버튼 라벨 (버튼 텍스트)
    },
    buttonHeader: {
        type: String,
        default: null // 버튼 컬럼 헤더
    },
    buttonAction: {
        type: Function,
        default: null // 버튼 클릭 시 동작할 함수
    },
    buttonField: {
        type: String,
        default: '' // 버튼을 추가할 컬럼 필드명
    },
    buttonColumnWidth: {
        type: String,
        default: 'auto' // 버튼 컬럼 너비
    }
});

const selectedItems = ref([]);
</script>

<style>
/* 체크박스 컬럼에 패딩과 가운데 정렬 적용 */
.checkbox-cell {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 8px 12px 8px 12px !important;
}

/* 버튼 스타일 */
.custom-button {
    margin-left: 8px;
    padding: 4px 12px;
    background-color: #FFF;
    color: #6360AB;
    border: 1px solid #6360AB;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
}

/* 버튼 셀 정렬 */
.p-column-title {
    width: 90px !important;
}

.custom-button:hover {
    background-color: #F1F1FD;
}

/* 양쪽 테두리 제거 */
.custom-datatable .p-datatable .p-datatable-thead>tr>th:first-child,
.custom-datatable .p-datatable .p-datatable-tbody>tr>td:first-child,
.custom-datatable .p-datatable .p-datatable-thead>tr>th:last-child,
.custom-datatable .p-datatable .p-datatable-tbody>tr>td:last-child {
    border-left: none !important;
    border-right: none !important;
}

/* 모든 컬럼 헤더(th)와 셀(td)의 텍스트 가운데 정렬 */
.custom-datatable .p-datatable .p-datatable-thead>tr>th,
.custom-datatable .p-datatable .p-datatable-tbody>tr>td {
    text-align: center !important;
}

/* 헤더 컨텐츠 가운데 정렬 */
.custom-datatable .p-datatable .p-column-header-content {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    color: #777777;
    font-weight: normal;
}

/* 컬럼 헤더 높이 설정 */
.custom-datatable .p-datatable .p-datatable-thead>tr>th {
    height: 30px !important;
    padding: 0 !important;
    font-size: 14px;
}

/* 셀 높이 설정 */
.custom-datatable .p-datatable .p-datatable-tbody>tr>td {
    height: 30px !important;
    padding: 0 !important;
    font-size: 14px;
}

/* 정렬된 컬럼 헤더 배경색 완전 제거 */
.custom-datatable .p-datatable .p-sortable-column.p-highlight,
.custom-datatable .p-datatable .p-sortable-column.p-highlight:focus,
.custom-datatable .p-datatable .p-sortable-column.p-highlight:active {
    background-color: #F8F8F8;
    color: inherit !important;
    box-shadow: none !important;
    /* 그림자 제거 */
    border-color: 1px solid #EEEEEE !important;
    /* 테두리 제거 */
}

/* 정렬 아이콘의 강조 색상 제거 */
.custom-datatable .p-datatable .p-sortable-column.p-highlight .p-sortable-column-icon,
.custom-datatable .p-datatable .p-sortable-column:focus .p-sortable-column-icon,
.custom-datatable .p-datatable .p-sortable-column:active .p-sortable-column-icon {
    color: inherit !important;
}

/* 컬럼 헤더의 hover 효과 완전 제거 */
.custom-datatable .p-datatable .p-sortable-column:hover {
    color: inherit !important;
    box-shadow: none !important;
    /* 그림자 제거 */
    border-color: transparent !important;
}

/* hover 시 정렬 아이콘 색상 유지 */
.custom-datatable .p-datatable .p-sortable-column:hover .p-sortable-column-icon {
    color: inherit !important;
}
</style>
