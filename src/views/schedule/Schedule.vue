<template>
    <div class="calendar-container">
        <div ref="calendarEl"></div>

        <div v-if="showSmallCalendar" class="small-calendar-dropdown" :style="smallCalendarPosition">
            <input type="date" v-model="selectedDate" @change="goToSelectedDate" class="small-calendar-input" />
        </div>

        <div v-if="showTagDropdown" class="tag-dropdown" :style="tagDropdownPosition">
            <ul>
                <li v-for="tag in tags" :key="tag.name" @click="selectTag(tag)" class="tag-item">
                    <input type="checkbox" :id="tag.name" :value="tag.name" v-model="selectedTags" />
                    <span class="color-dot" :style="{ backgroundColor: tag.color }"></span>
                    <label :for="tag.name">{{ tag.name }}</label>
                </li>
            </ul>
            <button class="add-new-tag-button" @click.stop="openNewTagModal">새로운 태그 추가</button>
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
                        <label for="content">내용</label>
                        <textarea id="content" v-model="newEvent.content" rows="3" required></textarea>
                    </div>
                    <div>
                        <label for="date">날짜</label>
                        <input type="date" id="date" v-model="newEvent.date" required />
                        <label for="start-time">시작 시간</label>
                        <input type="time" id="start-time" v-model="newEvent.startTime" />
                        <label for="end-time">종료 시간</label>
                        <input type="time" id="end-time" v-model="newEvent.endTime" />
                    </div>
                    <div>
                        <label for="tag">태그</label>
                        <select id="tag" v-model="newEvent.tag" required>
                            <option value="">태그 선택</option>
                            <option v-for="tag in tags" :key="tag.name" :value="tag.name">
                                {{ tag.name }}
                            </option>
                        </select>
                    </div>
                    <button type="submit">등록</button>
                    <button type="button" @click="closeEventModal">취소</button>
                </form>
            </div>
        </div>
        <div v-if="showScheduleDetails" class="event-detail-modal">
            <div class="modal-content">
                <h3 v-if="!isEditing">{{ selectedSchedule.title }}</h3>
                <h3 v-else>일정 수정</h3>

                <!-- 조회 모드 -->
                <div v-if="!isEditing">
                    <p><strong>제목:</strong> {{ selectedSchedule.title }}</p>
                    <p><strong>내용:</strong> {{ selectedSchedule.content }}</p>
                    <p><strong>시작일시:</strong> {{ selectedSchedule.startDate }}</p>
                    <p><strong>종료일시:</strong> {{ selectedSchedule.endDate }}</p>
                    <p>
                        <strong>태그:</strong>
                        <span class="tag-badge" :style="{ backgroundColor: selectedSchedule.tagColor }">
                            {{ selectedSchedule.tag }}
                        </span>
                    </p>
                </div>

                <!-- 수정 모드 -->
                <form v-else @submit.prevent="updateSchedule" class="edit-form">
                    <div class="form-group">
                        <label for="edit-title">제목</label>
                        <input type="text" id="edit-title" v-model="editedSchedule.title" required />
                    </div>

                    <div class="form-group">
                        <label for="edit-content">내용</label>
                        <textarea id="edit-content" v-model="editedSchedule.content" rows="3" required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="edit-start-date">시작일시</label>
                        <input type="datetime-local" id="edit-start-date" v-model="editedSchedule.startDate" required />
                    </div>

                    <div class="form-group">
                        <label for="edit-end-date">종료일시</label>
                        <input type="datetime-local" id="edit-end-date" v-model="editedSchedule.endDate" required />
                    </div>

                    <div class="form-group">
                        <label for="edit-tag">태그</label>
                        <select id="edit-tag" v-model="editedSchedule.tag" required>
                            <option v-for="tag in tags" :key="tag.name" :value="tag.name">
                                {{ tag.name }}
                            </option>
                        </select>
                    </div>
                </form>

                <div class="modal-footer">
                    <template v-if="!isEditing">
                        <button @click="startEditing" class="edit-button">수정</button>
                        <button @click="closeScheduleDetails" class="close-button">닫기</button>
                    </template>
                    <template v-else>
                        <button @click="updateSchedule" class="save-button">저장</button>
                        <button @click="cancelEditing" class="cancel-button">취소</button>
                    </template>
                </div>
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
import { $api } from '@/services/api/api';

export default {
    data() {
        return {
            calendar: null,
            tags: [
                { name: 'METTING', color: '#B0DDFF' },
                { name: 'TRAINING', color: '#FFF3E0' },
                { name: 'VACATION', color: '#E3F2FD' },
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
            showScheduleDetails: false,
            isEditing: false,
            selectedSchedule: {
                title: '',
                content: '',
                startDate: '',
                endDate: '',
                tag: ''
            },
            selectedDate: '',
            newEvent: {
                title: '',
                date: '',
                tag: ''
            },
            editedSchedule: {
                id: null,
                title: '',
                content: '',
                startDate: '',
                endDate: '',
                tag: ''
            },
            schedules: []
        };
    },
    async mounted() {
        // 컴포넌트 마운트 시 일정 데이터 조회
        await this.fetchSchedules();
        this.initCalendar();
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
        // 컴포넌트가 제거되기 전에 이벤트 리스너 제거
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        async fetchSchedules() {
            try {
                const response = await $api.schedule.get('', '');
                console.log('일정 조회 결과:', response);
                this.schedules = Array.isArray(response.data) ? response.data : response.result;
                if (this.calendar) {
                    this.updateCalendarEvents();
                }
            } catch (error) {
                console.error('일정 조회 실패:', error);
            }
        },


        // 일정 수정 저장
        async updateSchedule() {
            try {

                const updatedData = {
                    // scheduleId: this.editedSchedule.id,
                    name: this.editedSchedule.title,
                    content: this.editedSchedule.content,
                    startAt: new Date(this.editedSchedule.startDate).toISOString(),
                    endAt: new Date(this.editedSchedule.endDate).toISOString(),
                    tag: this.editedSchedule.tag
                };

                const scheduleId = this.editedSchedule.id;
                console.log("scheduleId확인:". scheduleId);

                // API 호출 시 URL에서 scheduleId를 올바르게 사용
                const response = await $api.schedule.put(
                    `${scheduleId}`,  // scheduleId를 올바르게 삽입
                    updatedData
                );

                console.log("response 조회", response);

                if (response.success || response.status === 200) {
                    alert('일정이 성공적으로 수정되었습니다.');
                    await this.fetchSchedules(); // 캘린더 이벤트 새로고침
                    this.closeEditMode();
                } else {
                    throw new Error('일정 수정에 실패했습니다.');
                }
            } catch (error) {
                console.error('일정 수정 실패:', error);
                alert('일정 수정에 실패했습니다. 다시 시도해주세요.');
            }
        },
        async startEditing() {
            try {
                this.isEditing = true;
                const response = await $api.schedule.get(`${this.selectedSchedule.id}`);
                const scheduleData = response.data || response.result;

                if (scheduleData) {
                    this.editedSchedule = {
                        id: scheduleData.scheduleId || scheduleData.id,
                        title: scheduleData.name || scheduleData.title,
                        content: scheduleData.content,
                        startDate: this.formatDateTimeForInput(scheduleData.startAt),
                        endDate: this.formatDateTimeForInput(scheduleData.endAt),
                        tag: scheduleData.tag
                    };
                }
            } catch (error) {
                console.error('일정 조회 실패:', error);
                alert('일정을 불러오는데 실패했습니다.');
            }
        },

        // Format datetime for input fields
        formatDateTimeForInput(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
        },

        // Close edit mode and reset form
        closeEditMode() {
            this.isEditing = false;
            this.editedSchedule = {
                id: null,
                title: '',
                content: '',
                startDate: '',
                endDate: '',
                tag: ''
            };
            this.showScheduleDetails = false;
        },

        // Cancel editing
        cancelEditing() {
            this.closeEditMode();
        },

        // Fetch schedule details for viewing
        async fetchScheduleDetails(scheduleId) {
            try {
                const response = await $api.schedule.get(`${scheduleId}`);
                const scheduleData = response.data || response.result;

                if (scheduleData) {
                    this.selectedSchedule = {
                        id: scheduleData.scheduleId || scheduleData.id,
                        title: scheduleData.name || scheduleData.title,
                        content: scheduleData.content,
                        startDate: this.formatDateTime(scheduleData.startAt),
                        endDate: this.formatDateTime(scheduleData.endAt),
                        tag: scheduleData.tag,
                        tagColor: this.tags.find(t => t.name === scheduleData.tag)?.color
                    };
                    this.showScheduleDetails = true;
                }
            } catch (error) {
                console.error('일정 상세 조회 실패:', error);
                alert('일정을 불러오는데 실패했습니다.');
            }
        },

        // Format datetime for display
        formatDateTime(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                weekday: 'short'
            });
        },
        closeScheduleDetails() {
            this.showScheduleDetails = false;
            this.selectedSchedule = {};
        },
        // 캘린더 이벤트 업데이트
        updateCalendarEvents() {
            // 기존 이벤트 모두 제거
            this.calendar.removeAllEvents();

            // API로 받아온 일정 데이터를 캘린더 이벤트로 변환하여 추가
            this.schedules.forEach(schedule => {
                // Ensure we have valid date strings
                const startDate = this.formatDateString(schedule.startAt || schedule.date);
                const endDate = this.formatDateString(schedule.endAt || schedule.date);

                // Find matching tag or use default
                const tag = this.tags.find(t => t.name === schedule.tag) || this.tags[5];

                // Create the event object
                const eventObject = {
                    id: schedule.scheduleId || schedule.id,
                    title: schedule.name || schedule.title,
                    start: startDate,
                    end: endDate || startDate, // If no end date, use start date
                    color: tag.color,
                    textColor: '#333',
                    tag: schedule.tag,
                    allDay: true // Set to true for full-day events
                };

                this.calendar.addEvent(eventObject);
            });
        },
        formatDateString(dateStr) {
            if (!dateStr) return '';

            // Remove any time component if it exists and return just the date
            return dateStr.split(' ')[0];
        },

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
                events: this.schedules.map(schedule => ({
                    id: schedule.scheduleId,
                    title: schedule.title,
                    content: schedule.content,
                    start: schedule.startAt,
                    end: schedule.endAt,
                    color: this.tags.find(t => t.name === schedule.tag)?.color || '#FFFFFF',
                    allDay: true,
                })),
                editable: true,
                eventDrop: async (info) => {
                    try {
                        const updatedEvent = {
                            scheduleId: info.event.id,
                            startAt: info.event.startStr,
                        };

                        // Call the API to update the schedule date
                        const response = await $api.schedule.put(`${updatedEvent.scheduleId}`, {
                            date: updatedEvent.startAt,
                        });

                        if (response.success || response.status === 200) {
                            alert('일정이 성공적으로 업데이트되었습니다.');
                        } else {
                            throw new Error('일정 업데이트 실패');
                        }
                    } catch (error) {
                        console.error('일정 업데이트 오류:', error);
                        alert('일정 업데이트에 실패했습니다.');
                        // Revert the event position if API call fails
                        info.revert();
                    }
                },
                eventClick: async (info) => {
                    const scheduleId = info.event.id;
                    if (scheduleId) {
                        await this.fetchScheduleDetails(scheduleId);
                    } else {
                        console.error('일정 ID가 없습니다.');
                    }
                }
            });

            this.calendar.render();
            this.updateCalendarEvents();

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
        closeScheduleDetails() {
            this.showScheduleDetails = false; // 상세 정보 닫기
            this.selectedSchedule = null;
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
        async addNewEvent() {
            if (this.newEvent.title && this.newEvent.date && this.newEvent.tag) {
                try {
                    // ScheduleRegistDTO 구조에 맞는 데이터 준비
                    const scheduleRegistDTO = {
                        name: this.newEvent.title,
                        content: `${this.newEvent.title} 관련 일정`, // 추가 정보로 content 구성
                        tag: this.newEvent.tag,
                        startAt: `${this.newEvent.date} 00:00:00`, // 기본적으로 시작 시간은 00:00:00
                        endAt: `${this.newEvent.date} 23:59:59` // 종료 시간은 하루의 끝
                    };

                    // POST API 호출
                    const response = await $api.schedule.post(scheduleRegistDTO);

                    console.log('일정 등록 결과:', response);

                    if (response.success || response.status === 201) {
                        // 캘린더에 새 이벤트 추가
                        const selectedTag = this.tags.find(tag => tag.name === this.newEvent.tag);
                        this.calendar.addEvent({
                            id: response.data.id, // 등록된 일정 ID
                            title: this.newEvent.title,
                            start: scheduleRegistDTO.startAt,
                            end: scheduleRegistDTO.endAt,
                            color: selectedTag.color,
                            textColor: '#333',
                            tag: this.newEvent.tag
                        });

                        alert('일정이 등록되었습니다.');
                        this.closeEventModal();
                        this.fetchSchedules(); // 일정 목록 새로고침
                    } else {
                        throw new Error('일정 등록에 실패했습니다.');
                    }
                } catch (error) {
                    console.error('일정 등록 실패:', error);
                    alert('일정 등록에 실패했습니다.');
                }
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

::v-deep(.fc .fc-toolbar.fc-header-toolbar) {
    margin-bottom: 1rem;
}

::v-deep(.fc-direction-ltr .fc-toolbar > * > :not(:first-child)) {
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
    margin-top: 0.32rem;
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

.event-detail-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    width: 400px;
}

.event-detail-modal .modal-content {
    padding: 20px;
}

.event-detail-modal h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.event-detail-modal p {
    margin: 12px 0;
    line-height: 1.6;
}

.event-detail-modal strong {
    display: inline-block;
    width: 80px;
    color: #666;
    font-weight: 500;
}

.tag-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
    color: #333;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-footer {
    margin-top: 20px;
    text-align: right;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

.close-button {
    background-color: #6360AB;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.close-button:hover {
    background-color: #504B8A;
}


.edit-form {
    margin-top: 1rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

.edit-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 0.5rem;
}

.save-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.cancel-button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.edit-button:hover,
.save-button:hover {
    background-color: #45a049;
}

.cancel-button:hover {
    background-color: #da190b;
}
</style>