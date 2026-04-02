import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';
import { useApp } from '../../context/AppContext';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';

const TIER_LABELS = {
  free: 'Free Tier',
  today: 'Today Pass',
  week: 'Week Pass',
  line: 'Skip the Line',
};

const TIPS = [
  'Find a quiet, comfortable space',
  'Hydrate before your session',
  'Keep an open mind -- measurable results speak for themselves',
  'Your healer may ask you to close your eyes during the session',
  'Sessions typically last 30 minutes',
];

export default function QueueScreen({ navigation }) {
  const { queuePosition, selectedTier, leaveQueue } = useApp();
  const [position, setPosition] = useState(queuePosition || 7);
  const [waitMinutes, setWaitMinutes] = useState(position * 4);
  const [showWarning, setShowWarning] = useState(false);

  // Pulsing animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Simulate queue movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigation.navigate('SymptomConfirm');
          return 0;
        }
        const next = prev - 1;
        setWaitMinutes(next * 4);
        if (next <= 2) setShowWarning(true);
        return next;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [navigation]);

  const handleCancel = () => {
    Alert.alert(
      'Leave Queue?',
      'You will lose your position. Are you sure?',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            leaveQueue();
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>You're in the queue</Text>

        {/* Queue position */}
        <View style={styles.positionContainer}>
          <Animated.View
            style={[
              styles.positionRing,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <View style={styles.positionInner}>
            <Text style={styles.positionNumber}>{position}</Text>
            <Text style={styles.positionLabel}>position</Text>
          </View>
        </View>

        {/* Wait time */}
        <Text style={styles.waitTime}>
          Estimated wait: ~{waitMinutes} min
        </Text>

        {/* Tier badge */}
        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>
            {TIER_LABELS[selectedTier] || 'Standard'}
          </Text>
        </View>

        {/* 3-minute warning */}
        {showWarning && (
          <Card style={styles.warningCard}>
            <Text style={styles.warningTitle}>Almost your turn!</Text>
            <Text style={styles.warningText}>
              You're near the front of the queue. Please be ready to confirm
              your symptoms when it's your turn.
            </Text>
          </Card>
        )}

        {/* Tips */}
        <Text style={styles.tipsTitle}>What to expect</Text>
        {TIPS.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}

        {/* Cancel */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel and leave queue</Text>
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
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: T.text,
    marginBottom: 32,
  },
  positionContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  positionRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: T.accentDim,
  },
  positionInner: {
    alignItems: 'center',
  },
  positionNumber: {
    fontFamily: fonts.headingBold,
    fontSize: 56,
    color: T.accent,
  },
  positionLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: -4,
  },
  waitTime: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: T.textMuted,
    marginBottom: 16,
  },
  tierBadge: {
    backgroundColor: T.accentDim,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 32,
  },
  tierText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: T.accent,
  },
  warningCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.warm,
    backgroundColor: T.warmDim,
    marginBottom: 28,
    width: '100%',
  },
  warningTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.warm,
    marginBottom: 6,
  },
  warningText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    lineHeight: 20,
  },
  tipsTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    width: '100%',
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.accent,
    marginRight: 12,
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    lineHeight: 20,
  },
  cancelBtn: {
    marginTop: 32,
    paddingVertical: 12,
  },
  cancelText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.danger,
  },
});
