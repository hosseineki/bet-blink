import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { SignUpData } from '../../../types/auth';
import APIs from '../../../config/apis';
import * as Crypto from "expo-crypto";


interface CredentialsStepProps {
  data: Partial<SignUpData>;
  onNext: (data: Partial<SignUpData>) => void;
  onPrevious?: () => void;
}

export default function CredentialsStep({
  data,
  onNext,
  onPrevious
}: CredentialsStepProps): React.JSX.Element {
  const [formData, setFormData] = useState({
    email: data.email || '',
    phoneNumber: data.phoneNumber || '',
    password: data.password || '',
    confirmPassword: data.confirmPassword || '',
    termsAccepted: data.termsAccepted || false,
  });


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      email: 'alix.a.sanders@gmail.com',
      phoneNumber: '+447725465417',
      password: '1234Aaaa',
      confirmPassword: '1234Aaaa',
      termsAccepted: true,
    }));
  }, []);

  const registerStep1 = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const hashedPassword = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, formData.password);
      // const response = await axios.post(APIs.REGISTER_STEP_1, {
      //   Email: formData.email,
      //   PhoneNumber: formData.phoneNumber,
      //   Password: hashedPassword,
      //   TermsAccepted: formData.termsAccepted,
      // });

      Alert.alert('Registration successful');
      return true;

      // if (response.status === 200) {
      //   return true;
      // } else {
      //   Alert.alert('Error', 'Registration failed. Please try again.');
      //   return false;
      // }
    } catch (error: any) {
      console.error('RegisterStep1 error:', error);

      if (error.response?.data?.message) {
        Alert.alert('Registration Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (): Promise<void> => {
    if (validateForm()) {
      const success = await registerStep1();
      if (success) {
        onNext(formData);
      }
    }
  };

  const handleInputChange = (field: string, value: string | boolean): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Let's start with your basic information
      </Text>

      <View style={styles.form}>
        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholder="Create a password"
            placeholderTextColor="#666"
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            placeholder="Confirm your password"
            placeholderTextColor="#666"
            secureTextEntry
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>
        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={[styles.input, errors.phoneNumber && styles.inputError]}
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
            placeholder="+1 (555) 123-4567"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
          />
          {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
        </View>

        {/* Terms and Conditions */}
        {/* <View style={styles.checkboxGroup}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleInputChange('termsAccepted', !formData.termsAccepted)}
          >
            <Ionicons
              name={formData.termsAccepted ? 'checkbox' : 'square-outline'}
              size={24}
              color={formData.termsAccepted ? '#ffd700' : '#666'}
            />
            <Text style={styles.checkboxText}>
              I agree to the Terms and Conditions *
            </Text>
          </TouchableOpacity>
          {errors.termsAccepted && <Text style={styles.errorText}>{errors.termsAccepted}</Text>}
        </View> */}

        {/* Marketing Consent */}
        <View style={styles.checkboxGroup}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleInputChange('termsAccepted', !formData.termsAccepted)}
          >
            <Ionicons
              name={formData.termsAccepted ? 'checkbox' : 'square-outline'}
              size={24}
              color={formData.termsAccepted ? '#ffd700' : '#666'}
            />
            <Text style={styles.checkboxText}>
              I am over 18 and agree to the{' '}
              <Text
                style={styles.linkText}
                onPress={() => Linking.openURL('https://www.betblink.com/terms-and-conditions')}
              >
                Terms and Conditions
              </Text>
              ,{' '}
              <Text
                style={styles.linkText}
                onPress={() => Linking.openURL('https://www.betblink.com/privacy-policy')}
              >
                Privacy Policy
              </Text>
              {' '}and{' '}
              <Text
                style={styles.linkText}
                onPress={() => Linking.openURL('https://www.betblink.com/sport-rules')}
              >
                Sport Rules
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {onPrevious && (
          <TouchableOpacity style={styles.previousButton} onPress={onPrevious}>
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
            <Text style={styles.previousButtonText}>Previous</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, isLoading && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isLoading}
        >
          <LinearGradient
            colors={isLoading ? ['#666', '#555'] : ['#ffd700', '#ffed4e']}
            style={styles.nextButtonGradient}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#1a1a2e" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>Next</Text>
                <Ionicons name="arrow-forward" size={20} color="#1a1a2e" />
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 4,
  },
  checkboxGroup: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 14,
    color: '#b0b0b0',
    marginLeft: 12,
    flex: 1,
  },
  linkText: {
    color: '#ffd700',
    textDecorationLine: 'underline',
    fontWeight: '600',
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
  nextButton: {
    flex: 1,
    marginLeft: 20,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
