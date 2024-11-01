import MemberApiService from '@/services/api/MemberApiService'

export const $api = {
    member: new MemberApiService(),
};