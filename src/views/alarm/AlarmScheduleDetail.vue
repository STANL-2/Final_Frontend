<template>
    <div v-if="alarm" class="alarm-detail-container">
        <div class="alarm-detail-header">
            <div class="member-info">
                <img v-if="member.profileImageUrl" :src="member.profileImageUrl" alt="Profile" class="profile-image" />
                <span class="member-name">{{ member.name || "이름 없음" }}</span>
            </div>
        </div>

        <div class="alarm-detail-content">
            <h3 class="message">{{ alarm.message }}</h3>
            <p class="created-at">{{ formatDate(alarm.createdAt) }}</p>

            <!-- 태그별 조건부 상세 정보 렌더링 -->
            <div v-if="detailInfo" class="additional-details">
                <!-- 미팅/회의/휴가/교육 -->
                <template v-if="alarm.type == 'SCHEDULE'">
                    <h4>{{ alarm.tag }} 상세 정보</h4>
                    <div class="detail-grid">
                        <div v-if="detailInfo.startDateTime" class="detail-item">
                            <strong>시작 시간:</strong> {{ formatDate(detailInfo.startDateTime) }}
                        </div>
                        <div v-if="detailInfo.endDateTime" class="detail-item">
                            <strong>종료 시간:</strong> {{ formatDate(detailInfo.endDateTime) }}
                        </div>
                        <div v-if="detailInfo.location" class="detail-item">
                            <strong>장소:</strong> {{ detailInfo.location }}
                        </div>
                        <div v-if="detailInfo.participants" class="detail-item">
                            <strong>참석자:</strong> {{ detailInfo.participants }}
                        </div>
                    </div>
                </template>

                <!-- 공지사항 -->
                <template v-else-if="alarm.type == 'NOTICE'">
                    <h4>{{ alarm.tag }} 공지사항</h4>
                    <div class="detail-grid">
                        <div v-if="detailInfo.title" class="detail-item">
                            <strong>제목:</strong> {{ detailInfo.title }}
                        </div>
                        <div v-if="detailInfo.writer" class="detail-item">
                            <strong>태그</strong> {{ detailInfo.tag }}
                        </div>
                        <div v-if="detailInfo.createdAt" class="detail-item">
                            <strong>내용</strong> {{ truncateContent(detailInfo.content) }}
                        </div>
                    </div>
                </template>

                <!-- 계약서 -->
                <template v-else-if="alarm.tag === '계약서'">
                    <h4>계약서 정보</h4>
                    <div class="detail-grid">
                        <div v-if="detailInfo.contractNumber" class="detail-item">
                            <strong>계약 번호:</strong> {{ detailInfo.contractNumber }}
                        </div>
                        <div v-if="detailInfo.contractAmount" class="detail-item">
                            <strong>계약 금액:</strong> {{ detailInfo.contractAmount.toLocaleString() }}원
                        </div>
                        <div v-if="detailInfo.contractDate" class="detail-item">
                            <strong>계약 날짜:</strong> {{ formatDate(detailInfo.contractDate) }}
                        </div>
                        <div v-if="detailInfo.contractParty" class="detail-item">
                            <strong>계약 상대방:</strong> {{ detailInfo.contractParty }}
                        </div>
                    </div>
                </template>

                <!-- 수주서/발주서 -->
                <template v-if="alarm.tag === '수주서'">
                    <h4>수주서 정보</h4>
                    <div class="detail-grid">
                        <div v-if="detailInfo.orderNumber" class="detail-item">
                            <strong>수주 번호:</strong> {{ detailInfo.orderNumber }}
                        </div>
                        <div v-if="detailInfo.totalAmount" class="detail-item">
                            <strong>총 금액:</strong> {{ detailInfo.totalAmount.toLocaleString() }}원
                        </div>
                        <div v-if="detailInfo.orderDate" class="detail-item">
                            <strong>수주 날짜:</strong> {{ formatDate(detailInfo.orderDate) }}
                        </div>
                        <div v-if="detailInfo.customer" class="detail-item">
                            <strong>고객:</strong> {{ detailInfo.customer }}
                        </div>
                    </div>
                </template>

                <template v-else-if="alarm.tag === '발주서'">
                    <h4>발주서 정보</h4>
                    <div class="detail-grid">
                        <div v-if="detailInfo.orderNumber" class="detail-item">
                            <strong>발주 번호:</strong> {{ detailInfo.orderNumber }}
                        </div>
                        <div v-if="detailInfo.totalAmount" class="detail-item">
                            <strong>총 금액:</strong> {{ detailInfo.totalAmount.toLocaleString() }}원
                        </div>
                        <div v-if="detailInfo.orderDate" class="detail-item">
                            <strong>발주 날짜:</strong> {{ formatDate(detailInfo.orderDate) }}
                        </div>
                        <div v-if="detailInfo.customer" class="detail-item">
                            <strong>공급업체:</strong> {{ detailInfo.customer }}
                        </div>
                    </div>
                </template>

                <!-- 기타 추가 정보 -->
                <div v-if="alarm.additionalDetails" class="additional-custom-details">
                    <div v-for="(value, key) in alarm.additionalDetails" :key="key" class="detail-item">
                        <strong>{{ formatKey(key) }}:</strong> {{ value }}
                    </div>
                </div>
            </div>

            <div v-if="alarm.redirectUrl" class="action-buttons">
                <button @click="goToRelatedPage" class="view-details-btn">
                    관련 페이지 보기
                </button>
            </div>
        </div>
    </div>
    <div v-else class="no-alarm-selected">
        알림을 선택해주세요.
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import ApiService from '@/services/api/config/ApiService';

const apiMemberService = new ApiService('api/v1/member');
const apiScheduleService = new ApiService('api/v1/schedule');
const apiNoticeService = new ApiService('api/v1/notice');
const apiContractService = new ApiService('api/v1/contract');
const apiPurchaseOrderService = new ApiService('api/v1/purchase-order');
const apiOrderService = new ApiService('api/v1/order');

const router = useRouter();

const props = defineProps({
    alarm: {
        type: Object,
        required: true
    }
});

const member = ref({
    name: '',
    profileImageUrl: ''
});

const detailInfo = ref(null);

// content를 최대 30글자로 자르고, 초과 시 "..." 추가
const truncateContent = (htmlContent) => {
    if (!htmlContent) return '';

    // <p> 태그 내의 내용을 추출
    const paragraphMatch = htmlContent.match(/<p[^>]*>(.*?)<\/p>/);
    if (!paragraphMatch || !paragraphMatch[1]) return '';

    const paragraphText = paragraphMatch[1].trim();

    // 70글자 내외로 자르고 초과 시 "..." 추가
    return paragraphText.length > 200
        ? paragraphText.substring(0, 200) + '...'
        : paragraphText;
};

// Member 정보 조회 함수
const fetchMemberInfo = async () => {
    if (props.alarm && props.alarm.adminId) {

        try {
            const response = await apiMemberService.get(
                'memberInfo',
                `${props.alarm.adminId}`,
                ''
            );

            member.value = {
                name: response.result.name || "이름 없음",
                profileImageUrl: response.result.imageUrl || null
            };
        } catch (error) {
            console.error("Failed to fetch member info:", error);
            member.value = { name: '', profileImageUrl: '' };
        }
    } else {
        member.value = { name: '', profileImageUrl: '' };
    }
};

// 스케줄 정보 조회 함수들
const fetchScheduleInfo = async () => {
    const scheduleTypes = ['미팅', '회의', '휴가', '교육'];
    if (scheduleTypes.includes(props.alarm.tag)) {
        try {
            const response = await apiScheduleService.get(
                '',
                `${props.alarm.referenceId}`,
                ''
            );
            detailInfo.value = response;
        } catch (error) {
            console.error("Failed to fetch schedule info:", error);
        }
    }
};

const fetchNoticeInfo = async () => {
    const noticeTypes = ['중요', '일반'];
    if (noticeTypes.includes(props.alarm.tag)) {
        try {
            const response = await apiNoticeService.get(
                '',
                `${props.alarm.contentId}`,
                ''
            );

            console.log("response", response);

            detailInfo.value = response;
        } catch (error) {
            console.error("Failed to fetch notice info:", error);
        }
    }
};

const fetchContractInfo = async () => {
    if (props.alarm.tag === '계약서') {
        try {
            const response = await apiContractService.get(
                'contractDetail',
                `${props.alarm.contentId}`,
                ''
            );
            detailInfo.value = response;
        } catch (error) {
            console.error("Failed to fetch contract info:", error);
        }
    }
};

const fetchPurchaseOrderInfo = async () => {
    if (props.alarm.tag === '수주서') {
        try {
            const response = await apiPurchaseOrderService.get(
                'purchaseOrderDetail',
                `${props.alarm.contentId}`,
                ''
            );
            detailInfo.value = response;
        } catch (error) {
            console.error("Failed to fetch purchase order info:", error);
        }
    }
};

const fetchOrderInfo = async () => {
    if (props.alarm.tag === '발주서') {
        try {
            const response = await apiOrderService.get(
                'orderDetail',
                `${props.alarm.contentId}`,
                ''
            );
            detailInfo.value = response;
        } catch (error) {
            console.error("Failed to fetch order info:", error);
        }
    }
};

// 알림을 클릭할 때마다 조회
watch(() => props.alarm, async (newAlarm) => {
    if (newAlarm) {
        await fetchMemberInfo();

        // 알림 태그에 따라 적절한 정보 조회 함수 호출
        switch (newAlarm.tag) {
            case '미팅':
            case '회의':
            case '휴가':
            case '교육':
                await fetchScheduleInfo();
                break;
            case '중요':
            case '일반':
                await fetchNoticeInfo();
                break;
            case '계약서':
                await fetchContractInfo();
                break;
            case '수주서':
                await fetchPurchaseOrderInfo();
                break;
            case '발주서':
                await fetchOrderInfo();
                break;
        }
    }
}, { immediate: true });

// 알림 상세 페이지로 이동
const goToRelatedPage = () => {
    if (props.alarm.redirectUrl) {
        router.push(props.alarm.redirectUrl);
    }
};

// 날짜 포맷터
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// 키 포맷터
const formatKey = (key) => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, (str) => str.toUpperCase());
};

// 알림을 클릭할 떄 마다 조회
watch(() => props.alarm, async (newAlarm) => {
    if (newAlarm) {
        await fetchMemberInfo();
    }
}, { immediate: true });

</script>

<style scoped>
.alarm-detail-container {
    position: fixed;
    background-color: white;
    border-radius: 8px;
    width: 450px;
    height: 480px;
    padding: 1rem;
    margin-left: 5px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    border: 2px solid #ddd;
}

.alarm-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.member-info {
    display: flex;
    align-items: center;
}

.profile-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.member-name {
    font-size: 14px;
    font-weight: bold;
    color: #333;
}

.alarm-detail-content {
    flex-grow: 1;
}

.message {
    font-size: 18px;
    margin-bottom: 10px;
    line-height: 1.5;
}

.created-at {
    color: #777;
    margin-bottom: 15px;
}

.additional-details {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
}

.detail-item {
    margin-bottom: 10px;
}

.action-buttons {
    display: flex;
    justify-content: flex-start;
}

.view-details-btn {
    background-color: #6360AB;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.view-details-btn:hover {
    background-color: #4a48a2;
}

.no-alarm-selected {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #777;
    font-size: 16px;
}
</style>
