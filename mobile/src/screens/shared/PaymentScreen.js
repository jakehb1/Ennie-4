import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

export default function PaymentScreen({ navigation, route }) {
  const tier = route?.params?.tier ?? {
    name: 'This Week',
    price: 150,
    wait: '~30 min wait',
  };

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '').replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : '';
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const discount = promoApplied ? Math.round(tier.price * 0.1) : 0;
  const total = tier.price - discount;

  const handlePay = () => {
    navigation.navigate('PaymentConfirm', {
      tier,
      amount: total,
      transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    });
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

        <Text style={styles.title}>Payment</Text>

        {/* Order summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{tier.name} session</Text>
            <Text style={styles.summaryValue}>${tier.price}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated wait</Text>
            <Text style={styles.summaryValue}>{tier.wait}</Text>
          </View>
          {promoApplied && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: T.green }]}>
                Promo discount
              </Text>
              <Text style={[styles.summaryValue, { color: T.green }]}>
                -${discount}
              </Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total}</Text>
          </View>
        </View>

        {/* Payment methods */}
        <Text style={styles.sectionTitle}>Payment Method</Text>

        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[
              styles.methodTab,
              paymentMethod === 'card' && styles.methodTabActive,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <Text
              style={[
                styles.methodTabText,
                paymentMethod === 'card' && styles.methodTabTextActive,
              ]}
            >
              Card
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.methodTab,
              paymentMethod === 'apple' && styles.methodTabActive,
            ]}
            onPress={() => setPaymentMethod('apple')}
          >
            <Text
              style={[
                styles.methodTabText,
                paymentMethod === 'apple' && styles.methodTabTextActive,
              ]}
            >
              Apple Pay
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.methodTab,
              paymentMethod === 'google' && styles.methodTabActive,
            ]}
            onPress={() => setPaymentMethod('google')}
          >
            <Text
              style={[
                styles.methodTabText,
                paymentMethod === 'google' && styles.methodTabTextActive,
              ]}
            >
              Google Pay
            </Text>
          </TouchableOpacity>
        </View>

        {paymentMethod === 'card' && (
          <View style={styles.cardForm}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={T.textDim}
              value={cardNumber}
              onChangeText={(t) => setCardNumber(formatCardNumber(t))}
              keyboardType="number-pad"
              maxLength={19}
            />

            <View style={styles.cardRow}>
              <View style={styles.cardRowHalf}>
                <Text style={styles.inputLabel}>Expiry</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor={T.textDim}
                  value={expiry}
                  onChangeText={(t) => setExpiry(formatExpiry(t))}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              <View style={styles.cardRowHalf}>
                <Text style={styles.inputLabel}>CVC</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor={T.textDim}
                  value={cvc}
                  onChangeText={setCvc}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        )}

        {paymentMethod === 'apple' && (
          <TouchableOpacity style={styles.walletBtn} onPress={handlePay}>
            <Text style={styles.walletBtnText}>{'\uF8FF'} Pay with Apple Pay</Text>
          </TouchableOpacity>
        )}

        {paymentMethod === 'google' && (
          <TouchableOpacity
            style={[styles.walletBtn, styles.googleBtn]}
            onPress={handlePay}
          >
            <Text style={styles.walletBtnText}>G Pay with Google Pay</Text>
          </TouchableOpacity>
        )}

        {/* Promo code */}
        <Text style={styles.sectionTitle}>Promo Code</Text>
        <View style={styles.promoRow}>
          <TextInput
            style={[styles.input, styles.promoInput]}
            placeholder="Enter code"
            placeholderTextColor={T.textDim}
            value={promoCode}
            onChangeText={setPromoCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={[
              styles.promoApplyBtn,
              promoApplied && styles.promoAppliedBtn,
            ]}
            onPress={() => {
              if (promoCode.trim().length > 0) setPromoApplied(true);
            }}
          >
            <Text
              style={[
                styles.promoApplyText,
                promoApplied && styles.promoAppliedText,
              ]}
            >
              {promoApplied ? 'Applied' : 'Apply'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Guarantee */}
        <View style={styles.guaranteeCard}>
          <Text style={styles.guaranteeIcon}>{'\uD83D\uDEE1\uFE0F'}</Text>
          <View style={styles.guaranteeContent}>
            <Text style={styles.guaranteeTitle}>Money-Back Guarantee</Text>
            <Text style={styles.guaranteeText}>
              If your session does not show any measurable improvement, you
              are eligible for a full refund within 48 hours.
            </Text>
          </View>
        </View>

        {/* Security badges */}
        <View style={styles.securityRow}>
          <View style={styles.securityBadge}>
            <Text style={styles.securityIcon}>{'\uD83D\uDD12'}</Text>
            <Text style={styles.securityText}>SSL Encrypted</Text>
          </View>
          <View style={styles.securityBadge}>
            <Text style={styles.securityIcon}>{'\u2705'}</Text>
            <Text style={styles.securityText}>PCI Compliant</Text>
          </View>
          <View style={styles.securityBadge}>
            <Text style={styles.securityIcon}>{'\uD83C\uDFE6'}</Text>
            <Text style={styles.securityText}>Stripe Secured</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      {paymentMethod === 'card' && (
        <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.payBtn}
            activeOpacity={0.8}
            onPress={handlePay}
          >
            <Text style={styles.payBtnText}>Pay ${total}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
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
  summaryCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: T.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  summaryValue: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.text,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: T.border,
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
  },
  totalValue: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: T.text,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: T.text,
    marginBottom: 12,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  methodTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
  },
  methodTabActive: {
    backgroundColor: T.accentDim,
    borderColor: T.accent,
  },
  methodTabText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.textMuted,
  },
  methodTabTextActive: {
    color: T.accent,
  },
  cardForm: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: T.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: T.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.body,
    fontSize: 16,
    color: T.text,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardRowHalf: {
    flex: 1,
  },
  walletBtn: {
    backgroundColor: '#000000',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  googleBtn: {
    backgroundColor: '#4285F4',
  },
  walletBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  promoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  promoInput: {
    flex: 1,
    marginBottom: 0,
  },
  promoApplyBtn: {
    backgroundColor: T.accent,
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  promoAppliedBtn: {
    backgroundColor: T.green,
  },
  promoApplyText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  promoAppliedText: {
    color: '#FFFFFF',
  },
  guaranteeCard: {
    flexDirection: 'row',
    backgroundColor: T.greenDim,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  guaranteeIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  guaranteeContent: {
    flex: 1,
  },
  guaranteeTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.green,
    marginBottom: 4,
  },
  guaranteeText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    lineHeight: 18,
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  securityBadge: {
    alignItems: 'center',
  },
  securityIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  securityText: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: T.textDim,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: T.border,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  payBtn: {
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
