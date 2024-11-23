<template>
    <div class="calendar-container">
        <div ref="calendarEl"></div>

        <div v-if="showSmallCalendar" class="small-calendar-dropdown" :style="smallCalendarPosition">
            <input type="date" v-model="selectedDate" @change="goToSelectedDate" class="small-calendar-input" />
        </div>

        <div v-if="showTagDropdown" class="tag-dropdown" :style="tagDropdownPosition">
            <ul>
                <li v-for="tag in tags" :key="tag.name" @click="selectTag(tag)" class="tag-item">
                    <input 
                        type="checkbox" 
                        :id="tag.name" 
                        :value="tag.name" 
                        v-model="selectedTags" 
                    />
                    <span 
                        class="color-dot"
                        :style="{ backgroundColor: tag.color }"
                    ></span>
                    <label :for="tag.name">{{ tag.name }}</label>
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
                    <div>
                        <label for="tag">태그</label>
                        <select id="tag" v-model="newEvent.tag" required>
                            <option value="">태그 선택</option>
                            <option 
                                v-for="tag in tags" 
                                :key="tag.name" 
                                :value="tag.name"
                            >
                                {{ tag.name }}
                            </option>
                        </select>
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
            tags: [
                { name: '국내', color: '#E8F5E9' },
                { name: '공장', color: '#FFF3E0' },
                { name: '내부', color: '#E3F2FD' },
                { name: '대외', color: '#FFEBEE' },
                { name: '세미나', color: '#F3E5F5' },
                { name: '일정', color: '#FFFFFF' },
                { name: '프로젝트', color: '#E0F2F1' },
                { name: '필독', color: '#FFF8E1' },
                { name: 'To-do', color: '#FFEBEE' }
            ],
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
        // 전역 클릭 이벤트 리스너 추가
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
        // 컴포넌트가 제거되기 전에 이벤트 리스너 제거
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        initCalendar() {
            const calendarEl = this.$refs.calendarEl;

            this.calendar = new Calendar(calendarEl, {
                plugins: [dayGridPlugin, interactionPlugin],
                initialView: 'dayGridMonth',
                locale: 'ko',
                headerToolbar: {
                    left: ' today prev,next title',
                    center: '',
                    right: 'customCalendarButton customTagsButton customAddEventButton',
                },
                buttonText: {
                    today: '오늘'
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
                        click: (e) => {
                            e.stopPropagation(); // 이벤트 전파 중지
                            this.toggleSmallCalendar();
                            // Tag 드롭다운이 열려있다면 닫기
                            if (this.showTagDropdown) {
                                this.showTagDropdown = false;
                            }
                        },
                    },
                    customTagsButton: {
                        text: '',
                        click: (e) => {
                            e.stopPropagation(); // 이벤트 전파 중지
                            this.toggleTagDropdown();
                            // Calendar 드롭다운이 열려있다면 닫기
                            if (this.showSmallCalendar) {
                                this.showSmallCalendar = false;
                            }
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
                svgContainer.src = calendarSvg;
                svgContainer.style.width = '1.2rem';
                svgContainer.style.height = '1.2rem';
                customCalendarButton.innerHTML = '';
                customCalendarButton.appendChild(svgContainer);
            }

            const customTagsButton = calendarEl.querySelector('.fc-customTagsButton-button');
            if (customTagsButton) {
                const svgContainer = document.createElement('img');
                svgContainer.src = tagSvg;
                svgContainer.style.width = '1.2rem';
                svgContainer.style.height = '1.2rem';
                customTagsButton.innerHTML = '';
                customTagsButton.appendChild(svgContainer);
            }
        },
        handleClickOutside(event) {
            // small calendar 드롭다운 처리
            const calendarDropdown = this.$el.querySelector('.small-calendar-dropdown');
            const calendarButton = this.$el.querySelector('.fc-customCalendarButton-button');
            if (this.showSmallCalendar &&
                calendarDropdown &&
                !calendarDropdown.contains(event.target) &&
                !calendarButton.contains(event.target)) {
                this.showSmallCalendar = false;
            }

            // tag 드롭다운 처리
            const tagDropdown = this.$el.querySelector('.tag-dropdown');
            const tagButton = this.$el.querySelector('.fc-customTagsButton-button');
            if (this.showTagDropdown &&
                tagDropdown &&
                !tagDropdown.contains(event.target) &&
                !tagButton.contains(event.target)) {
                this.showTagDropdown = false;
            }
        },
        toggleSmallCalendar() {
            if (!this.showSmallCalendar) {
                const calendarButton = this.$el.querySelector('.fc-customCalendarButton-button');
                if (calendarButton) {
                    const rect = calendarButton.getBoundingClientRect();
                    const containerRect = this.$el.getBoundingClientRect();
                    const dropdownWidth = 150; // 달력 드롭다운의 예상 너비

                    this.smallCalendarPosition = {
                        top: `${rect.bottom - containerRect.top}px`,
                        left: `${rect.left - containerRect.left + (rect.width / 2) - (dropdownWidth / 2)}px`
                    };
                }
            }
            this.showSmallCalendar = !this.showSmallCalendar;
        },
        goToSelectedDate() {
            if (this.selectedDate) {
                this.calendar.gotoDate(this.selectedDate); // FullCalendar 날짜 이동
                this.showSmallCalendar = false; // 작은 달력 닫기
            }
        },
        toggleTagDropdown() {
            if (!this.showTagDropdown) {
                const tagButton = this.$el.querySelector('.fc-customTagsButton-button');
                if (tagButton) {
                    const rect = tagButton.getBoundingClientRect();
                    const containerRect = this.$el.getBoundingClientRect();
                    const dropdownWidth = 150; // tag 드롭다운의 너비 (CSS에서 설정한 값)

                    this.tagDropdownPosition = {
                        top: `${rect.bottom - containerRect.top}px`,
                        left: `${rect.left - containerRect.left + (rect.width / 2) - (dropdownWidth / 2)}px`
                    };
                }
            }
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
            if (this.newEvent.title && this.newEvent.date && this.newEvent.tag) {
                const selectedTag = this.tags.find(tag => tag.name === this.newEvent.tag);
                this.calendar.addEvent({
                    title: this.newEvent.title,
                    start: this.newEvent.date,
                    color: selectedTag.color,
                    textColor: '#333', // 파스텔 색상이므로 텍스트는 어두운 색으로
                    tag: this.newEvent.tag
                });
                alert('일정이 등록되었습니다.');
                this.closeEventModal();
            } else {
                alert('모든 필드를 입력해주세요.');
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

::v-deep(.fc .fc-toolbar.fc-header-toolbar){
    margin-bottom: 1rem;
}

::v-deep(.fc-direction-ltr .fc-toolbar > * > :not(:first-child)){
    margin-left: 0;
}

::v-deep(.fc-toolbar-title) {
    display: inline-block;
    font-size: 1.4rem;
    margin-top: 0.3rem;
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

::v-deep(.fc-today-button) {
    border: 1px solid #333 !important;
    padding: 0.2rem 0.6rem !important;
    border-radius: 4px;
    margin-top: 0.2rem;

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

::v-deep(.fc-daygrid-day-frame) {
    height: 8rem;
    box-sizing: border-box;
}

.small-calendar-dropdown {
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 10px;
    margin-top: 5px;
}

.small-calendar-input {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}

::v-deep(.fc-toolbar-chunk) {
    display: flex;
    gap: 1rem;
}

::v-deep(.fc-customTagsButton-button),
::v-deep(.fc-customCalendarButton-button) {
    background-color: white !important;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem !important;
    height: 3rem !important;
    padding: 0.6rem !important;
}

::v-deep(.fc-customCalendarButton-button img),
::v-deep(.fc-customTagsButton-button img) {
    width: 1.8rem !important;
    height: 1.8rem !important;
    filter: brightness(0) !important;
    transition: filter 0.2s ease;
}

::v-deep(.fc-customTagsButton-button:hover img),
::v-deep(.fc-customCalendarButton-button:hover img) {
    filter: brightness(0.4) !important;
}

::v-deep(.fc-customAddEventButton-button) {
    background-color: white !important;
    color: #333 !important;
    font-size: 0.875rem !important;
    border-radius: 20px !important;
    padding: 0.5rem 1rem !important;
    margin-left: 0.5rem;
    border: 1px solid #dadce0 !important;
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
                0 1px 3px 1px rgba(60, 64, 67, 0.15) !important;
    display: flex !important;
    align-items: center;
    gap: 4px;
    font-weight: 500;
    height: 36px;
    margin-top:0.32rem;
}

::v-deep(.fc-customAddEventButton-button)::before {
    content: '+';
    font-size: 1.25rem;
    margin-right: 4px;
    font-weight: 400;
}

::v-deep(.fc-customAddEventButton-button:hover) {
    background-color: #f8f9fa !important;
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
                0 2px 6px 2px rgba(60, 64, 67, 0.15) !important;
}

::v-deep(.fc-customAddEventButton-button:active) {
    background-color: #f1f3f4 !important;
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3) !important;
}

.tag-dropdown {
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: 150px;
    padding: 10px;
    margin-top: 5px;
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

.color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-content select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 15px;
}

.tag-dropdown .tag-item input {
    margin-right: 8px;
}

.tag-dropdown .tag-item label {
    flex-grow: 1;
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