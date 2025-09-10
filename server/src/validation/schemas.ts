import { z } from 'zod';

// Address validation schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

// Payment method validation schema
export const paymentMethodSchema = z.object({
  type: z.enum(['card', 'paypal', 'bank_transfer'], {
    required_error: 'Payment method type is required',
  }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardholderName: z.string().optional(),
  paypalEmail: z.string().email().optional(),
  bankAccount: z.string().optional(),
  sortCode: z.string().optional(),
}).refine((data) => {
  if (data.type === 'card') {
    return data.cardNumber && data.expiryDate && data.cvv && data.cardholderName;
  }
  if (data.type === 'paypal') {
    return data.paypalEmail;
  }
  if (data.type === 'bank_transfer') {
    return data.bankAccount && data.sortCode;
  }
  return true;
}, {
  message: 'Required fields for selected payment method are missing',
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


//-------------------- Sign up validation schema --------------------
export const registerStep1Schema = z.object({
  Email: z.string().email('Invalid email format'),
  PhoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  Password: z.string().min(8, 'Password must be at least 8 characters'),
  TermsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  })
});

export const registerStep2Schema = z.object({
  Email: z.string().email('Invalid email format'),
  Password: z.string().min(8, 'Password must be at least 8 characters'),
  PhoneNumber: z.string().min(10, 'Phone number must be at least 10 characters')
});

// Sign up validation schema
export const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: addressSchema,
  paymentMethod: paymentMethodSchema,
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  marketingConsent: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Refresh token validation schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Verification code validation schema
export const verificationSchema = z.object({
  email: z.string().email('Invalid email format'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

// Password reset validation schema
export const passwordResetSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// New password validation schema
export const newPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
