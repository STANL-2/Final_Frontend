import BaseApiService from '@/services/api/config/BaseApiService';
import DOMEventService from '@/services/DOMEventService';
import { useUserStore } from '@/stores/user';

export default class ApiService extends BaseApiService {
    #userStore;

    constructor(resource) {
        super(resource);

        const userStore = useUserStore();
        this.#userStore = userStore;
    }

    // 요청 처리하는 곳
    async #callApi(url, options) {
        try {

            // headers 값 셋팅
            const myHeaders = new Headers();

            // form data가 아니면 Content-Type 추가
            if (options?.body && !(options.body instanceof FormData)) {
                myHeaders.append('Content-Type', 'application/json');
            }

            const fetchOptions = { ...options };

            fetchOptions['headers'] = myHeaders;

            // 요청 시작
            const response = await fetch(url, fetchOptions);
            if (response.ok) {
                const responseData = await response.json(); // JSON 데이터 추출
                return responseData;
            } else {
                console.error(`HTTP Error: ${response.status}`);
                return null;
            }
        } catch (err) {
            console.log('서버 에러 발생!', err);
        }
    }

    async get(subUrl, queryParams) {
        let url = `${this.baseUrl}`;
        if (subUrl) {
            url += `/${subUrl}`;
        }
        if (queryParams) {
            url += `?${queryParams}`;
        }

        const responseData = await this.#callApi(url);
        return responseData.result;
    }


    async post(data = {}, subUrl) {
        let url = `${this.baseUrl}/${this.resource}`;
        if (subUrl) {
            url += `/${subUrl}`;
        }
        let requestBody = JSON.stringify(data);
        // formData 자체로 넘어올 예정
        if (data instanceof FormData) {
            requestBody = data;
        }

        const options = {
            method: 'POST',
            body: requestBody,
        };

        const responseData = await this.#callApi(url, options);

        if (responseData) {
            return responseData;
        } else {
            const errorData = await response.text();
            return null;
        }
    }

    async put(data = {}, subUrl) {
        let url = `${this.baseUrl}/${this.resource}`;
        if (subUrl) {
            url += `/${subUrl}`;
        }

        let requestBody = JSON.stringify(data);

        // formData 자체로 넘어올 예정
        if (data instanceof FormData) {
            requestBody = data;
        }

        const options = {
            method: 'PUT',
            body: requestBody,
        };

        const responseData = await this.#callApi(url, options);
        DOMEventService.dispatchApiSuccess(responseData.msg || '성공');

        return responseData.result;
    }

    async delete(data, subUrl) {
        let url = `${this.baseUrl}/${this.resource}`;
        if (subUrl) {
            url += `/${subUrl}`;
        }

        const options = {
            method: 'DELETE',
            body: JSON.stringify(data),
        };

        const responseData = await this.#callApi(url, options);
        DOMEventService.dispatchApiSuccess(responseData.msg || '성공');

        return responseData.result;
    }
}