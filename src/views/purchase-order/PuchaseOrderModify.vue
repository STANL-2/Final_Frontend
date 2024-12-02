<template>
    <Modal
        v-model="isVisible"
        header="발주서 수정"
        width="80rem"
        height="none"
        @cancel="resetModalState"
    >
        <div class="flex-row content-center">
            <div class="flex-row items-center">
                <Typography type="title3" color="black" fontSize="16px" class="mr-s">발주서 제목:</Typography>
            </div>
            <InputText type="text" v-model="title" />
        </div>
        <CKEditor 
            v-if="content"
            v-model="content" 
            :initial-html="content"
            @update:model-value="handleEditorUpdate" 
        />

        <template #footer>
            <CommonButton 
                label="취소" 
                color="#F1F1FD" 
                textColor="#6360AB" 
                @click="closeModal" 
            />
            <CommonButton 
                label="수정" 
                color="#6360AB" 
                textColor="#FFFFFF" 
                @click="onUpdate"
            />
        </template>
    </Modal>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import Modal from '@/components/common/Modal.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import Typography from '@/components/Typography.vue';
import CKEditor from '@/components/common/CKEditor/CKEditor.vue';
import { $api } from "@/services/api/api";

const props = defineProps({
    visible: {
        type: Boolean,
        required: true,
    },
    purchaseOrderId: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update:visible', 'close']);
const isVisible = ref(props.visible);
const content = ref('');
const title = ref('');

watch(
    () => props.visible,
    async (newVal) => {
        isVisible.value = newVal;
        if (newVal) {
            await getDetailRequest();
        }
    }
);

const getDetailRequest = async () => {
    try {
        console.log("purchaseOrderId: " + props.purchaseOrderId);
        const response = await $api.purchaseOrder.get('', props.purchaseOrderId);
        console.log('계약서 상세 조회 응답:', response);

        const createdUrl = response.result.content;
        if (createdUrl) {
            console.log('Fetching HTML from:', createdUrl);

            const htmlResponse = await fetch(createdUrl);
            if (!htmlResponse.ok) {
                throw new Error(`Failed to fetch HTML: ${htmlResponse.status}`);
            }

            const htmlText = await htmlResponse.text();
            content.value = htmlText; // content를 직접 설정
            console.log('Fetched HTML:', content.value);
        } else {
            console.error('createdUrl이 비어 있습니다.');
        }
    } catch (error) {
        console.error('GET DETAIL 요청 실패: ', error);
    }
};

// 수정 버튼 클릭 시 호출되는 함수
const onUpdate = async () => {
    try {
        if (!content.value) {
            throw new Error("에디터 내용이 비어 있습니다.");
        }

        const postData = extractDataFromHTML(content.value);
        console.log("추출된 데이터:", postData);
        
        const response = await $api.purchaseOrder.put(
            postData,
            props.purchaseOrderId
        );
        console.log("PUT 응답:", response);

        alert("발주서가 성공적으로 수정되었습니다.");
        closeModal();
        window.location.reload();
    } catch (error) {
        console.error("수정 중 오류:", error);
        alert("수정 중 문제가 발생했습니다: " + error.message);
    }
};

// CKEditor 내용에서 데이터를 추출하는 함수
const extractDataFromHTML = (html) => {
    const parser = new DOMParser();
    
    const doc = parser.parseFromString(html, "text/html");

    // 필요한 필드를 추가적으로 추출
    return {
        title: title.value,
        content: html, // HTML 전체를 전송
    };
};

const handleEditorUpdate = (newContent) => {
    content.value = newContent;
    console.log("Editor content updated:", newContent);
};

function closeModal() {
    isVisible.value = false;
    content.value = ''; // 모달 닫을 때 content 초기화
    emit('update:visible', false);
    emit('close');
}
</script>

<style scoped>
/* 모달 및 CKEditor 스타일 */
.main-container {
    max-width: 99%;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
}

.editor-container {
    background-color: #ffffff;
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

.p-inputtext {
    width: 30rem;
    border-bottom: 3px solid #000;
    border-radius: 0px;
    border-top: none;
    border-left: none;
    border-right: none;
}
</style>