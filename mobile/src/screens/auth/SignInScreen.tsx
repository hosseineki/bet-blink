import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../../contexts/AuthContext';
import { LoginCredentials } from '../../types/auth';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

interface SignInScreenProps {
    navigation: SignInScreenNavigationProp;
}

export default function SignInScreen({ navigation }: SignInScreenProps): React.JSX.Element {
    const { signIn, isLoading, error, clearError, biometricEnabled, enableBiometric } = useAuth();

    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [biometricPrompted, setBiometricPrompted] = useState<boolean>(false);

    useEffect(() => {
        // Clear any previous errors when component mounts
        clearError();
    }, [clearError]);

    const handleSignIn = async (): Promise<void> => {
        try {
            await signIn(credentials);

            // Show biometric setup prompt on first successful login
            if (!biometricEnabled && !biometricPrompted) {
                setBiometricPrompted(true);
                Alert.alert(
                    'Enable Biometric Login',
                    'Would you like to enable biometric authentication for faster future logins?',
                    [
                        {
                            text: 'Not Now',
                            style: 'cancel',
                        },
                        {
                            text: 'Enable',
                            onPress: async () => {
                                try {
                                    await enableBiometric();
                                    Alert.alert('Success', 'Biometric authentication enabled!');
                                } catch (error) {
                                    Alert.alert('Error', 'Failed to enable biometric authentication.');
                                }
                            },
                        },
                    ]
                );
            }
        } catch (error) {
            // Error is handled by the auth context
        }
    };

    const handleBiometricSignIn = async (): Promise<void> => {
        try {
            // In a real app, you would implement biometric authentication here
            Alert.alert('Biometric Login', 'Biometric authentication would be implemented here');
        } catch (error) {
            Alert.alert('Error', 'Biometric authentication failed');
        }
    };

    const handleInputChange = (field: keyof LoginCredentials, value: string): void => {
        setCredentials(prev => ({ ...prev, [field]: value }));
        if (error) clearError();
    };

    const isFormValid = (): boolean => {
        return credentials.email.trim().length > 0 && credentials.password.length > 0;
    };

    return (
        <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#ffffff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Welcome Back</Text>
                        <View style={styles.placeholder} />
                    </View>

                    {/* Logo and Title */}
                    <View style={styles.logoContainer}>
                        <Ionicons name="logo-bitcoin" size={80} color="#ffd700" />
                        <Text style={styles.title}>Sign In</Text>
                        <Text style={styles.subtitle}>Enter your credentials to continue</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail" size={20} color="#b0b0b0" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={credentials.email}
                                    onChangeText={(value) => handleInputChange('email', value)}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#666"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed" size={20} color="#b0b0b0" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={credentials.password}
                                    onChangeText={(value) => handleInputChange('password', value)}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#666"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color="#b0b0b0"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Remember Me & Forgot Password */}
                        <View style={styles.optionsRow}>
                            <TouchableOpacity
                                style={styles.rememberMeContainer}
                                onPress={() => setRememberMe(!rememberMe)}
                            >
                                <Ionicons
                                    name={rememberMe ? 'checkbox' : 'square-outline'}
                                    size={20}
                                    color={rememberMe ? '#ffd700' : '#b0b0b0'}
                                />
                                <Text style={styles.rememberMeText}>Remember me</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.forgotPasswordButton}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Error Message */}
                        {error && (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={20} color="#ff6b6b" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={[styles.signInButton, !isFormValid() && styles.signInButtonDisabled]}
                            onPress={handleSignIn}
                            disabled={!isFormValid() || isLoading}
                        >
                            <LinearGradient
                                colors={!isFormValid() || isLoading ? ['#666', '#555'] : ['#ffd700', '#ffed4e']}
                                style={styles.signInButtonGradient}
                            >
                                {isLoading ? (
                                    <Ionicons name="hourglass" size={20} color="#999" />
                                ) : (
                                    <>
                                        <Text style={[styles.signInButtonText, !isFormValid() && styles.signInButtonTextDisabled]}>
                                            Sign In
                                        </Text>
                                        <Ionicons
                                            name="arrow-forward"
                                            size={20}
                                            color={!isFormValid() ? '#999' : '#1a1a2e'}
                                        />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Biometric Sign In */}
                        {biometricEnabled && (
                            <TouchableOpacity
                                style={styles.biometricButton}
                                onPress={handleBiometricSignIn}
                                disabled={isLoading}
                            >
                                <LinearGradient
                                    colors={['#4CAF50', '#45a049']}
                                    style={styles.biometricButtonGradient}
                                >
                                    <Ionicons name="finger-print" size={20} color="#ffffff" />
                                    <Text style={styles.biometricButtonText}>Use Biometric</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Sign Up Link */}
                        <View style={styles.signUpContainer}>
                            <Text style={styles.signUpText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={styles.signUpLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        padding: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    placeholder: {
        width: 44,
    },
    logoContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#b0b0b0',
        marginTop: 8,
    },
    form: {
        paddingHorizontal: 20,
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    inputIcon: {
        paddingLeft: 16,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#ffffff',
    },
    eyeButton: {
        paddingRight: 16,
        paddingVertical: 16,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberMeText: {
        fontSize: 14,
        color: '#b0b0b0',
        marginLeft: 8,
    },
    forgotPasswordButton: {
        paddingVertical: 8,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#ffd700',
        fontWeight: '600',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#ff6b6b',
    },
    errorText: {
        flex: 1,
        fontSize: 14,
        color: '#ff6b6b',
        marginLeft: 8,
    },
    signInButton: {
        marginBottom: 20,
    },
    signInButtonDisabled: {
        opacity: 0.6,
    },
    signInButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
    },
    signInButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginRight: 8,
    },
    signInButtonTextDisabled: {
        color: '#999',
    },
    biometricButton: {
        marginBottom: 20,
    },
    biometricButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
    },
    biometricButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginLeft: 8,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    dividerText: {
        fontSize: 14,
        color: '#b0b0b0',
        paddingHorizontal: 16,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    signUpText: {
        fontSize: 14,
        color: '#b0b0b0',
    },
    signUpLink: {
        fontSize: 14,
        color: '#ffd700',
        fontWeight: '600',
    },
});
