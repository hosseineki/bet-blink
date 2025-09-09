import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SignUpData, Address } from '../../../types/auth';

interface AddressStepProps {
  data: Partial<SignUpData>;
  onNext: (data: Partial<SignUpData>) => void;
  onPrevious: () => void;
}

export default function AddressStep({
  data,
  onNext,
  onPrevious
}: AddressStepProps): React.JSX.Element {
  const [address, setAddress] = useState<Address>({
    street: data.address?.street || '',
    city: data.address?.city || '',
    state: data.address?.state || '',
    postCode: data.address?.postCode || '',
    country: data.address?.country || 'United Kingdom',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isManualEntry, setIsManualEntry] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCountryModal, setShowCountryModal] = useState<boolean>(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('GBP');
  const [promotionCode, setPromotionCode] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!address.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!address.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!address.postCode.trim()) {
      newErrors.postCode = 'Postal code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(address.postCode)) {
      newErrors.postCode = 'Please enter a valid postal code';
    }

    if (!address.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (): void => {
    if (validateForm()) {
      onNext({ address });
    }
  };

  const handleInputChange = (field: keyof Address, value: string): void => {
    setAddress(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const countries = [
    'United Kingdom',
    'United States',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
    'Sweden',
    'Norway',
    'Denmark',
    'Other',
  ];

  const currencies = [
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Please provide your address information
      </Text>

      <View style={styles.form}>
        {!isManualEntry ? (
          // Address Search View
          <>
            {/* Country */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Country *</Text>
              <TouchableOpacity
                style={[styles.selectableField, styles.selectedField]}
                onPress={() => setShowCountryModal(true)}
              >
                <Text style={styles.selectedFieldText}>{address.country}</Text>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {/* Address Search */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address *</Text>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="184"
                  placeholderTextColor="#666"
                />
                <TouchableOpacity style={styles.searchButton}>
                  <Text style={styles.searchButtonText}>Search address</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.manualLink}
                onPress={() => setIsManualEntry(true)}
              >
                <Text style={styles.manualLinkText}>Or, enter manually</Text>
              </TouchableOpacity>
            </View>

            {/* Currency */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Currency</Text>
              <TouchableOpacity
                style={[styles.selectableField, styles.selectedField]}
                onPress={() => setShowCurrencyModal(true)}
              >
                <Text style={styles.selectedFieldText}>{currency}</Text>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {/* Promotion Code */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Promotion code</Text>
              <TextInput
                style={styles.input}
                value={promotionCode}
                onChangeText={setPromotionCode}
                placeholder="Enter promotion code"
                placeholderTextColor="#666"
                autoCapitalize="characters"
              />
            </View>
          </>
        ) : (
          // Manual Entry View
          <>
            {/* Country */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Country *</Text>
              <TouchableOpacity
                style={[styles.selectableField, styles.selectedField]}
                onPress={() => setShowCountryModal(true)}
              >
                <Text style={styles.selectedFieldText}>{address.country}</Text>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {/* Back to Search */}
            <TouchableOpacity
              style={styles.manualLink}
              onPress={() => setIsManualEntry(false)}
            >
              <Text style={styles.manualLinkText}>← Back to address search</Text>
            </TouchableOpacity>

            {/* Street Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter address *</Text>
              <TextInput
                style={[styles.input, errors.street && styles.inputError]}
                value={address.street}
                onChangeText={(value) => handleInputChange('street', value)}
                placeholder="184"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
              {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}
            </View>

            {/* City */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter city *</Text>
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                value={address.city}
                onChangeText={(value) => handleInputChange('city', value)}
                placeholder="Enter city"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>

            {/* Postal Code */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter postal code *</Text>
              <TextInput
                style={[styles.input, errors.postCode && styles.inputError]}
                value={address.postCode}
                onChangeText={(value) => handleInputChange('postCode', value)}
                placeholder="Enter postal code"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.postCode && <Text style={styles.errorText}>{errors.postCode}</Text>}
            </View>

            {/* Currency */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Currency</Text>
              <TouchableOpacity
                style={[styles.selectableField, styles.selectedField]}
                onPress={() => setShowCurrencyModal(true)}
              >
                <Text style={styles.selectedFieldText}>{currency}</Text>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {/* Promotion Code */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Promotion code</Text>
              <TextInput
                style={styles.input}
                value={promotionCode}
                onChangeText={setPromotionCode}
                placeholder="Enter promotion code"
                placeholderTextColor="#666"
                autoCapitalize="characters"
              />
            </View>


          </>
        )}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#ffd700" />
          <Text style={styles.infoText}>
            Your address information is required for account verification and
            compliance with local regulations.
          </Text>
        </View>
      </View>

      {/* Country Selection Modal */}
      <Modal
        visible={showCountryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={true}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country}
                  style={[
                    styles.modalItem,
                    country === address.country && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setAddress(prev => ({ ...prev, country }));
                    setShowCountryModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    country === address.country && styles.modalItemTextSelected
                  ]}>
                    {country}
                  </Text>
                  {country === address.country && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCountryModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Currency Selection Modal */}
      <Modal
        visible={showCurrencyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={true}>
              {currencies.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.modalItem,
                    curr.code === currency && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setCurrency(curr.code);
                    setShowCurrencyModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    curr.code === currency && styles.modalItemTextSelected
                  ]}>
                    {curr.code} - {curr.name} {curr.symbol}
                  </Text>
                  {curr.code === currency && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCurrencyModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  countryText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
  },
  countryNote: {
    fontSize: 12,
    color: '#b0b0b0',
    marginTop: 4,
    fontStyle: 'italic',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffd700',
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
  selectableField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedField: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  selectedFieldText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchButton: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  searchButtonText: {
    color: '#1a1a2e',
    fontSize: 14,
    fontWeight: 'bold',
  },
  manualLink: {
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'flex-end',
  },
  manualLinkText: {
    color: '#4A90E2',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalList: {
    maxHeight: 300,
    flexGrow: 0,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 2,
    minHeight: 50,
  },
  modalItemSelected: {
    backgroundColor: '#ffd700',
  },
  modalItemText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  modalItemTextSelected: {
    color: '#1a1a2e',
    fontWeight: '700',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
