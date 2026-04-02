import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const MOCK_VERIFIED = [
  { name: 'Migraine', icon: '\u{1F4A0}', successRate: 82, sessionsCompleted: 67 },
  { name: 'Chronic Back Pain', icon: '\u{1F9B4}', successRate: 78, sessionsCompleted: 54 },
];

const MOCK_DEVELOPING = [
  { name: 'Anxiety', icon: '\u{1F9E0}', successRate: 68, sessionsCompleted: 31, sessionsNeeded: 50 },
  { name: 'Fibromyalgia', icon: '\u{2728}', successRate: 55, sessionsCompleted: 18, sessionsNeeded: 50 },
  { name: 'Neuropathy', icon: '\u{26A1}', successRate: 42, sessionsCompleted: 8, sessionsNeeded: 50 },
];

export default function SpecializationsScreen({ navigation }) {
  const getRateColor = (rate) => {
    if (rate >= 75) return T.green;
    if (rate >= 50) return T.warm;
    return T.danger;
  };

  const getRateBg = (rate) => {
    if (rate >= 75) return T.greenDim;
    if (rate >= 50) return T.warmDim;
    return T.dangerDim;
  };

  const renderConditionCard = (condition, verified) => {
    const rateColor = getRateColor(condition.successRate);
    const rateBg = getRateBg(condition.successRate);
    const progressPct = Math.min((condition.successRate / 75) * 100, 100);
    const sessionsRemaining = verified
      ? 0
      : Math.max(0, (condition.sessionsNeeded || 50) - condition.sessionsCompleted);

    return (
      <View key={condition.name} style={styles.conditionCard}>
        <View style={styles.conditionHeader}>
          <View style={styles.conditionIconWrap}>
            <Text style={styles.conditionIcon}>{condition.icon}</Text>
          </View>
          <View style={styles.conditionInfo}>
            <View style={styles.conditionNameRow}>
              <Text style={styles.conditionName}>{condition.name}</Text>
              {verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedCheck}>&#10003;</Text>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.sessionsCount}>
              {condition.sessionsCompleted} sessions completed
            </Text>
          </View>
          <View style={[styles.rateBadge, { backgroundColor: rateBg }]}>
            <Text style={[styles.rateText, { color: rateColor }]}>
              {condition.successRate}%
            </Text>
          </View>
        </View>

        {/* Progress bar to 75% threshold */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPct}%`, backgroundColor: rateColor },
              ]}
            />
            {!verified && (
              <View style={styles.thresholdMarker}>
                <View style={styles.thresholdLine} />
              </View>
            )}
          </View>
          {!verified && (
            <Text style={styles.progressMeta}>
              {sessionsRemaining > 0
                ? `${sessionsRemaining} more sessions needed`
                : `Reach 75% success to verify`}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Specializations</Text>
        <Text style={styles.subtitle}>
          Build verified skills to earn more and get matched with more patients
        </Text>

        {/* Verified Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeIcon}>&#10003;</Text>
          </View>
          <Text style={styles.sectionTitle}>Verified</Text>
          <Text style={styles.sectionMeta}>75%+ success rate</Text>
        </View>
        {MOCK_VERIFIED.length > 0 ? (
          MOCK_VERIFIED.map((c) => renderConditionCard(c, true))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No verified specializations yet. Keep building your skills!
            </Text>
          </View>
        )}

        {/* Developing Section */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <View style={[styles.sectionBadge, { backgroundColor: T.warmDim }]}>
            <Text style={[styles.sectionBadgeIcon, { color: T.warm }]}>&#9650;</Text>
          </View>
          <Text style={styles.sectionTitle}>Developing</Text>
          <Text style={styles.sectionMeta}>In progress</Text>
        </View>
        {MOCK_DEVELOPING.map((c) => renderConditionCard(c, false))}

        {/* Build New Skill Button */}
        <TouchableOpacity
          style={styles.buildButton}
          onPress={() => navigation.navigate('SkillBuild')}
          activeOpacity={0.8}
        >
          <Text style={styles.buildButtonIcon}>+</Text>
          <Text style={styles.buildButtonText}>Build a New Skill</Text>
        </TouchableOpacity>
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
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: T.text,
    paddingTop: 16,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: T.greenDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBadgeIcon: {
    fontSize: 12,
    color: T.green,
    fontWeight: '700',
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
  },
  sectionMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
    marginLeft: 'auto',
  },
  conditionCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 18,
    marginBottom: 12,
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conditionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  conditionIcon: {
    fontSize: 20,
  },
  conditionInfo: {
    flex: 1,
  },
  conditionNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  conditionName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.greenDim,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 3,
  },
  verifiedCheck: {
    fontSize: 10,
    color: T.green,
    fontWeight: '700',
  },
  verifiedText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: T.green,
  },
  sessionsCount: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
  },
  rateBadge: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  rateText: {
    fontFamily: fonts.headingBold,
    fontSize: 16,
  },
  progressSection: {
    marginTop: 14,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: 'visible',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  thresholdMarker: {
    position: 'absolute',
    left: '100%',
    top: -4,
  },
  thresholdLine: {
    width: 2,
    height: 14,
    backgroundColor: T.textDim,
    borderRadius: 1,
  },
  progressMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
    marginTop: 8,
  },
  emptyCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    textAlign: 'center',
  },
  buildButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 12,
    gap: 8,
  },
  buildButtonIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  buildButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
