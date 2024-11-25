<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th v-for="header in organizationMemberHeader" :key="header">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(member, index) in organizationMembers" :key="index">
                    <td>{{ member.loginId }}</td>
                    <td>{{ member.name }}</td>
                    <td>{{ member.position }}</td>
                    <td>{{ member.jobType }}</td>
                    <td>{{ member.createdAt }}</td>
                    <td><Button></Button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import ApiService from '@/services/api/config/ApiService';

const props = defineProps({
    organizationId: {
        type: String,
        required: true
    }
});

const apiService = new ApiService('api/v1/member/organization');

const organizationMemberHeader = ['사원번호', '성명', '직급', '발령일', '고용 구분', '상세보기'];
const organizationMembers = ref([]);

const getOrganizationMembers = async () => {
    try {
        const response = await apiService.get('', props.organizationId);  // 추후에 수정 예정
        
        const result = response.result;

        // 필요한 데이터만 추출하여 careerData 배열에 저장
        organizationMembers.value = result.map(member => ({
            loginId: member.loginId,
            name: member.name,  // name이 없다면 '정보 없음'으로 처리
            position: member.position,
            jobType: member.jobType,
            createdAt: member.createdAt
        }));

        console.log(organizationMembers.value);

    } catch (error) {
        console.error('부서 별 사원 요청 실패: ', error);
    }
};

watch(() => props.organizationId, (newId) => {
    getOrganizationMembers(newId);
}, { immediate: true });

onMounted(() => {
    getOrganizationMembers(props.organizationId);  // Initial fetch with the given organizationId
});
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    margin-top: 10px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px 16px;
    text-align: center;
    font-size: 13px;
}

th {
    background-color: #F8F8F8;
    color: #777777;
}
</style>