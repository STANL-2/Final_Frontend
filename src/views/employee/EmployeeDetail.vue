<template>
    <PageLayout>

        <div>
            <div>
                기초 정보
            </div>
            <div class="row" v-for="(item, index) in memberInfo" :key="index">
                <div class="label">{{ item.firstLabel }}</div>
                <div class="value">{{ item.firstValue }}</div>
                <div class="label">{{ item.secondLabel }}</div>
                <div class="value">{{ item.secondValue }}</div>
                <div class="label">{{ item.thirdLabel }}</div>
                <div class="value">{{ item.thirdValue }}</div>
            </div>
        </div>


        <!-- 학력 정보 -->
        <div>
            <div>
                학력 사항
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

        <!-- 외국어/자격증 정보 -->
        <div>
            <div>
                외국어/자격증 정보
            </div>
            <table>
                <thead>
                    <tr>
                        <th v-for="header in certificationHeaders" :key="header">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in certificationData" :key="index">
                        <td v-for="(value, key) in row" :key="key">{{ value }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 경력 정보 -->
        <div>
            <div>경력 정보</div>
            <table>
                <thead>
                    <tr>
                        <th v-for="header in careerHeaders" :key="header">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in careerData" :key="index">
                        <td v-for="(value, key) in row" :key="key">{{ value }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 가족 구성원 -->
        <div>
            <div>가족 구성원</div>
            <table>
                <thead>
                    <tr>
                        <th v-for="header in familyHeaders" :key="header">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in familyData" :key="index">
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

const memberInfo = ref([]);

// 학력 정보
const educationHeaders = ['입학일', '졸업일', '학력', '전공', '점수', '비고'];
const educationData = ref([]);

// 자격증/외국어 정보
const certificationHeaders = ['취득 날짜', '시행기관', '자격증/외국어', '등급', '비고'];
const certificationData = ref([]);

// 경력 정보
const careerHeaders = ['입사일', '퇴사일', '경력 정보', '비고'];
const careerData = ref([]);

// 가족 구성원
const familyHeaders = ['관계', '이름', '생년월일', '주민등록번호', '연락처', '성별', '장애인 여부', '사망 여부', '비고'];
const familyData = ref([]);

// 기본 정보
const getMemberInfo = async () => {
    try {
        const response = await $api.member.get('', '');
        const result = response.result;

        memberInfo.value = [
            {
                firstLabel: '사원번호', firstValue: result.centerId,
                secondLabel: '성명', secondValue: result.name,
                thirdLabel: '주민등록번호', thirdValue: result.identNo
            },
            {
                firstLabel: '이메일', firstValue: result.email,
                secondLabel: '휴대전화', secondValue: result.phone,
                thirdLabel: '성별', thirdValue: result.sex
            },
            {
                firstLabel: '입사일', firstValue: '-', // 입사일 정보 없음
                secondLabel: '발령일', secondValue: '-', // 발령일 정보 없음
                thirdLabel: '병역구분', thirdValue: result.military
            },
            {
                firstLabel: '비상연락처', firstValue: result.emergePhone || '-',
                secondLabel: '직책', secondValue: result.position,
                thirdLabel: '학력구분', thirdValue: result.grade
            },
            {
                firstLabel: '은행명', firstValue: result.bankName,
                secondLabel: '계좌번호', secondValue: result.account,
                thirdLabel: '주소', thirdValue: result.address
            },
            {
                firstLabel: '고용형태', firstValue: result.jobType,
                secondLabel: '비고', secondValue: result.note || '-'
            },
        ];
    } catch (error) {
        console.error('GET 요청 실패: ', error);
    }
};

// 학력 정보 API 호출
const getEducationData = async () => {
    try {
        const response = await $api.education.get('other', 'god'); // API 수정 필요
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

// 자격증/외국어 정보 API 호출
const getCertificationData = async () => {
    try {
        const response = await $api.certification.get('other', 'god'); // API 수정 필요
        const result = response.result;

        certificationData.value = result.map((cert) => ({
            '취득 날짜': cert.acquisitionDate,
            시행기관: cert.agency,
            '자격증/외국어': cert.name,
            등급: cert.score || '-',
            비고: cert.note || '-',
        }));
    } catch (error) {
        console.error('자격증/외국어 정보 요청 실패: ', error);
    }
};

const getCareerData = async () => {
    try {
        const response = await $api.career.get('other', 'god'); // API 수정 필요
        const result = response.result;

        careerData.value = result.map((career) => ({
            입사일: career.emplDate,
            퇴사일: career.resignDate || '-',
            '경력 정보': career.name,
            비고: career.note || '-',
        }));
    } catch (error) {
        console.error('경력 정보 요청 실패:', error);
    }
};

const getFamilyData = async () => {
    try {
        const response = await $api.family.get('other', 'god'); // API 수정 필요
        const result = response.result;

        familyData.value = result.map((family) => ({
            관계: family.relation,
            이름: family.name,
            생년월일: family.birth,
            주민등록번호: family.identNo,
            연락처: family.phone,
            성별: family.sex === 'MALE' ? '남성' : '여성',
            '장애인 여부': family.disability ? 'O' : 'X',
            '사망 여부': family.die ? 'O' : 'X',
            비고: family.note || '-',
        }));
    } catch (error) {
        console.error('가족 구성원 정보 요청 실패:', error);
    }
};

onMounted(() => {
    getMemberInfo();
    getEducationData();
    getCertificationData();
    getCareerData();
    getFamilyData();
});
</script>

<style scoped>
.info-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0px;
    /* 간격을 없앰 */
    border: 1px solid #EEEEEE;
    /* 외곽선 추가 */
}

.row {
    /* position: relative; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 35px;
    /* 각 행의 높이를 고정 */
    border-bottom: 1px solid #EEEEEE;
    /* 행 간의 구분선을 적용 */
}

.label,
.value {
    border-right: 1px solid #EEEEEE;
    /* 좌우 구분선 추가 */
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
