import React, { useEffect } from 'react';
import { Stack, router, SplashScreen } from 'expo-router';
import { useAuth } from '../../lib/auth';
import { Drawer } from 'expo-router/drawer';
import { Target, NotebookPen, Info, Phone, Mail, Map } from 'lucide-react-native';
// import CustomDrawer from '~/components/CustomDrawer';
import { Image, Text, View } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();

      if (!isAuthenticated) {
        router.replace('/sign-in');
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return null; // Keep splash screen visible
  }

  if (!isAuthenticated) {
    return null; // Will redirect to sign-in
  }

  return (
    // <Stack screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="dashboard" />
    // </Stack>
    <Drawer
      drawerContent={CustomDrawer}
      screenOptions={{
        drawerActiveBackgroundColor: '#346157',
        drawerActiveTintColor: '#fff',
        drawerStatusBarAnimation: 'fade',
        drawerInactiveBackgroundColor: '#2B564D',
        drawerInactiveTintColor: '#fff',
      }}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
          drawerIcon: ({ color }) => <Target color={color} size={24} />,
          drawerLabelStyle: { fontSize: 20, fontWeight: '600' },
        }}
      />
      <Drawer.Screen
        name="blog"
        options={{
          drawerLabel: 'Blog',
          title: 'blog',
          drawerIcon: ({ color }) => <NotebookPen color={color} size={24} />,
          drawerLabelStyle: { fontSize: 20, fontWeight: '600' },
        }}
      />
      <Drawer.Screen
        name="about-us"
        options={{
          drawerLabel: 'About Us',
          title: 'About Us',
          drawerIcon: ({ color }) => <Info color={color} size={24} />,
          drawerLabelStyle: { fontSize: 20, fontWeight: '600' },
        }}
      />
    </Drawer>
  );
}

function CustomDrawer(props: any) {
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
        <View>
          <View
            className="flex w-max items-center justify-center gap-4 p-4"
            style={{ paddingTop: top, paddingBottom: bottom }}>
            <Image
              source={require('../../assets/logo_base.png')}
              className="h-28 w-28"
              resizeMode="contain"
            />
            <Text className="text-4xl font-medium text-white">ANNOTSAV</Text>
          </View>

          <View>
            <DrawerItemList {...props} />
          </View>
        </View>

        {/* Contact */}
        <View className="flex items-center justify-center gap-4 p-4 text-white">
          <Text className="text-2xl font-semibold leading-relaxed text-white">CONTACT US</Text>
          <View className="flex w-full items-start justify-center gap-6 p-4">
            <View className="flex-row items-center gap-4">
              <Phone color={'#fff'} size={32} />
              <Text className="text-lg text-white">7011270902 | 7011644516</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <Mail color={'#fff'} size={32} />
              <Text className="text-lg text-white">projectannotsav@gmail.com</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <Map color={'#fff'} size={32} />
              <View>
                <Text className="text-lg text-white">Netaji Subhas University of Technology,</Text>
                <Text className="text-lg text-white">Dwarka Sector-3,</Text>
                <Text className="text-lg text-white">New Delhi-110078</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="border-t border-gray-800">
          <DrawerItem
            label="SIGN OUT"
            onPress={() => handleSignOut()}
            style={{
              backgroundColor: '#F0EBE4',
              borderRadius: 9999,
              margin: 8,
              paddingRight: 8,
              paddingLeft: 8,
            }}
            labelStyle={{
              color: '#2B564D',
              fontWeight: '600',
              fontSize: 20,
              width: '100%',
              textAlign: 'center',
            }}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}
