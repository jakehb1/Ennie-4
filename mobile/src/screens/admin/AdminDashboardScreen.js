import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const QUEUE_ENTRIES = [
  {
    id: '1',
    position: 1,
    tier: 'Today',
    condition: 'Chronic Back Pain',
    waitTime: '3 min',
    patient: 'Sarah M.',
  },
  {
    id: '2',
    position: 2,
    tier: 'Today',
    condition: 'Migraine',
    waitTime: '5 min',
    patient: 'Mike T.',
  },
  {
    id: '3',
    position: 3,
    tier: 'This Week',
    condition: 'Shoulder Pain',
    waitTime: '12 min',
    patient: 'Lisa K.',
  },
  {
    id: '4',
    position: 4,
    tier: 'This Week',
    condition: 'Anxiety',
    waitTime: '18 min',
    patient: 'James R.',
  },
  {
    id: '5',
    position: 5,
    tier: 'Get in Line',
    condition: 'Knee Pain',
    waitTime: '1 hr 22 min',
    patient: 'Anna P.',
  },
  {
    id: '6',
    position: 6,
    tier: 'Get in Line',
    condition: 'Neck Pain',
    waitTime: '1 hr 45 min',
    patient: 'Tom W.',
  },
];

const HEALERS = [
  { id: '1', name: 'Sarah Chen', status: 'in_session', sessions: 12, rate: '82%' },
  { id: '2', name: 'David Park', status: 'online', sessions: 8, rate: '78%' },
  { id: '3', name: 'Maria Santos', status: 'online', sessions: 15, rate: '85%' },
  { id: '4', name: 'James Liu', status: 'offline', sessions: 6, rate: '74%' },
  { id: '5', name: 'Emily Watson', status: 'in_session', sessions: 10, rate: '80%' },
];

function getTierColor(tier) {
  switch (tier) {
    case 'Today':
      return { bg: T.warmDim, color: T.warm };
    case 'This Week':
      return { bg: T.accentDim, color: T.accent };
    case 'Get in Line':
      return { bg: T.greenDim, color: T.green };
    default:
      return { bg: T.border, color: T.textMuted };
  }
}

function getHealerStatusInfo(status) {
  switch (status) {
    case 'online':
      return { label: 'Online', color: T.green, dotColor: T.green };
    case 'in_session':
      return { label: 'In Session', color: T.warm, dotColor: T.warm };
    case 'offline':
      return { label: 'Offline', color: T.textDim, dotColor: T.textDim };
    default:
      return { label: status, color: T.textMuted, dotColor: T.textDim };
  }
}

export default function AdminDashboardScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const queueLength = QUEUE_ENTRIES.length;
  const activeSessions = HEALERS.filter((h) => h.status === 'in_session').length;
  const healersOnline = HEALERS.filter(
    (h) => h.status === 'online' || h.status === 'in_session'
  ).length;
  const systemWindow = 72; // percentage

  const sessionsToday = 47;
  const avgImprovementToday = 68;
  const revenueToday = 8450;

  const patientsInQueue = queueLength;
  const committedHealers = HEALERS.filter(
    (h) => h.status === 'online'
  ).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Admin Dashboard</Text>

        {/* System health cards */}
        <View style={styles.healthGrid}>
          <View style={styles.healthCard}>
            <Text style={styles.healthValue}>{queueLength}</Text>
            <Text style={styles.healthLabel}>Queue Length</Text>
          </View>
          <View style={styles.healthCard}>
            <Text style={[styles.healthValue, { color: T.warm }]}>
              {activeSessions}
            </Text>
            <Text style={styles.healthLabel}>Active Sessions</Text>
          </View>
          <View style={styles.healthCard}>
            <Text style={[styles.healthValue, { color: T.green }]}>
              {healersOnline}
            </Text>
            <Text style={styles.healthLabel}>Healers Online</Text>
          </View>
          <View style={styles.healthCard}>
            <Text style={[styles.healthValue, { color: T.accent }]}>
              {systemWindow}%
            </Text>
            <Text style={styles.healthLabel}>System Window</Text>
          </View>
        </View>

        {/* Real-time stats */}
        <Text style={styles.sectionTitle}>Today's Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{sessionsToday}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: T.green }]}>
              {avgImprovementToday}%
            </Text>
            <Text style={styles.statLabel}>Avg Improvement</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: T.accent }]}>
              ${revenueToday.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        {/* Queue Engine */}
        <Text style={styles.sectionTitle}>Queue Engine</Text>
        <View style={styles.engineCard}>
          <View style={styles.engineRow}>
            <View style={styles.engineItem}>
              <Text style={styles.engineValue}>{patientsInQueue}</Text>
              <Text style={styles.engineLabel}>Patients in Queue</Text>
            </View>
            <View style={styles.engineDivider} />
            <View style={styles.engineItem}>
              <Text style={styles.engineValue}>{committedHealers}</Text>
              <Text style={styles.engineLabel}>Available Healers</Text>
            </View>
            <View style={styles.engineDivider} />
            <View style={styles.engineItem}>
              <Text style={[styles.engineValue, { color: T.accent }]}>
                {systemWindow}%
              </Text>
              <Text style={styles.engineLabel}>System Window</Text>
            </View>
          </View>
          <View style={styles.engineBarTrack}>
            <View
              style={[styles.engineBarFill, { width: `${systemWindow}%` }]}
            />
          </View>
          <Text style={styles.engineHint}>
            System window = available healer capacity / queue demand
          </Text>
        </View>

        {/* Queue visualization */}
        <Text style={styles.sectionTitle}>Queue ({queueLength})</Text>
        {QUEUE_ENTRIES.map((entry) => {
          const tierColor = getTierColor(entry.tier);
          return (
            <View key={entry.id} style={styles.queueCard}>
              <View style={styles.queuePosition}>
                <Text style={styles.queuePositionText}>#{entry.position}</Text>
              </View>
              <View style={styles.queueInfo}>
                <Text style={styles.queuePatient}>{entry.patient}</Text>
                <Text style={styles.queueCondition}>{entry.condition}</Text>
              </View>
              <View style={styles.queueRight}>
                <View
                  style={[styles.tierBadge, { backgroundColor: tierColor.bg }]}
                >
                  <Text
                    style={[styles.tierBadgeText, { color: tierColor.color }]}
                  >
                    {entry.tier}
                  </Text>
                </View>
                <Text style={styles.queueWait}>{entry.waitTime}</Text>
              </View>
            </View>
          );
        })}

        {/* Healer list */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Healers ({HEALERS.length})
        </Text>
        {HEALERS.map((healer) => {
          const statusInfo = getHealerStatusInfo(healer.status);
          return (
            <View key={healer.id} style={styles.healerCard}>
              <View style={styles.healerLeft}>
                <View style={styles.healerAvatar}>
                  <Text style={styles.healerInitial}>
                    {healer.name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.healerName}>{healer.name}</Text>
                  <View style={styles.healerStatusRow}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: statusInfo.dotColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.healerStatus,
                        { color: statusInfo.color },
                      ]}
                    >
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.healerRight}>
                <Text style={styles.healerStat}>
                  {healer.sessions} today
                </Text>
                <Text style={styles.healerRate}>{healer.rate} rate</Text>
              </View>
            </View>
          );
        })}
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
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: T.text,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    marginBottom: 12,
  },
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  healthCard: {
    width: '48%',
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 18,
    flexGrow: 1,
    flexBasis: '46%',
  },
  healthValue: {
    fontFamily: fonts.headingBold,
    fontSize: 32,
    color: T.text,
  },
  healthLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: T.text,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: T.textMuted,
    marginTop: 2,
  },
  engineCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 24,
  },
  engineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  engineItem: {
    flex: 1,
    alignItems: 'center',
  },
  engineValue: {
    fontFamily: fonts.headingBold,
    fontSize: 24,
    color: T.text,
  },
  engineLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: T.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  engineDivider: {
    width: 1,
    height: 36,
    backgroundColor: T.border,
  },
  engineBarTrack: {
    height: 8,
    backgroundColor: T.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  engineBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: T.accent,
  },
  engineHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
    textAlign: 'center',
  },
  queueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    marginBottom: 6,
  },
  queuePosition: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  queuePositionText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: T.accent,
  },
  queueInfo: {
    flex: 1,
  },
  queuePatient: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
  },
  queueCondition: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
  },
  queueRight: {
    alignItems: 'flex-end',
  },
  tierBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 4,
  },
  tierBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
  },
  queueWait: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
  },
  healerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    marginBottom: 6,
  },
  healerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  healerInitial: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.accent,
  },
  healerName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
  },
  healerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  healerStatus: {
    fontFamily: fonts.body,
    fontSize: 12,
  },
  healerRight: {
    alignItems: 'flex-end',
  },
  healerStat: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.text,
  },
  healerRate: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
  },
});
