<template>
    <div>
        <ckeditor
            v-model="data"
            :editor="TestEditor"
            :config="config"
            :disabled="disabled"
            @ready="onReady"
            @focus="onFocus"
            @blur="onBlur"
            @input="onInput"
            @destroy="onDestroy"
        />
        <button @click="toggleEditorDisabled">
            {{ disabled ? 'Enable' : 'Disable' }} editor
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ClassicEditor, Essentials, Paragraph, Heading, FontSize, Bold, Italic, Underline, Strikethrough, Link, List, Alignment, BlockQuote } from 'ckeditor5';

class TestEditor extends ClassicEditor {
    static builtinPlugins = [
        Essentials,
        Paragraph,
        Heading,
        FontSize,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Link,
        List,
        Alignment,
        BlockQuote
    ];
}

// State
const editorInstance = ref<TestEditor | null>(null);
const data = ref('<p>Hello world!</p>');
const disabled = ref(false);
const config = reactive({
    toolbar: [
        'heading', '|', 'fontsize', '|',
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'bulletedList', 'numberedList', '|',
        'alignment', '|',
        'link', 'blockquote'
    ],
    fontSize: {
        options: [10, 12, 14, 16, 18, 20, 24]
    }
});

// Methods
function toggleEditorDisabled() {
    disabled.value = !disabled.value;
}

function onReady(editor) {
    editorInstance.value = editor;
    console.log('Editor is ready.', { editor });
}

function onFocus(event, editor) {
    console.log('Editor focused.', { event, editor });
}

function onBlur(event, editor) {
    console.log('Editor blurred.', { event, editor });
}

function onInput(data, event, editor) {
    console.log('Editor data input.', { event, editor, data });
}

function onDestroy() {
    console.log('Editor destroyed.');
}
</script>

<style scoped>
/* Optional custom styling */
</style>
