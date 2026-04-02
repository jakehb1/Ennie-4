import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { T, fonts } from '../../theme/tokens';

export default function PaymentConfirmScreen({ navigation, route }) {
  const tier = route?.params?.tier ?? { name: 'This Week', wait: '~30 min wait' };
  const amount = route?.params?.amount ?? 150;
  const transactionId =
    route?.params?.transactionId ?? 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Checkmark animation */}
        <Animated.View
          style={[
            styles.checkCircle,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.checkmark}>{'\u2713'}</Text>
        </Animated.View>

        <Animated.View style={[styles.textSection, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Payment Successful</Text>
          <Text style={styles.subtitle}>
            Your session has been booked.
          </Text>

          {/* Receipt card */}
          <View style={styles.receiptCard}>
            <Text style={styles.receiptTitle}>Receipt</Text>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Amount</Text>
              <Text style={styles.receiptValue}>${amount}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Tier</Text>
              <Text style={styles.receiptValue}>{tier.name}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Date</Text>
              <Text style={styles.receiptValue}>{dateStr}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transaction ID</Text>
              <Text style={styles.receiptValueSmall}>{transactionId}</Text>
            </View>
          </View>

          {/* Queue message */}
          <View style={styles.queueCard}>
            <View style={styles.queueDot} />
            <View style={styles.queueContent}>
              <Text style={styles.queueTitle}>
                You're now in the queue
              </Text>
              <Text style={styles.queueWait}>
                Estimated wait: {tier.wait}
              </Text>
              <Text style={styles.queueDesc}>
                We'll notify you when a healer is ready for your session.
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.queueBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Queue')}
        >
          <Text style={styles.queueBtnText}>Go to Queue</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: T.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 42,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  textSection: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: T.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.textMuted,
    marginBottom: 28,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 16,
  },
  receiptTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: T.text,
    marginBottom: 12,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  receiptLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  receiptValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
  },
  receiptValueSmall: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
  },
  queueCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: T.accentDim,
    borderRadius: 16,
    padding: 16,
  },
  queueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: T.accent,
    marginTop: 4,
    marginRight: 12,
  },
  queueContent: {
    flex: 1,
  },
  queueTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.accent,
  },
  queueWait: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: T.text,
    marginTop: 4,
  },
  queueDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    marginTop: 4,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  queueBtn: {
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  queueBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
