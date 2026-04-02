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
import { useApp } from '../../context/AppContext';
import Card from '../../components/shared/Card';

const OPTIONS = [
  {
    id: 'free',
    title: 'Free Session',
    description: 'Test a healer -- free, unverified, longer wait',
    price: 'Free',
    wait: '~45 min',
    successRate: 'Varies',
    tier: 'free',
    color: T.green,
    bgColor: T.greenDim,
  },
  {
    id: 'paid',
    title: 'Paid Session',
    description: 'Verified healer -- 75%+ success rate',
    price: '$49.99',
    wait: '~10 min',
    successRate: '75%+',
    tier: 'today',
    color: T.accent,
    bgColor: T.accentDim,
    recommended: true,
  },
  {
    id: 'group',
    title: 'Group Healing',
    description: 'Join a group session -- $19.99/mo subscription',
    price: '$19.99/mo',
    wait: 'Scheduled',
    successRate: '68%',
    tier: 'group',
    color: T.warm,
    bgColor: T.warmDim,
  },
];

export default function RoutingScreen({ navigation }) {
  const { setSelectedTier } = useApp();
  const [expanded, setExpanded] = useState(false);

  const handleSelect = (option) => {
    if (option.id === 'group') {
      navigation.navigate('GroupSchedule');
      return;
    }
    setSelectedTier(option.tier);
    navigation.navigate('Queue');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your Best Options</Text>
        <Text style={styles.subtitle}>
          Based on your symptoms, here are the best ways to get healing
        </Text>

        {OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.7}
            onPress={() => handleSelect(option)}
          >
            <Card
              style={[
                styles.optionCard,
                { borderColor: option.color },
              ]}
            >
              {option.recommended && (
                <View style={[styles.badge, { backgroundColor: option.bgColor }]}>
                  <Text style={[styles.badgeText, { color: option.color }]}>
                    Recommended
                  </Text>
                </View>
              )}
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDesc}>{option.description}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Price</Text>
                  <Text style={[styles.metaValue, { color: option.color }]}>
                    {option.price}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Wait</Text>
                  <Text style={styles.metaValue}>{option.wait}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Success</Text>
                  <Text style={styles.metaValue}>{option.successRate}</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* How we verify healers */}
        <TouchableOpacity
          style={styles.expandBtn}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandBtnText}>
            How we verify healers {expanded ? '(hide)' : '(learn more)'}
          </Text>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.expandedText}>
              Every healer on Ennie goes through a rigorous testing process.
              They must demonstrate measurable improvement across multiple
              blind sessions before being verified.
            </Text>
            <Text style={styles.expandedText}>
              Verified healers have achieved a 75% or higher improvement rate
              across at least 20 measured sessions. Their results are tracked
              and published transparently.
            </Text>
            <Text style={styles.expandedText}>
              Free-tier healers are still in the testing phase. While results
              may vary, every session is measured and contributes to our
              research database.
            </Text>
          </View>
        )}
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
    paddingTop: 24,
    paddingBottom: 40,
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
  optionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  badgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  optionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
  },
  optionDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 4,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 16,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
    marginBottom: 2,
  },
  metaValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.text,
  },
  expandBtn: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  expandBtnText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.accent,
  },
  expandedContent: {
    backgroundColor: T.accentDim,
    borderRadius: 14,
    padding: 18,
    marginTop: 4,
  },
  expandedText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    lineHeight: 21,
    marginBottom: 12,
  },
});
