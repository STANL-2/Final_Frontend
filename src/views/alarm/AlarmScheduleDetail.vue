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

            <div v-if="alarm.additionalDetails" class="additional-details">
                <div v-for="(value, key) in alarm.additionalDetails" :key="key" class="detail-item">
                    <strong>{{ formatKey(key) }}:</strong> {{ value }}
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
import { ref, watch, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { $api } from '@/services/api/api';

const router = useRouter();

const props = defineProps({
    alarm: {
        type: Object,
        default: null
    }
});

const member = ref({
    name: '',
    profileImageUrl: ''
});

watch(
    () => props.alarm,
    async (newAlarm) => {
        if (newAlarm && newAlarm.memberId) {
            try {

                const response = $api.member.get(
                    ''
                )
            } catch (error) {
                console.error('Failed to fetch member info:', error);
            }
        } else {
            member.value = { name: '', profileImageUrl: '' };
        }
    },
    { immediate: true }
);

const getTagColor = (tag) => {
    const tagColors = {
        '미팅': '#AEC6CF',
        '교육': '#FFDAB9',
        '휴가': '#B0E57C',
        '회의': '#FFB7C5',
        '계약서': '#A7D8DE',
        '발주서': '#FFE4E1',
        '수주서': '#B9E4C9',
        '중요': '#FF6347',
        '일반': '#32CD32'
    };
    return tagColors[tag] || '#DDD';
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatKey = (key) => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, (str) => str.toUpperCase());
};

const goToRelatedPage = () => {
    if (props.alarm.redirectUrl) {
        router.push(props.alarm.redirectUrl);
    }
};
</script>

<style scoped>
.alarm-detail-container {
    background-color: white;
    border-radius: 8px; 
    width: 550px;
    height: 500px;
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
