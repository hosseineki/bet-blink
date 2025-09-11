import { buildApiUrl } from "./config";


const API_ENDPOINTS = {
    REGISTER_STEP_1: '/api/auth/RegisterStep1',
    REGISTER_STEP_2: '/api/auth/RegisterStep2',
    LOGIN: '/api/auth/login',
    REFRESH_TOKEN: '/api/auth/refresh',
    ADDRESS_SEARCH: '/api/address/search',
    // Add more endpoints as needed
} as const;

const REGISTER_STEP_1 = buildApiUrl(API_ENDPOINTS.REGISTER_STEP_1);
const REGISTER_STEP_2 = buildApiUrl(API_ENDPOINTS.REGISTER_STEP_2);
const LOGIN = buildApiUrl(API_ENDPOINTS.LOGIN);
const REFRESH_TOKEN = buildApiUrl(API_ENDPOINTS.REFRESH_TOKEN);
const ADDRESS_SEARCH = buildApiUrl(API_ENDPOINTS.ADDRESS_SEARCH);

export default {
    REGISTER_STEP_1,
    REGISTER_STEP_2,
    LOGIN,
    REFRESH_TOKEN,
    ADDRESS_SEARCH,
};