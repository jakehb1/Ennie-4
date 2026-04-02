import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import AuthStack from './AuthStack';
import PatientTabs from './PatientTabs';
import HealerTabs from './HealerTabs';
import AdminTabs from './AdminTabs';

// Patient flow screens
import IntakeScreen from '../screens/patient/IntakeScreen';
import ConsentScreen from '../screens/patient/ConsentScreen';
import AgeGateScreen from '../screens/patient/AgeGateScreen';
import RoutingScreen from '../screens/patient/RoutingScreen';
import QueueScreen from '../screens/patient/QueueScreen';
import SymptomConfirmScreen from '../screens/patient/SymptomConfirmScreen';
import ConnectingScreen from '../screens/patient/ConnectingScreen';
import LiveSessionScreen from '../screens/patient/LiveSessionScreen';
import SessionEndScreen from '../screens/patient/SessionEndScreen';
import ShareScreen from '../screens/patient/ShareScreen';
import FollowUpScreen from '../screens/patient/FollowUpScreen';
import NoResultScreen from '../screens/patient/NoResultScreen';

// Group screens
import GroupScheduleScreen from '../screens/shared/GroupScheduleScreen';
import GroupConfirmScreen from '../screens/shared/GroupConfirmScreen';
import GroupIntakeScreen from '../screens/shared/GroupIntakeScreen';
import GroupSessionScreen from '../screens/shared/GroupSessionScreen';

// Payment screens
import TierSelectScreen from '../screens/shared/TierSelectScreen';
import PaymentScreen from '../screens/shared/PaymentScreen';
import PaymentConfirmScreen from '../screens/shared/PaymentConfirmScreen';

// Healer flow screens
import HealerOnboardScreen from '../screens/healer/HealerOnboardScreen';
import SpecializationsScreen from '../screens/healer/SpecializationsScreen';
import SkillBuildScreen from '../screens/healer/SkillBuildScreen';
import HealerPingScreen from '../screens/healer/HealerPingScreen';
import HealerCommittedScreen from '../screens/healer/HealerCommittedScreen';
import SmartMatchScreen from '../screens/healer/SmartMatchScreen';
import HealerSessionScreen from '../screens/healer/HealerSessionScreen';
import HealerPostScreen from '../screens/healer/HealerPostScreen';
import HealerEarningsScreen from '../screens/healer/HealerEarningsScreen';
import GroupInviteScreen from '../screens/healer/GroupInviteScreen';

// Shared screens
import ProfileScreen from '../screens/shared/ProfileScreen';
import SessionHistoryScreen from '../screens/shared/SessionHistoryScreen';
import SupportScreen from '../screens/shared/SupportScreen';
import ReferralScreen from '../screens/shared/ReferralScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  gestureEnabled: true,
};

export default function RootNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            {/* Main tab navigators by role */}
            <Stack.Screen name="PatientTabs" component={PatientTabs} />
            <Stack.Screen name="HealerTabs" component={HealerTabs} />
            <Stack.Screen name="AdminTabs" component={AdminTabs} />

            {/* Patient flow */}
            <Stack.Screen name="Consent" component={ConsentScreen} />
            <Stack.Screen name="AgeGate" component={AgeGateScreen} />
            <Stack.Screen name="Intake" component={IntakeScreen} />
            <Stack.Screen name="Routing" component={RoutingScreen} />
            <Stack.Screen name="TierSelect" component={TierSelectScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="PaymentConfirm" component={PaymentConfirmScreen} />
            <Stack.Screen name="Queue" component={QueueScreen} />
            <Stack.Screen name="SymptomConfirm" component={SymptomConfirmScreen} />
            <Stack.Screen name="Connecting" component={ConnectingScreen} />
            <Stack.Screen name="LiveSession" component={LiveSessionScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="SessionEnd" component={SessionEndScreen} />
            <Stack.Screen name="Share" component={ShareScreen} />
            <Stack.Screen name="FollowUp" component={FollowUpScreen} />
            <Stack.Screen name="NoResult" component={NoResultScreen} />

            {/* Group flow */}
            <Stack.Screen name="GroupSchedule" component={GroupScheduleScreen} />
            <Stack.Screen name="GroupConfirm" component={GroupConfirmScreen} />
            <Stack.Screen name="GroupIntake" component={GroupIntakeScreen} />
            <Stack.Screen name="GroupSession" component={GroupSessionScreen} options={{ gestureEnabled: false }} />

            {/* Healer flow */}
            <Stack.Screen name="HealerOnboard" component={HealerOnboardScreen} />
            <Stack.Screen name="Specializations" component={SpecializationsScreen} />
            <Stack.Screen name="SkillBuild" component={SkillBuildScreen} />
            <Stack.Screen name="HealerPing" component={HealerPingScreen} />
            <Stack.Screen name="HealerCommitted" component={HealerCommittedScreen} />
            <Stack.Screen name="SmartMatch" component={SmartMatchScreen} />
            <Stack.Screen name="HealerSession" component={HealerSessionScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="HealerPost" component={HealerPostScreen} />
            <Stack.Screen name="HealerEarnings" component={HealerEarningsScreen} />
            <Stack.Screen name="GroupInvite" component={GroupInviteScreen} />

            {/* Shared screens */}
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="SessionHistory" component={SessionHistoryScreen} />
            <Stack.Screen name="Support" component={SupportScreen} />
            <Stack.Screen name="Referral" component={ReferralScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
