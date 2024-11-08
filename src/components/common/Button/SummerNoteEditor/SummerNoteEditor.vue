<template>
    <div ref="summernoteRefElement"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const summernoteRefElement = ref(null);

onMounted(() => {
    if (summernoteRefElement.value) {
        window.$(summernoteRefElement.value).summernote({
            height: 300,
            placeholder: 'Start typing...',
            tabsize: 2,
            callbacks: {
                onChange: function (contents) {
                    console.log('Content changed:', contents);
                }
            }
        });
    }
});

onBeforeUnmount(() => {
    if (summernoteRefElement.value) {
        window.$(summernoteRefElement.value).summernote('destroy');
    }
});
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.18/summernote-lite.min.css';
</style>