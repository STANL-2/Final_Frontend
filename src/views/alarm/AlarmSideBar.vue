<template>
    <div class="sidebar">
        <button
            v-for="menu in menus"
            :key="menu.id"
            @click="handleMenuClick(menu)"
            class="menu-button"
        >
            {{ menu.name }}
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            menus: [
                { id: 1, name: '계약', value: 'CONTRACT' },
                { id: 2, name: '공지', value: 'NOTICE' },
                { id: 3, name: '일정', value: 'SCHEDULE' }
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
    padding: 20px;
    background-color: #f9f9f9;
    border-right: 1px solid #ddd;
    width: 200px;
}

.menu-button {
    padding: 10px 20px;
    background-color: #6360ab;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: left;
    font-size: 16px;
    transition: background-color 0.3s;
}

.menu-button:hover {
    background-color: #5050a5;
}

.menu-button:active {
    background-color: #3e3e99;
}
</style>
