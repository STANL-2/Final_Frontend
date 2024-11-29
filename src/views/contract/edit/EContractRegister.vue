<template>
    <Modal v-model="isVisible" header="계약서 등록" width="80rem" height="100rem">
        <div class="flex-row content-center">
            <div class="flex-row items-center">
                <Typography type="title3" color="black" fontSize="16px" class="mr-s">계약서 제목:</Typography>
            </div>
            <InputText type="text" v-model="title" />
        </div>
        <CKEditor v-model="content" :initial-html="initialHtml" @update:model-value="handleEditorUpdate"
            @ready="onEditorReady" />
        <SignatureModal v-model="isSignatureModalVisible" @signatureSaved="handleSignature" />

        <template #footer>
            <CommonButton label="취소" color="#F1F1FD" textColor="#6360AB" @click="closeModal" />
            <CommonButton label="등록" color="#6360AB" textColor="#FFFFFF" @click="onRegister" />
        </template>
    </Modal>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onUpdated, nextTick, onMounted } from 'vue';
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
const content = ref(''); // CKEditor의 현재 내용
const title = ref('');
const initialHtml = `
    <!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>자동차 매매 계약서</title>
</head>

<body style="font-family: 'Noto Sans KR', sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 800px; margin: auto; background-color: white; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <!-- 상단 로고 및 계약 정보 -->
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 24px; margin-bottom: 10px;">기아 자동차 매매 계약서</h1>
        </div>

        <!-- 관리 번호 및 계약 정보 -->
        <section style="margin-top: 20px;">
            <h2 style="background-color: #333; color: #fff; padding: 10px; font-size: 18px;">계약 정보</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #ddd;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f0f0f0; font-weight: bold; width: 20%;">계약일</th>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: left; width: 30%;"></td>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f0f0f0; font-weight: bold; width: 20%;">계약장소</th>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: left;"></td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f0f0f0; font-weight: bold; width: 11%;">담당자</th>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">유혜진</td>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f0f0f0; font-weight: bold; width: 11%;">전화번호</th>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">010-2222-2222</td>
                </tr>
            </table>
        </section>

        <!-- 고객 사항 -->
        <section style="margin-top: 20px;">
            <h2 style="background-color: #333; color: #fff; padding: 10px; font-size: 18px;">고객사항</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">성명</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-name-value"></td>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">상호</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-company-value">-</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">주민등록번호</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left;" class="customer-identifiNo-value">990212-2314152</td>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">사업자등록번호</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left;" class="customer-campanyNo-value">-</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">주소</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-address-value">신대방삼거리</td>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">사업자등록주소</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-campanyAddresss-value"></td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">전화(휴대폰)</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-phone-value"></td>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">구분</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-classification-value">개인</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">E-mail</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-email-value">younghee@example.com</td>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">구매조건</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-purchaseCondition-value">현금</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">나이</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-age-value">34</td>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">성별</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-sex-value">남자</td>
                </tr>
            </table>
        </section>

        <!-- 차량 사항 -->
        <section style="margin-top: 20px;">
            <h2 style="background-color: #333; color: #fff; padding: 10px; font-size: 18px;">차량사항</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">차종</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-carName-value">셀토스</td>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">일련번호</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-serialNo-value">KNJFA42DALU3C00004</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">선택옵션</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-selectOption-value"></td>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">차량대수</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;" class="customer-numberOfVehicles-value">1</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">인도예정일</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left;" class="customer-deliveryDate-value">2024-12-15</td>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">인도장소</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left;" class="customer-deliveryLocation-value">매장</td>
                </tr>
                <tr>
                    <th colspan="1" style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">특약사항</th>
                    <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: left;">- 특약사항 내용이 여기에 표시됩니다.</td>
                </tr>
            </table>
        </section>

        <!-- 금액 사항 -->
        <section style="margin-top: 20px;">
            <h2 style="background-color: #333; color: #fff; padding: 10px; font-size: 18px;">금액사항</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">차량가격</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 82%" class="customer-vehiclePrice-value">10000</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">계약금</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 82%" class="customer-downPayment-value">2000</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">중도금</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 82%" class="customer-intermediatePayment-value">1000</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">인도금</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 82%" class="customer-remainderPayment-value">1000</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">탁송료</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 82%" class="customer-consignmentPayment-value">1000</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f0f0f0; font-weight: bold;">합계</th>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 82%" class="customer-totalSales-value">15000</td>
                </tr>
            </table>
        </section>

        <!-- 서명 -->
        <section style="margin-top: 20px;">
            <p style="margin-top: 30px;">본 계약서 주요 내용을 확인하고 계약을 체결하였음을 확인합니다.</p>
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <div>매수인
        <div
            id="signature-area"
            style="border: 1px dashed #ccc; padding: 10px; text-align: center; cursor: pointer;"
        >
            (서명)
        </div>:유혜진</div>
                <div>매도인 (서명):강남</div>
            </div>
        </section>
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
        createdUrl: html // HTML 전체를 전송
    };
};

const handleEditorUpdate = (newContent) => {
    content.value = newContent;

    nextTick(() => {
        const signatureArea = document.querySelector("#signature-area");
        if (signatureArea) {
            console.log("Signature area found:", signatureArea);
        } else {
            console.warn("Signature area not found after content update.");
        }
    });
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

        const response = await $api.contract.post(postData, "");
        console.log("POST 요청:", postData);
        console.log("POST 응답:", response);

        alert("계약서가 성공적으로 등록되었습니다.");
        emit('refresh');
        closeModal();
    } catch (error) {
        console.error("등록 중 오류:", error);
        alert("등록 중 문제가 발생했습니다: " + error.message);
    }
};

const ckEditorRef = ref(null);

// 에디터 준비 완료 시 호출되는 핸들러
const onEditorReady = (editor) => {
    console.log("CKEditor is ready");
    ckEditorRef.value = editor;

    nextTick(() => {
        const signatureArea = document.querySelector("#signature-area");
        if (signatureArea) {
            console.log("Signature area found:", signatureArea);
        } else {
            console.warn("Signature area not found.");
        }
    });
};

setTimeout(() => {
    const signatureArea = document.querySelector("#signature-area");
    if (signatureArea) {
        console.log("Signature area found:", signatureArea);
    } else {
        console.warn("Signature area not found after timeout.");
    }
}, 100); // 필요한 경우 100ms 지연 시간을 조정

// 서명 영역 클릭 이벤트 바인딩 함수
const bindSignatureAreaClick = () => {
    const observer = new MutationObserver(() => {
        const signatureArea = document.getElementById("signature-area");
        console.log("ssss: " + signatureArea);
        if (signatureArea) {
            console.log("Signature area dynamically detected:", signatureArea);

            signatureArea.addEventListener("click", () => {
                console.log("Signature area clicked");
                isSignatureModalVisible.value = true; // 서명 모달 열기
            });
            observer.disconnect(); // 더 이상 관찰 필요 없음
        }
    });
    // const signatureArea = document.querySelector("#signature-area");
    // if (signatureArea) {
    //     console.log("Signature area found:", signatureArea);

    //     // 클릭 이벤트 바인딩
    //     signatureArea.addEventListener("click", () => {
    //         console.log("Signature area clicked");
    //         isSignatureModalVisible.value = true; // 서명 모달 열기
    //     });
    // } else {
    //     console.warn("Signature area not found.");
    // }
};


const handleEditorReady = (editor) => {
    console.log("CKEditor is ready");
    // 래퍼런스에 에디터 저장
    ckEditorRef.value = editor;
};

// 서명 모달 열기
const openSignatureModal = () => {
    console.log("Signature modal opened.");
    isSignatureModalVisible.value = true;
};

const handleSignature = (signatureData) => {
    console.log("Signature received:", signatureData);
    const updatedHtml = content.value.replace(
        '<div id="signature-area" style="border: 1px dashed #ccc; padding: 10px; text-align: center; cursor: pointer;">서명을 클릭하여 추가하세요</div>',
        `<img src="${signatureData}" alt="서명 이미지" style="max-width: 100%; height: auto;" />`
    );
    content.value = updatedHtml;
    isSignatureModalVisible.value = false;
};

const editorInstance = ref(null);

const observeDOMChanges = () => {
    const observer = new MutationObserver(() => {
        const signatureArea = document.getElementById("signature-area");
        console.log("ssss: " + signatureArea);
        if (signatureArea) {
            console.log("Signature area dynamically detected:", signatureArea);
            observer.disconnect(); // 더 이상 관찰 필요 없음
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

// 호출 시점에 맞춰 실행
onMounted(() => {
    nextTick(() => {
        bindSignatureAreaClick();
    });
});

onUpdated(() => {
    bindSignatureAreaClick();
});

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
</style>