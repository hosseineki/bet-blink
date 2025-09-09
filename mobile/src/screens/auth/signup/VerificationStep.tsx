import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SignUpData } from '../../../types/auth';

interface VerificationStepProps {
    data: Partial<SignUpData>;
    onNext: (data: Partial<SignUpData>) => void;
    onPrevious: () => void;
    isLoading: boolean;
}

export default function VerificationStep({
    data,
    onNext,
    onPrevious,
    isLoading
}: VerificationStepProps): React.JSX.Element {
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [resendTimer, setResendTimer] = useState<number>(0);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // Start resend timer
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const validateCode = (): boolean => {
        if (!verificationCode.trim()) {
            setError('Verification code is required');
            return false;
        }

        if (verificationCode.length !== 6) {
            setError('Verification code must be 6 digits');
            return false;
        }

        if (!/^\d{6}$/.test(verificationCode)) {
            setError('Verification code must contain only numbers');
            return false;
        }

        setError('');
        return true;
    };

    const handleVerify = (): void => {
        if (validateCode()) {
            // In a real app, you would verify the code with your backend
            onNext({});
        }
    };

    const handleResendCode = async (): Promise<void> => {
        try {
            // In a real app, you would call your backend to resend the verification code
            Alert.alert('Code Sent', 'A new verification code has been sent to your email and phone.');
            setResendTimer(60);

            const interval = setInterval(() => {
                setResendTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            Alert.alert('Error', 'Failed to resend verification code. Please try again.');
        }
    };

    const formatPhoneNumber = (phone: string): string => {
        // Simple phone number formatting for display
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
    };

    const maskEmail = (email: string): string => {
        const [localPart, domain] = email.split('@');
        if (localPart.length <= 2) return email;

        const maskedLocal = localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1];
        return `${maskedLocal}@${domain}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.description}>
                Verify your email and phone number
            </Text>

            <View style={styles.form}>
                {/* Verification Code Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Verification Code *</Text>
                    <TextInput
                        style={[styles.codeInput, error && styles.inputError]}
                        value={verificationCode}
                        onChangeText={(value) => {
                            setVerificationCode(value);
                            if (error) setError('');
                        }}
                        placeholder="123456"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        maxLength={6}
                        textAlign="center"
                        autoFocus
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>

                {/* Verification Info */}
                <View style={styles.verificationInfo}>
                    <Text style={styles.verificationText}>
                        We've sent a 6-digit verification code to:
                    </Text>

                    <View style={styles.contactInfo}>
                        <View style={styles.contactItem}>
                            <Ionicons name="mail" size={20} color="#ffd700" />
                            <Text style={styles.contactText}>
                                {data.email ? maskEmail(data.email) : 'your email'}
                            </Text>
                        </View>

                        <View style={styles.contactItem}>
                            <Ionicons name="call" size={20} color="#ffd700" />
                            <Text style={styles.contactText}>
                                {data.phoneNumber ? formatPhoneNumber(data.phoneNumber) : 'your phone'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Resend Code */}
                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>
                        Didn't receive the code?
                    </Text>
                    <TouchableOpacity
                        style={[styles.resendButton, resendTimer > 0 && styles.resendButtonDisabled]}
                        onPress={handleResendCode}
                        disabled={resendTimer > 0 || isLoading}
                    >
                        <Text style={[
                            styles.resendButtonText,
                            resendTimer > 0 && styles.resendButtonTextDisabled
                        ]}>
                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Security Notice */}
                <View style={styles.infoBox}>
                    <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                    <Text style={styles.infoText}>
                        This verification step helps us secure your account and comply with
                        regulatory requirements.
                    </Text>
                </View>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.previousButton}
                    onPress={onPrevious}
                    disabled={isLoading}
                >
                    <Ionicons name="arrow-back" size={20} color="#ffffff" />
                    <Text style={styles.previousButtonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
                    onPress={handleVerify}
                    disabled={isLoading}
                >
                    <LinearGradient
                        colors={isLoading ? ['#666', '#555'] : ['#4CAF50', '#45a049']}
                        style={styles.verifyButtonGradient}
                    >
                        {isLoading ? (
                            <Ionicons name="hourglass" size={20} color="#999" />
                        ) : (
                            <>
                                <Ionicons name="checkmark" size={20} color="#ffffff" />
                                <Text style={styles.verifyButtonText}>Verify & Complete</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    description: {
        fontSize: 16,
        color: '#b0b0b0',
        textAlign: 'center',
        marginBottom: 30,
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 12,
        textAlign: 'center',
    },
    codeInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        letterSpacing: 4,
    },
    inputError: {
        borderColor: '#ff6b6b',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    verificationInfo: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    verificationText: {
        fontSize: 14,
        color: '#b0b0b0',
        textAlign: 'center',
        marginBottom: 16,
    },
    contactInfo: {
        gap: 12,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactText: {
        fontSize: 16,
        color: '#ffffff',
        marginLeft: 12,
        fontWeight: '500',
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    resendText: {
        fontSize: 14,
        color: '#b0b0b0',
        marginBottom: 8,
    },
    resendButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    resendButtonDisabled: {
        opacity: 0.5,
    },
    resendButtonText: {
        fontSize: 16,
        color: '#ffd700',
        fontWeight: '600',
    },
    resendButtonTextDisabled: {
        color: '#666',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#b0b0b0',
        marginLeft: 12,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
    },
    previousButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    previousButtonText: {
        color: '#ffffff',
        fontSize: 16,
        marginLeft: 8,
    },
    verifyButton: {
        flex: 1,
        marginLeft: 20,
    },
    verifyButtonDisabled: {
        opacity: 0.6,
    },
    verifyButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
    },
    verifyButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
