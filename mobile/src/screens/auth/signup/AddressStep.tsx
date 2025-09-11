import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SignUpData, Address, AddressSearchResult } from '../../../types/auth';
import axios from 'axios';
import APIs from './../../../config/apis';
import { useNavigation } from '@react-navigation/native';

interface AddressStepProps {
  data: Partial<SignUpData>;
  onNext: (data: Partial<SignUpData>) => void;
  onPrevious: () => void;
}

const MOCK_ADDRESSES: AddressSearchResult[] = [
  {
    id: '1',
    address: '184 Whitacres Road',
    city: 'Glasgow',
    postCode: 'G53 7ZP',
    country: 'United Kingdom',
    formattedAddress: '184 Whitacres Road, Glasgow, G53 7ZP, United Kingdom',
  },
  {
    id: '2',
    address: '184 High Street',
    city: 'Edinburgh',
    postCode: 'EH1 1QS',
    country: 'United Kingdom',
    formattedAddress: '184 High Street, Edinburgh, EH1 1QS, United Kingdom',
  },
  {
    id: '3',
    address: '184 Oxford Street',
    city: 'London',
    postCode: 'W1C 1JN',
    country: 'United Kingdom',
    formattedAddress: '184 Oxford Street, London, W1C 1JN, United Kingdom',
  },
  {
    id: '4',
    address: '184 George Street',
    city: 'Manchester',
    postCode: 'M1 4HE',
    country: 'United Kingdom',
    formattedAddress: '184 George Street, Manchester, M1 4HE, United Kingdom',
  },
  {
    id: '5',
    address: '184 Queen Street',
    city: 'Birmingham',
    postCode: 'B1 1AA',
    country: 'United Kingdom',
    formattedAddress: '184 Queen Street, Birmingham, B1 1AA, United Kingdom',
  },
];

export default function AddressStep({
  data,
  onNext,
  onPrevious
}: AddressStepProps): React.JSX.Element {
  const navigation = useNavigation();
  const [address, setAddress] = useState<Address>({
    address: data.address?.address || '',
    city: data.address?.city || '',
    postCode: data.address?.postCode || '',
    country: data.address?.country || 'United Kingdom',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isManualEntry, setIsManualEntry] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCountryModal, setShowCountryModal] = useState<boolean>(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('GBP');
  const [promotionCode, setPromotionCode] = useState<string>('');

  // Address search states
  const [addressSearchResults, setAddressSearchResults] = useState<AddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressSearchResult | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setAddress(prev => ({
      address: '184 St John Street',
      city: 'London',
      postCode: 'EC1M 4BS',
      country: 'United Kingdom',
    }));
  }, []);

  // Address search function
  const searchAddresses = async (query: string) => {
    if (query.length < 2) {
      setAddressSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      // const response = await axios.get(APIs.ADDRESS_SEARCH, {
      //   params: {
      //     query,
      //     country: address.country,
      //   },
      // });
      const response = {
        data: {
          success: true,
          data: {
            addresses: MOCK_ADDRESSES,
          },
        },
      };

      if (response.data.success) {
        setAddressSearchResults(response.data.data.addresses);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Address search error:', error);
      setAddressSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      searchAddresses(query);
    }, 300);

    setSearchTimeout(timeout);
  }, [searchTimeout, address.country]);

  // Handle search query change
  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle address selection
  const handleAddressSelect = (selectedAddr: AddressSearchResult) => {
    setSelectedAddress(selectedAddr);
    setSearchQuery(selectedAddr.address);
    setShowSearchResults(false);

    // Update the address state with selected address
    setAddress(prev => ({
      ...prev,
      address: selectedAddr.address,
      city: selectedAddr.city,
      postCode: selectedAddr.postCode,
      country: selectedAddr.country,
    }));
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!address.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!address.postCode.trim()) {
      newErrors.postCode = 'Postal code is required';
    } else if (!/^[A-Z0-9\s-]{3,10}$/i.test(address.postCode)) {
      newErrors.postCode = 'Please enter a valid postal code';
    }

    if (!address.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerStep2 = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Combine profile data from previous step with current address data
      const registrationData = {
        ...data, // Profile data from ProfileStep
        address,
        currency,
        promotionCode: promotionCode || undefined,
      };
      console.log('response', 'before', registrationData);
      const response = await axios.post(APIs.REGISTER_STEP_2, registrationData);
      console.log('response', 'after');

      if (response.status === 200) {
        return true;
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
        return false;
      }
    } catch (error: any) {
      console.error('RegisterStep2 error:', error);

      if (error.response?.data?.message) {
        Alert.alert('Registration Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (): Promise<void> => {
    if (validateForm()) {
      const success = await registerStep2();
      if (success) {
        // onNext({
        //   address,
        //   currency,
        //   promotionCode: promotionCode || undefined,
        // });
        Alert.alert('Success', 'Account created successfully!');
        //navigation.navigate('SignIn');
      }
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
                <View style={styles.searchInputContainer}>
                  <TextInput
                    id="address-search"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearchQueryChange}
                    placeholder="184"
                    placeholderTextColor="#666"
                    onFocus={() => {
                      if (addressSearchResults.length > 0) {
                        setShowSearchResults(true);
                      }
                    }}
                  />
                  {isSearching && (
                    <View style={styles.searchLoadingContainer}>
                      <Ionicons name="search" size={16} color="#666" />
                    </View>
                  )}
                </View>
                <TouchableOpacity style={styles.searchButton}>
                  <Text style={styles.searchButtonText}>Search address</Text>
                </TouchableOpacity>
              </View>

              {/* Search Results Dropdown */}
              {showSearchResults && addressSearchResults.length > 0 && (
                <View style={styles.searchResultsContainer}>
                  <ScrollView
                    style={styles.searchResultsList}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {addressSearchResults.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.searchResultItem}
                        onPress={() => handleAddressSelect(item)}
                      >
                        <Text style={styles.searchResultText}>{item.formattedAddress}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <TouchableOpacity
                style={styles.manualLink}
                onPress={() => setIsManualEntry(true)}
              >
                <Text style={styles.manualLinkText}>Or, enter manually</Text>
              </TouchableOpacity>
            </View>

            {/* Selected Address Display */}
            {selectedAddress && (
              <View style={styles.selectedAddressContainer}>
                <Text style={styles.label}>Address</Text>
                <View style={styles.selectedAddressBox}>
                  <Text style={styles.selectedAddressText}>{selectedAddress.address}</Text>
                  <Text style={styles.selectedAddressText}>{selectedAddress.city}</Text>
                  <Text style={styles.selectedAddressText}>{selectedAddress.postCode}</Text>
                </View>
              </View>
            )}

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

            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter address *</Text>
              <TextInput
                style={[styles.input, errors.address && styles.inputError]}
                value={address.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="184 St John Street"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
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
      <TouchableOpacity
        style={[styles.nextButton, isLoading && styles.nextButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <LinearGradient
          colors={isLoading ? ['#666', '#555'] : ['#ffd700', '#ffed4e']}
          style={styles.nextButtonGradient}
        >
          <Text style={[styles.nextButtonText, isLoading && styles.nextButtonTextDisabled]}>
            {isLoading ? 'Processing...' : 'Submit'}
          </Text>
          {!isLoading && <Ionicons name="arrow-forward" size={20} color="#1a1a2e" />}
        </LinearGradient>
      </TouchableOpacity>
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
    width: '100%',
    marginTop: 20
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
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonTextDisabled: {
    color: '#999',
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
  searchInputContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 40,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchLoadingContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  searchResultsContainer: {
    position: 'absolute',
    top: '65%',
    left: 0,
    right: 0,
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchResultsList: {
    maxHeight: 200,
  },
  searchResultItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchResultText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
  selectedAddressContainer: {
    marginTop: -30,
    marginBottom: 20,
  },
  selectedAddressBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  selectedAddressText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 2,
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
