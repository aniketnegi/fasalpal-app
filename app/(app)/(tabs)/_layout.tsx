import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, ArrowBigUp, ShoppingBag } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'green' }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="selector"
        options={{
          title: 'Selector',
          headerShown: false,
          tabBarIcon: ({ color }) => <ArrowBigUp color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          headerShown: false,
          tabBarIcon: ({ color }) => <ShoppingBag color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
