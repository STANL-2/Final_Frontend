<template>
    <div>
        <div id="editor"></div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

let editor = null;

// 컴포넌트가 마운트된 후 에디터를 초기화
onMounted(() => {
    editor = new Editor({
        el: document.querySelector('#editor'),
        height: '500px',
        initialEditType: 'markdown',
        previewStyle: 'vertical',
    });
});
</script>

<style scoped></style>