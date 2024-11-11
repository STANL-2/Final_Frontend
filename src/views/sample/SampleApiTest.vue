<template>
    <div>
        <div>
            <h1>POST API</h1><br>
            name: <input v-model="postName" type="text" class="post-name"><br><br>
            num: <input v-model="postNum" type="text" class="post-num"><br><br>
            <Button label="post 요청" class="btn-post" @click="postRequest">post 요청
            </Button>
        </div>
        <br><br><br>

        <div>
            <h1>PUT API</h1><br>
            mem_id: <input v-model="putMemId" type="text" class="put-mem-id"><br><br>
            name: <input v-model="putName" type="text" class="put-name"><br><br>
            <Button label="put 요청" class="btn-put" @click="putRequest">put 요청
            </Button>
        </div>

        <br><br><br>

        <div>
            <h1>DELETE API</h1><br>
            mem_id: <input v-model="deleteMemId" type="text" class="delete-mem-id"><br><br>
            <Button label="delete 요청" class="btn-delete" @click="deleteRequest">delete 요청
            </Button>
        </div>
        <br><br><br>

        <div>
            <h1>GET API</h1><br>
            mem_id: <input v-model="getMemId" type="text" class="get-mem-id"><br><br>
            <Button label="get 요청" class="btn-get" @click="getRequest">get 요청
            </Button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { $api } from '@/services/api/api'

const postName = ref('');
const postNum = ref('');

const putMemId = ref('');
const putName = ref('');

const deleteMemId = ref('');

const getMemId = ref('');

// GET 요청 함수
const getRequest = async () => {
    try {
        const response = await $api.sample.get(
            '',
            'id='+getMemId.value
            
        );

        console.log('[GET 요청]');
        console.log(response);
    } catch (error) {
        console.error('GET 요청 실패: ', error);
    }
}

// POST 요청 함수
const postRequest = async () => {
    try {
        const response = await $api.sample.post(
            {
                name: postName.value,
                num: postNum.value
            },
            ''
        );

        console.log('[POST 요청]');
        console.log('response: ', response);
        console.log('result: ', response.result);
    } catch (error) {
        console.error('POST 요청 실패: ', error);
    }
};

// PUT 요청 함수
const putRequest = async () => {
    try {
        const response = await $api.sample.put(
            {
                name: putName.value
            },
            '?mem_id='+putMemId.value    // 파라미터
        )

        console.log('[PUT 요청]!!');
        console.log(response);

        console.log('result');
        console.log(response.result);
    }catch(error){
        console.error('PUT 요청 실패: ', error);
    }
}

// DELETE 요청 함수
const deleteRequest = async () => {
    try {
        const response = await $api.sample.delete(
            '',
            'mem_id='+deleteMemId.value
            
        );

        console.log('[DELETE 요청]');
        console.log(response);
    } catch (error) {
        console.error('DELETE 요청 실패: ', error);
    }
}
</script>

<style scoped></style>