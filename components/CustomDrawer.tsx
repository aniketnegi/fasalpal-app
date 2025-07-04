import React from 'react';
import { Image, Text, View } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../lib/auth';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';

export default function CustomDrawer(props: any) {
  const { top, bottom } = useSafeAreaInsets();

  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/sign-in');
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: '#2B564D' }}>
      <View className="flex-1 justify-between">
        {/* Header */}
        <View
          className="flex items-center justify-center p-4"
          style={{ paddingTop: top, paddingBottom: bottom }}>
          <Image
            source={require('../assets/logo_base.png')}
            className="h-24 w-24"
            resizeMode="contain"
          />
        </View>

        <View>
          <DrawerItemList {...props} />
        </View>

        {/* Footer */}
        <View className="border-t border-black">
          <DrawerItem
            label="Sign Out"
            onPress={() => handleSignOut()}
            icon={() => <LogOut color="#fff" size={24} />}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}
