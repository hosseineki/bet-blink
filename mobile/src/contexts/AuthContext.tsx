import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import {
    AuthContextType,
    AuthState,
    User,
    AuthTokens,
    LoginCredentials,
    SignUpData,
    BiometricCredentials,
    BiometricAuthResult
} from '../types/auth';

// Initial state
const initialState: AuthState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    biometricEnabled: false,
};

// Action types
type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
    | { type: 'LOGOUT' }
    | { type: 'SET_BIOMETRIC_ENABLED'; payload: boolean }
    | { type: 'CLEAR_ERROR' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                tokens: action.payload.tokens,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                tokens: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'SET_BIOMETRIC_ENABLED':
            return { ...state, biometricEnabled: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
    USER: 'user',
    TOKENS: 'tokens',
    BIOMETRIC_ENABLED: 'biometric_enabled',
    BIOMETRIC_CREDENTIALS: 'biometric_credentials',
};

// API base URL - replace with your actual backend URL
const API_BASE_URL = 'https://your-backend-api.com/api';

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for stored authentication on app start
    useEffect(() => {
        checkStoredAuth();
    }, []);

    const checkStoredAuth = async (): Promise<void> => {
        try {
            const [user, tokens, biometricEnabled] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.USER),
                AsyncStorage.getItem(STORAGE_KEYS.TOKENS),
                AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED),
            ]);

            if (user && tokens) {
                const parsedUser = JSON.parse(user);
                const parsedTokens = JSON.parse(tokens);

                // Verify token is still valid
                if (parsedTokens.expiresIn > Date.now()) {
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: { user: parsedUser, tokens: parsedTokens },
                    });
                    dispatch({
                        type: 'SET_BIOMETRIC_ENABLED',
                        payload: biometricEnabled === 'true',
                    });
                } else {
                    // Token expired, try to refresh
                    await refreshToken();
                }
            }
        } catch (error) {
            console.error('Error checking stored auth:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const signIn = async (credentials: LoginCredentials): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'CLEAR_ERROR' });

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            const { user, tokens } = data.data;

            // Store authentication data
            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
                AsyncStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens)),
            ]);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, tokens },
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            throw error;
        }
    };

    const signUp = async (data: SignUpData): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'CLEAR_ERROR' });

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            const { user, tokens } = result.data;

            // Store authentication data
            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
                AsyncStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens)),
            ]);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, tokens },
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            throw error;
        }
    };

    const signOut = async (): Promise<void> => {
        try {
            // Clear stored data
            await Promise.all([
                AsyncStorage.removeItem(STORAGE_KEYS.USER),
                AsyncStorage.removeItem(STORAGE_KEYS.TOKENS),
                AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_CREDENTIALS),
            ]);

            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const refreshToken = async (): Promise<void> => {
        try {
            const tokens = await AsyncStorage.getItem(STORAGE_KEYS.TOKENS);
            if (!tokens) return;

            const parsedTokens = JSON.parse(tokens);
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${parsedTokens.refreshToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const newTokens = data.data.tokens;

                await AsyncStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(newTokens));

                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { user: state.user!, tokens: newTokens },
                });
            } else {
                // Refresh failed, sign out
                await signOut();
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            await signOut();
        }
    };

    const enableBiometric = async (): Promise<void> => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                throw new Error('Biometric authentication not available');
            }

            // Store credentials for biometric authentication
            const credentials: BiometricCredentials = {
                username: state.user?.email || '',
                password: '', // In a real app, you'd need to securely store this
            };

            await AsyncStorage.setItem(
                STORAGE_KEYS.BIOMETRIC_CREDENTIALS,
                JSON.stringify(credentials)
            );
            await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');

            dispatch({ type: 'SET_BIOMETRIC_ENABLED', payload: true });
        } catch (error) {
            console.error('Error enabling biometric:', error);
            throw error;
        }
    };

    const disableBiometric = async (): Promise<void> => {
        try {
            await Promise.all([
                AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_CREDENTIALS),
                AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_ENABLED),
            ]);

            dispatch({ type: 'SET_BIOMETRIC_ENABLED', payload: false });
        } catch (error) {
            console.error('Error disabling biometric:', error);
        }
    };

    const authenticateWithBiometric = async (): Promise<BiometricAuthResult> => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                return { success: false, error: 'Biometric authentication not available' };
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to access your account',
                fallbackLabel: 'Use Password',
            });

            if (result.success) {
                const storedCredentials = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_CREDENTIALS);
                if (storedCredentials) {
                    const credentials = JSON.parse(storedCredentials);
                    return { success: true, credentials };
                }
            }

            return { success: false, error: 'Biometric authentication failed' };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Biometric authentication error'
            };
        }
    };

    const clearError = (): void => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value: AuthContextType = {
        ...state,
        signIn,
        signUp,
        signOut,
        refreshToken,
        enableBiometric,
        disableBiometric,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
