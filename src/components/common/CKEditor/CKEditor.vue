<template>
	<div>
		<div class="main-container">
			<div
				class="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-block-toolbar"
				ref="editorContainerElement"
			>
				<div class="editor-container__editor">
					<div ref="editorElement">
						<ckeditor
							v-if="isLayoutReady"
							v-model="config.initialData"
							:editor="editor"
							:config="config"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	ClassicEditor,
	AccessibilityHelp,
	Alignment,
	Autoformat,
	AutoImage,
	AutoLink,
	Autosave,
	BlockQuote,
	Bold,
	Code,
	CodeBlock,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Heading,
	Highlight,
	HorizontalLine,
	ImageBlock,
	ImageCaption,
	ImageInline,
	ImageInsert,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	Italic,
	Link,
	List,
	MediaEmbed,
	PageBreak,
	Paragraph,
	PasteFromOffice,
	RemoveFormat,
	SimpleUploadAdapter,
	SourceEditing,
	SpecialCharacters,
	Table,
	TableToolbar,
	Underline,
	Undo
} from 'ckeditor5';

import translations from 'ckeditor5/translations/ko.js';
import 'ckeditor5/ckeditor5.css';

export default {
	name: 'app',
	data() {
		return {
			isLayoutReady: false,
			config: null,
			editor: ClassicEditor
		};
	},
	mounted() {
		this.config = {
			toolbar: {
				items: [
					'undo', 'redo', '|', 'sourceEditing', 'heading', '|',
					'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
					'bold', 'italic', 'underline', 'strikethrough', 'removeFormat', '|',
					'link', 'bulletedList', 'numberedList', '|',
					'insertImage', 'mediaEmbed', 'insertTable', '|',
					'blockQuote', 'codeBlock', 'htmlEmbed', 'highlight'
				]
			},
			plugins: [
				AccessibilityHelp, Alignment, Autoformat, AutoImage, AutoLink, Autosave,
				BlockQuote, Bold, Code, CodeBlock, Essentials, FontBackgroundColor,
				FontColor, FontFamily, FontSize, Heading, Highlight, HorizontalLine,
				ImageBlock, ImageCaption, ImageInline, ImageInsert, ImageResize, ImageStyle,
				ImageTextAlternative, ImageToolbar, ImageUpload, Indent, Italic, Link,
				List, MediaEmbed, PageBreak, Paragraph, PasteFromOffice, RemoveFormat,
				SimpleUploadAdapter, SourceEditing, SpecialCharacters, Table,
				TableToolbar, Underline, Undo
			],
			style: {
				definitions: [
					{ name: 'Article category', element: 'h3', classes: 'category' },
					{ name: 'Title', element: 'h2', classes: 'document-title' },
					{ name: 'Subtitle', element: 'h3', classes: 'document-subtitle' },
					{ name: 'Info box', element: 'p', classes: 'info-box' },
					{ name: 'Marker', element: 'span', classes: 'marker' },
					{ name: 'Code (dark)', element: 'pre', classes: 'fancy-code-dark' }
				]
			},
			image: {
				toolbar: ['toggleImageCaption', 'imageTextAlternative', '|', 'resizeImage']
			},
			initialData: '',
			language: 'ko'
		};
		this.isLayoutReady = true;
	}
};
</script>

<style>
/* CKEditor 전체 컨테이너 */
.main-container {
	max-width: 99%;
	margin: 0 auto;
	padding: 20px;
	border-radius: 8px;
}

/* 에디터 컨테이너 */
.editor-container {
	background-color: #ffffff;
	border: 1px solid #ddd;
	border-radius: 8px;
	padding: 16px;
}

/* 에디터 내부 */
::v-deep .ck-editor__editable {
	min-height: 400px;
	padding: 16px;
	font-size: 16px;
	line-height: 1.6;
	color: #333;
	background-color: #fff;
	border-radius: 4px;
}

/* 에디터 툴바 */
::v-deep .ck-toolbar {
	border-bottom: 1px solid #e0e0e0;
	background-color: #f7f7f7;
	border-radius: 8px 8px 0 0;
}

::v-deep .ck-toolbar .ck-button {
	color: #333;
}

::v-deep .ck-toolbar .ck-button.ck-on {
	background-color: #007acc;
	color: white;
}

/* 스타일 정의 */
::v-deep .ck-content .category {
	font-size: 1.5em;
	color: #007acc;
}

::v-deep .ck-content .document-title {
	font-size: 2em;
	font-weight: bold;
	margin-top: 20px;
}

::v-deep .ck-content .document-subtitle {
	font-size: 1.75em;
	font-style: italic;
	color: #555;
}

::v-deep .ck-content .info-box {
	background-color: #f5f5f5;
	padding: 10px;
	border-left: 4px solid #007acc;
}

::v-deep .ck-content .marker {
	background-color: #ffeb3b;
	padding: 2px 4px;
}

::v-deep .ck-content pre.fancy-code-dark {
	background-color: #282c34;
	color: #61dafb;
	padding: 16px;
	border-radius: 4px;
	overflow-x: auto;
}
</style>





<!-- const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// 파일 저장 설정
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	}
});

const upload = multer({ storage });

// 파일 업로드 엔드포인트
app.post('/api/upload', upload.single('upload'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded' });
	}
	res.json({ url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});

// 정적 파일 제공
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
}); -->
