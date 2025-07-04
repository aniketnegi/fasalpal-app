import React from 'react';
import { View, Text } from 'react-native';
import { AppButton } from '../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Drawer } from 'expo-router/drawer';
import { router } from 'expo-router';
import { useAuth } from '../../lib/auth';

export default function AboutUs() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView className="h-full w-full flex-1 items-center justify-center gap-6 bg-lightGreen">
      <Text className="text-2xl font-semibold">Welcome to the About! {user?.name}</Text>
      <AppButton onPress={handleSignOut} title="Sign Out" cls="px-6" />
    </SafeAreaView>
  );
}
