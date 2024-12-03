<template>
    <div v-if="alarm" class="alarm-detail-container">
        <div class="alarm-detail-header">
            <div class="member-info">
                <img v-if="admin.profileImageUrl" :src="admin.profileImageUrl" alt="Profile" class="profile-image" />
                <span class="member-name">{{ admin.name || "이름 없음" }}</span>
            </div>
            <p class="created-at">{{ formatDate(alarm.createdAt) }}</p>
        </div>

        <div class="alarm-detail-content">
            <h3 class="message">{{ alarm.message }}</h3>

            <!-- 태그별 조건부 상세 정보 렌더링 -->
            <div v-if="detailInfo" class="additional-details">
                <!-- 미팅/회의/휴가/교육 -->
                <template v-if="alarm.type == 'SCHEDULE'">
                    <div class="detail-grid">
                        <div v-if="detailInfo?.result.name" class="detail-item title-with-date">
                            <strong>[</strong> {{ detailInfo.result.name }} <strong>]</strong>
                            <span class="created-at">{{ formatDate(detailInfo.result.createdAt) }}</span>
                        </div>
                        <div v-if="detailInfo?.result.content" class="detail-item">
                            <strong>내용: </strong> {{ detailInfo.result.content }}
                        </div>
                        <div v-if="detailInfo?.result.tag" class="detail-item">
                            <span class="tag" :style="{
                                backgroundColor: getTagColor(tagMapping(detailInfo.result.tag)),
                            }">
                                {{ tagMapping(detailInfo.result.tag) }}
                            </span>
                        </div>
                        <div v-if="detailInfo?.result.startAt" class="detail-item">
                            <strong>시작일자: </strong> {{ detailInfo.result.startAt }}
                        </div>
                        <div v-if="detailInfo?.result.endAt" class="detail-item">
                            <strong>종료일자: </strong> {{ detailInfo.result.endAt }}
                        </div>
                    </div>
                </template>

                <!-- 공지사항 -->
                <template v-else-if="alarm.type == 'NOTICE'">
                    <h4>{{ alarm.tag }} 공지사항</h4>
                    <div class="detail-grid">
                        <div v-if="detailInfo.title" class="detail-item title-with-date">
                            <strong>제목:</strong> {{ detailInfo.title }}
                            <span class="created-at">{{ formatDate(detailInfo.createdAt) }}</span>
                        </div>
                        <div v-if="detailInfo.tag" class="detail-item">
                            <strong>태그</strong> {{ detailInfo.tag }}
                        </div>
                        <div v-if="detailInfo.createdAt" class="detail-item">
                            <strong>내용</strong> {{ truncateContent(detailInfo.content) }}
                        </div>
                    </div>
                </template>

                <!-- 계약서 -->
                <template v-else-if="alarm.tag === '계약서'">
                    <div class="detail-grid">
                        <div v-if="detailInfo?.result.title" class="detail-item title-with-date">
                            <strong>[</strong> {{ detailInfo.result.title }} <strong>]</strong>
                            <span class="created-at">{{ formatDate(detailInfo.result.createdAt) }}</span>
                        </div>
                        <div v-if="alarm.tag" class="detail-contract-item">
                            <strong>태그: </strong>
                            <span class="tag" :style="{
                                backgroundColor: getTagColor(alarm.tag),
                            }">
                                {{ alarm.tag }}
                            </span>
                        </div>
                        <div v-if="detailInfo?.result.carName" class="detail-contract-item">
                            <strong>차량: </strong> {{ detailInfo.result.carName }}
                        </div>
                        <div v-if="detailInfo.result.status" class="detail-contract-item">
                            <strong>승인 상태: </strong>
                            <span class="tag" :style="{
                                backgroundColor: getTagColor(tagMapping(detailInfo.result.status)),
                            }">
                                {{ tagMapping(detailInfo.result.status) }}
                            </span>
                        </div>
                        <div v-if="detailInfo?.result.createdUrl" class="detail-contract-item">
                            <a :href="detailInfo.result.createdUrl" download target="_blank">다운로드</a>
                        </div>
                        <div v-if="detailInfo?.result.totalSales" class="detail-contract-item">
                            <strong>총 금액: </strong> {{ detailInfo.result.totalSales }}
                        </div>
                        <div v-if="detailInfo?.result.createdAt" class="detail-contract-item">
                            <strong>생성 일자: </strong> {{ detailInfo.result.createdAt }}
                        </div>
                    </div>
                </template>

                <!-- 수주서/발주서 -->
                <template v-if="alarm.tag === '수주서'">
                    <div class="detail-grid">
                        <div v-if="detailInfo?.result.title" class="detail-item title-with-date">
                            <strong>[</strong> {{ detailInfo.result.title }} <strong>]</strong>
                            <span class="created-at">{{ formatDate(detailInfo.result.createdAt) }}</span>
                        </div>
                        <div v-if="alarm.tag" class="detail-item">
                            <strong>태그: </strong>
                            <span class="tag" :style="{
                                backgroundColor: getTagColor(alarm.tag),
                            }">
                                {{ alarm.tag }}
                            </span>
                        </div>
                        <div v-if="detailInfo.result.status" class="detail-item">
                            <strong>승인 상태: </strong>
                            <span class="tag" :style="{
                                backgroundColor: getTagColor(tagMapping(detailInfo.result.status)),
                            }">
                                {{ tagMapping(detailInfo.result.status) }}
                            </span>
                        </div>
                        <div v-if="detailInfo?.result.content" class="detail-item">
                            <a :href="detailInfo.result.content" download target="_blank">다운로드</a>
                        </div>
                        <div v-if="detailInfo?.result.createdAt" class="detail-item">
                            <strong>생성 일자</strong> {{ detailInfo.result.createdAt }}
                        </div>
                    </div>
                </template>

                <!-- 발주서 -->
                <template v-else-if="alarm.tag === '발주서'">
                    <div class="detail-grid">
                        <div v-if="detailInfo?.result.title" class="detail-item title-with-date">
                            <strong>[</strong> {{ detailInfo.result.title }} <strong>]</strong>
                            <span class="created-at">{{ formatDate(detailInfo.result.createdAt) }}</span>
                        </div>
                        <div v-if="alarm.tag" class="detail-item">
                            <strong>태그: </strong>
                            <span class="tag" :style="{
                                backgroundColor: getTagColor(alarm.tag),
                            }">
                                {{ alarm.tag }}
                            </span>
                        </div>
                        <div v-if="detailInfo.result.status" class="detail-item">
                            <strong>승인 상태: </strong>
                            <span class="tag" :style="{
                                backgroundColor: getTagColor(tagMapping(detailInfo.result.status)),
                            }">
                                {{ tagMapping(detailInfo.result.status) }}
                            </span>
                        </div>
                        <div v-if="detailInfo?.result.content" class="detail-item">
                            <a :href="detailInfo.result.content" download target="_blank">다운로드</a>
                        </div>
                        <div v-if="detailInfo?.result.createdAt" class="detail-item">
                            <strong>생성 일자:</strong> {{ detailInfo.result.createdAt }}
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
    profileImageUrl: '',
    position: ''
});

const admin = ref({
    name: '',
    profileImageUrl: '',
    position: ''
});

const tagMapping = (tag) => {
    const tagMap = {
        'MEETING': '미팅',
        'TRAINING': '교육',
        'VACATION': '휴가',
        'SESSION': '회의',
        'IMPORTANT': '중요',
        'NORMAL': '일반',
        'APPROVED': '승인'
    };

    return tagMap[tag] || tag; // 일치하는 값이 없으면 원래 값 반환
};


const tagColors = [
    { name: '미팅', color: '#AEC6CF' },
    { name: '교육', color: '#FFDAB9' },
    { name: '휴가', color: '#B0E57C' },
    { name: '회의', color: '#FFB7C5' },
    { name: '계약서', color: '#A7D8DE' },
    { name: '발주서', color: '#FFE4E1' },
    { name: '수주서', color: '#B9E4C9' },
    { name: '중요', color: '#FFB3B3' },
    { name: '일반', color: '#E0FFB3' },
    { name: '승인', color: '#B3FFB3' },
];

const getTagColor = (tag) => {

    const tagData = tagColors.find(item => item.name === tag);
    return tagData ? tagData.color : '#DDD'; // 기본 회색
};

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
            const memResponse = await apiMemberService.get(
                'memberInfo',
                `${props.alarm.memberId}`,
                ''
            );

            member.value = {
                name: memResponse.result.name || "이름 없음",
                profileImageUrl: memResponse.result.imageUrl || null,
                position: memResponse.result.position || null
            };

            const admResponse = await apiMemberService.get(
                'memberInfo',
                `${props.alarm.adminId}`,
                ''
            );

            admin.value = {
                name: admResponse.result.name || "이름 없음",
                profileImageUrl: admResponse.result.imageUrl || null,
                position: memResponse.result.position || null
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

    console.log("alarm", props.alarm);

    const scheduleTypes = ['미팅', '회의', '휴가', '교육'];
    if (scheduleTypes.includes(props.alarm.tag)) {
        try {
            const response = await apiScheduleService.get(
                '',
                `${props.alarm.contentId}`,
                ''
            );
            detailInfo.value = response;
        } catch (error) {
            console.error("Failed to fetch schedule info:", error);
        }

        console.log("response", detailInfo.value);
    } else {
        console.log('잘못된 태그 정보 입니다.');
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

            detailInfo.value = response;
        } catch (error) {
            console.error("Failed to fetch notice info:", error);
        }

        console.log("response", detailInfo.value);
    } else {
        console.log('잘못된 태그 정보 입니다.');
    }
};

const fetchContractInfo = async () => {

    if (props.alarm.tag === '계약서') {
        if (member.value.position === "영업 사원") {
            // "영업 사원"일 경우 실행할 코드
            try {
                const response = await apiContractService.get(
                    'employee',
                    `${props.alarm.contentId}`,
                    ''
                );
                detailInfo.value = response;
            } catch (error) {
                console.error("Failed to fetch contract info for 영업 사원:", error);
            }
        } else if (member.value.position === "영업 관리자") {
            // "영업 담당자"일 경우 실행할 코드
            try {
                const response = await apiContractService.get(
                    'center',
                    `${props.alarm.contentId}`,
                    ''
                );
                detailInfo.value = response;
            } catch (error) {
                console.error("Failed to fetch contract info for 영업 관리자:", error);
            }
        } else if (member.value.position === "영업 담당자") {
            // "시스템 관리자"일 경우 실행할 코드
            try {
                const response = await apiContractService.get(
                    '',
                    `${props.alarm.contentId}`,
                    ''
                );
                detailInfo.value = response;
            } catch (error) {
                console.error("Failed to fetch contract info for 영업 담당자:", error);
            }
        } else if (member.value.position === "시스템 관리자") {
            // "시스템 관리자"일 경우 실행할 코드
            try {
                const response = await apiContractService.get(
                    '',
                    `${props.alarm.contentId}`,
                    ''
                );
                detailInfo.value = response;
            } catch (error) {
                console.error("Failed to fetch contract info for 시스템 관리자:", error);
            }
        } else {
            console.log('계약정보를 가져오지 못했습니다.');
        }

        console.log("response", detailInfo.value);
    } else {
        console.log('잘못된 태그 정보 입니다.');
    }
};


const fetchPurchaseOrderInfo = async () => {

    console.log("alarm", props.alarm);

    if (props.alarm.tag === '수주서') {
        if (member.value.position === "영업 사원") {
            // "영업 사원"일 경우 실행할 코드
            try {
                const response = await apiOrderService.get(
                    'employee',
                    `${props.alarm.contentId}`,
                    ''
                );
                detailInfo.value = response;
            } catch (error) {
                console.error("Failed to fetch contract info for 영업 사원:", error);
            }
        } else if (member.value.position === "영업 관리자") {
            // "영업 담당자"일 경우 실행할 코드
            try {
                const response = await apiOrderService.get(
                    '',
                    `${props.alarm.contentId}`,
                    ''
                );
                detailInfo.value = response;
            } catch (error) {
                console.error("Failed to fetch contract info for 영업 관리자:", error);
            }
        } else if (member.value.position === "영업 담당자") {
            // "시스템 관리자"일 경우 실행할 코드
            try {
                const response = await apiOrderService.get(
                    '',
                    `${props.alarm.contentId}`,
                    ''
                );
                detailInfo.value = response;
            } catch (error) {
                console.error("Failed to fetch contract info for 영업 담당자:", error);
            }
        } else if (member.value.position === "시스템 관리자") {
            // "시스템 관리자"일 경우 실행할 코드
            try {
                const response = await apiOrderService.get(
                    '',
                    `${props.alarm.contentId}`,
                    ''
                );
                detailInfo.value = response;
            } catch (error) {
                console.error("Failed to fetch contract info for 시스템 관리자:", error);
            }
        } else {
            console.log('계약정보를 가져오지 못했습니다.');
        }

        console.log("response", detailInfo.value);
    } else {
        console.log('잘못된 태그 정보 입니다.');
    }
};

const fetchOrderInfo = async () => {

    if (props.alarm.tag === '발주서') {
        if (member.value.position === "영업 관리자") {
            // "영업 담당자"일 경우 실행할 코드
            try {
                const response = await apiPurchaseOrderService.get(
                    'admin',
                    `${props.alarm.contentId}`,
                    ''
                );
                detailInfo.value = response;
            } catch (error) {
                console.error("Failed to fetch contract info for 영업 관리자:", error);
            }
        } else if (member.value.position === "영업 담당자") {
            // "시스템 관리자"일 경우 실행할 코드
            try {
                const response = await apiPurchaseOrderService.get(
                    '',
                    `${props.alarm.contentId}`,
                    ''
                );
                detailInfo.value = response;
            } catch (error) {
                console.error("Failed to fetch contract info for 영업 담당자:", error);
            }
        } else if (member.value.position === "시스템 관리자") {
            // "시스템 관리자"일 경우 실행할 코드
            try {
                const response = await apiPurchaseOrderService.get(
                    '',
                    `${props.alarm.contentId}`,
                    ''
                );
                detailInfo.value = response;
            } catch (error) {
                console.error("Failed to fetch contract info for 시스템 관리자:", error);
            }
        } else {
            console.log('계약정보를 가져오지 못했습니다.');
        }

        console.log("response", detailInfo.value);
    } else {
        console.log('잘못된 태그 정보 입니다.');
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
</script>

<style scoped>
.alarm-detail-container {
    position: fixed;
    background-color: white;
    border-radius: 8px;
    width: 450px;
    height: 480px;
    padding: 1rem;
    margin-left: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    border: 2px solid #ddd;
}

.alarm-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
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
    font-size: 18px;
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
    display: flex;
    justify-content: center;
}

.additional-details {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    width: 414px;
    height: 280px;
}

.detail-item {
    margin-bottom: 2rem;
}

.detail-contract-item {
    margin-bottom: 1.5rem;
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

.title-with-date {
    display: inline-block; /* 같은 줄에 배치 */
    white-space: nowrap;   /* 줄바꿈 방지 */
    justify-content: space-between;
}

.title-with-date .created-at {
    display: inline-block;
    white-space: nowrap;   /* 줄바꿈 방지 */
    font-size: 12px;   /* 생성 일자의 폰트 크기 */
    color: #777;       /* 생성 일자의 색상 */
}

.tag {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 8px;
    width: 3.2rem;
    text-align: center;
    /* 텍스트 가로 정렬 */
    line-height: 1.5;
    /* 수직 정렬을 위한 줄 높이 */
    vertical-align: middle;
}
</style>
