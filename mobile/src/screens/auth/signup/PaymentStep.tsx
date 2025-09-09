import React, { useState } from 'react';
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
import { SignUpData, PaymentMethod } from '../../../types/auth';

interface PaymentStepProps {
  data: Partial<SignUpData>;
  onNext: (data: Partial<SignUpData>) => void;
  onPrevious: () => void;
}

export default function PaymentStep({ 
  data, 
  onNext, 
  onPrevious 
}: PaymentStepProps): React.JSX.Element {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: data.paymentMethod?.type || 'card',
    cardNumber: data.paymentMethod?.cardNumber || '',
    expiryDate: data.paymentMethod?.expiryDate || '',
    cvv: data.paymentMethod?.cvv || '',
    cardholderName: data.paymentMethod?.cardholderName || '',
    paypalEmail: data.paymentMethod?.paypalEmail || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod.type === 'card') {
      if (!paymentMethod.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(paymentMethod.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }

      if (!paymentMethod.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentMethod.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }

      if (!paymentMethod.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(paymentMethod.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }

      if (!paymentMethod.cardholderName) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
    } else if (paymentMethod.type === 'paypal') {
      if (!paymentMethod.paypalEmail) {
        newErrors.paypalEmail = 'PayPal email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentMethod.paypalEmail)) {
        newErrors.paypalEmail = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (): void => {
    if (validateForm()) {
      onNext({ paymentMethod });
    }
  };

  const handleInputChange = (field: keyof PaymentMethod, value: string): void => {
    setPaymentMethod(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (text: string): string => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string): string => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const renderPaymentMethodForm = (): React.JSX.Element => {
    switch (paymentMethod.type) {
      case 'card':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Card Number *</Text>
              <TextInput
                style={[styles.input, errors.cardNumber && styles.inputError]}
                value={paymentMethod.cardNumber}
                onChangeText={(value) => handleInputChange('cardNumber', formatCardNumber(value))}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={19}
              />
              {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cardholder Name *</Text>
              <TextInput
                style={[styles.input, errors.cardholderName && styles.inputError]}
                value={paymentMethod.cardholderName}
                onChangeText={(value) => handleInputChange('cardholderName', value)}
                placeholder="John Doe"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
              {errors.cardholderName && <Text style={styles.errorText}>{errors.cardholderName}</Text>}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Expiry Date *</Text>
                <TextInput
                  style={[styles.input, errors.expiryDate && styles.inputError]}
                  value={paymentMethod.expiryDate}
                  onChangeText={(value) => handleInputChange('expiryDate', formatExpiryDate(value))}
                  placeholder="MM/YY"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  maxLength={5}
                />
                {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>CVV *</Text>
                <TextInput
                  style={[styles.input, errors.cvv && styles.inputError]}
                  value={paymentMethod.cvv}
                  onChangeText={(value) => handleInputChange('cvv', value)}
                  placeholder="123"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
                {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
              </View>
            </View>
          </>
        );

      case 'paypal':
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PayPal Email *</Text>
            <TextInput
              style={[styles.input, errors.paypalEmail && styles.inputError]}
              value={paymentMethod.paypalEmail}
              onChangeText={(value) => handleInputChange('paypalEmail', value)}
              placeholder="your.email@example.com"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.paypalEmail && <Text style={styles.errorText}>{errors.paypalEmail}</Text>}
          </View>
        );

      case 'bank_transfer':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bank Account Number *</Text>
              <TextInput
                style={[styles.input, errors.bankAccount && styles.inputError]}
                value={paymentMethod.bankAccount || ''}
                onChangeText={(value) => handleInputChange('bankAccount', value)}
                placeholder="Enter bank account number"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
              {errors.bankAccount && <Text style={styles.errorText}>{errors.bankAccount}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sort Code *</Text>
              <TextInput
                style={[styles.input, errors.sortCode && styles.inputError]}
                value={paymentMethod.sortCode || ''}
                onChangeText={(value) => handleInputChange('sortCode', value)}
                placeholder="12-34-56"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={8}
              />
              {errors.sortCode && <Text style={styles.errorText}>{errors.sortCode}</Text>}
            </View>
          </>
        );

      default:
        return <></>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Add a payment method for your account
      </Text>

      <View style={styles.form}>
        {/* Payment Method Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Payment Method *</Text>
          <View style={styles.paymentMethodContainer}>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                paymentMethod.type === 'card' && styles.paymentMethodButtonActive,
              ]}
              onPress={() => {
                setPaymentMethod(prev => ({ ...prev, type: 'card' }));
                setErrors({});
              }}
            >
              <Ionicons 
                name="card" 
                size={24} 
                color={paymentMethod.type === 'card' ? '#ffd700' : '#b0b0b0'} 
              />
              <Text style={[
                styles.paymentMethodText,
                paymentMethod.type === 'card' && styles.paymentMethodTextActive,
              ]}>
                Credit/Debit Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                paymentMethod.type === 'paypal' && styles.paymentMethodButtonActive,
              ]}
              onPress={() => {
                setPaymentMethod(prev => ({ ...prev, type: 'paypal' }));
                setErrors({});
              }}
            >
              <Ionicons 
                name="logo-paypal" 
                size={24} 
                color={paymentMethod.type === 'paypal' ? '#ffd700' : '#b0b0b0'} 
              />
              <Text style={[
                styles.paymentMethodText,
                paymentMethod.type === 'paypal' && styles.paymentMethodTextActive,
              ]}>
                PayPal
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Method Form */}
        {renderPaymentMethodForm()}

        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>
            Your payment information is encrypted and secure. We use industry-standard 
            security measures to protect your data.
          </Text>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.previousButton} onPress={onPrevious}>
          <Ionicons name="arrow-back" size={20} color="#ffffff" />
          <Text style={styles.previousButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <LinearGradient
            colors={['#ffd700', '#ffed4e']}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#1a1a2e" />
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 0.48,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodButton: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  paymentMethodButtonActive: {
    borderColor: '#ffd700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#b0b0b0',
    marginLeft: 8,
    textAlign: 'center',
  },
  paymentMethodTextActive: {
    color: '#ffd700',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    marginTop: 10,
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
  nextButton: {
    flex: 1,
    marginLeft: 20,
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
