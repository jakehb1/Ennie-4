import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

export default function HealerCommittedScreen({ navigation, route }) {
  const hoursPerWeek = route?.params?.hoursPerWeek || 10;
  const [queueCount, setQueueCount] = useState(5);
  const [showWarning, setShowWarning] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  // Pulsing animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim, opacityAnim]);

  // Simulate 3-minute warning popup
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWarning(true);
    }, 15000); // 15 seconds for demo (would be ~3 min in production)
    return () => clearTimeout(timer);
  }, []);

  // Simulate queue changes
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueCount((prev) => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>You're Committed</Text>
        <Text style={styles.subtitle}>Waiting for a patient match...</Text>

        {/* Pulsing Circle */}
        <View style={styles.pulseContainer}>
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseAnim }],
                opacity: opacityAnim,
              },
            ]}
          />
          <View style={styles.pulseCore}>
            <Text style={styles.pulseCoreText}>{hoursPerWeek}</Text>
            <Text style={styles.pulseCoreUnit}>hrs/wk</Text>
          </View>
        </View>

        {/* Status Info */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Actively searching for matches</Text>
          </View>
        </View>

        {/* Queue Stats */}
        <View style={styles.queueCard}>
          <Text style={styles.queueLabel}>Patients waiting in your specializations</Text>
          <Text style={styles.queueCount}>{queueCount}</Text>
          <Text style={styles.queueMeta}>
            You'll be notified when a match is found
          </Text>
        </View>

        {/* Commitment Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hours committed</Text>
            <Text style={styles.detailValue}>{hoursPerWeek} hrs/week</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>Active</Text>
            </View>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Est. wait</Text>
            <Text style={styles.detailValue}>~5-15 min</Text>
          </View>
        </View>
      </View>

      {/* Cancel Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel Commitment</Text>
        </TouchableOpacity>
      </View>

      {/* 3-Minute Warning Modal */}
      <Modal visible={showWarning} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.warningIcon}>
              <Text style={styles.warningIconText}>!</Text>
            </View>
            <Text style={styles.modalTitle}>Match Imminent</Text>
            <Text style={styles.modalBody}>
              A patient match is about to arrive. Stay ready — you'll have 5 seconds to claim.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowWarning(false);
                navigation.navigate('SmartMatch');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>I'm Ready</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalDismiss}
              onPress={() => setShowWarning(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalDismissText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 28,
    color: T.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  pulseContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: T.accent,
  },
  pulseCore: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCoreText: {
    fontFamily: fonts.headingBold,
    fontSize: 36,
    color: '#FFFFFF',
  },
  pulseCoreUnit: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: -4,
  },
  statusCard: {
    backgroundColor: T.greenDim,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.green,
  },
  statusText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.green,
  },
  queueCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  queueLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    textAlign: 'center',
  },
  queueCount: {
    fontFamily: fonts.headingBold,
    fontSize: 48,
    color: T.accent,
    marginVertical: 8,
  },
  queueMeta: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textDim,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 18,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  detailValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
  },
  detailDivider: {
    height: 1,
    backgroundColor: T.border,
  },
  activeTag: {
    backgroundColor: T.greenDim,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeTagText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: T.green,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  cancelButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.danger,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: T.bg,
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
  },
  warningIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: T.warmDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  warningIconText: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: T.warm,
  },
  modalTitle: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: T.text,
    marginBottom: 8,
  },
  modalBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalDismiss: {
    paddingVertical: 10,
  },
  modalDismissText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.textMuted,
  },
});
