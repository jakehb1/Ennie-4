import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { T } from '../theme/tokens';
import HealerHomeScreen from '../screens/healer/HealerHomeScreen';
import HealerEarningsScreen from '../screens/healer/HealerEarningsScreen';
import SpecializationsScreen from '../screens/healer/SpecializationsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function HealerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: T.border,
          borderTopWidth: 1,
          paddingBottom: 20,
          paddingTop: 8,
          height: 80,
        },
        tabBarActiveTintColor: T.text,
        tabBarInactiveTintColor: T.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'DMSans-SemiBold',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          const icons = { Dashboard: '🏠', Earnings: '💰', Skills: '⭐', Profile: '👤' };
          return <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={HealerHomeScreen} />
      <Tab.Screen name="Earnings" component={HealerEarningsScreen} />
      <Tab.Screen name="Skills" component={SpecializationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
