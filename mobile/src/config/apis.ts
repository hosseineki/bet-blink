import { buildApiUrl } from "./config";


const API_ENDPOINTS = {
    REGISTER_STEP_1: '/api/auth/RegisterStep1',
    LOGIN: '/api/auth/login',
    REFRESH_TOKEN: '/api/auth/refresh',
    // Add more endpoints as needed
} as const;

const REGISTER_STEP_1 = buildApiUrl(API_ENDPOINTS.REGISTER_STEP_1);
const LOGIN = buildApiUrl(API_ENDPOINTS.LOGIN);
const REFRESH_TOKEN = buildApiUrl(API_ENDPOINTS.REFRESH_TOKEN);

export default {
    REGISTER_STEP_1,
    LOGIN,
    REFRESH_TOKEN,
};