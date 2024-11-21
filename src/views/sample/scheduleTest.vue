<template>
    <div class="calendar-container">
        <div ref="calendarEl"></div>
        <div v-if="showEventForm" class="event-form">
            <h3>일정 등록</h3>
            <form @submit.prevent="addEvent">
                <div>
                    <label for="title">제목:</label>
                    <input type="text" id="title" v-model="newEvent.title" required />
                </div>
                <div>
                    <label for="start">시작 날짜:</label>
                    <input type="date" id="start" v-model="newEvent.start" required />
                </div>
                <div>
                    <label for="end">종료 날짜:</label>
                    <input type="date" id="end" v-model="newEvent.end" />
                </div>
                <button type="submit">등록</button>
                <button type="button" @click="closeEventForm">취소</button>
            </form>
        </div>
    </div>
</template>

<script>
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
    data() {
        return {
            showEventForm: false, // 일정 등록 폼 표시 여부
            newEvent: {
                title: '',
                start: '',
                end: '',
            },
            calendar: null, // 캘린더 인스턴스
        };
    },
    mounted() {
        this.initCalendar();
    },
    methods: {
        initCalendar() {
            const calendarEl = this.$refs.calendarEl;

            this.calendar = new Calendar(calendarEl, {
                plugins: [dayGridPlugin, interactionPlugin],
                initialView: 'dayGridMonth',
                locale: 'en',
                headerToolbar: {
                    left: 'title',
                    center: '' ,
                    right: 'customAddEvent prev,next',
                },
                views: {
                    dayGridMonth: {
                        titleFormat: {
                            month: 'long',
                        }
                    }
                },
                customButtons: {
                    customAddEvent: {
                        text: '일정 등록',
                        click: () => {
                            this.openEventForm();
                        },
                    },
                },
                events: [
                    { title: 'All Day Event', start: '2024-11-01', color: '#FF5733' },
                    { title: 'Long Event', start: '2024-11-07', end: '2024-11-10', color: '#33FF57' },
                    { title: 'Conference', start: '2024-11-10', end: '2024-11-12', color: '#3357FF' },
                ],
                editable: true,
            });

            this.calendar.render();
        },
        openEventForm() {
            this.showEventForm = true;
        },
        closeEventForm() {
            this.showEventForm = false;
            this.newEvent = {
                title: '',
                start: '',
                end: '',
            };
        },
        addEvent() {
            // 캘린더에 새 일정 추가
            this.calendar.addEvent(this.newEvent);
            this.closeEventForm();
        },
    },
};
</script>

<style scoped>
/* 캘린더 컨테이너 크기 및 중앙 정렬 */
.calendar-container {
    max-width: 1300px;
    margin: 0 auto;
    padding: 2rem;
}

/* 캘린더 기본 스타일 */
.fc {
    font-family: Arial, sans-serif;
    font-size: 1rem;
}

.fc-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.fc-toolbar-chunk {
    display: flex; /* 가로로 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
    gap: 1rem; /* 요소 간 간격 추가 */
}

.fc-toolbar-title {
    font-size: 2rem; /* 타이틀 크기 */
    font-weight: bold;
    margin: 0;
    text-align: center;
}

/* 네비게이션 버튼 */
.fc-prev-button .fc-button .fc-button-primary{
    background-color: #B0DDFF;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
}

.fc-button:hover {
    background-color: #0056b3;
}

/* 이벤트 스타일 */
.fc-event {
    border: none;
    padding: 0.5rem;
    border-radius: 0.25rem;
    color: #fff;
    font-size: 0.9rem;
}

/* 주말 배경 색상 */
.fc-day-sat,
.fc-day-sun {
    background-color: #f9f9f9;
}

/* 오늘 날짜 강조 */
.fc-day-today {
    background-color: #e6f7ff;
    border: 1px solid #007bff;
}

/* 캘린더 셀 테두리 */
.fc-daygrid-day {
    border: 1px solid #ddd;
}

/* 일정 등록 폼 스타일 */
.event-form {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    padding: 1.5rem;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.event-form h3 {
    margin-bottom: 1rem;
    font-size: 1.25rem;
}

.event-form form div {
    margin-bottom: 1rem;
}

.event-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.event-form input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
}

.event-form button {
    margin-right: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
}

.event-form button[type="submit"] {
    background-color: #007bff;
    color: white;
}

.event-form button[type="button"] {
    background-color: #ccc;
    color: black;
}
</style>