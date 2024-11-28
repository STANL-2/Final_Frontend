<template>
    <div class="page-container">
        <div class="title-container">
            <label for="title-input">제목</label>
            <input 
                id="title-input" 
                type="text" 
                v-model="title" 
                placeholder="제목을 입력하세요" 
            />
        </div>

        <div class="file-upload-container">
            <label for="file-upload">파일 업로드</label>
            <input 
                id="file-upload" 
                type="file" 
                @change="onFileChange"
                accept="image/*" 
            />
        </div>

        <CKEditor 
            v-model="content" 
            :initial-html="initialHtml"
        />

        <div class="footer-buttons">
            <CommonButton 
                label="취소" 
                color="#F1F1FD" 
                textColor="#6360AB" 
                @click="closePage" 
            />
            <CommonButton 
                label="등록" 
                color="#6360AB" 
                textColor="#FFFFFF" 
                @click="onRegister" 
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import CKEditor from '@/components/common/CKEditor/CKEditor.vue';
import { $api } from "@/services/api/api";


const router = useRouter();

const title = ref(''); // 제목
const content = ref('')
const file = ref(null); // 업로드할 파일

const initialHtml = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>공지사항</title>
    </head>
    <body>
        <p>공지사항 내용을 작성하세요.</p>
    </body>
    </html>
`;

// 파일 선택 핸들러
const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        file.value = selectedFile; // 선택한 파일 저장
    }
};

const closePage = () => {
    router.push('/notice/list'); // 취소 시 이동 경로
};

const onRegister = async () => {
    if (!title.value.trim() || !content.value.trim()) {
        alert('제목과 내용을 입력해주세요.');
        return;
    }

    // JSON 데이터 추가
    const noticeData = {
        title: title.value.trim(),
        content: content.value.trim(),
    };

    console.log("notice", noticeData);

    try {
        // API 호출
        const response = await $api.notice.post(noticeData, '', file.value);

        console.log("response",response.value);

        alert("등록되었습니다.");
        router.push('/notice/list');
        
    } catch (error) {
        console.error("등록 오류:", error);
        alert("등록 중 오류: " + error.message);
    }
};
</script>

<style scoped>
.page-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
}

.title-container {
    margin-left: 2.4rem;
    width: 905px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

.title-container label {
    font-weight: bold;
    margin-bottom: 5px;
}

.title-container input {
    padding: 10px;
    padding-left: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
}

.file-upload-container {
    margin-left: 2.4rem;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

.file-upload-container label {
    font-weight: bold;
    margin-bottom: 5px;
}

.file-upload-container input {
    padding: 5px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
}

.footer-buttons {
    margin-right:2.5rem;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 5px;
}
</style>

<!--패딩 수정 필요 시 CKEditor.vue 들어가서 고치면 됨-->