import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, SplashScreen, Slot } from 'expo-router';
import { View } from 'react-native';
import { AuthProvider } from '../lib/auth';
import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import '../global.css';

// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [loaded] = useFonts({
  //   Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
  //   InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  // });

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) return null;

  return (
    <GestureHandlerRootView className="flex-1">
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
