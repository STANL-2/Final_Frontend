<template>
    <div>
        <h2 class="title">개발자 도구</h2>
        <textarea v-model="inputData" @keydown.enter.prevent="handleEnter" placeholder="여러 줄 입력 후 엔터를 누르세요" rows="10"
            class="textarea"></textarea>

        <!-- 테이블 출력 -->
        <table class="table">
            <thead>
                <tr>
                    <th v-for="(header, index) in headers" :key="'header-' + index">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in rows" :key="'row-' + rowIndex">
                    <td v-for="(cell, cellIndex) in row" :key="'cell-' + rowIndex + '-' + cellIndex">
                        {{ cell }}
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- 변환된 SELECT 쿼리 출력 -->
        <pre class="query-output">{{ generatedQuery }}</pre>

        <!-- 변환된 MyBatis XML 출력 -->
        <pre class="xml-output">{{ generatedXml }}</pre>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const headers = ref(['Table', 'Entity', 'Query']);
const rows = ref([]);
const inputData = ref('');
const generatedQuery = ref('');
const generatedXml = ref('');

// 예외 처리할 필드와 대응하는 Entity 및 Query
const exceptions = {
    CREATED_AT: { entity: 'createdAt', query: 'A.CREATED_AT' },
    UPDATED_AT: { entity: 'updatedAt', query: 'A.UPDATED_AT' },
    DELETED_AT: { entity: 'deletedAt', query: 'A.DELETED_AT' }
};

// 엔터 키를 누를 때 입력을 처리하는 함수
const handleEnter = () => {
    const lines = inputData.value.trim().split('\n');
    rows.value = []; // 이전 입력을 지우고 새로 추가

    let currentColumn = '';

    lines.forEach(line => {
        const input = line.trim();

        if (input) {
            let tableName, entity, query;

            if (input.startsWith('@Column')) {
                const columnNameMatch = input.match(/name = \"(\w+)"/);
                if (columnNameMatch) {
                    currentColumn = columnNameMatch[1];
                }
            } else if (input.startsWith('private')) {
                const entityMatch = input.match(/private \w+ (\w+);/);
                if (!entityMatch) {
                    const entityWithDefaultMatch = input.match(/private \w+ (\w+) = .+;/);
                    entity = entityWithDefaultMatch ? entityWithDefaultMatch[1] : null;
                } else {
                    entity = entityMatch[1];
                }
                if (entity) {
                    tableName = currentColumn;
                    query = `A.${tableName}`;
                    rows.value.push([tableName, entity, query]);
                }
            }
        }
    });

    // SELECT 쿼리 및 XML 생성
    generateQueryOutput();
    generateXmlOutput();

    // 입력 필드 초기화
    inputData.value = '';
};

// Entity에서 Table 이름으로 변환하는 함수
const convertToTableName = (entity) => {
    return entity
        .replace(/([A-Z])/g, '_$1') // 대문자 앞에 언더스코어 추가
        .toUpperCase();
};

// SELECT 쿼리 생성 함수
const generateQueryOutput = () => {
    if (rows.value.length > 0) {
        const selectFields = rows.value.map(row => `    ${row[2]}`);
        generatedQuery.value = `SELECT\n   ${selectFields.join(',\n   ')}\n  FROM CENTER A`;
    } else {
        generatedQuery.value = '';
    }
};

// MyBatis XML 생성 함수
const generateXmlOutput = () => {
    if (rows.value.length > 0) {
        const xmlFields = rows.value.map(row => {
            if (row[0].includes("ID")) {
                return `<id property="${row[1]}" column="${row[0]}"/>`;
            } else {
                return `<result property="${row[1]}" column="${row[0]}"/>`;
            }
        });
        generatedXml.value = xmlFields.join('\n');
    } else {
        generatedXml.value = '';
    }
};
</script>

<style scoped>
.title {
    margin-bottom: 24px;
}

.textarea {
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.table th,
.table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.table th {
    background-color: #f4f4f4;
    font-weight: bold;
}

.query-output,
.xml-output {
    background-color: #f9f9f9;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-top: 1rem;
    white-space: pre-wrap;
    font-family: monospace;
}
</style>
