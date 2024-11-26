<template>
    <PageLayout>
        <!-- 기초 정보 -->
        <div>
            
                <div class="subtitle">
                <div class="line"></div>
                <div class="subtitle-text">
                    고객 정보
                </div>
            </div>
            </div>
            <div class="customer-info">
                <div class="row" v-for="(item, index) in customerInfo" :key="index">
                <div class="label">{{ item.firstLabel }}</div>
                <div class="value">{{ item.firstValue }}</div>
                <div class="label">{{ item.secondLabel }}</div>
                <div class="value">{{ item.secondValue }}</div>
                <div class="label">{{ item.thirdLabel }}</div>
                <div class="value">{{ item.thirdValue }}</div>
            </div>
            </div>
        


        <!-- 학력 정보 -->
        <div class="section">
            <div class="subtitle">
                <div class="line"></div>
                <div class="subtitle-text">
                    계약서
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th v-for="header in educationHeaders" :key="header">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in educationData" :key="index">
                        <td v-for="(value, key) in row" :key="key">{{ value }}</td>
                    </tr>
                </tbody>
            </table>

        </div>

    </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/common/layouts/PageLayout.vue';
import { ref, onMounted } from 'vue';
import { $api } from '@/services/api/api';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 기본 정보
const customerInfo = ref([]);

// 학력 정보
const educationHeaders = ['입학일', '졸업일', '학력', '전공', '점수', '비고'];
const educationData = ref([]);


// 기본 정보
const getcustomerInfo = async () => {
    try {
        const response = await $api.customer.get('', 'CUS_000000001');      // 추후에 수정
        const result = response.result;

        customerInfo.value = [
            {
                firstLabel: '고객번호', firstValue: result.customerId,
                secondLabel: '성명', secondValue: result.name,
                thirdLabel: '나이', thirdValue: result.age
            },
            {
                firstLabel: '성별', firstValue: result.sex,
                secondLabel: '휴대전화', secondValue: result.phone,
                thirdLabel: '이메일', thirdValue: result.email
            },
            {
                firstLabel: '비상연락처', firstValue: result.emergePhone, 
                secondLabel: '', secondValue: '',
                thirdLabel: '', thirdValue: ''
            }
        ];
    } catch (error) {
        console.error('GET 요청 실패: ', error);
    }
};

// 학력 정보 API 호출
const getEducationData = async () => {
    try {
        const response = await $api.education.get('', ''); 
        const result = response.result;

        educationData.value = result.map((edu) => ({
            입학일: edu.entranceDate,
            졸업일: edu.graduationDate,
            학력: edu.name,
            전공: edu.major || '-',
            점수: edu.score || '-',
            비고: edu.note || '-',
        }));
    } catch (error) {
        console.error('학력 정보 요청 실패: ', error);
    }
};



onMounted(() => {
    getcustomerInfo();
    getEducationData();
});
</script>

<style scoped>
.section {
    margin-bottom: 30px; /* 각 섹션 간 간격 */
}

.section-text {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
}

.customer-info{
    margin-top: 20px;
    margin-bottom: 30px;
}

.subtitle {
    display: flex;
    align-items: center;    /* 수직 중앙 정렬 */
}

.line {
    width: 5px;
    height: 24px;
    background-color: #333333;
    margin-right: 10px;
}

.subtitle-text {
    font-size: 16px;
    font-weight: bold;
    color: #000;
}

.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 35px;   /* 각 행의 높이를 고정 */
    border-bottom: 0.5px solid #EEEEEE;   /* 행 간의 구분선을 적용 */
    border-top: 0.5px solid #EEEEEE;   /* 행 간의 구분선을 적용 */
}

.label,
.value {
    border-right: 1px solid #EEEEEE;    /* 좌우 구분선 추가 */
    font-family: 'Pretendard';
    font-size: 12px;
    line-height: 1.5;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 5px;
    box-sizing: border-box;
}

/* 각 label 셀의 스타일 */
.label {
    width: 25%;
    color: #777777;
    background: #F8F8F8;
    display: flex;
    justify-content: center;
}

/* 각 value 셀의 스타일 */
.value {
    width: 75%;
    color: #000000;
}

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
