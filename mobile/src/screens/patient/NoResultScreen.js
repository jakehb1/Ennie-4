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
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';

const OPTIONS = [
  {
    id: 'another',
    title: 'Try another healer',
    description:
      'Different healers have different strengths. Another healer may have better results for your condition.',
    action: 'Routing',
    color: T.accent,
    bgColor: T.accentDim,
  },
  {
    id: 'group',
    title: 'Try a group session',
    description:
      'Group healing sessions can sometimes produce different results. Join a scheduled session.',
    action: 'GroupSchedule',
    color: T.warm,
    bgColor: T.warmDim,
  },
  {
    id: 'support',
    title: 'Talk to support',
    description:
      'Our team is here to help. We can discuss your options and find the best path forward.',
    action: 'Support',
    color: T.blue,
    bgColor: T.blueDim,
  },
];

export default function NoResultScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>We're Sorry</Text>
        <Text style={styles.message}>
          This session didn't show the improvement we hoped for. Not every
          session works for every person, and that's okay. We're committed to
          transparency -- real results mean sometimes acknowledging when
          healing doesn't happen.
        </Text>

        {/* Refund info */}
        <View style={styles.refundCard}>
          <Text style={styles.refundTitle}>Refund Policy</Text>
          <Text style={styles.refundText}>
            If you paid for this session and didn't see measurable
            improvement, you're eligible for a full refund. Refunds are
            processed automatically within 3-5 business days.
          </Text>
        </View>

        {/* Options */}
        <Text style={styles.optionsTitle}>What would you like to do?</Text>
        {OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(opt.action)}
          >
            <Card
              style={[
                styles.optionCard,
                { borderColor: opt.color },
              ]}
            >
              <View
                style={[
                  styles.optionBadge,
                  { backgroundColor: opt.bgColor },
                ]}
              >
                <Text style={[styles.optionBadgeText, { color: opt.color }]}>
                  Option
                </Text>
              </View>
              <Text style={styles.optionTitle}>{opt.title}</Text>
              <Text style={styles.optionDesc}>{opt.description}</Text>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Back home */}
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('PatientTabs')}
          activeOpacity={0.7}
        >
          <Text style={styles.homeBtnText}>Return home</Text>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: T.text,
    marginBottom: 12,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.textMuted,
    lineHeight: 23,
    marginBottom: 24,
  },
  refundCard: {
    backgroundColor: T.greenDim,
    borderRadius: 14,
    padding: 18,
    marginBottom: 28,
  },
  refundTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.green,
    marginBottom: 6,
  },
  refundText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    lineHeight: 20,
  },
  optionsTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    marginBottom: 14,
  },
  optionCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  optionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  optionBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
  },
  optionTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
    marginBottom: 4,
  },
  optionDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    lineHeight: 20,
  },
  homeBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  homeBtnText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.textMuted,
  },
});
