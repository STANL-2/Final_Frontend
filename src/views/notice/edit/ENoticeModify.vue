<template>
    <PageLayout>
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
    
                <CKEditor v-model="content" :initial-html="initialHtml" />
    
                <div class="footer-buttons">
                    <CommonButton
                        label="취소"
                        color="#F1F1FD"
                        textColor="#6360AB"
                        @click="closePage"
                    />
                    <CommonButton
                        label="수정 완료"
                        color="#6360AB"
                        textColor="#FFFFFF"
                        @click="onUpdate"
                    />
                </div>
            </div>
        </PageLayout>
    </template>
    
    <script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import CommonButton from '@/components/common/Button/CommonButton.vue';
    import CKEditor from '@/components/common/CKEditor/CKEditor.vue';
    import { $api } from '@/services/api/api';
    
    const router = useRouter();
    const route = useRoute();
    
    const noticeId = route.query.noticeId || '';
    const title = ref('');
    const content = ref('');
    const initialHtml = ref('');
    
    onMounted(() => {
        // 기존 데이터 로드
        title.value = route.query.noticeTitle || '';
        content.value = route.query.noticeContent || '';
        initialHtml.value = content.value; // CKEditor 초기 HTML
    });
    
    const closePage = () => {
        router.push('/notice/list'); // 취소 시 목록 페이지로 이동
    };
    console.log("noticeId",noticeId); 
    const onUpdate = async () => {
        try {
            const response = await $api.notice.put(
                {
                    title: title.value.trim(),
                    content: content.value.trim(),
                },
                noticeId,
            );
    
            alert('공지사항이 수정되었습니다.');
            router.push('/notice/list');
        } catch (error) {
            console.error('수정 중 오류 발생:', error);
            alert('수정에 실패했습니다.');
        }
    };
    </script>
    
    <style scoped>
    /* 기존 스타일 유지 */
    </style>
    