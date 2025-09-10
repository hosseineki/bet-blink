import { IS_MOBILE, EMULATOR_API_URL, PHYSICAL_DEVICE_API_URL, PORT } from '@env';

// Type definitions for environment variables
declare module '@env' {
    export const PORT: string;
    export const IS_MOBILE: string;
    export const EMULATOR_API_URL: string;
    export const PHYSICAL_DEVICE_API_URL: string;
}

const getApiBaseUrl = (): string => {
    const isMobile = IS_MOBILE === 'true';
    return isMobile ? PHYSICAL_DEVICE_API_URL : EMULATOR_API_URL;
};

export const buildApiUrl = (endpoint: string): string => {
    const baseUrl = getApiBaseUrl();
    return `${baseUrl}:${PORT}${endpoint}`;
};
