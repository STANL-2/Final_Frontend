<template>
    <div v-if="alarm" class="alarm-detail-container">
        <div class="alarm-detail-header">
            <span class="tag" :style="{ backgroundColor: getTagColor(alarm.tag) }">
                {{ alarm.tag }}
            </span>
            <button class="close-button" @click="$emit('close')">
                <i class="pi pi-times"></i>
            </button>
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
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    alarm: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close']);

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
    // Convert camelCase or snake_case to readable text
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, str => str.toUpperCase());
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
    padding: 20px;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.alarm-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.tag {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    color: white;
}

.close-button {
    background: none;
    border: none;
    color: #777;
    cursor: pointer;
    font-size: 18px;
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