import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const { width } = Dimensions.get('window');

const MOCK_PATIENT = {
  condition: 'Chronic Migraine',
  severity: '7/10',
  duration: '3 years',
  age: '34',
  sessionCount: 'First session',
};

const COUNTDOWN_SECONDS = 5;

export default function SmartMatchScreen({ navigation }) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [claimed, setClaimed] = useState(false);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  // Flash animation
  useEffect(() => {
    const flash = Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    flash.start();
    return () => flash.stop();
  }, [flashAnim]);

  // Countdown progress
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: COUNTDOWN_SECONDS * 1000,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  // Pulse the claim button
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [scaleAnim]);

  // Countdown timer
  useEffect(() => {
    if (claimed) return;
    if (countdown <= 0) {
      navigation.navigate('HealerCommitted');
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, claimed, navigation]);

  const handleClaim = () => {
    setClaimed(true);
    navigation.navigate('HealerSession', { patient: MOCK_PATIENT });
  };

  const handleSkip = () => {
    navigation.navigate('HealerCommitted');
  };

  const flashBg = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [T.accentDim, 'rgba(139,63,255,0.15)'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: flashBg }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Urgent Header */}
          <View style={styles.urgentHeader}>
            <Text style={styles.urgentLabel}>NEW MATCH</Text>
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          </View>

          {/* Countdown Progress Bar */}
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressLabel}>
            Claim within {countdown} seconds
          </Text>

          {/* Patient Info */}
          <View style={styles.patientCard}>
            <Text style={styles.patientCardTitle}>Patient Details</Text>

            <View style={styles.patientRow}>
              <Text style={styles.patientLabel}>Condition</Text>
              <Text style={styles.patientValue}>{MOCK_PATIENT.condition}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.patientRow}>
              <Text style={styles.patientLabel}>Severity</Text>
              <View style={styles.severityBadge}>
                <Text style={styles.severityText}>{MOCK_PATIENT.severity}</Text>
              </View>
            </View>
            <View style={styles.divider} />

            <View style={styles.patientRow}>
              <Text style={styles.patientLabel}>Duration</Text>
              <Text style={styles.patientValue}>{MOCK_PATIENT.duration}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.patientRow}>
              <Text style={styles.patientLabel}>Age</Text>
              <Text style={styles.patientValue}>{MOCK_PATIENT.age}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.patientRow}>
              <Text style={styles.patientLabel}>History</Text>
              <Text style={styles.patientValue}>{MOCK_PATIENT.sessionCount}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
            <TouchableOpacity
              style={styles.claimButton}
              onPress={handleClaim}
              activeOpacity={0.8}
            >
              <Text style={styles.claimButtonText}>CLAIM</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  urgentLabel: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: T.accent,
    letterSpacing: 2,
  },
  countdownCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontFamily: fonts.headingBold,
    fontSize: 32,
    color: '#FFFFFF',
  },
  progressTrack: {
    height: 6,
    width: '100%',
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: T.accent,
    borderRadius: 3,
  },
  progressLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.textMuted,
    marginBottom: 24,
  },
  patientCard: {
    backgroundColor: T.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    padding: 24,
    width: '100%',
    marginBottom: 28,
  },
  patientCardTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    marginBottom: 16,
  },
  patientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  patientLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  patientValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
  },
  divider: {
    height: 1,
    backgroundColor: T.border,
  },
  severityBadge: {
    backgroundColor: T.warmDim,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  severityText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.warm,
  },
  claimButton: {
    backgroundColor: T.accent,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  claimButtonText: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  skipButtonText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.textDim,
  },
});
