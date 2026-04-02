import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Logo from '../../components/shared/Logo';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';

const TICKER_MESSAGES = [
  '14 sessions completed in the last hour',
  'Average improvement today: 72%',
  '8 healers are online now',
  'A patient just reported full pain relief',
];

const MOCK_SESSIONS = [
  { id: '1', date: 'Mar 28, 2026', condition: 'Lower back pain', improvement: 68 },
  { id: '2', date: 'Mar 21, 2026', condition: 'Headache', improvement: 85 },
  { id: '3', date: 'Mar 14, 2026', condition: 'Shoulder tension', improvement: 42 },
];

export default function PatientHomeScreen({ navigation }) {
  const { user } = useAuth();
  const { inQueue, queuePosition } = useApp();
  const [tickerIndex, setTickerIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Logo size={28} />
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.profileBtn}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>
              {firstName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome card */}
        <Card style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            Welcome back, {firstName}
          </Text>
          <Text style={styles.welcomeSub}>
            Ready for your next healing session?
          </Text>
        </Card>

        {/* Queue status or Start session */}
        {inQueue ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Queue')}
          >
            <Card style={styles.queueCard}>
              <View style={styles.queueBadge}>
                <Text style={styles.queueBadgeText}>In Queue</Text>
              </View>
              <Text style={styles.queuePosition}>
                Position: #{queuePosition || '--'}
              </Text>
              <Text style={styles.queueWait}>Estimated wait: ~12 min</Text>
              <Text style={styles.queueTap}>Tap to view details</Text>
            </Card>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Consent')}
          >
            <Card style={styles.startCard}>
              <View style={styles.startCardInner}>
                <View style={styles.startCardText}>
                  <Text style={styles.startTitle}>Start a Session</Text>
                  <Text style={styles.startDesc}>
                    Tell us what's bothering you and we'll match you with the
                    right healer
                  </Text>
                  <View style={styles.startArrow}>
                    <Text style={styles.startArrowText}>Begin intake</Text>
                  </View>
                </View>
                {/* Body silhouette placeholder */}
                <View style={styles.bodyPlaceholder}>
                  <View style={styles.bodyHead} />
                  <View style={styles.bodyTorso} />
                  <View style={styles.bodyLegs} />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}

        {/* Your Results */}
        <Text style={styles.sectionTitle}>Your Results</Text>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: T.green }]}>74%</Text>
            <Text style={styles.statLabel}>Avg Improvement</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: T.accent }]}>92%</Text>
            <Text style={styles.statLabel}>Best Result</Text>
          </Card>
        </View>

        {/* Recent sessions */}
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        {MOCK_SESSIONS.map((session) => (
          <TouchableOpacity
            key={session.id}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SessionHistory', { sessionId: session.id })}
          >
            <Card style={styles.sessionCard}>
              <View style={styles.sessionRow}>
                <View>
                  <Text style={styles.sessionCondition}>{session.condition}</Text>
                  <Text style={styles.sessionDate}>{session.date}</Text>
                </View>
                <View style={styles.improvementBadge}>
                  <Text style={styles.improvementText}>
                    +{session.improvement}%
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Group healing promo */}
        <Card style={styles.groupCard}>
          <Text style={styles.groupTitle}>Group Healing Sessions</Text>
          <Text style={styles.groupDesc}>
            Join a live group session with other patients. Shared energy,
            powerful results.
          </Text>
          <Button
            title="Learn More"
            onPress={() => navigation.navigate('GroupSchedule')}
            style={styles.groupBtn}
          />
        </Card>

        {/* Live ticker */}
        <View style={styles.ticker}>
          <View style={styles.tickerDot} />
          <Animated.Text
            style={[styles.tickerText, { opacity: fadeAnim }]}
            numberOfLines={1}
          >
            {TICKER_MESSAGES[tickerIndex]}
          </Animated.Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  profileBtn: {
    padding: 4,
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.accent,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  welcomeCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: T.accentDim,
    borderWidth: 0,
  },
  welcomeText: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: T.text,
  },
  welcomeSub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 4,
  },
  queueCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderColor: T.warm,
    borderWidth: 1,
  },
  queueBadge: {
    backgroundColor: T.warmDim,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  queueBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: T.warm,
  },
  queuePosition: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: T.text,
  },
  queueWait: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 4,
  },
  queueTap: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.accent,
    marginTop: 10,
  },
  startCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderColor: T.accent,
    borderWidth: 1,
  },
  startCardInner: {
    flexDirection: 'row',
  },
  startCardText: {
    flex: 1,
    marginRight: 16,
  },
  startTitle: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: T.text,
  },
  startDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 6,
    lineHeight: 20,
  },
  startArrow: {
    marginTop: 12,
  },
  startArrowText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.accent,
  },
  bodyPlaceholder: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyHead: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: T.accentDim,
    marginBottom: 4,
  },
  bodyTorso: {
    width: 30,
    height: 36,
    borderRadius: 6,
    backgroundColor: T.accentDim,
    marginBottom: 4,
  },
  bodyLegs: {
    width: 30,
    height: 28,
    borderRadius: 4,
    backgroundColor: T.accentDim,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.border,
  },
  statValue: {
    fontFamily: fonts.headingBold,
    fontSize: 24,
    color: T.text,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: T.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  sessionCard: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: T.border,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionCondition: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.text,
  },
  sessionDate: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    marginTop: 2,
  },
  improvementBadge: {
    backgroundColor: T.greenDim,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  improvementText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.green,
  },
  groupCard: {
    padding: 20,
    borderRadius: 16,
    marginTop: 14,
    marginBottom: 24,
    backgroundColor: T.warmDim,
    borderWidth: 0,
  },
  groupTitle: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: T.text,
  },
  groupDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 6,
    lineHeight: 20,
  },
  groupBtn: {
    marginTop: 14,
  },
  ticker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tickerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.green,
    marginRight: 8,
  },
  tickerText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
  },
});
