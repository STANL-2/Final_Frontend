<template>
    <div class="path" v-if="breadcrumbs.length">
        <div class="breadcrumb" v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.key">
            <span class="name">{{ breadcrumb.label }}</span>
            <span v-if="index < breadcrumbs.length - 1" class="fork"> > </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { asideMenu } from '@/utils/constants';

const route = useRoute();

defineProps({
    menu: {
        type: Array,
        required: true
    }
});

const findMenuPath = (menu, path) => {
    for (const item of menu) {
        if (item.url === path) return [item];
        if (item.children) {
            const subPath = findMenuPath(item.children, path);
            if (subPath.length) return [item, ...subPath];
        }
    }
    return [];
};

const breadcrumbs = computed(() => {
    const path = route.path;
    return findMenuPath(asideMenu.value, path);
});
</script>

<style scoped>
.path {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.breadcrumb {
    display: inline-flex;
    align-items: center;
}

.name {
    color: #AAAAAA;
    font-size: 16px;
}

.fork {
    color: #AAAAAA;
    font-size: 16px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
</style>