import React, { useState } from 'react';
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
import Toggle from '../../components/shared/Toggle';
import Button from '../../components/shared/Button';

const QUESTIONS = [
  'What condition did you come in with?',
  'What was your pain level before?',
  'How do you feel now?',
  'Would you recommend Ennie?',
];

export default function ShareScreen({ navigation }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [revenueOptIn, setRevenueOptIn] = useState(false);

  const handleRecord = () => {
    // Placeholder: would launch camera recording
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      navigation.navigate('PatientTabs');
    }
  };

  const handleSkip = () => {
    navigation.navigate('PatientTabs');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Share Your Experience</Text>
        <Text style={styles.subtitle}>
          Record a short testimonial video. Your story helps others find
          healing.
        </Text>

        {/* Camera preview placeholder */}
        <View style={styles.cameraPreview}>
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.cameraIcon}>REC</Text>
            <Text style={styles.cameraText}>Camera preview</Text>
          </View>
        </View>

        {/* Question display */}
        <Card style={styles.questionCard}>
          <Text style={styles.questionNumber}>
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </Text>
          <Text style={styles.questionText}>
            {QUESTIONS[currentQuestion]}
          </Text>
        </Card>

        {/* Question dots */}
        <View style={styles.dotsRow}>
          {QUESTIONS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentQuestion && styles.dotActive,
                i < currentQuestion && styles.dotDone,
              ]}
            />
          ))}
        </View>

        {/* Revenue share info */}
        <Card style={styles.revenueCard}>
          <Text style={styles.revenueTitle}>Earn from your story</Text>
          <Text style={styles.revenueText}>
            Your video could earn you a share of ad revenue each month.
            Testimonials help others find healing, and you get rewarded for
            sharing your experience.
          </Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Opt in to revenue sharing</Text>
            <Toggle value={revenueOptIn} onValueChange={setRevenueOptIn} />
          </View>
        </Card>
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <View style={styles.recordBtnWrapper}>
          <Button title="Record" onPress={handleRecord} />
        </View>
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
    paddingTop: 24,
    paddingBottom: 120,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: T.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.textMuted,
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },
  cameraPreview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  cameraIcon: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: T.danger,
    marginBottom: 8,
  },
  cameraText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: '#888888',
  },
  questionCard: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.accent,
    backgroundColor: T.accentDim,
    marginBottom: 16,
  },
  questionNumber: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: T.accent,
    marginBottom: 8,
  },
  questionText: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    lineHeight: 26,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.border,
  },
  dotActive: {
    backgroundColor: T.accent,
    width: 24,
  },
  dotDone: {
    backgroundColor: T.green,
  },
  revenueCard: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
  },
  revenueTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
    marginBottom: 8,
  },
  revenueText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.text,
    flex: 1,
    marginRight: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 16,
    backgroundColor: T.bg,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  skipBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  skipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.textMuted,
  },
  recordBtnWrapper: {
    flex: 1,
    marginLeft: 12,
  },
});
