import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import { useAuth } from '../lib/auth';
import { PhoneInput, isValidNumber } from 'react-native-phone-entry';
import { OtpInput } from 'react-native-otp-entry';
import { validateEmail, validateName } from '../lib/validation';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [countryCode, setCountryCode] = useState('IN');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pin: '',
  });
  const [step, setStep] = useState<'details' | 'pin'>('details');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error || 'Invalid name';
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Invalid email';
    }

    const phoneValidation = isValidNumber(formData.phone, countryCode);
    if (!phoneValidation) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Simulate sending OTP
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    setStep('pin');
  };

  const handlePinSubmit = async () => {
    setLoading(true);
    const result = await signUp(formData);
    setLoading(false);

    if (result.success) {
      router.replace('/(app)/dashboard');
    } else {
      setErrors({ general: result.error || 'Registration failed' });
    }
  };

  const handleBackToDetails = () => {
    setStep('details');
    setFormData((prev) => ({ ...prev, pin: '' }));
    setErrors({});
  };

  const handleGoToSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <SafeAreaView className="flex-1 bg-lightGreen">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6">
          <View className="items-center py-10">
            <View className="mb-6 rounded-full bg-darkGreen p-6 shadow-lg">
              <Image
                source={require('../assets/logo_base.png')}
                className="h-16 w-16"
                resizeMode="contain"
              />
            </View>
            <Text className="mb-6 text-4xl font-semibold text-darkGreen">Sign Up</Text>
          </View>
          {step === 'details' ? (
            <View className="mb-8 flex w-full max-w-md items-center justify-center gap-6">
              <Text className="mb-2 text-base text-gray-600">
                Enter your details to create an account
              </Text>

              <View className="flex w-full gap-12">
                <View className="flex w-full gap-6">
                  <View className="flex flex-row justify-between">
                    <View className="flex w-1/2 justify-start pr-2">
                      <Text className="mb-2 text-sm font-semibold text-gray-700">Full Name</Text>
                      <TextInput
                        value={formData.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                        placeholder="John Doe"
                        autoCapitalize="words"
                        autoCorrect={false}
                        className={`rounded border p-3 ${errors.name ? 'border-red-500' : 'border-black focus:border-lightBrown'}`}
                      />
                      {errors.name && <Text className="text-sm text-red-500">{errors.name}</Text>}
                    </View>

                    <View className="flex w-1/2 justify-start pl-2">
                      <Text className="mb-2 text-sm font-semibold text-gray-700">Email</Text>
                      <TextInput
                        value={formData.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        placeholder="example@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        className={`rounded border p-3 ${errors.email ? 'border-red-500' : 'border-black focus:border-lightBrown'}`}
                      />
                      {errors.email && <Text className="text-sm text-red-500">{errors.email}</Text>}
                    </View>
                  </View>

                  <View className="flex justify-start">
                    <Text className="mb-2 text-sm font-semibold text-gray-700">Phone Number</Text>
                    <PhoneInput
                      defaultValues={{
                        countryCode: 'IN',
                        callingCode: '+91',
                        phoneNumber: '+91',
                      }}
                      value={formData.phone}
                      onChangeText={(text) => handleInputChange('phone', text)}
                      onChangeCountry={(country) => setCountryCode(country.cca2)}
                      disabled={loading}
                    />
                    {errors.phone && <Text className="text-sm text-red-500">{errors.phone}</Text>}
                  </View>
                </View>

                <AppButton onPress={handleDetailsSubmit} title="Continue" />
              </View>
            </View>
          ) : (
            <View className="mb-8 flex w-full max-w-md items-center justify-center gap-6">
              <Text className="mb-2 text-center text-base text-gray-600">
                Sent a PIN to {formData.phone}
              </Text>
              <OtpInput
                numberOfDigits={5}
                focusColor="black"
                autoFocus={false}
                hideStick={false}
                placeholder="*****"
                blurOnFilled={true}
                disabled={loading}
                type="numeric"
                secureTextEntry={false}
                focusStickBlinkingDuration={200}
                onTextChange={(text) => handleInputChange('pin', text)}
              />

              <AppButton
                onPress={handlePinSubmit}
                disabled={loading || formData.pin.length !== 5}
                title="Create Account"
                cls="px-10"
              />

              <AppButton
                onPress={handleBackToDetails}
                variant="secondary"
                title="Back to Details"
                cls="px-10"
              />
            </View>
          )}

          {errors.general && (
            <Text className="mt-4 text-center text-sm text-red-500">{errors.general}</Text>
          )}

          <View className="mt-auto items-center border-t border-darkGreen py-6">
            <Text className="pb-4 text-base text-gray-500">Already have an account?</Text>
            <Pressable
              onPress={handleGoToSignIn}
              className="h-12 items-center justify-center rounded-lg bg-darkGreen px-6 shadow-2xl">
              <Text className="text-base font-semibold text-white">Sign In</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
