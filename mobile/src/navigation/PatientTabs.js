import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { T } from '../theme/tokens';
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import SessionHistoryScreen from '../screens/shared/SessionHistoryScreen';
import SupportScreen from '../screens/shared/SupportScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator();

const tabIcon = (name, focused) => {
  const icons = { Home: focused ? '●' : '○', History: '◷', Support: '?', Profile: '◉' };
  return null; // Icons handled in tabBarLabel
};

export default function PatientTabs() {
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
          const icons = { Home: '🏠', History: '📋', Support: '💬', Profile: '👤' };
          const { Text } = require('react-native');
          return <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={PatientHomeScreen} />
      <Tab.Screen name="History" component={SessionHistoryScreen} />
      <Tab.Screen name="Support" component={SupportScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
