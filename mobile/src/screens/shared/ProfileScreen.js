import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const ROLES = ['Patient', 'Healer', 'Admin'];

export default function ProfileScreen({ navigation }) {
  const [role, setRole] = useState('Patient');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  const cycleRole = () => {
    const idx = ROLES.indexOf(role);
    const next = ROLES[(idx + 1) % ROLES.length];
    setRole(next);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: () => {
          // AuthContext.signOut() would be called here
          navigation.navigate('Landing');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            // Delete account API call
          },
        },
      ]
    );
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'Healer':
        return { bg: T.warmDim, text: T.warm };
      case 'Admin':
        return { bg: T.dangerDim, text: T.danger };
      default:
        return { bg: T.accentDim, text: T.accent };
    }
  };

  const badgeColor = getRoleBadgeColor();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@email.com</Text>
          <View style={styles.roleRow}>
            <View
              style={[styles.roleBadge, { backgroundColor: badgeColor.bg }]}
            >
              <Text style={[styles.roleBadgeText, { color: badgeColor.text }]}>
                {role}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.switchRoleBtn}
              onPress={cycleRole}
            >
              <Text style={styles.switchRoleText}>Switch Role</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Email</Text>
            <View style={styles.settingsRight}>
              <Text style={styles.settingsValue}>john.doe@email.com</Text>
              <Text style={styles.settingsArrow}>{'\u203A'}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Change Password</Text>
            <Text style={styles.settingsArrow}>{'\u203A'}</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: T.border, true: T.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.settingsDivider} />
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Session Reminders</Text>
            <Switch
              value={sessionReminders}
              onValueChange={setSessionReminders}
              trackColor={{ false: T.border, true: T.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Appearance */}
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: T.border, true: T.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Privacy */}
        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsLabelCol}>
              <Text style={styles.settingsLabel}>
                Share Anonymized Data
              </Text>
              <Text style={styles.settingsHint}>
                Help improve healing research
              </Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={setDataSharing}
              trackColor={{ false: T.border, true: T.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Links */}
        <View style={styles.linksSection}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => navigation.navigate('Referral')}
          >
            <View style={[styles.linkIcon, { backgroundColor: T.greenDim }]}>
              <Text style={styles.linkIconText}>{'\uD83C\uDF81'}</Text>
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Referral Program</Text>
              <Text style={styles.linkDesc}>
                Earn rewards by inviting friends
              </Text>
            </View>
            <Text style={styles.settingsArrow}>{'\u203A'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => navigation.navigate('Support')}
          >
            <View style={[styles.linkIcon, { backgroundColor: T.blueDim }]}>
              <Text style={styles.linkIconText}>{'\uD83D\uDCAC'}</Text>
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Support</Text>
              <Text style={styles.linkDesc}>Get help or ask questions</Text>
            </View>
            <Text style={styles.settingsArrow}>{'\u203A'}</Text>
          </TouchableOpacity>
        </View>

        {/* Sign out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Delete account */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Ennie v1.0.0 (Build 1)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: T.accent,
  },
  userName: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: T.text,
  },
  userEmail: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 2,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  roleBadge: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  roleBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  switchRoleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: T.border,
  },
  switchRoleText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.textMuted,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: T.text,
    marginBottom: 10,
    marginTop: 16,
  },
  settingsCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingsLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.text,
  },
  settingsLabelCol: {
    flex: 1,
    marginRight: 12,
  },
  settingsHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsValue: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginRight: 8,
  },
  settingsArrow: {
    fontSize: 22,
    color: T.textDim,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: T.border,
    marginLeft: 16,
  },
  linksSection: {
    marginTop: 24,
    gap: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
  },
  linkIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  linkIconText: {
    fontSize: 20,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.text,
  },
  linkDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    marginTop: 1,
  },
  signOutBtn: {
    marginTop: 28,
    backgroundColor: T.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.text,
  },
  deleteBtn: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.danger,
  },
  version: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
    textAlign: 'center',
    marginTop: 20,
  },
});
