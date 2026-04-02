import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const FILTERS = ['All', 'Pain', 'Stress', 'Emotional', 'Chronic'];

const SESSIONS = [
  {
    id: '1',
    focus: 'Chronic Pain Relief',
    category: 'Chronic',
    date: 'Tue, Apr 7 · 7:00 PM EST',
    healer: 'Sarah Chen',
    participants: 18,
    maxParticipants: 30,
    priceSingle: 29,
    priceSubscription: 19.99,
  },
  {
    id: '2',
    focus: 'Stress & Anxiety Release',
    category: 'Stress',
    date: 'Wed, Apr 8 · 8:00 PM EST',
    healer: 'David Park',
    participants: 24,
    maxParticipants: 30,
    priceSingle: 29,
    priceSubscription: 19.99,
  },
  {
    id: '3',
    focus: 'Emotional Healing Circle',
    category: 'Emotional',
    date: 'Thu, Apr 9 · 6:30 PM EST',
    healer: 'Maria Santos',
    participants: 12,
    maxParticipants: 30,
    priceSingle: 29,
    priceSubscription: 19.99,
  },
  {
    id: '4',
    focus: 'Migraine & Headache Relief',
    category: 'Pain',
    date: 'Fri, Apr 10 · 7:30 PM EST',
    healer: 'James Liu',
    participants: 27,
    maxParticipants: 30,
    priceSingle: 29,
    priceSubscription: 19.99,
  },
  {
    id: '5',
    focus: 'Lower Back Pain Session',
    category: 'Pain',
    date: 'Sat, Apr 11 · 10:00 AM EST',
    healer: 'Emily Watson',
    participants: 8,
    maxParticipants: 30,
    priceSingle: 29,
    priceSubscription: 19.99,
  },
];

function ProgressBar({ filled, max }) {
  const pct = (filled / max) * 100;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct}%` }]} />
    </View>
  );
}

export default function GroupScheduleScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const filtered =
    activeFilter === 'All'
      ? SESSIONS
      : SESSIONS.filter((s) => s.category === activeFilter);

  const renderSession = ({ item }) => (
    <TouchableOpacity
      style={styles.sessionCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('GroupConfirm', { session: item })}
    >
      <View style={styles.sessionHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.sessionPrice}>
          ${item.priceSingle}{' '}
          <Text style={styles.sessionPriceSub}>single</Text>
        </Text>
      </View>

      <Text style={styles.sessionFocus}>{item.focus}</Text>
      <Text style={styles.sessionDate}>{item.date}</Text>

      <View style={styles.sessionMeta}>
        <View style={styles.healerRow}>
          <View style={styles.healerAvatar}>
            <Text style={styles.healerInitial}>
              {item.healer.charAt(0)}
            </Text>
          </View>
          <Text style={styles.healerName}>{item.healer}</Text>
        </View>
      </View>

      <View style={styles.spotsRow}>
        <ProgressBar filled={item.participants} max={item.maxParticipants} />
        <Text style={styles.spotsText}>
          {item.participants}/{item.maxParticipants} spots filled
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Group Healing Sessions</Text>
      </View>

      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterTab,
                activeFilter === f && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderSession}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <TouchableOpacity style={styles.promoCard} activeOpacity={0.8}>
            <View style={styles.promoLeft}>
              <Text style={styles.promoTitle}>Subscribe & Save</Text>
              <Text style={styles.promoDesc}>
                $19.99/mo for 8 group sessions
              </Text>
              <Text style={styles.promoSavings}>Save over 70% per session</Text>
            </View>
            <View style={styles.promoRight}>
              <Text style={styles.promoPrice}>$19.99</Text>
              <Text style={styles.promoPeriod}>/month</Text>
            </View>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No sessions found for this category.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: T.text,
  },
  filterRow: {
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  filterScroll: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: T.accentDim,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: T.accent,
  },
  filterText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.accent,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: 24,
    paddingBottom: 40,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.accentDim,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.accent,
    padding: 20,
    marginBottom: 20,
  },
  promoLeft: {
    flex: 1,
  },
  promoTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.accent,
  },
  promoDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    marginTop: 4,
  },
  promoSavings: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: T.green,
    marginTop: 4,
  },
  promoRight: {
    alignItems: 'flex-end',
  },
  promoPrice: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: T.accent,
  },
  promoPeriod: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
  },
  sessionCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: T.warmDim,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: T.warm,
  },
  sessionPrice: {
    fontFamily: fonts.headingBold,
    fontSize: 16,
    color: T.text,
  },
  sessionPriceSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
  },
  sessionFocus: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    marginBottom: 4,
  },
  sessionDate: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginBottom: 12,
  },
  sessionMeta: {
    marginBottom: 12,
  },
  healerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  healerInitial: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: T.accent,
  },
  healerName: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.text,
  },
  spotsRow: {
    gap: 6,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: T.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: T.accent,
  },
  spotsText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.textMuted,
  },
});
