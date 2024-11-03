<template>
    <aside class="side-bar">
        <!-- 버튼 그룹 -->
        <div class="button-group">
            <Button type="button" icon="pi-plus" class="expand-button" @click="expandAll">
                열기</Button>
            <Button type="button" icon="pi-minus" class="collapse-button" @click="collapseAll">
                닫기</Button>
        </div>

        <!-- 검색 필드와 트리 컴포넌트 -->
        <Tree 
            v-model:expandedKeys="expandedKeys" 
            :value="nodes" :filter="true" 
            filterMode="lenient"
            filterPlaceholder="필터메뉴검색" 
            selectionMode="single" 
            @node-expand="onNodeExpand" 
            @node-collapse="onNodeCollapse" 
            @node-select="onNodeSelect"
            @node-unselect="onNodeUnselect" 
            class="tree-component"/>
    </aside>
</template>

<script setup>
import { ref } from 'vue';
import { asideMenu } from '@/utils/constants';
import { useRouter } from 'vue-router';

const nodes = ref(asideMenu);
const expandedKeys = ref({});
const router = useRouter();

// 모두 열기
const expandAll = () => {
    nodes.value.forEach(expandNode);
    expandedKeys.value = { ...expandedKeys.value };
};

// 모두 닫기
const collapseAll = () => {
    expandedKeys.value = {};
};

// 재귀적으로 노드 확장
const expandNode = (node) => {
    if (node.children && node.children.length) {
        expandedKeys.value[node.key] = true;
        node.children.forEach(expandNode);
    }
};

const onNodeSelect = (event) => {
    // 선택된 노드가 URL을 가지고 있으면 페이지 이동
    if (event.url) {
        router.push(event.url);
    } else {
        console.error('Selected node does not contain a URL:', selectedNode);
    }
};

// 이벤트 핸들러
// 하위 열기 이벤트
const onNodeExpand = (node) => {
    console.log('확장된 노드:', node);
};

// 하위 닫기 이벤트
const onNodeCollapse = (node) => {
    console.log('닫힌 노드:', node);
};

const onNodeUnselect = (event) => {
    console.log('Node unselected:', event.node);
};
</script>

<style scoped>
/* 사이드 바 */
.side-bar {
    width: 260px;
    height: 100%;
    background-color: #ffffff;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 10px;
}

/* 버튼 그룹 스타일 */
.button-group {
    display: flex;
    justify-content: space-between;
    width: 90%;
    gap: 10px;
    margin-bottom: -10px;   /* 버튼과 tree 사이 간격 */
    margin-top: -10px;
}

/* 버튼 크기 */
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
    background-color: #F3F3F3;
    border-radius: 10px;
    padding: 0.5rem 1rem;
    width: 100%;
    height: 43px;
    margin-bottom: 1rem; /* 검색창과 트리 컴포넌트 사이의 여백 */
}

/* 검색 text 스타일 */
:deep(.tree-component .p-inputtext){
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 1rem;
    border-radius: 5px;
    color: #777777;
}

/* 돋보기 모양 스타일 */
:deep(.tree-component .p-tree-filter-icon){
    color: #777777;
    font-size: 1.2rem;
    margin-left: -1.5rem;
}
</style>
