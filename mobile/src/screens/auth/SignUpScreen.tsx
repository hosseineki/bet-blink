import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import { SignUpData, SignUpStage } from '../../types/auth';
import PersonalInfoStep from './signup/PersonalInfoStep';
import ProfileStep from './signup/ProfileStep';
import AddressStep from './signup/AddressStep';
// import PaymentStep from './signup/PaymentStep';
// import VerificationStep from './signup/VerificationStep';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

const STAGES: SignUpStage[] = [
  'credentials',
  'profile',
  'address',
];

export default function SignUpScreen({ navigation }: SignUpScreenProps): React.JSX.Element {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [signUpData, setSignUpData] = useState<Partial<SignUpData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNext = (stageData: Partial<SignUpData>): void => {
    setSignUpData(prev => ({ ...prev, ...stageData }));
    console.log('going to the next stage', stageData);
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = (): void => {
    if (currentStage > 0) {
      setCurrentStage(prev => prev - 1);
    }
  };

  const handleComplete = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Here you would call your sign-up API
      // await signUp(completeSignUpData);
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = (): React.JSX.Element => {
    const stage = STAGES[currentStage];

    switch (stage) {
      case 'credentials':
        return (
          <PersonalInfoStep
            data={signUpData}
            onNext={handleNext}
            onPrevious={currentStage > 0 ? handlePrevious : undefined}
          />
        );
      case 'profile':
        return (
          <ProfileStep
            data={signUpData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 'address':
        return (
          <AddressStep
            data={signUpData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      // case 'payment':
      //   return (
      //     <PaymentStep
      //       data={signUpData}
      //       onNext={handleNext}
      //       onPrevious={handlePrevious}
      //     />
      //   );
      // case 'verification':
      //   return (
      //     <VerificationStep
      //       data={signUpData}
      //       onNext={handleNext}
      //       onPrevious={handlePrevious}
      //       isLoading={isLoading}
      //     />
      //   );
      default:
        return <PersonalInfoStep data={signUpData} onNext={handleNext} />;
    }
  };

  const getStageTitle = (stage: SignUpStage): string => {
    switch (stage) {
      case 'personal-info':
        return 'Personal Information';
      case 'date-of-birth':
        return 'Date of Birth';
      case 'address':
        return 'Address Details';
      case 'payment':
        return 'Payment Method';
      case 'verification':
        return 'Account Verification';
      default:
        return 'Sign Up';
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {STAGES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentStage && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>
          Step {currentStage + 1} of {STAGES.length}
        </Text>
      </View>

      {/* Stage Title */}
      <View style={styles.stageTitleContainer}>
        <Text style={styles.stageTitle}>
          {getStageTitle(STAGES[currentStage])}
        </Text>
      </View>

      {/* Current Step */}
      <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 44, // Same width as back button for centering
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#ffd700',
  },
  progressText: {
    color: '#b0b0b0',
    fontSize: 14,
  },
  stageTitleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  stageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
