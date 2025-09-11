import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SignUpData } from '../../../types/auth';

interface ProfileStepProps {
  data: Partial<SignUpData>;
  onNext: (data: Partial<SignUpData>) => void;
  onPrevious: () => void;
}

export default function ProfileStep({
  data,
  onNext,
  onPrevious
}: ProfileStepProps): React.JSX.Element {
  const [fullName, setFullName] = useState({ firstName: '', lastName: '' });
  const [dateOfBirth, setDateOfBirth] = useState<Date>(
    data.dateOfBirth ? new Date(data.dateOfBirth) : new Date(2000, 0, 1)
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
  const [showDayPicker, setShowDayPicker] = useState<boolean>(false);
  const [gender, setGender] = useState<string>(data.gender || '');
  const [promotionalOffers, setPromotionalOffers] = useState<boolean>(data.marketingConsent || false);
  const [showPromoModal, setShowPromoModal] = useState<boolean>(false);
  const [promoPreferences, setPromoPreferences] = useState({
    sms: {
      casino: false,
      sport: false,
      bingo: false,
    },
    email: {
      casino: false,
      sport: false,
      bingo: false,
    },
  });

  useEffect(() => {
    const tempData = {
      dateOfBirth: new Date(1991, 1, 1),
      gender: 'male',
      fullName: { firstName: 'John', lastName: 'Doe' },
    };
    setDateOfBirth(tempData.dateOfBirth);
    setGender(tempData.gender);
    setFullName(tempData.fullName);
  }, []);

  const validateAge = (birthDate: Date): boolean => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }

    return age >= 18;
  };


  // ---------------------------------- DoB validation
  const handleYearChange = (year: number): void => {
    // Ensure the day is valid for the selected month/year
    const daysInMonth = new Date(year, dateOfBirth.getMonth() + 1, 0).getDate();
    const validDay = Math.min(dateOfBirth.getDate(), daysInMonth);
    const newDate = new Date(year, dateOfBirth.getMonth(), validDay);

    if (validateAge(newDate)) {
      setDateOfBirth(newDate);
      setErrors(prev => ({ ...prev, dateOfBirth: '' }));
    } else {
      setErrors(prev => ({ ...prev, dateOfBirth: 'You must be at least 18 years old to register' }));
    }
    setShowYearPicker(false);
  };

  const handleMonthChange = (month: number): void => {
    // Ensure the day is valid for the selected month/year
    const daysInMonth = new Date(dateOfBirth.getFullYear(), month + 1, 0).getDate();
    const validDay = Math.min(dateOfBirth.getDate(), daysInMonth);
    const newDate = new Date(dateOfBirth.getFullYear(), month, validDay);

    if (validateAge(newDate)) {
      setDateOfBirth(newDate);
      setErrors(prev => ({ ...prev, dateOfBirth: '' }));
    } else {
      setErrors(prev => ({ ...prev, dateOfBirth: 'You must be at least 18 years old to register' }));
    }
    setShowMonthPicker(false);
  };

  const handleDayChange = (day: number): void => {
    // Ensure the day is valid for the selected month/year
    const daysInMonth = new Date(dateOfBirth.getFullYear(), dateOfBirth.getMonth() + 1, 0).getDate();
    const validDay = Math.min(day, daysInMonth);
    const newDate = new Date(dateOfBirth.getFullYear(), dateOfBirth.getMonth(), validDay);

    if (validateAge(newDate)) {
      setDateOfBirth(newDate);
      setErrors(prev => ({ ...prev, dateOfBirth: '' }));
    } else {
      setErrors(prev => ({ ...prev, dateOfBirth: 'You must be at least 18 years old to register' }));
    }
    setShowDayPicker(false);
  };
  //-----------------------------------------------------

  const isFormValid = (): boolean => {
    return (
      fullName.firstName.length >= 2 &&
      fullName.lastName.length >= 2 &&
      validateAge(dateOfBirth) &&
      gender !== ''
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.firstName) {
      newErrors.firstName = 'Please enter your First name';
    } else if (fullName.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!fullName.lastName) {
      newErrors.lastName = 'Please enter your Last name';
    } else if (fullName.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    if (!validateAge(dateOfBirth)) {
      newErrors.dateOfBirth = 'You must be at least 18 years old to register';
    }

    if (!gender) {
      newErrors.gender = 'Please select your gender';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (): void => {
    if (validateForm()) {
      onNext({
        dateOfBirth: dateOfBirth.toISOString().split('T')[0],
        gender,
        marketingConsent: promotionalOffers,
        promoPreferences: promotionalOffers ? promoPreferences : undefined
      });
    }
  };

  const handlePromoCheckboxChange = (): void => {
    if (!promotionalOffers) {
      setShowPromoModal(true);
    } else {
      setPromotionalOffers(false);
      setPromoPreferences({
        sms: { casino: false, sport: false, bingo: false },
        email: { casino: false, sport: false, bingo: false },
      });
    }
  };

  const handlePromoModalConfirm = (): void => {
    setPromotionalOffers(true);
    setShowPromoModal(false);
  };

  const handlePromoModalCancel = (): void => {
    setShowPromoModal(false);
  };

  const togglePromoPreference = (method: 'sms' | 'email', category: 'casino' | 'sport' | 'bingo'): void => {
    setPromoPreferences(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [category]: !prev[method][category]
      }
    }));
  };

  const handleCheckAll = (): void => {
    const allChecked = Object.values(promoPreferences).every(method =>
      Object.values(method).every(checked => checked)
    );

    setPromoPreferences({
      sms: { casino: !allChecked, sport: !allChecked, bingo: !allChecked },
      email: { casino: !allChecked, sport: !allChecked, bingo: !allChecked },
    });
  };

  const isAllChecked = (): boolean => {
    return Object.values(promoPreferences).every(method =>
      Object.values(method).every(checked => checked)
    );
  };

  const generateYears = (): number[] => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 1; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  const generateMonths = (): { value: number; label: string }[] => {
    return [
      { value: 0, label: '01' },
      { value: 1, label: '02' },
      { value: 2, label: '03' },
      { value: 3, label: '04' },
      { value: 4, label: '05' },
      { value: 5, label: '06' },
      { value: 6, label: '07' },
      { value: 7, label: '08' },
      { value: 8, label: '09' },
      { value: 9, label: '10' },
      { value: 10, label: '11' },
      { value: 11, label: '12' },
    ];
  };

  const generateDays = (): number[] => {
    const daysInMonth = new Date(dateOfBirth.getFullYear(), dateOfBirth.getMonth() + 1, 0).getDate();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const handleInputChange = (field: string, value: string | boolean): void => {
    setFullName(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Please provide your date of birth for age verification
      </Text>

      <View style={styles.form}>

        {/* First Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            value={fullName.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
            placeholder="Enter your first name"
            placeholderTextColor="#666"
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName as string}</Text>}
        </View>

        {/* Last Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            value={fullName.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
            placeholder="Enter your last name"
            placeholderTextColor="#666"
            autoCapitalize="none"
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName as string}</Text>}
        </View>


        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth *</Text>
          <View style={styles.dateContainer}>
            {/* Year Dropdown */}
            <TouchableOpacity
              style={[styles.dateDropdown, (errors.dateOfBirth as DatePart)?.year && styles.dateDropdownError]}
              onPress={() => setShowYearPicker(true)}
            >
              <Text style={styles.dateDropdownText}>
                {dateOfBirth.getFullYear()}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#b0b0b0" />
            </TouchableOpacity>

            {/* Month Dropdown */}
            <TouchableOpacity
              style={[styles.dateDropdown, (errors.dateOfBirth as DatePart)?.month && styles.dateDropdownError]}
              onPress={() => setShowMonthPicker(true)}
            >
              <Text style={styles.dateDropdownText}>
                {String(dateOfBirth.getMonth() + 1).padStart(2, '0')}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#b0b0b0" />
            </TouchableOpacity>

            {/* Day Dropdown */}
            <TouchableOpacity
              style={[styles.dateDropdown, (errors.dateOfBirth as DatePart)?.day && styles.dateDropdownError]}
              onPress={() => setShowDayPicker(true)}
            >
              <Text style={styles.dateDropdownText}>
                {String(dateOfBirth.getDate()).padStart(2, '0')}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#b0b0b0" />
            </TouchableOpacity>
          </View>
          {errors && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Gender *</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'male' && styles.genderButtonSelected]}
              onPress={() => setGender('male')}
            >
              <Ionicons
                name="male"
                size={20}
                color={gender === 'male' ? '#1a1a2e' : '#b0b0b0'}
              />
              <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'female' && styles.genderButtonSelected]}
              onPress={() => setGender('female')}
            >
              <Ionicons
                name="female"
                size={20}
                color={gender === 'female' ? '#1a1a2e' : '#b0b0b0'}
              />
              <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={styles.promoCheckbox}
            onPress={handlePromoCheckboxChange}
          >
            <Ionicons
              name={promotionalOffers ? 'checkbox' : 'square-outline'}
              size={24}
              color={promotionalOffers ? '#ffd700' : '#b0b0b0'}
            />
            <Text style={styles.promoText}>
              I agree to get unique promotional offers
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#ffd700" />
          <Text style={styles.infoText}>
            You must be at least 18 years old to create an account.
            This information is required for age verification and compliance.
          </Text>
        </View>
      </View>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContent}>
            <Text style={styles.pickerModalTitle}>Select Year</Text>
            <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={true}>
              {generateYears().map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.pickerItem,
                    year === dateOfBirth.getFullYear() && styles.pickerItemSelected
                  ]}
                  onPress={() => handleYearChange(year)}
                >
                  <Text style={[
                    styles.pickerItemText,
                    year === dateOfBirth.getFullYear() && styles.pickerItemTextSelected
                  ]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={() => setShowYearPicker(false)}
            >
              <Text style={styles.pickerCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContent}>
            <Text style={styles.pickerModalTitle}>Select Month</Text>
            <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={true}>
              {generateMonths().map((month) => (
                <TouchableOpacity
                  key={month.value}
                  style={[
                    styles.pickerItem,
                    month.value === dateOfBirth.getMonth() && styles.pickerItemSelected
                  ]}
                  onPress={() => handleMonthChange(month.value)}
                >
                  <Text style={[
                    styles.pickerItemText,
                    month.value === dateOfBirth.getMonth() && styles.pickerItemTextSelected
                  ]}>
                    {month.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={() => setShowMonthPicker(false)}
            >
              <Text style={styles.pickerCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Day Picker Modal */}
      <Modal
        visible={showDayPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDayPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContent}>
            <Text style={styles.pickerModalTitle}>Select Day</Text>
            <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={true}>
              {generateDays().map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.pickerItem,
                    day === dateOfBirth.getDate() && styles.pickerItemSelected
                  ]}
                  onPress={() => handleDayChange(day)}
                >
                  <Text style={[
                    styles.pickerItemText,
                    day === dateOfBirth.getDate() && styles.pickerItemTextSelected
                  ]}>
                    {String(day).padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={() => setShowDayPicker(false)}
            >
              <Text style={styles.pickerCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Promotional Offers Modal */}
      <Modal
        visible={showPromoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handlePromoModalCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Promotional Offer Preferences</Text>

            <View style={styles.preferencesContainer}>
              <View style={styles.preferencesHeader}>
                <View style={styles.headerSpacer} />
                <Text style={styles.headerText}>Casino</Text>
                <Text style={styles.headerText}>Sport</Text>
                <Text style={styles.headerText}>Bingo</Text>
              </View>

              <View style={styles.preferencesRow}>
                <Text style={styles.rowLabel}>SMS</Text>
                <TouchableOpacity
                  style={styles.preferenceCheckbox}
                  onPress={() => togglePromoPreference('sms', 'casino')}
                >
                  <Ionicons
                    name={promoPreferences.sms.casino ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={promoPreferences.sms.casino ? '#ffd700' : '#b0b0b0'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.preferenceCheckbox}
                  onPress={() => togglePromoPreference('sms', 'sport')}
                >
                  <Ionicons
                    name={promoPreferences.sms.sport ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={promoPreferences.sms.sport ? '#ffd700' : '#b0b0b0'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.preferenceCheckbox}
                  onPress={() => togglePromoPreference('sms', 'bingo')}
                >
                  <Ionicons
                    name={promoPreferences.sms.bingo ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={promoPreferences.sms.bingo ? '#ffd700' : '#b0b0b0'}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.preferencesRow}>
                <Text style={styles.rowLabel}>Email</Text>
                <TouchableOpacity
                  style={styles.preferenceCheckbox}
                  onPress={() => togglePromoPreference('email', 'casino')}
                >
                  <Ionicons
                    name={promoPreferences.email.casino ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={promoPreferences.email.casino ? '#ffd700' : '#b0b0b0'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.preferenceCheckbox}
                  onPress={() => togglePromoPreference('email', 'sport')}
                >
                  <Ionicons
                    name={promoPreferences.email.sport ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={promoPreferences.email.sport ? '#ffd700' : '#b0b0b0'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.preferenceCheckbox}
                  onPress={() => togglePromoPreference('email', 'bingo')}
                >
                  <Ionicons
                    name={promoPreferences.email.bingo ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={promoPreferences.email.bingo ? '#ffd700' : '#b0b0b0'}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.separator} />

              <TouchableOpacity
                style={styles.checkAllContainer}
                onPress={handleCheckAll}
              >
                <Ionicons
                  name={isAllChecked() ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={isAllChecked() ? '#ffd700' : '#b0b0b0'}
                />
                <Text style={styles.checkAllText}>Check All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handlePromoModalCancel}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handlePromoModalConfirm}
              >
                <LinearGradient
                  colors={['#ffd700', '#ffed4e']}
                  style={styles.modalConfirmGradient}
                >
                  <Text style={styles.modalConfirmText}>Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.previousButton} onPress={onPrevious}>
          <Ionicons name="arrow-back" size={20} color="#ffffff" />
          <Text style={styles.previousButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, !isFormValid() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isFormValid()}
        >
          <LinearGradient
            colors={!isFormValid() ? ['#666', '#555'] : ['#ffd700', '#ffed4e']}
            style={styles.nextButtonGradient}
          >
            <Text style={[styles.nextButtonText, !isFormValid() && styles.nextButtonTextDisabled]}>
              Next
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={!isFormValid() ? '#999' : '#1a1a2e'}
            />
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
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dateDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dateDropdownError: {
    borderColor: '#ff6b6b',
  },
  dateDropdownText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dateButtonError: {
    borderColor: '#ff6b6b',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffd700',
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
  nextButtonTextDisabled: {
    color: '#999',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  genderButtonSelected: {
    backgroundColor: '#ffd700',
    borderColor: '#ffd700',
  },
  genderText: {
    fontSize: 16,
    color: '#b0b0b0',
    marginLeft: 8,
    fontWeight: '500',
  },
  genderTextSelected: {
    color: '#1a1a2e',
    fontWeight: '600',
  },
  promoCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
    fontWeight: '500',
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
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  preferencesContainer: {
    marginBottom: 24,
  },
  preferencesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerSpacer: {
    width: 60,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffd700',
    textAlign: 'center',
  },
  preferencesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowLabel: {
    width: 60,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  preferenceCheckbox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 16,
  },
  checkAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkAllText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalConfirmButton: {
    flex: 1,
  },
  modalConfirmGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerModalContent: {
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 300,
    maxHeight: '70%',
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  pickerList: {
    maxHeight: 250,
    flexGrow: 0,
  },
  pickerItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 2,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: '#ffd700',
  },
  pickerItemText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
  pickerItemTextSelected: {
    color: '#1a1a2e',
    fontWeight: '700',
  },
  pickerCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerCloseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
