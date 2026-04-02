import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const SESSIONS = [
  {
    id: '1',
    date: 'Mar 28, 2026',
    time: '7:00 PM',
    condition: 'Chronic Back Pain',
    before: 8,
    after: 3,
    healerType: 'verified',
    healer: 'Sarah Chen',
    moments: [
      { time: '0:00', note: 'Session started, severity 8/10' },
      { time: '5:12', note: 'First noticeable relief' },
      { time: '12:30', note: 'Severity dropped to 5/10' },
      { time: '18:00', note: 'Deep relaxation phase' },
      { time: '25:00', note: 'Final measurement: 3/10' },
    ],
  },
  {
    id: '2',
    date: 'Mar 22, 2026',
    time: '3:30 PM',
    condition: 'Migraine',
    before: 7,
    after: 2,
    healerType: 'verified',
    healer: 'David Park',
    moments: [
      { time: '0:00', note: 'Session started, severity 7/10' },
      { time: '8:00', note: 'Pain beginning to ease' },
      { time: '15:00', note: 'Severity at 4/10' },
      { time: '22:00', note: 'Significant improvement' },
    ],
  },
  {
    id: '3',
    date: 'Mar 15, 2026',
    time: '6:00 PM',
    condition: 'Shoulder Pain',
    before: 6,
    after: 4,
    healerType: 'free',
    healer: 'Test Healer',
    moments: [
      { time: '0:00', note: 'Session started, severity 6/10' },
      { time: '10:00', note: 'Mild improvement noted' },
    ],
  },
  {
    id: '4',
    date: 'Mar 10, 2026',
    time: '8:00 PM',
    condition: 'Anxiety / Stress',
    before: 9,
    after: 4,
    healerType: 'group',
    healer: 'Maria Santos',
    moments: [
      { time: '0:00', note: 'Group session started, severity 9/10' },
      { time: '12:00', note: 'Breathing exercises helped' },
      { time: '20:00', note: 'Feeling calmer, severity 5/10' },
      { time: '28:00', note: 'Session end: 4/10' },
    ],
  },
];

function getImprovementColor(pct) {
  if (pct >= 50) return T.green;
  if (pct >= 25) return T.warm;
  return T.danger;
}

function getHealerBadge(type) {
  switch (type) {
    case 'verified':
      return { label: 'Verified', bg: T.accentDim, color: T.accent };
    case 'free':
      return { label: 'Free', bg: T.blueDim, color: T.blue };
    case 'group':
      return { label: 'Group', bg: T.warmDim, color: T.warm };
    default:
      return { label: type, bg: T.border, color: T.textMuted };
  }
}

export default function SessionHistoryScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const totalSessions = SESSIONS.length;
  const avgImprovement =
    SESSIONS.length > 0
      ? Math.round(
          SESSIONS.reduce((sum, s) => {
            return sum + ((s.before - s.after) / s.before) * 100;
          }, 0) / SESSIONS.length
        )
      : 0;

  const renderSession = ({ item }) => {
    const improvement = Math.round(
      ((item.before - item.after) / item.before) * 100
    );
    const improvementColor = getImprovementColor(improvement);
    const badge = getHealerBadge(item.healerType);
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={styles.sessionCard}
        activeOpacity={0.7}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        <View style={styles.sessionHeader}>
          <View>
            <Text style={styles.sessionDate}>
              {item.date} · {item.time}
            </Text>
            <Text style={styles.sessionCondition}>{item.condition}</Text>
          </View>
          <View
            style={[
              styles.improvementBadge,
              { backgroundColor: improvementColor + '18' },
            ]}
          >
            <Text
              style={[styles.improvementText, { color: improvementColor }]}
            >
              {improvement}%
            </Text>
          </View>
        </View>

        <View style={styles.severityRow}>
          <View style={styles.severityBlock}>
            <Text style={styles.severityLabel}>Before</Text>
            <Text style={styles.severityValue}>{item.before}/10</Text>
          </View>
          <View style={styles.severityArrow}>
            <Text style={styles.arrowText}>{'\u2192'}</Text>
          </View>
          <View style={styles.severityBlock}>
            <Text style={styles.severityLabel}>After</Text>
            <Text style={[styles.severityValue, { color: improvementColor }]}>
              {item.after}/10
            </Text>
          </View>
          <View style={styles.severityBarContainer}>
            <View
              style={[
                styles.severityBarBefore,
                { width: `${(item.before / 10) * 100}%` },
              ]}
            />
            <View
              style={[
                styles.severityBarAfter,
                {
                  width: `${(item.after / 10) * 100}%`,
                  backgroundColor: improvementColor,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.sessionFooter}>
          <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.typeBadgeText, { color: badge.color }]}>
              {badge.label}
            </Text>
          </View>
          <Text style={styles.healerName}>{item.healer}</Text>
        </View>

        {/* Expanded content */}
        {isExpanded && (
          <View style={styles.expandedSection}>
            <View style={styles.divider} />

            {/* Severity curve placeholder */}
            <Text style={styles.expandedTitle}>Severity Over Time</Text>
            <View style={styles.chartPlaceholder}>
              <View style={styles.chartLine}>
                {item.moments.map((_, idx) => {
                  const progress = idx / (item.moments.length - 1);
                  const severity =
                    item.before -
                    (item.before - item.after) * progress;
                  const height = (severity / 10) * 60;
                  return (
                    <View key={idx} style={styles.chartBarWrapper}>
                      <View
                        style={[
                          styles.chartBar,
                          {
                            height,
                            backgroundColor:
                              progress > 0.5 ? T.green : T.warm,
                          },
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Moments log */}
            <Text style={styles.expandedTitle}>Session Moments</Text>
            {item.moments.map((moment, idx) => (
              <View key={idx} style={styles.momentRow}>
                <View style={styles.momentDot} />
                <View style={styles.momentContent}>
                  <Text style={styles.momentTime}>{moment.time}</Text>
                  <Text style={styles.momentNote}>{moment.note}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.expandHint}>
          {isExpanded ? 'Tap to collapse' : 'Tap for details'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Session History</Text>
      </View>

      <FlatList
        data={SESSIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderSession}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalSessions}</Text>
              <Text style={styles.statLabel}>Total Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: T.green }]}>
                {avgImprovement}%
              </Text>
              <Text style={styles.statLabel}>Avg Improvement</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{'\uD83D\uDCCB'}</Text>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyDesc}>
              Your completed healing sessions will appear here with
              detailed results and improvement tracking.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: T.text,
  },
  list: {
    padding: 24,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: T.text,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    marginTop: 4,
  },
  sessionCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionDate: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
  },
  sessionCondition: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: T.text,
    marginTop: 2,
  },
  improvementBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  improvementText: {
    fontFamily: fonts.headingBold,
    fontSize: 16,
  },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  severityBlock: {
    alignItems: 'center',
  },
  severityLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: T.textDim,
  },
  severityValue: {
    fontFamily: fonts.headingBold,
    fontSize: 18,
    color: T.text,
  },
  severityArrow: {
    marginHorizontal: 12,
  },
  arrowText: {
    fontSize: 16,
    color: T.textDim,
  },
  severityBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: T.border,
    borderRadius: 4,
    marginLeft: 12,
    overflow: 'hidden',
  },
  severityBarBefore: {
    position: 'absolute',
    height: 8,
    borderRadius: 4,
    backgroundColor: T.dangerDim,
  },
  severityBarAfter: {
    height: 8,
    borderRadius: 4,
  },
  sessionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 8,
  },
  typeBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  healerName: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
  },
  expandedSection: {
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: T.border,
    marginVertical: 12,
  },
  expandedTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
    marginBottom: 10,
  },
  chartPlaceholder: {
    height: 80,
    backgroundColor: T.accentDim,
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    justifyContent: 'flex-end',
  },
  chartLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 60,
  },
  chartBarWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 12,
    borderRadius: 6,
    minHeight: 4,
  },
  momentRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  momentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.accent,
    marginTop: 5,
    marginRight: 10,
  },
  momentContent: {
    flex: 1,
  },
  momentTime: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: T.accent,
  },
  momentNote: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    marginTop: 1,
  },
  expandHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: T.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});
