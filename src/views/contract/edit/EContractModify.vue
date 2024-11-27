<template>
    <Modal
        v-model="isVisible"
        header="수정 모달"
        width="80rem"
        height="100rem"
        @close="closeModal"
    >
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
import CKEditor from '@/components/common/CKEditor/CKEditor.vue';
import { $api } from "@/services/api/api";

const props = defineProps({
    visible: {
        type: Boolean,
        required: true,
    },
    contractId: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update:visible', 'close']);
const isVisible = ref(props.visible);
const content = ref('');

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
        const response = await $api.contract.get('', props.contractId);
        console.log('계약서 상세 조회 응답:', response);

        const createdUrl = response.result.createdUrl;
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
        
        const response = await $api.contract.put(
            postData,
            props.contractId
        );
        console.log("PUT 응답:", response);

        alert("계약서가 성공적으로 수정되었습니다.");
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

    // 고객 사항
    const customerName = doc.querySelector(".customer-name-value")?.innerText.trim() || "";
    const customerIdentifiNo = doc.querySelector(".customer-identifiNo-value")?.innerText.trim() || "";
    const customerAddress = doc.querySelector(".customer-address-value")?.innerText.trim() || "";
    const customerPhone = doc.querySelector(".customer-phone-value")?.innerText.trim() || "";
    const customerEmail = doc.querySelector(".customer-email-value")?.innerText.trim() || "";
    const companyName = doc.querySelector(".customer-company-value")?.innerText.trim() || "";
    const customerClassifcation = doc.querySelector(".customer-customerClassifcation-value")?.innerText.trim() || "";
    const customerPurchaseCondition = doc.querySelector(".customer-purchaseCondition-value")?.innerText.trim() || "";
    const customerAge = doc.querySelector(".customer-age-value")?.innerText.trim() || "";
    const customerSex = doc.querySelector(".customer-sex-value")?.innerText.trim() || "";

    // 차량 사항
    const carName = doc.querySelector(".customer-carName-value")?.innerText.trim() || "";
    const serialNum = doc.querySelector(".customer-serialNo-value")?.innerText.trim() || "";
    const selectOption = doc.querySelector(".customer-selectOption-value")?.innerText.trim() || "";
    const numberOfVehicles = doc.querySelector(".customer-numberOfVehicles-value")?.innerText.trim() || "";
    const deliveryDate = doc.querySelector(".customer-deliveryDate-value")?.innerText.trim() || "";
    const deliveryLocation = doc.querySelector(".customer-deliveryLocation-value")?.innerText.trim() || "";

    // 금액 사항
    const vehiclePrice = parseFloat(doc.querySelector(".customer-vehiclePrice-value")?.innerText.trim() || "0");
    const downPayment = parseFloat(doc.querySelector(".customer-downPayment-value")?.innerText.trim() || "0");
    const intermediatePayment = parseFloat(doc.querySelector(".customer-intermediatePayment-value")?.innerText.trim() || "0");
    const remainderPayment = parseFloat(doc.querySelector(".customer-remainderPayment-value")?.innerText.trim() || "0");
    const consignmentPayment = parseFloat(doc.querySelector(".customer-consignmentPayment-value")?.innerText.trim() || "0");
    const totalSales = parseFloat(doc.querySelector(".customer-totalSales-value")?.innerText.trim() || "0");

    // 필요한 필드를 추가적으로 추출
    return {
        title: "프론트에서 하는 계약서 수정",
        customerName,
        customerIdentifiNo,
        customerAddress,
        customerPhone,
        customerEmail,
        companyName,
        customerClassifcation,
        customerPurchaseCondition,
        customerAge,
        customerSex,
        carName,
        serialNum,
        selectOption,
        numberOfVehicles,
        deliveryDate,
        deliveryLocation,
        vehiclePrice,
        downPayment,
        intermediatePayment,
        remainderPayment,
        consignmentPayment,
        totalSales,
        createdUrl: html, // HTML 전체를 전송
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
</style>