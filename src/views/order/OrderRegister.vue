<template>
    <Modal v-model="isVisible" header="수주서 등록" width="80rem" height="100rem">
        <div class="flex-row content-center">
            <div class="flex-row items-center">
                <Typography type="title3" color="black" fontSize="16px" class="mr-s">수주서 제목:</Typography>
            </div>
            <InputText type="text" v-model="title" />
        </div>
        <CKEditor v-model="content" :initial-html="initialHtml" @update:model-value="handleEditorUpdate" />

        <template #footer>
            <CommonButton label="취소" color="#F1F1FD" textColor="#6360AB" @click="closeModal" />
            <CommonButton label="등록" color="#6360AB" textColor="#FFFFFF" @click="onRegister" />
        </template>
    </Modal>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, nextTick } from 'vue';
import Modal from '@/components/common/Modal.vue';
import CommonButton from '@/components/common/Button/CommonButton.vue';
import CKEditor from '@/components/common/CKEditor/CKEditor.vue';
import Typography from '@/components/Typography.vue';
import SignatureModal from '@/components/common/signatureCanvas/SignatureModal.vue';
import { $api } from "@/services/api/api"; // $api는 API 호출 핸들러로 가정

// 부모에서 전달받는 props
const props = defineProps({
    visible: {
        type: Boolean,
        required: true,
    },
});

// 부모 컴포넌트로 상태를 전달하는 emit
const emit = defineEmits(['update:visible', 'close']);

// 내부 상태 변수
const isVisible = ref(props.visible);
const isSignatureModalVisible = ref(false);
const currentSignatureRole = ref(''); // 현재 서명 역할 (buyer/seller)
const content = ref(''); // CKEditor의 현재 내용
const title = ref('');
const initialHtml = `
    <!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Sheet</title>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.5; display: flex; justify-content: center; padding: 20px; background-color: #f9f9f9;">

    <div style="width: 900px; border: 1px solid #000; padding: 20px; background-color: #fff;">
        <!-- Header Section -->
        <div
            style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px; position: relative;">
            <!-- 수주서 제목 -->
            <div style="position: absolute; left: 50%; transform: translateX(-50%); text-align: center;">
                <h2 style="font-size: 20px; font-weight: bold; margin: 0;">수주서</h2>
            </div>

            <!-- Approval Table -->
            <table
                style=" width: 20%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; margin-left: auto;">
                <tr style="background-color: #f0f0f0;">
                    <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">작성</td>
                    <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">검토</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 20px; text-align: center;"></td>
                    <td style="border: 1px solid #000; padding: 20px; text-align: center;"></td>
                </tr>
            </table>
        </div>

        <!-- Top Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
            <tr>
                <td style="width: 10%; border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">날짜
                </td>
                <td style="width: 15%; border: 1px solid #000; padding: 6px;" class="createdAt"></td>
                <td style="width: 10%; border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">계약서
                    번호</td>
                <td style="width: 15%; border: 1px solid #000; padding: 6px;" class="contractId"></td>
                <td style="width: 10%; border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">매장
                </td>
                <td style="width: 15%; border: 1px solid #000; padding: 6px;" class="centerName"></td>
                <td style="width: 10%; border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">담당자
                </td>
                <td style="width: 15%; border: 1px solid #000; padding: 6px;" class="adminId"></td>
            </tr>
        </table>

        <!-- Middle Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
            <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid #000; padding: 6px;">No.</th>
                <th style="border: 1px solid #000; padding: 6px;">일련번호</th>
                <th style="border: 1px solid #000; padding: 6px;">품명 / 규격</th>
                <th style="border: 1px solid #000; padding: 6px;">수주수량</th>
                <th style="border: 1px solid #000; padding: 6px;">단가 / 합계</th>
                <th style="border: 1px solid #000; padding: 6px;">현재고</th>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 6px; height: 20px;"></td>
                <td style="border: 1px solid #000; padding: 6px;" class="serialNo"></td>
                <td style="border: 1px solid #000; padding: 6px;" class="carName"></td>
                <td style="border: 1px solid #000; padding: 6px;" class="numberOfVehicles"></td>
                <td style="border: 1px solid #000; padding: 6px;" class="totalSales"></td>
                <td style="border: 1px solid #000; padding: 6px;" class="stock"></td>
            </tr>
        </table>
    </div>
</body>
</html>
`;

// props 변화 감지
watch(
    () => props.visible,
    (newVal) => {
        isVisible.value = newVal;
        if (newVal && !content.value) {
            content.value = initialHtml;
        }
    }
);

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
        title: title.value,
        contractId: "CON_000000037",
        content: html // HTML 전체를 전송
    };
};

// 에디터 내용 업데이트 핸들러
const handleEditorUpdate = (newContent) => {
    content.value = newContent;
    console.log("Editor content updated:", newContent);
};

// 등록 버튼 클릭 시 호출되는 함수
const onRegister = async () => {
    try {
        console.log("Current editor content:", content.value);

        if (!content.value) {
            throw new Error("에디터 내용이 비어 있습니다.");
        }

        const postData = extractDataFromHTML(content.value);
        console.log("추출된 데이터:", postData);

        const response = await $api.order.post(postData, "");
        console.log("POST 요청:", postData);
        console.log("POST 응답:", response);

        alert("수주서가 성공적으로 등록되었습니다.");

        // 필드 초기화
        title.value = "";
        content.value = initialHtml; // 에디터 초기화
        isVisible.value = false; // 모달 닫기
        emit('update:visible', false); // 부모에 모달 상태 전달
        emit('refresh'); // 부모에 데이터 갱신 요청
        closeModal();
    } catch (error) {
        console.error("등록 중 오류:", error);
        alert("등록 중 문제가 발생했습니다: " + error.message);
    }
};

// 모달 닫기 함수
function closeModal() {
    isVisible.value = false;
    emit('update:visible', false); // 부모 컴포넌트에 상태 전달
    emit('close'); // 부모 컴포넌트에 close 이벤트 전달
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

.custom-button {
    margin-left: 8px;
    padding: 4px 12px;
    background-color: #FFF;
    color: #6360AB;
    border: 1px solid #6360AB;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
}
</style>