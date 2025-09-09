// Authentication types and interfaces

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
    address: Address;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    postCode: string;
    country: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignUpData {
    // Stage 1: Personal Information
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;

    // Stage 2: Profile Information
    dateOfBirth: string;
    gender: string;

    // Stage 3: Address
    address: Address;

    // Stage 4: Payment Information
    paymentMethod: PaymentMethod;

    // Additional fields
    termsAccepted: boolean;
    marketingConsent: boolean;
    promoPreferences?: PromoPreferences;
}

export interface PromoPreferences {
    sms: {
        casino: boolean;
        sport: boolean;
        bingo: boolean;
    };
    email: {
        casino: boolean;
        sport: boolean;
        bingo: boolean;
    };
}

export interface PaymentMethod {
    type: 'card' | 'paypal' | 'bank_transfer';
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
    paypalEmail?: string;
    bankAccount?: string;
    sortCode?: string;
}

export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    biometricEnabled: boolean;
}

export interface AuthContextType extends AuthState {
    signIn: (credentials: LoginCredentials) => Promise<void>;
    signUp: (data: SignUpData) => Promise<void>;
    signOut: () => Promise<void>;
    refreshToken: () => Promise<void>;
    enableBiometric: () => Promise<void>;
    disableBiometric: () => Promise<void>;
    clearError: () => void;
}

// Sign-up stage types
export type SignUpStage =
    | 'credentials'
    | 'profile'
    | 'address';
// | 'payment'
// | 'verification'
// | 'complete';

export interface SignUpStageData {
    stage: SignUpStage;
    data: Partial<SignUpData>;
    isComplete: boolean;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
    errors?: Record<string, string[]>;
}

export interface LoginResponse {
    user: User;
    tokens: AuthTokens;
}

export interface SignUpResponse {
    user: User;
    tokens: AuthTokens;
    requiresVerification: boolean;
}

// Biometric types
export interface BiometricCredentials {
    username: string;
    password: string;
}

export interface BiometricAuthResult {
    success: boolean;
    error?: string;
    credentials?: BiometricCredentials;
}
