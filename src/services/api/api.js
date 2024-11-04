import AuthApiService from './AuthApiService';
import MemberApiService from './MemberApiService'

export const $api = {
    auth: new AuthApiService(),
    member: new MemberApiService()
};