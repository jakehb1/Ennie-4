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

const PERIODS = ['This Week', 'This Month', 'All Time'];

const MOCK_DATA = {
  'This Week': {
    total: 420,
    individual: { count: 12, rate: 30, total: 360 },
    group: { count: 1, rate: 40, total: 40 },
    referral: 0,
    specialization: 20,
    chart: [30, 60, 45, 30, 90, 60, 0],
  },
  'This Month': {
    total: 1680,
    individual: { count: 48, rate: 30, total: 1440 },
    group: { count: 4, rate: 40, total: 160 },
    referral: 0,
    specialization: 80,
    chart: [280, 420, 380, 600],
  },
  'All Time': {
    total: 4260,
    individual: { count: 124, rate: 30, total: 3720 },
    group: { count: 8, rate: 40, total: 320 },
    referral: 500,
    specialization: 220,
    chart: [800, 900, 1100, 1460],
  },
};

const MOCK_TRANSACTIONS = [
  { id: '1', type: 'Session', amount: 30, date: 'Apr 1, 2:30 PM', status: 'Completed' },
  { id: '2', type: 'Session', amount: 30, date: 'Apr 1, 11:00 AM', status: 'Completed' },
  { id: '3', type: 'Group Session', amount: 40, date: 'Mar 31, 7:00 PM', status: 'Completed' },
  { id: '4', type: 'Spec. Bonus', amount: 20, date: 'Mar 30', status: 'Completed' },
  { id: '5', type: 'Session', amount: 30, date: 'Mar 30, 3:15 PM', status: 'Completed' },
  { id: '6', type: 'Payout', amount: -500, date: 'Mar 28', status: 'Processed' },
];

export default function HealerEarningsScreen() {
  const [period, setPeriod] = useState('This Week');
  const data = MOCK_DATA[period];
  const maxChart = Math.max(...data.chart);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Earnings</Text>

        {/* Period Selector */}
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodTab, period === p && styles.periodTabActive]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.7}
            >
              <Text style={[styles.periodTabText, period === p && styles.periodTabTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Total Earnings */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{period} Earnings</Text>
          <Text style={styles.totalValue}>${data.total.toLocaleString()}</Text>
        </View>

        {/* Breakdown Cards */}
        <View style={styles.breakdownGrid}>
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownLabel}>Individual Sessions</Text>
            <Text style={styles.breakdownValue}>${data.individual.total}</Text>
            <Text style={styles.breakdownMeta}>
              {data.individual.count} x ${data.individual.rate}
            </Text>
          </View>
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownLabel}>Group Sessions</Text>
            <Text style={styles.breakdownValue}>${data.group.total}</Text>
            <Text style={styles.breakdownMeta}>
              {data.group.count} x ${data.group.rate}
            </Text>
          </View>
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownLabel}>Referral Bonuses</Text>
            <Text style={styles.breakdownValue}>${data.referral}</Text>
            <Text style={styles.breakdownMeta}>
              {data.referral > 0 ? `${data.referral / 500} referral(s)` : 'None yet'}
            </Text>
          </View>
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownLabel}>Spec. Bonuses</Text>
            <Text style={styles.breakdownValue}>${data.specialization}</Text>
            <Text style={styles.breakdownMeta}>Verified skill bonus</Text>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Earnings Overview</Text>
          <View style={styles.chartContainer}>
            {data.chart.map((val, i) => (
              <View key={i} style={styles.chartBarWrap}>
                <View style={styles.chartBarTrack}>
                  <View
                    style={[
                      styles.chartBarFill,
                      { height: `${maxChart > 0 ? (val / maxChart) * 100 : 0}%` },
                    ]}
                  />
                </View>
                <Text style={styles.chartBarLabel}>
                  {period === 'This Week'
                    ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]
                    : `W${i + 1}`}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Payment Method</Text>
          <View style={styles.paymentRow}>
            <View style={styles.paymentIcon}>
              <Text style={styles.paymentIconText}>&#9634;</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Bank Account</Text>
              <Text style={styles.paymentDetail}>****4821</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.paymentEdit}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Request Payout */}
        <TouchableOpacity style={styles.payoutButton} activeOpacity={0.8}>
          <Text style={styles.payoutButtonText}>Request Payout</Text>
        </TouchableOpacity>

        {/* Transaction History */}
        <View style={styles.transactionsSection}>
          <Text style={styles.transactionsTitle}>Transaction History</Text>
          {MOCK_TRANSACTIONS.map((tx) => (
            <View key={tx.id} style={styles.transactionRow}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>{tx.type}</Text>
                <Text style={styles.transactionDate}>{tx.date}</Text>
              </View>
              <View style={styles.transactionRight}>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: tx.amount >= 0 ? T.green : T.text },
                  ]}
                >
                  {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount)}
                </Text>
                <Text style={styles.transactionStatus}>{tx.status}</Text>
              </View>
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: T.text,
    paddingTop: 16,
    marginBottom: 20,
  },
  periodRow: {
    flexDirection: 'row',
    backgroundColor: T.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    padding: 4,
    marginBottom: 20,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  periodTabActive: {
    backgroundColor: T.accent,
  },
  periodTabText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.textMuted,
  },
  periodTabTextActive: {
    color: '#FFFFFF',
  },
  totalCard: {
    backgroundColor: T.accentDim,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  totalValue: {
    fontFamily: fonts.headingBold,
    fontSize: 44,
    color: T.accent,
    marginTop: 4,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  breakdownCard: {
    width: '48%',
    backgroundColor: T.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
  },
  breakdownLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
    marginBottom: 6,
  },
  breakdownValue: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: T.text,
  },
  breakdownMeta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: T.textDim,
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: T.text,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 8,
  },
  chartBarWrap: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  chartBarTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: T.accent,
    borderRadius: 4,
    minHeight: 4,
  },
  chartBarLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: T.textDim,
    marginTop: 6,
  },
  paymentCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 18,
    marginBottom: 16,
  },
  paymentTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: T.text,
    marginBottom: 14,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentIconText: {
    fontSize: 20,
    color: T.accent,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
  },
  paymentDetail: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
    marginTop: 1,
  },
  paymentEdit: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.accent,
  },
  payoutButton: {
    backgroundColor: T.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 28,
  },
  payoutButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  transactionsSection: {
    marginBottom: 20,
  },
  transactionsTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    marginBottom: 14,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
  },
  transactionDate: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
  },
  transactionStatus: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: T.textDim,
    marginTop: 2,
  },
});
