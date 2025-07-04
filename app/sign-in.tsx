import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, Image, ScrollView, Pressable } from 'react-native';
import { AppButton } from '../components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../lib/auth';
import { PhoneInput, isValidNumber } from 'react-native-phone-entry';
import { OtpInput } from 'react-native-otp-entry';
import { cn } from '~/lib/utils';

export default function SignInScreen() {
  const { user, signIn, getStoredPhoneNumber, isLoading: authLoading } = useAuth();
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'phone' | 'pin'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStoredPhoneNumber();
  }, []);

  const loadStoredPhoneNumber = async () => {
    try {
      const storedPhone = await getStoredPhoneNumber();
      if (storedPhone) {
        setPhone(storedPhone);
        setStep('pin');
      }
    } catch (error) {
      console.error('Failed to load stored phone number:', error);
    }
  };

  const handlePhoneSubmit = async () => {
    setError('');

    console.log('Phone: ', phone, 'Validity: ', isValidNumber(phone, countryCode));

    const validation = isValidNumber(phone, countryCode);
    if (!validation) {
      setError('Invalid phone number');
      return;
    }
    setStep('pin');
  };

  const handlePinSubmit = async () => {
    setError('');
    console.log('PIN: ', pin);
    const result = await signIn(phone, pin);

    if (result.success) {
      router.replace('/(app)');
    } else {
      setError(result.error || 'Authentication failed');
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setPin('');
    setError('');
  };

  const handleGoToSignUp = () => {
    router.push('/sign-up');
  };

  if (authLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-lightGreen">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-between px-6 pt-20">
          <View className="w-full flex-1 items-center justify-center">
            <View className="mb-8">
              <View className="mb-6 items-center justify-center rounded-full bg-darkGreen p-6 shadow-lg">
                <Image
                  source={require('../assets/logo_base.png')}
                  className="h-16 w-16"
                  resizeMode="contain"
                />
              </View>

              <Text className="mb-10 text-4xl font-semibold text-darkGreen">Log In</Text>
            </View>

            {step === 'phone' ? (
              <View className="w-full">
                <PhoneInput
                  defaultValues={{
                    countryCode: 'IN',
                    callingCode: '+91',
                    phoneNumber: '+91',
                  }}
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                  onChangeCountry={(country) => setCountryCode(country.cca2)}
                  autoFocus
                  disabled={false}
                />
                <View className="mt-4">
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <AppButton
                      onPress={handlePhoneSubmit}
                      disabled={loading || !phone}
                      title="Continue"
                      variant="primary"
                    />
                  )}
                </View>
              </View>
            ) : (
              <View className="w-full flex-1 items-center justify-center gap-16 px-6">
                <Text className="text-3xl font-semibold text-darkGreen">
                  Welcome Back, {user?.name}!
                </Text>
                <OtpInput
                  numberOfDigits={5}
                  focusColor="green"
                  autoFocus={false}
                  hideStick={true}
                  placeholder="******"
                  blurOnFilled={true}
                  disabled={loading}
                  type="numeric"
                  secureTextEntry={false}
                  focusStickBlinkingDuration={500}
                  onTextChange={(text) => setPin(text)}
                />

                <View className="gap-6">
                  <AppButton
                    onPress={handlePinSubmit}
                    disabled={loading || pin.length !== 5}
                    title="Sign In"
                    cls="px-20"
                  />
                  <AppButton
                    onPress={handleBackToPhone}
                    title="Change Phone Number"
                    cls="px-20"
                    variant="secondary"
                  />
                </View>
              </View>
            )}
          </View>

          <View className="items-center justify-center border-t border-darkGreen py-10">
            <Text className="pb-2 text-base text-gray-500">Don't have an account?</Text>
            <Pressable
              onPress={handleGoToSignUp}
              className="h-12 items-center justify-center rounded-lg bg-darkGreen px-6 shadow-2xl">
              <Text className="text-base font-semibold text-white">Create New Account</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
