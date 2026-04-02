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

const EXPECTATIONS = [
  { icon: '\u23F1', label: '30-minute guided session' },
  { icon: '\uD83D\uDC65', label: 'Up to 30 participants' },
  { icon: '\u2705', label: 'Led by a verified healer' },
];

export default function GroupConfirmScreen({ navigation, route }) {
  const session = route?.params?.session ?? {
    focus: 'Chronic Pain Relief',
    date: 'Tue, Apr 7 · 7:00 PM EST',
    healer: 'Sarah Chen',
    participants: 18,
    maxParticipants: 30,
    priceSingle: 29,
    priceSubscription: 19.99,
  };

  const [paymentType, setPaymentType] = useState('single');

  const price =
    paymentType === 'single' ? session.priceSingle : session.priceSubscription;
  const priceLabel =
    paymentType === 'single' ? `$${price}` : `$${price}/mo`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>{'\u2190'} Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Confirm Booking</Text>

        {/* Session details card */}
        <View style={styles.detailCard}>
          <Text style={styles.detailFocus}>{session.focus}</Text>
          <Text style={styles.detailDate}>{session.date}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Healer</Text>
            <Text style={styles.detailValue}>{session.healer}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Spots</Text>
            <Text style={styles.detailValue}>
              {session.participants}/{session.maxParticipants} filled
            </Text>
          </View>
        </View>

        {/* Payment toggle */}
        <Text style={styles.sectionTitle}>Payment Option</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleCard,
              paymentType === 'single' && styles.toggleCardActive,
            ]}
            onPress={() => setPaymentType('single')}
          >
            <View style={styles.radioOuter}>
              {paymentType === 'single' && <View style={styles.radioInner} />}
            </View>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleLabel}>Single Session</Text>
              <Text style={styles.togglePrice}>${session.priceSingle}</Text>
              <Text style={styles.toggleDesc}>One-time payment</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleCard,
              paymentType === 'subscription' && styles.toggleCardActive,
            ]}
            onPress={() => setPaymentType('subscription')}
          >
            <View style={styles.radioOuter}>
              {paymentType === 'subscription' && (
                <View style={styles.radioInner} />
              )}
            </View>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleLabel}>Monthly Subscription</Text>
              <Text style={styles.togglePrice}>
                ${session.priceSubscription}
                <Text style={styles.togglePricePeriod}>/mo</Text>
              </Text>
              <Text style={styles.toggleDesc}>8 sessions per month</Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>Save 70%</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* What to expect */}
        <Text style={styles.sectionTitle}>What to Expect</Text>
        <View style={styles.expectCard}>
          {EXPECTATIONS.map((item, idx) => (
            <View key={idx} style={styles.expectRow}>
              <Text style={styles.expectIcon}>{item.icon}</Text>
              <Text style={styles.expectLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Payment method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethodCard}>
          <View style={styles.cardIconBox}>
            <Text style={styles.cardIconText}>VISA</Text>
          </View>
          <View style={styles.cardDetails}>
            <Text style={styles.cardNumber}>{'\u2022\u2022\u2022\u2022'} 4242</Text>
            <Text style={styles.cardExpiry}>Expires 12/27</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.confirmBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('GroupIntake', { session })}
        >
          <Text style={styles.confirmBtnText}>
            Confirm Booking — {priceLabel}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
  detailCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 24,
  },
  detailFocus: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    marginBottom: 4,
  },
  detailDate: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: T.border,
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
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    marginBottom: 12,
  },
  toggleRow: {
    gap: 12,
    marginBottom: 24,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: T.border,
    padding: 16,
  },
  toggleCardActive: {
    borderColor: T.accent,
    backgroundColor: T.accentDim,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: T.accent,
  },
  toggleContent: {
    flex: 1,
  },
  toggleLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.text,
  },
  togglePrice: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: T.text,
    marginTop: 4,
  },
  togglePricePeriod: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  toggleDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    marginTop: 2,
  },
  saveBadge: {
    backgroundColor: T.greenDim,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  saveText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: T.green,
  },
  expectCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 24,
    gap: 14,
  },
  expectRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expectIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  expectLabel: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.text,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 24,
  },
  cardIconBox: {
    backgroundColor: T.blueDim,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 12,
  },
  cardIconText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: T.blue,
  },
  cardDetails: {
    flex: 1,
  },
  cardNumber: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.text,
  },
  cardExpiry: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
  },
  changeText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.accent,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: T.border,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  confirmBtn: {
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.textMuted,
  },
});
