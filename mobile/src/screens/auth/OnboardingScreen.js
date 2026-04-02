import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';
import Button from '../../components/shared/Button';

const STEPS = [
  {
    number: '1',
    title: 'Tell us what\'s bothering you',
    description: 'Our AI-guided intake captures your symptoms, location, and severity.',
    color: T.accent,
    bgColor: T.accentDim,
  },
  {
    number: '2',
    title: 'We\'ll match you with the right healer',
    description: 'Our algorithm finds healers with proven success for your condition.',
    color: T.warm,
    bgColor: T.warmDim,
  },
  {
    number: '3',
    title: 'Track your improvement in real-time',
    description: 'See your symptoms change during the session with measurable data.',
    color: T.green,
    bgColor: T.greenDim,
  },
  {
    number: '4',
    title: '30-minute healing session',
    description: 'Experience energy healing from a verified practitioner, remotely or in-person.',
    color: T.blue,
    bgColor: T.blueDim,
  },
];

export default function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome to Ennie</Text>
        <Text style={styles.subtitle}>Here's what to expect</Text>

        <View style={styles.stepsContainer}>
          {STEPS.map((step, index) => (
            <View key={step.number} style={styles.stepRow}>
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <View style={styles.connectorLine} />
              )}

              {/* Step number badge */}
              <View
                style={[
                  styles.stepBadge,
                  { backgroundColor: step.bgColor },
                ]}
              >
                <Text style={[styles.stepNumber, { color: step.color }]}>
                  {step.number}
                </Text>
              </View>

              {/* Step content */}
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Backed by science</Text>
          <Text style={styles.infoText}>
            Ennie's healing methodology is validated by UC Irvine research.
            Every session is measured, giving you real data about your
            improvement.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() => navigation.navigate('AgeGate')}
        />
      </View>
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
    paddingBottom: 120,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 28,
    color: T.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: T.textMuted,
    marginTop: 8,
    marginBottom: 36,
  },
  stepsContainer: {
    marginBottom: 32,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 28,
    position: 'relative',
  },
  connectorLine: {
    position: 'absolute',
    left: 22,
    top: 48,
    width: 2,
    height: 40,
    backgroundColor: T.border,
  },
  stepBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumber: {
    fontFamily: fonts.headingBold,
    fontSize: 18,
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
    marginBottom: 4,
  },
  stepDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: T.accentDim,
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.accent,
    marginBottom: 8,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: T.bg,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
});
