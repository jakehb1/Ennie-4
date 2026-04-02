import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const REFERRAL_CODE = 'ENNIE-JD2026';

const REFERRAL_HISTORY = [
  {
    id: '1',
    name: 'Sarah M.',
    date: 'Mar 20, 2026',
    status: 'completed',
    earned: 25,
  },
  {
    id: '2',
    name: 'Mike T.',
    date: 'Mar 15, 2026',
    status: 'completed',
    earned: 25,
  },
  {
    id: '3',
    name: 'Lisa K.',
    date: 'Mar 28, 2026',
    status: 'pending',
    earned: 0,
  },
  {
    id: '4',
    name: 'James R.',
    date: 'Mar 10, 2026',
    status: 'invited',
    earned: 0,
  },
];

const HOW_IT_WORKS_PATIENT = [
  { step: '1', text: 'Share your referral code with a friend' },
  { step: '2', text: 'They sign up and complete their first session' },
  { step: '3', text: 'You both earn $25 credit' },
];

const HOW_IT_WORKS_HEALER = [
  { step: '1', text: 'Share your referral code with another healer' },
  { step: '2', text: 'They apply, get verified, and complete 5 sessions' },
  { step: '3', text: 'You earn $500 and they get a welcome bonus' },
];

export default function ReferralScreen({ navigation, route }) {
  const userRole = route?.params?.role ?? 'Patient';
  const [codeCopied, setCodeCopied] = useState(false);

  const isHealer = userRole === 'Healer';
  const rewardAmount = isHealer ? '$500' : '$25';
  const rewardDesc = isHealer
    ? 'Earn $500 for every healer who gets verified'
    : 'Earn $25 for every friend who completes a session';
  const howItWorks = isHealer ? HOW_IT_WORKS_HEALER : HOW_IT_WORKS_PATIENT;

  const referralsSent = REFERRAL_HISTORY.length;
  const referralsCompleted = REFERRAL_HISTORY.filter(
    (r) => r.status === 'completed'
  ).length;
  const totalEarnings = REFERRAL_HISTORY.reduce(
    (sum, r) => sum + r.earned,
    0
  );

  const handleCopy = () => {
    // Clipboard.setString(REFERRAL_CODE);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Try Ennie for measured energy healing! Use my referral code ${REFERRAL_CODE} to get started. https://ennie.app/ref/${REFERRAL_CODE}`,
      });
    } catch (_) {
      // Share cancelled
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', bg: T.greenDim, color: T.green };
      case 'pending':
        return { label: 'Pending', bg: T.warmDim, color: T.warm };
      case 'invited':
        return { label: 'Invited', bg: T.blueDim, color: T.blue };
      default:
        return { label: status, bg: T.border, color: T.textMuted };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>{'\u2190'} Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Referral Program</Text>

        {/* Reward highlight */}
        <View style={styles.rewardCard}>
          <Text style={styles.rewardAmount}>{rewardAmount}</Text>
          <Text style={styles.rewardLabel}>per referral</Text>
          <Text style={styles.rewardDesc}>{rewardDesc}</Text>
        </View>

        {/* Referral code */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your Referral Code</Text>
          <View style={styles.codeRow}>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{REFERRAL_CODE}</Text>
            </View>
            <TouchableOpacity
              style={[styles.copyBtn, codeCopied && styles.copyBtnCopied]}
              onPress={handleCopy}
            >
              <Text
                style={[
                  styles.copyBtnText,
                  codeCopied && styles.copyBtnTextCopied,
                ]}
              >
                {codeCopied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.shareBtn}
            activeOpacity={0.8}
            onPress={handleShare}
          >
            <Text style={styles.shareBtnText}>Share Referral Link</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{referralsSent}</Text>
            <Text style={styles.statLabel}>Sent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: T.green }]}>
              {referralsCompleted}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: T.accent }]}>
              ${totalEarnings}
            </Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
        </View>

        {/* Referral history */}
        <Text style={styles.sectionTitle}>Referral History</Text>
        {REFERRAL_HISTORY.map((ref) => {
          const badge = getStatusBadge(ref.status);
          return (
            <View key={ref.id} style={styles.historyCard}>
              <View style={styles.historyLeft}>
                <View style={styles.historyAvatar}>
                  <Text style={styles.historyInitial}>
                    {ref.name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.historyName}>{ref.name}</Text>
                  <Text style={styles.historyDate}>{ref.date}</Text>
                </View>
              </View>
              <View style={styles.historyRight}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: badge.bg },
                  ]}
                >
                  <Text
                    style={[styles.statusBadgeText, { color: badge.color }]}
                  >
                    {badge.label}
                  </Text>
                </View>
                {ref.earned > 0 && (
                  <Text style={styles.earnedText}>+${ref.earned}</Text>
                )}
              </View>
            </View>
          );
        })}

        {/* How it works */}
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.howCard}>
          {howItWorks.map((item, idx) => (
            <View key={item.step} style={styles.howRow}>
              <View style={styles.howStepCircle}>
                <Text style={styles.howStepText}>{item.step}</Text>
              </View>
              <Text style={styles.howText}>{item.text}</Text>
              {idx < howItWorks.length - 1 && (
                <View style={styles.howLine} />
              )}
            </View>
          ))}
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
    padding: 24,
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 8,
  },
  backText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.accent,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: T.text,
    marginBottom: 20,
  },
  rewardCard: {
    backgroundColor: T.accentDim,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
  },
  rewardAmount: {
    fontFamily: fonts.headingBold,
    fontSize: 48,
    color: T.accent,
  },
  rewardLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 2,
  },
  rewardDesc: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.text,
    textAlign: 'center',
    marginTop: 8,
  },
  codeCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 20,
  },
  codeLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.textMuted,
    marginBottom: 10,
  },
  codeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  codeBox: {
    flex: 1,
    backgroundColor: T.accentDim,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  codeText: {
    fontFamily: fonts.headingBold,
    fontSize: 18,
    color: T.accent,
    letterSpacing: 1,
  },
  copyBtn: {
    backgroundColor: T.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  copyBtnCopied: {
    backgroundColor: T.greenDim,
    borderColor: T.green,
  },
  copyBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
  },
  copyBtnTextCopied: {
    color: T.green,
  },
  shareBtn: {
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: '#FFFFFF',
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
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.headingBold,
    fontSize: 24,
    color: T.text,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    marginBottom: 12,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    marginBottom: 8,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  historyInitial: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.accent,
  },
  historyName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
  },
  historyDate: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  earnedText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.green,
    marginTop: 4,
  },
  howCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
  },
  howRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    position: 'relative',
  },
  howStepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  howStepText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  howText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.text,
    flex: 1,
    marginTop: 5,
    lineHeight: 22,
  },
  howLine: {
    position: 'absolute',
    left: 15,
    top: 34,
    width: 2,
    height: 20,
    backgroundColor: T.border,
  },
});
