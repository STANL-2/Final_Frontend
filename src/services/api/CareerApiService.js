import ApiService from '@/services/api/config/ApiService';

export default class CareerApiService extends ApiService {
    constructor() {
        super('api/v1/career');
    }
}