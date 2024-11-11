import AuthApiService from './AuthApiService';
import MemberApiService from './MemberApiService'
import SampleApiService from './SampleApiService';

export const $api = {
    auth: new AuthApiService(),
    member: new MemberApiService(),
    sample: new SampleApiService()
};