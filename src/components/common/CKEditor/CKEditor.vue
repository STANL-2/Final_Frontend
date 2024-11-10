<template>
	<div>
		<div class="main-container">
			<div class="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-block-toolbar"
				ref="editorContainerElement">
				<div class="editor-container__editor">
					<div ref="editorElement">
						<ckeditor v-if="isLayoutReady" v-model="config.initialData" :editor="editor" :config="config" />
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
	BalloonToolbar,
	BlockQuote,
	BlockToolbar,
	Bold,
	Code,
	CodeBlock,
	Essentials,
	FindAndReplace,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	FullPage,
	GeneralHtmlSupport,
	Heading,
	Highlight,
	HorizontalLine,
	HtmlEmbed,
	ImageBlock,
	ImageCaption,
	ImageInline,
	ImageInsert,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	LinkImage,
	List,
	ListProperties,
	Markdown,
	MediaEmbed,
	Mention,
	PageBreak,
	Paragraph,
	PasteFromOffice,
	RemoveFormat,
	SelectAll,
	SimpleUploadAdapter,
	SourceEditing,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextTransformation,
	TodoList,
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
					'undo', 'redo', '|', 'sourceEditing', 'findAndReplace', '|',
					'heading', '|', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
					'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'code', 'removeFormat', '|',
					'specialCharacters', 'horizontalLine', 'pageBreak', 'link', 'insertImage', 'insertImageViaUrl',
					'mediaEmbed', 'insertTable', 'highlight', 'blockQuote', 'codeBlock', 'htmlEmbed', '|',
					'alignment', '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
				],
				shouldNotGroupWhenFull: false
			},
			plugins: [
				AccessibilityHelp, Alignment, Autoformat, AutoImage, AutoLink, Autosave,
				BalloonToolbar, BlockQuote, BlockToolbar, Bold, Code, CodeBlock,
				Essentials, FindAndReplace, FontBackgroundColor, FontColor, FontFamily,
				FontSize, FullPage, GeneralHtmlSupport, Heading, Highlight,
				HorizontalLine, HtmlEmbed, ImageBlock, ImageCaption, ImageInline,
				ImageInsert, ImageInsertViaUrl, ImageResize, ImageStyle,
				ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock,
				Italic, Link, LinkImage, List, ListProperties, Markdown, MediaEmbed,
				Mention, PageBreak, Paragraph, PasteFromOffice, RemoveFormat, SelectAll,
				SimpleUploadAdapter, SourceEditing, SpecialCharacters,
				SpecialCharactersArrows, SpecialCharactersCurrency, SpecialCharactersEssentials,
				SpecialCharactersLatin, SpecialCharactersMathematical, SpecialCharactersText,
				Strikethrough, Subscript, Superscript, Table, TableCaption,
				TableCellProperties, TableColumnResize, TableProperties, TableToolbar,
				TextTransformation, TodoList, Underline, Undo
			],
			simpleUpload: {
				uploadUrl: 'http://localhost:3000/api/upload',
				headers: {
					Authorization: 'Bearer <your-token>'
				}
			},
			image: {
				toolbar: [
					'toggleImageCaption', 'imageTextAlternative', '|', 'imageStyle:inline',
					'imageStyle:wrapText', 'imageStyle:breakText', '|', 'resizeImage'
				]
			},
			htmlSupport: {
				allow: [
					{
						name: /^.*$/,
						styles: true,
						attributes: true,
						classes: true
					}
				]
			},
			language: 'ko',
			placeholder: '내용을 입력하세요...'
		};

		this.isLayoutReady = true;
	}
};
</script>

<style>
.main-container {
	max-width: 99%;
	margin: 0 auto;
	padding: 20px;
	border-radius: 8px;
}

.editor-container {
	background-color: #ffffff;
	border: 1px solid #ddd;
	border-radius: 8px;
	padding: 16px;
}

::v-deep .ck-editor__editable {
	min-height: 400px;
	padding: 16px;
	font-size: 16px;
	line-height: 1.6;
	color: #333;
	background-color: #fff;
	border-radius: 4px;
}

::v-deep .ck-toolbar {
	border-bottom: 1px solid #e0e0e0;
	background-color: #f7f7f7;
	border-radius: 8px 8px 0 0;
}

::v-deep .ck-content pre.fancy-code-dark {
	background-color: #282c34;
	color: #61dafb;
	padding: 16px;
	border-radius: 4px;
}
</style>




<!-- const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	}
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('upload'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded' });
	}
	res.json({ url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
}); -->
