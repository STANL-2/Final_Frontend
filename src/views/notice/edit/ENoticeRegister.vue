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

const closePage = () => {
    router.push('/notice/list'); // 취소 시 이동 경로
};

const onRegister = async () => {
    try {
        if (!title.value.trim()) {
            throw new Error("제목을 입력해주세요.");
        }
        if (!content.value.trim()) {
            throw new Error("내용을 입력해주세요.");
        }

        const postData = {
            title: title.value, // 제목
            content: content.value, // CKEditor 내용
        };

        console.log("전송 데이터:", postData); // 디버깅용 로그

        // API 호출 (JSON 형태로 전송)
        const response = await $api.notice.post(
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // JSON 요청 헤더 설정
            },
            body: JSON.stringify(postData), // JSON 형태로 변환
        });

        console.log("Response 객체:", response);

        if (response.httpStatus!=200) {
            throw new Error("등록에 실패했습니다.");
        }
        const responseData = response.data || response;
        console.log("응답 데이터:", responseData);
        
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

.footer-buttons {
    margin-right:2.5rem;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 5px;
}
</style>

<!--패딩 수정 필요 시 CKEditor.vue 들어가서 고치면 됨-->