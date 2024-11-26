<template>
    <PageLayout>
        <div class="header width-s ml-l mb-m mt-xl">
            <h1>상세 페이지</h1>
        </div>
        <div class="detail-container width-xxxs ml-xl">
            <h2 class="notice-title mb-m">{{ noticeTitle }}</h2>
            <h3 class="notice-content ml-xs">
                <div v-html="noticeContent"></div>
            </h3>


            <div class="bottom-section flex-col items-center width-s ml-xxxl">
                <!-- 첨부 파일 -->
                <div class="file-section mb-xl">
                    <table class="file-table">
                        <thead>
                            <tr>
                                <th>첨부파일명</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2024년 11월 영업목표 안내문.pdf</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 버튼 -->
                <div class="button-section ">
                    <button class="button back-button" @click="goBack">목록</button>
                    <div class="right-buttons">
                        <button class="button delete-button" @click="deleteNotice">삭제</button>
                        <button class="button edit-button" @click="navigateToEditPage">수정</button>
                    </div>
                </div>
            </div>
        </div>
    </PageLayout>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { $api } from '@/services/api/api';


const route = useRoute();
const router = useRouter();

const noticeTitle = route.query.noticeTitle || '';
const noticeContent = route.query.noticeContent || '';
const noticeId = route.query.noticeId || '';

const goBack = () => {
    router.back();
};
const deleteNotice = async () => {
    try {
        const response = await $api.notice.delete(
            noticeId
        );
        console.log(response.status)
        alert('공지사항이 삭제되었습니다.');
        router.back(); 
    } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제에 실패했습니다.');
    }
};

const navigateToEditPage = () => {
    router.push({
        name: 'ENoticeModify',
        query: {
            noticeId,
            noticeTitle,
            noticeContent,
        },
    });
};
</script>

<style scoped>
.bottom-section {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    padding: 1rem 2rem;
}


.page-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

.description {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #666;
}

.file-section {
    width: 70%;
}

.file-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 1rem;
    text-align: left;
}

.file-table thead th {
    background-color: #f5f5f5;
    padding: 0.8rem;
    border-bottom: 2px solid #ddd;
}

.file-table tbody td {
    padding: 0.8rem;
    border-bottom: 1px solid #ddd;
}

.button-section {
    display: flex;
    justify-content: space-between;
    width: 70%;
}

.right-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.back-button {
    position: relative;
    left: 50%;
    right: 50%;
    background-color: #6360AB;
    color: #FFFFFF;

}

.delete-button {
    background-color: #F1F1FD;
    color: #6360AB;
}

.edit-button {
    background-color: #6360AB;
    color: #FFFFFF;
}
</style>
