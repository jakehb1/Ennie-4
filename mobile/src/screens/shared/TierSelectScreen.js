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

const TIERS = [
  {
    id: 'line',
    name: 'Get in Line',
    price: 50,
    wait: '~2 hr wait',
    badge: 'Best value',
    badgeBg: T.greenDim,
    badgeColor: T.green,
    successRate: '72%',
    description: 'Join the queue and get matched when a healer is available.',
  },
  {
    id: 'week',
    name: 'This Week',
    price: 150,
    wait: '~30 min wait',
    badge: 'Most popular',
    badgeBg: T.accentDim,
    badgeColor: T.accent,
    successRate: '76%',
    description: 'Priority matching with a verified healer within 30 minutes.',
    popular: true,
  },
  {
    id: 'today',
    name: 'Today',
    price: 350,
    wait: '~5 min wait',
    badge: 'Priority access',
    badgeBg: T.warmDim,
    badgeColor: T.warm,
    successRate: '78%',
    description: 'Immediate access to a top-rated healer.',
  },
];

export default function TierSelectScreen({ navigation }) {
  const [selectedTier, setSelectedTier] = useState('week');
  const [whyExpanded, setWhyExpanded] = useState(false);

  const handleSelect = () => {
    const tier = TIERS.find((t) => t.id === selectedTier);
    navigation.navigate('Payment', { tier });
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

        <Text style={styles.title}>Choose Your Session</Text>
        <Text style={styles.subtitle}>
          Select a tier based on how quickly you want to see a healer.
        </Text>

        {/* Tier cards */}
        {TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <TouchableOpacity
              key={tier.id}
              style={[
                styles.tierCard,
                isSelected && styles.tierCardSelected,
                tier.popular && styles.tierCardPopular,
              ]}
              activeOpacity={0.7}
              onPress={() => setSelectedTier(tier.id)}
            >
              {tier.popular && (
                <View style={styles.popularRibbon}>
                  <Text style={styles.popularRibbonText}>MOST POPULAR</Text>
                </View>
              )}

              <View style={styles.tierHeader}>
                <View>
                  <Text style={styles.tierName}>{tier.name}</Text>
                  <Text style={styles.tierWait}>{tier.wait}</Text>
                </View>
                <View style={styles.tierPriceCol}>
                  <Text style={styles.tierPrice}>${tier.price}</Text>
                </View>
              </View>

              <Text style={styles.tierDesc}>{tier.description}</Text>

              <View style={styles.tierMeta}>
                <View style={[styles.tierBadge, { backgroundColor: tier.badgeBg }]}>
                  <Text style={[styles.tierBadgeText, { color: tier.badgeColor }]}>
                    {tier.badge}
                  </Text>
                </View>
                <Text style={styles.tierSuccess}>
                  {tier.successRate} success rate
                </Text>
              </View>

              <View style={styles.radioRow}>
                <View
                  style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterActive,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>
                  {isSelected ? 'Selected' : 'Select this tier'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Free session link */}
        <TouchableOpacity
          style={styles.freeLink}
          onPress={() => navigation.navigate('FreeSession')}
        >
          <View style={styles.freeLinkInner}>
            <Text style={styles.freeLinkTitle}>
              Try a test healer — free
            </Text>
            <Text style={styles.freeLinkDesc}>
              Experience a session with an unverified healer at no cost.
            </Text>
          </View>
          <Text style={styles.freeLinkArrow}>{'\u2192'}</Text>
        </TouchableOpacity>

        {/* Info section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            All paid sessions use verified healers with 75%+ success rate
            across multiple validated sessions.
          </Text>
        </View>

        {/* Why different prices */}
        <TouchableOpacity
          style={styles.expandableHeader}
          onPress={() => setWhyExpanded(!whyExpanded)}
        >
          <Text style={styles.expandableTitle}>Why different prices?</Text>
          <Text style={styles.expandableArrow}>
            {whyExpanded ? '\u25B2' : '\u25BC'}
          </Text>
        </TouchableOpacity>

        {whyExpanded && (
          <View style={styles.expandableContent}>
            <Text style={styles.expandableText}>
              Pricing reflects healer availability and queue priority. Higher
              tiers get matched faster because fewer patients are ahead of
              you. All tiers use the same pool of verified healers with
              proven track records.
            </Text>
            <Text style={[styles.expandableText, { marginTop: 8 }]}>
              Our healers have been validated through double-blind studies at
              UCI, demonstrating statistically significant results in pain
              reduction.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.selectBtn}
          activeOpacity={0.8}
          onPress={handleSelect}
        >
          <Text style={styles.selectBtnText}>
            Continue — ${TIERS.find((t) => t.id === selectedTier)?.price}
          </Text>
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
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.textMuted,
    marginBottom: 24,
  },
  tierCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: T.border,
    padding: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  tierCardSelected: {
    borderColor: T.accent,
    backgroundColor: T.accentDim,
  },
  tierCardPopular: {
    borderColor: T.accent,
  },
  popularRibbon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: T.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  popularRibbonText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tierName: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: T.text,
  },
  tierWait: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 2,
  },
  tierPriceCol: {
    alignItems: 'flex-end',
  },
  tierPrice: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: T.text,
  },
  tierDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    lineHeight: 20,
    marginBottom: 12,
  },
  tierMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  tierBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tierBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  tierSuccess: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioOuterActive: {
    borderColor: T.accent,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: T.accent,
  },
  radioLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.textMuted,
  },
  freeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.greenDim,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  freeLinkInner: {
    flex: 1,
  },
  freeLinkTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.green,
  },
  freeLinkDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    marginTop: 2,
  },
  freeLinkArrow: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.green,
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: T.blueDim,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.blue,
    lineHeight: 20,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  expandableTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.text,
  },
  expandableArrow: {
    fontSize: 12,
    color: T.textMuted,
  },
  expandableContent: {
    paddingBottom: 16,
  },
  expandableText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    lineHeight: 20,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: T.border,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  selectBtn: {
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  selectBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
