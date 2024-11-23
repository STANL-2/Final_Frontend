<template>
    <div class="calendar-container">
        <div ref="calendarEl"></div>

        <div v-if="showSmallCalendar" class="small-calendar-dropdown" ref="smallCalendarDropdown">
            <input type="date" v-model="selectedDate" @change="goToSelectedDate" class="small-calendar-input" />
        </div>

        <!-- Tag Dropdown -->
        <div v-if="showTagDropdown" class="tag-dropdown" ref="tagDropdown">
            <ul>
                <li v-for="tag in tags" :key="tag" @click="selectTag(tag)" class="tag-item">
                    <input type="checkbox" :id="tag" :value="tag" v-model="selectedTags" />
                    <label :for="tag">{{ tag }}</label>
                </li>
            </ul>
        </div>

        <!-- Event Modal -->
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
import tagSvg from '@/assets/icon/scheduleIcons/tag.svg';
import calendarSvg from '@/assets/icon/scheduleIcons/calendar.svg';

export default {
    data() {
        return {
            calendar: null,
            tags: ['Work', 'Personal', 'Important', 'Family', 'Projects'],
            selectedTags: [],
            showTagDropdown: false,
            showEventModal: false,
            showSmallCalendar: false,
            selectedDate: '',
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
                    left: ' today  prev next title',
                    center: '',
                    right: 'customCalendarButton customTagsButton customAddEventButton',
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
                    customCalendarButton: {
                        text: '',
                        click: () => {
                            this.toggleSmallCalendar();
                        },
                    },
                    customTagsButton: {
                        text: '',
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

            const customCalendarButton = calendarEl.querySelector('.fc-customCalendarButton-button');
            if (customCalendarButton) {
                const svgContainer = document.createElement('img');
                svgContainer.src = calendarSvg; // Calendar SVG 파일 경로를 이미지 src로 설정
                svgContainer.style.width = '1.2rem';
                svgContainer.style.height = '1.2rem';
                customCalendarButton.innerHTML = ''; // 기존 내용을 초기화
                customCalendarButton.appendChild(svgContainer); // SVG 추가
            }

            const customTagsButton = calendarEl.querySelector('.fc-customTagsButton-button');
            if (customTagsButton) {
                const svgContainer = document.createElement('img');
                svgContainer.src = tagSvg; // SVG 파일 경로를 이미지 src로 설정
                svgContainer.style.width = '1.2rem';
                svgContainer.style.height = '1.2rem';
                customTagsButton.innerHTML = ''; // 기존 내용을 초기화
                customTagsButton.appendChild(svgContainer); // SVG 추가
            }
        },
        toggleSmallCalendar() {
            this.showSmallCalendar = !this.showSmallCalendar;
        },
        goToSelectedDate() {
            if (this.selectedDate) {
                this.calendar.gotoDate(this.selectedDate); // FullCalendar 날짜 이동
                this.showSmallCalendar = false; // 작은 달력 닫기
            }
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
    position: relative;
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

::v-deep(.fc .fc-button-primary:disabled) {
    background-color: white;
    border-color: #333;
}

::v-deep(.fc-button.fc-button-disabled) {
    cursor: not-allowed;
}

::v-deep(.fc-today-button .fc-button .fc-button-primary) {
    border: #333;
}

::v-deep(.fc-daygrid-day-frame) {
    height: 8rem;
    box-sizing: border-box;
}

.small-calendar-dropdown {
    position: absolute;
    top: 50px;
    left: 120px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 10px;
}

.small-calendar-input {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}

::v-deep(.fc-customCalendarButton-button),
::v-deep(.fc-customTagsButton-button),
::v-deep(.fc-customAddEventButton-button) {
    background-color: #6360AB !important;
    color: white !important;
    font-size: 1rem !important;
    border-radius: 4px;
    padding: 0.4rem;
    margin-left: 0.5rem;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

::v-deep(.fc-customCalendarButton-button:hover),
::v-deep(.fc-customTagsButton-button:hover),
::v-deep(.fc-customAddEventButton-button:hover) {
    background-color: #4c4a96 !important;
}

::v-deep(.fc-toolbar-chunk) {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    /* 버튼 간 간격 추가 */
    align-items: center;
    justify-content: flex-start;
}

::v-deep(.fc-customTagsButton-button),
::v-deep(.fc-customCalendarButton-button) {
    background-color: white !important;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    display: flex;
}

::v-deep(.fc-customCalendarButton-button img),
::v-deep(.fc-customTagsButton-button img) {
    width: 3rem;
    height: 3rem;
}

::v-deep(.fc-customAddEventButton-button){
    background-color: #6360AB !important;
    color: white !important;
}

::v-deep(.fc-customTagsButton-button:hover),
::v-deep(.fc-customAddEventButton-button:hover),
::v-deep(.fc-customCalendarButton-button:hover) {
    background-color: #4c4a96 !important;
}

::v-deep(.fc-customTagsButton-button) {
    padding: 0.4rem !important;
    width: 2.5rem;
    height: 2.5rem;
}

::v-deep(.fc-customTagsButton-button svg) {
    width: 1.2rem;
    height: 1.2rem;
    stroke: white;
}

::v-deep(.fc-customTagsButton-button:hover),
::v-deep(.fc-customAddEventButton-button:hover) {
    background-color: #4c4a96 !important;
}

.tag-dropdown {
    position: absolute;
    right: 120px;
    top: 50px;
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