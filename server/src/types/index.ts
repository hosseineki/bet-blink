// API Types and Interfaces

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: Address;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  address: string;
  city: string;
  postCode: string;
  country: string;
}

export interface AddressSearchResult {
  id: string;
  address: string;
  city: string;
  postCode: string;
  country: string;
  formattedAddress: string;
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
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  address: Address;
  paymentMethod: PaymentMethod;
  termsAccepted: boolean;
  marketingConsent: boolean;
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

export interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface ProtectedRequest extends Request {
  user?: User;
}
