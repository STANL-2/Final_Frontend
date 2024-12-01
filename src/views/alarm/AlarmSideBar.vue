<template>
    <div class="sidebar">
        <button
            v-for="menu in menus"
            :key="menu.id"
            @click="handleMenuClick(menu)"
            class="menu-button"
        >
            {{ menu.name }}
            <Divider></Divider>
        </button>
    </div>
</template>

<script>
import Divider from 'primevue/divider';

export default {
    data() {
        return {
            menus: [
                { id: 1, name: '계약 알림', value: 'CONTRACT' },
                { id: 2, name: '공지 알림', value: 'NOTICE' },
                { id: 3, name: '일정 알림', value: 'SCHEDULE' }
            ]
        };
    },
    methods: {
        handleMenuClick(menu) {
            this.$emit('menu-clicked', menu.value); // 전달할 value
        }
    }
};
</script>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    gap: 10px; /* 버튼 간격 */
    padding-top: 0;
    padding-left: 0;
    padding-right: 1rem;
    width: 5rem;
}

.menu-button {
    padding: 10px 20px;
    /* background-color: #6360ab; */
    background-color: white;
    /* color: white; */
    color: black;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: left;
    font-size: 16px;
    height: 100%;
    transition: background-color 0.3s;
}

.menu-button:hover {
    background-color: #5050a5;
}

.menu-button:active {
    background-color: #3e3e99;
}
</style>
