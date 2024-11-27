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

    async #callApi(url, options = {}) { // options에 빈 객체 추가
        try {
            const myHeaders = new Headers();

            // form data가 아니면 Content-Type 추가
            if (options?.body && !(options.body instanceof FormData)) {
                myHeaders.append('Content-Type', 'application/json');
            }

            // Excel 다운로드를 위한 Accept 헤더 추가
            if (options?.responseType === 'blob') {
                myHeaders.append('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }

            if (this.#userStore.isLoggined && this.#userStore.accessToken) {
                myHeaders.append('Authorization', `Bearer ${this.#userStore.accessToken}`);
            }

            // fetch options 설정
            const fetchOptions = { 
                ...options,
                headers: myHeaders
            };

            // blob 요청인 경우 responseType 설정
            if (options?.responseType === 'blob') {
                fetchOptions.responseType = 'blob';
            }

            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                console.error(`HTTP Error: ${response.status}`);

                let errorMsg = '서버 요청 중 문제가 발생했습니다.';
                try {
                    const errorResponse = await response.json();
                    errorMsg = errorResponse?.msg || errorMsg;
                } catch (e) {
                    console.error('JSON 파싱 실패', e);
                }
                // DOMEventService.dispatchApiError(errorMsg);
                return null;
            }
            // blob 요청인 경우 바로 blob 반환
            if (options?.responseType === 'blob') {
                const blob = await response.blob();
                return blob;
            }

            // 일반 요청인 경우 JSON 반환
            const responseData = await response.json();
            return responseData;

        } catch (err) {
            console.error('서버 에러 발생!', err);
            // DOMEventService.dispatchApiError('서버와의 통신에 문제가 발생했습니다.');
            throw err;
        }
    }

    async get(subUrl, queryParams, options = {}) {
        let url = `${this.baseUrl}/${this.resource}`;

        if (subUrl) {
            url += `/${subUrl}`;
        }

        if (queryParams) {
            url += `/${queryParams}`;
        }

        const response = await this.#callApi(url, options);

        // blob 응답이 아닌 경우에만 성공 메시지 표시
        if (!options?.responseType || options.responseType !== 'blob') {
            // DOMEventService.dispatchApiSuccess(response?.msg || '성공');
        }

        return response;
    }

    async getParams(subUrl, queryParams) {
        let url = `${this.baseUrl}/${this.resource}`;

        if (subUrl) {
            url += `/${subUrl}`;
        }

        if (queryParams) {
            url += `${queryParams}`;
        }
        
        const response = await this.#callApi(url);
        console.log(url);
        return response;
    }


    async post(data = {}, subUrl, file = null) {
        let url = `${this.baseUrl}/${this.resource}`;
        if (subUrl) {
            url += `/${subUrl}`;
        }

        let requestBody;

        // JSON 요청 생성
        if(file) {
            requestBody = new FormData();        

            requestBody.append('file', file);
            requestBody.append('dto', 
                new Blob([JSON.stringify(data)], 
                { type: 'application/json'})
            );

        } else {
            requestBody = JSON.stringify(data);
        }   

        const options = {
            method: 'POST',
            body: requestBody
        };

        const responseData = await this.#callApi(url, options);
        // DOMEventService.dispatchApiSuccess(responseData.msg || '성공');
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

        const options = {
            method: 'PUT',
            body: requestBody,
        };

        const responseData = await this.#callApi(url, options);
        // DOMEventService.dispatchApiSuccess(responseData.msg || '성공');

        return responseData;
    }

    async delete(subUrl) {
        let url = `${this.baseUrl}/${this.resource}`;
        if (subUrl) {
            url += `/${subUrl}`;
        }

        const options = {
            method: 'DELETE'
        };

        const responseData = await this.#callApi(url, options);
        // DOMEventService.dispatchApiSuccess(responseData.msg || '성공');
        return responseData;
    }
}