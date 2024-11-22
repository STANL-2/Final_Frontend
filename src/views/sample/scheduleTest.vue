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

export default {
    data() {
        return {
            showEventForm: false,
            showYearDropdown: false,
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
                        }
                    }
                },
                customButtons: {
                    customYearDropdown: {
                        text: `${new Date().getFullYear()}년 ▼`, // 초기 연도 설정
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
                    const startDate = new Date(info.start); // 캘린더 시작 날짜
                    const endDate = new Date(info.end); // 캘린더 끝 날짜
                    const currentYear = new Date().getFullYear(); // 현재 기준 연도

                    // 달력의 시작 날짜와 끝 날짜가 다른 연도인지 확인
                    if (startDate.getFullYear() !== endDate.getFullYear()) {
                        const year = startDate.getMonth() === 11 ? endDate.getFullYear() : startDate.getFullYear();
                        this.updateYearDropdownText(year);
                    } else {
                        this.updateYearDropdownText(startDate.getFullYear());
                    }
                },
            });

            this.calendar.render();
        },

        updateYearDropdownText(year) {
            // 버튼 텍스트를 동적으로 변경
            const toolbarEl = document.querySelector('.fc-customYearDropdown-button');
            if (toolbarEl) {
                toolbarEl.textContent = `${year} ▼`;
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
                toolbarEl.textContent = `${year}년 ▼`;
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
    padding-bottom: 0.2rem;
}

::v-deep(.fc-toolbar-title) {
    font-size: 2rem;
    display: inline-block;
}

::v-deep(.fc-next-button),
::v-deep(.fc-prev-button) {
    background-color: #fff;
    border: none;
    padding: 0rem;
}

::v-deep(.fc-icon) {
    color: #333;
}

::v-deep(.fc-customAddEvent-button) {
    background-color: #B0DDFF;
    border: none;
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