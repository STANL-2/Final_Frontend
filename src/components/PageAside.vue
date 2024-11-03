<template>
    <aside class="side-bar">
        <!-- 버튼 그룹 -->
        <div class="button-group">
            <Button type="button" icon="pi pi-plus" class="expand-button" @click="expandAll">열기</Button>
            <Button type="button" icon="pi pi-minus" class="collapse-button" @click="collapseAll">닫기</Button>
        </div>

        <!-- 검색 필드와 트리 컴포넌트 -->
        <Tree v-model:expandedKeys="expandedKeys" :value="nodes" :filter="true" filterMode="lenient"
            filterPlaceholder="필터메뉴검색" :loading="loading" selectionMode="single" :selectionKeys="selectedKey"
            @node-expand="onNodeExpand" @node-collapse="onNodeCollapse" @node-select="onNodeSelect"
            @node-unselect="onNodeUnselect" class="tree-component w-full md:w-[30rem] mt-4" />
    </aside>
</template>

<script setup>
import { ref } from 'vue';
import { asideMenu } from '@/utils/constants';

const nodes = ref(asideMenu);
const expandedKeys = ref({});
const selectedKey = ref(null);
const loading = ref(false);

const expandAll = () => {
    nodes.value.forEach(expandNode);
    expandedKeys.value = { ...expandedKeys.value };
};

const collapseAll = () => {
    expandedKeys.value = {};
};

const expandNode = (node) => {
    if (node.children && node.children.length) {
        expandedKeys.value[node.key] = true;
        node.children.forEach(expandNode);
    }
};

// 이벤트 핸들러
const onNodeExpand = () => {};
const onNodeCollapse = () => {};
const onNodeSelect = () => {};
const onNodeUnselect = () => {};
</script>

<style scoped>
.side-bar {
    width: 260px;
    height: 841px;
    background-color: #ffffff;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

/* 버튼 그룹 스타일 */
.button-group {
    display: flex;
    justify-content: space-between;
    width: 90%;
    gap: 10px;
}

.expand-button,
.collapse-button {
    width: 100%;
    height: 80%;
    padding: 0.5rem 0;
    font-size: 1rem;
    background-color: #6360AB;
    color: white;
    border: none;
    border-radius: 8px;
    text-align: center;
    flex: 1;
}

/* 검색 필드 스타일 */
:deep(.tree-component .p-tree-filter-container) {
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    width: 100%;
    margin-bottom: 2rem; /* 검색창과 트리 컴포넌트 사이의 여백 */
}

:deep(.tree-component .p-inputtext){
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 1rem;
    border-radius: 5px;
    color: #333;
}

:deep(.tree-component .p-inputtext::placeholder){
    color: #b0b0b0;
    background-color: #f3f3f3;
}

:deep(.tree-component .p-tree-filter-icon){
    color: #b0b0b0;
    font-size: 1.2rem;
    margin-left: -1.5rem;
}
</style>
