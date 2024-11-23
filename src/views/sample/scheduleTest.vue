<template>
    <div class="calendar-container">
        <div ref="calendarEl"></div>
        <div v-if="showTagDropdown" class="tag-dropdown" ref="tagDropdown">
            <ul>
                <li
                    v-for="tag in tags"
                    :key="tag"
                    @click="selectTag(tag)"
                    class="tag-item"
                >
                    <input type="checkbox" :id="tag" :value="tag" v-model="selectedTags" />
                    <label :for="tag">{{ tag }}</label>
                </li>
            </ul>
        </div>
        <div v-if="showEventModal" class="event-modal">
            <div class="modal-content">
                <h3>일정 등록</h3>
                <form @submit.prevent="addNewEvent">
                    <div>
                        <label for="title">제목</label>
                        <input type="text" id="title" v-model="newEvent.title" required />
                    </div>
                    <div>
                        <label for="date">날짜</label>
                        <input type="date" id="date" v-model="newEvent.date" required />
                    </div>
                    <button type="submit">등록</button>
                    <button type="button" @click="closeEventModal">취소</button>
                </form>
            </div>
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
            calendar: null,
            tags: ['Work', 'Personal', 'Important', 'Family', 'Projects'],
            selectedTags: [],
            showTagDropdown: false,
            showEventModal: false,
            newEvent: {
                title: '',
                date: '',
            },
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
                locale: 'ko',
                headerToolbar: {
                    left: 'today prev,next title',
                    center: '',
                    right: 'customTagsButton customAddEventButton',
                },
                views: {
                    dayGridMonth: {
                        dayCellContent: (info) => {
                            const number = document.createElement('a');
                            number.classList.add('fc-daygrid-day-number');
                            number.innerHTML = info.dayNumberText.replace('일', '').replace('日', '');
                            return { html: number.outerHTML };
                        },
                    },
                },
                customButtons: {
                    customTagsButton: {
                        text: '태그 선택',
                        click: () => {
                            this.toggleTagDropdown();
                        },
                    },
                    customAddEventButton: {
                        text: '일정 등록',
                        click: () => {
                            this.openEventModal();
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
        toggleTagDropdown() {
            this.showTagDropdown = !this.showTagDropdown;
        },
        selectTag(tag) {
            if (!this.selectedTags.includes(tag)) {
                this.selectedTags.push(tag);
            } else {
                this.selectedTags = this.selectedTags.filter((t) => t !== tag);
            }
        },
        openEventModal() {
            this.showEventModal = true;
        },
        closeEventModal() {
            this.showEventModal = false;
            this.newEvent = { title: '', date: '' };
        },
        addNewEvent() {
            if (this.newEvent.title && this.newEvent.date) {
                this.calendar.addEvent({
                    title: this.newEvent.title,
                    start: this.newEvent.date,
                    color: '#FFC107',
                });
                alert('일정이 등록되었습니다.');
                this.closeEventModal();
            } else {
                alert('제목과 날짜를 모두 입력해주세요.');
            }
        },
    },
};
</script>

<style scoped>
.calendar-container {
    max-width: 1330px;
    margin: 0 auto;
    padding-top: 0rem;
    padding-right: 3rem;
}

.fc {
    font-family: 'Noto Sans KR', sans-serif;
    color: #333;
}

::v-deep(.fc-toolbar-title) {
    display: inline-block;
    font-size: 1.4rem;
}

::v-deep(.fc-button-primary) {
    background-color: white;
    border: none;
    padding: 0rem;
    font-size: 1.2rem;
}

::v-deep(.fc-button) {
    border: none !important;
    color: #333 !important;
    box-shadow: none !important;
    cursor: pointer;
    transition: none !important;
    font-size: 1.2rem;
}

::v-deep(.fc-button:hover) {
    background-color: inherit !important;
    color: inherit !important;
}

::v-deep(.fc-button.fc-button-active) {
    border: none !important;
}

::v-deep(.fc-button.fc-button-disabled) {
    cursor: not-allowed;
}

::v-deep(.fc-daygrid-day-frame) {
    height: 8rem;
    box-sizing: border-box;
}

::v-deep(.fc-customTagsButton-button),
::v-deep(.fc-customAddEventButton-button) {
    background-color: #6360AB !important;
    color: white !important;
    font-size: 1rem !important;
    border-radius: 4px;
    padding: 0.4rem 0.8rem;
    margin-left: 0.5rem;
    transition: background-color 0.3s ease;
}

::v-deep(.fc-customTagsButton-button:hover),
::v-deep(.fc-customAddEventButton-button:hover) {
    background-color: #4c4a96 !important;
}

.tag-dropdown {
    position: absolute;
    right: 10px;
    top: 40px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: 150px;
    padding: 10px;
}

.tag-dropdown ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.tag-dropdown .tag-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
}

.tag-dropdown .tag-item:hover {
    background-color: #f0f0f0;
}

.tag-dropdown .tag-item input {
    margin-right: 8px;
}

.event-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    width: 400px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1001;
}

.modal-content h3 {
    margin-bottom: 20px;
    text-align: center;
}

.modal-content form div {
    margin-bottom: 15px;
}

.modal-content form label {
    display: block;
    margin-bottom: 5px;
}

.modal-content form input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.modal-content button {
    padding: 8px 12px;
    margin-right: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.modal-content button[type="submit"] {
    background-color: #6360AB;
    color: white;
}

.modal-content button[type="button"] {
    background-color: #ddd;
    color: #333;
}
</style>
