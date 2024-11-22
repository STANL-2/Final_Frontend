<template>
    <div class="calendar-container">
        <div ref="calendarEl"></div>
        <div v-if="showYearDropdown" class="year-dropdown"
            :style="{ top: dropdownTop + 'px', left: dropdownLeft + 'px' }" @scroll="handleScroll">
            <ul>
                <li v-for="year in years" :key="year" @click="changeYear(year)">
                    {{ year }}년
                </li>
            </ul>
        </div>

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
import DatePicker from 'vue3-datepicker';

export default {
    components: {
        DatePicker,
    },
    data() {
        return {
            showEventForm: false,
            showYearDropdown: false,
            showDatePicker: false,
            newEvent: {
                title: '',
                start: '',
                end: '',
            },
            calendar: null,
            years: Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i),
            scrolling: false,
            dropdownTop: 0,
            dropdownLeft: 0
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
                    left: 'customYearDropdown',
                    center: 'prev title next',
                    right: 'customAddEvent',
                },
                views: {
                    dayGridMonth: {
                        titleFormat: {
                            month: 'long',
                        },
                        dayCellContent: (info) => {
                            // 날짜 텍스트에서 '일' 제거
                            const number = document.createElement('a');
                            number.classList.add('fc-daygrid-day-number');
                            number.innerHTML = info.dayNumberText.replace('일', '').replace('日', ''); // '일' 또는 '日' 제거

                            if (info.view.type === 'dayGridMonth') {
                                return {
                                    html: number.outerHTML,
                                };
                            }
                            return { domNodes: [] };
                        },
                    }
                },
                customButtons: {
                    customYearDropdown: {
                        text: `${new Date().getFullYear()}년 v`, // 초기 연도 설정
                        click: (event) => {
                            this.toggleYearDropdown(event);
                        },
                    },
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
                datesSet: (info) => {
                    // 현재 캘린더 중앙 날짜 기준으로 연도를 가져옴
                    const currentDate = this.calendar.getDate();
                    const currentYear = currentDate.getFullYear();
                    // 버튼 텍스트를 업데이트
                    this.updateYearDropdownText(currentYear);
                },
            });

            this.calendar.render();
        },
        updateYearDropdownText(year) {
            // 버튼 텍스트를 동적으로 변경
            const toolbarEl = document.querySelector('.fc-customYearDropdown-button');
            if (toolbarEl) {
                toolbarEl.textContent = `${year}년 v`;
            }
        },
        toggleYearDropdown(event) {
            if (this.showYearDropdown) {
                this.showYearDropdown = false;
                return;
            }
            const button = event.currentTarget;
            const rect = button.getBoundingClientRect();
            this.dropdownTop = rect.bottom + window.scrollY;
            this.dropdownLeft = rect.left + window.scrollX;
            this.showYearDropdown = true;
        },
        changeYear(year) {
            const date = new Date(this.calendar.getDate());
            date.setFullYear(year);
            this.calendar.gotoDate(date); // 캘린더 연도 변경
            this.showYearDropdown = false; // 드롭다운 숨김
            // 버튼 텍스트를 동적으로 변경
            const toolbarEl = document.querySelector('.fc-customYearDropdown-button');
            if (toolbarEl) {
                toolbarEl.textContent = `${year}년 v`;
            }
        },
        addMoreYears() {
            if (this.scrolling) return;
            this.scrolling = true;
            const lastYear = this.years[this.years.length - 1];
            const newYears = Array.from({ length: 5 }, (_, i) => lastYear - (i + 1));
            this.years = [...this.years, ...newYears];
            this.scrolling = false;
        },
        handleScroll(event) {
            const { scrollTop, scrollHeight, clientHeight } = event.target;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                this.addMoreYears();
            }
        },
        openDatePicker(event) {
            const rect = event.target.getBoundingClientRect();
            this.dropdownTop = rect.bottom + window.scrollY;
            this.dropdownLeft = rect.left + window.scrollX;
            this.showDatePicker = true;
        },
        closeDatePicker() {
            this.showDatePicker = false;
        },
        handleDateSelect(date) {
            this.selectedDate = date;
            this.newEvent.start = date.toISOString().slice(0, 10); // 선택된 날짜를 일정 시작 날짜에 설정
            this.closeDatePicker();
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
            this.calendar.addEvent(this.newEvent);
            this.closeEventForm();
        },
    },
};
</script>

<style scoped>
.calendar-container {
    max-width: 1330px;
    margin: 0 auto;
    padding: 1rem;
    padding-right: 1.3rem;
    padding-left: 0rem;
    padding-top: 0rem;
}

.fc {
    font-family: 'Noto Sans KR', sans-serif;
    color: #333;
}

::v-deep(.fc-header-toolbar) {
    border-bottom: 1px solid #e0e0e0;
    padding: 1rem;
    padding-top: 0.8rem;
    padding-bottom: 0.4rem;
}

::v-deep(.fc .fc-toolbar-title) {
    font-size: 2rem;
    display: inline-block;
    padding-bottom: 0.5rem;
}

::v-deep(.fc-direction-ltr .fc-toolbar > * > :not(:first-child)) {
    margin-left: 0rem;
    /* 버튼 간 간격 설정 */
}


::v-deep(.fc-next-button),
::v-deep(.fc-prev-button) {
    background-color: #fff;
    border: none;
    padding: 0rem;
}

::v-deep(.fc-icon) {
    line-height: 0.5;
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


::v-deep(.fc-icon .fc-icon-chevron-left::before)::v-deep(.fc-icon .fc-icon-chevron-right) {
    color: #333;
    size: 2rem;
}

::v-deep(.fc-button-primary) {
    background-color: #fff;
    border: none;
    color: #333;
}

::v-deep(.fc-customAddEvent-button) {
    background-color: #6360AB !important;
    color: #fff !important;
    transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

::v-deep(.fc-customAddEvent-button:hover) {
    background-color: #6360AB !important;
    color: #fff !important;
    transform: scale(1.03);
}

.event-form {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.event-form h3 {
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    color: #333;
}

.event-form form div {
    margin-bottom: 15px;
}

.event-form label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #666;
}

.event-form input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
}

.event-form button {
    width: calc(50% - 5px);
    padding: 8px 10px;
    font-size: 14px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.event-form button:hover {
    background-color: #0056b3;
}

.event-form button[type="button"] {
    background-color: #6c757d;
    margin-left: 10px;
}

.event-form button[type="button"]:hover {
    background-color: #5a6268;
}

.year-dropdown {
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: 120px;
    max-height: 200px;
    overflow-y: auto;
}

.year-dropdown ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.year-dropdown li {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
}

.year-dropdown li:hover {
    background-color: #f0f0f0;
}
</style>