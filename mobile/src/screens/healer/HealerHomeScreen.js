import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const MOCK_STATS = {
  totalSessions: 142,
  successRate: 78,
  totalEarned: 4260,
};

const MOCK_QUEUE = {
  count: 7,
  conditions: ['Migraine', 'Chronic Back Pain', 'Anxiety'],
};

const MOCK_SPECIALIZATIONS = [
  { name: 'Migraine', verified: true },
  { name: 'Chronic Back Pain', verified: true },
  { name: 'Anxiety', verified: false },
];

const MOCK_RECENT_SESSIONS = [
  { id: '1', condition: 'Migraine', improvement: 65, date: 'Today, 2:30 PM' },
  { id: '2', condition: 'Back Pain', improvement: 40, date: 'Today, 11:00 AM' },
  { id: '3', condition: 'Anxiety', improvement: 80, date: 'Yesterday, 4:15 PM' },
];

const MOCK_GROUP_INVITES = [
  { id: '1', topic: 'Chronic Pain Group', date: 'Apr 5, 7 PM', spots: 3 },
];

export default function HealerHomeScreen({ navigation }) {
  const [isOnline, setIsOnline] = useState(false);

  const getImprovementColor = (pct) => {
    if (pct >= 75) return T.green;
    if (pct >= 50) return T.warm;
    return T.danger;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Healer Dashboard</Text>
            <Text style={styles.subtitle}>Welcome back</Text>
          </View>
          <View style={styles.statusToggle}>
            <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
            <Text style={[styles.statusLabel, isOnline && styles.statusLabelOnline]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: T.border, true: T.greenDim }}
              thumbColor={isOnline ? T.green : T.textDim}
            />
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{MOCK_STATS.totalSessions}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: T.green }]}>
              {MOCK_STATS.successRate}%
            </Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${MOCK_STATS.totalEarned}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
        </View>

        {/* Current Queue */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Current Queue</Text>
            <View style={styles.queueBadge}>
              <Text style={styles.queueBadgeText}>{MOCK_QUEUE.count}</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            {MOCK_QUEUE.count} patients waiting in your specializations
          </Text>
          <View style={styles.conditionTags}>
            {MOCK_QUEUE.conditions.map((c) => (
              <View key={c} style={styles.conditionTag}>
                <Text style={styles.conditionTagText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Availability Commitment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Commitment</Text>
          <View style={styles.commitmentRow}>
            <Text style={styles.commitmentValue}>12 hrs</Text>
            <Text style={styles.commitmentLabel}>committed this week</Text>
          </View>
          <View style={styles.commitmentBar}>
            <View style={[styles.commitmentFill, { width: '60%' }]} />
          </View>
          <Text style={styles.commitmentMeta}>7.2 hrs completed / 12 hrs goal</Text>
        </View>

        {/* Start Accepting */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('HealerPing')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Start Accepting Patients</Text>
        </TouchableOpacity>

        {/* Specialization Badges */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Specializations</Text>
          <View style={styles.badgeRow}>
            {MOCK_SPECIALIZATIONS.map((s) => (
              <View
                key={s.name}
                style={[styles.specBadge, s.verified && styles.specBadgeVerified]}
              >
                {s.verified && <Text style={styles.checkmark}>&#10003;</Text>}
                <Text
                  style={[
                    styles.specBadgeText,
                    s.verified && styles.specBadgeTextVerified,
                  ]}
                >
                  {s.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Sessions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
        </View>
        {MOCK_RECENT_SESSIONS.map((session) => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionCondition}>{session.condition}</Text>
              <Text style={styles.sessionDate}>{session.date}</Text>
            </View>
            <View
              style={[
                styles.improvementBadge,
                { backgroundColor: getImprovementColor(session.improvement) + '18' },
              ]}
            >
              <Text
                style={[
                  styles.improvementText,
                  { color: getImprovementColor(session.improvement) },
                ]}
              >
                {session.improvement}% imp.
              </Text>
            </View>
          </View>
        ))}

        {/* Group Session Invites */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Group Session Invites</Text>
        </View>
        {MOCK_GROUP_INVITES.map((invite) => (
          <TouchableOpacity
            key={invite.id}
            style={styles.groupCard}
            onPress={() => navigation.navigate('GroupInvite', { invite })}
            activeOpacity={0.7}
          >
            <View style={styles.groupIcon}>
              <Text style={styles.groupIconText}>&#9673;</Text>
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupTopic}>{invite.topic}</Text>
              <Text style={styles.groupMeta}>
                {invite.date} &middot; {invite.spots} spots left
              </Text>
            </View>
            <Text style={styles.groupArrow}>&#8250;</Text>
          </TouchableOpacity>
        ))}

        {/* Referral Card */}
        <View style={styles.referralCard}>
          <Text style={styles.referralTitle}>Invite Healers</Text>
          <Text style={styles.referralBody}>
            Earn $500 for every qualified healer you refer to the platform.
          </Text>
          <TouchableOpacity style={styles.referralButton} activeOpacity={0.8}>
            <Text style={styles.referralButtonText}>Share Invite Link</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: T.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 2,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.textDim,
  },
  statusDotOnline: {
    backgroundColor: T.green,
  },
  statusLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.textMuted,
  },
  statusLabelOnline: {
    color: T.green,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: T.text,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: T.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: T.text,
  },
  cardBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginBottom: 12,
  },
  queueBadge: {
    backgroundColor: T.accentDim,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  queueBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: T.accent,
  },
  conditionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionTag: {
    backgroundColor: T.accentDim,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  conditionTagText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: T.accent,
  },
  commitmentRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 8,
  },
  commitmentValue: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: T.accent,
  },
  commitmentLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  commitmentBar: {
    height: 6,
    backgroundColor: T.border,
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  commitmentFill: {
    height: '100%',
    backgroundColor: T.accent,
    borderRadius: 3,
  },
  commitmentMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  specBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.accentDim,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
  },
  specBadgeVerified: {
    backgroundColor: T.greenDim,
  },
  specBadgeText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.accent,
  },
  specBadgeTextVerified: {
    color: T.green,
  },
  checkmark: {
    fontSize: 12,
    color: T.green,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 10,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionCondition: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.text,
  },
  sessionDate: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
    marginTop: 2,
  },
  improvementBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  improvementText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 10,
  },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupIconText: {
    fontSize: 20,
    color: T.accent,
  },
  groupInfo: {
    flex: 1,
  },
  groupTopic: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.text,
  },
  groupMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
  },
  groupArrow: {
    fontSize: 22,
    color: T.textDim,
  },
  referralCard: {
    backgroundColor: T.warmDim,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  referralTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.warm,
  },
  referralBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    marginTop: 8,
    lineHeight: 20,
  },
  referralButton: {
    backgroundColor: T.warm,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  referralButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
});
