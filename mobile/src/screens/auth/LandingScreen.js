import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { T, fonts } from '../../theme/tokens';
import Logo from '../../components/shared/Logo';
import Button from '../../components/shared/Button';

const { width } = Dimensions.get('window');

const TICKER_MESSAGES = [
  '3 patients just completed sessions',
  'A healer in Sydney achieved 89% improvement',
  '12 new patients joined today',
  'Group healing session starting in 15 min',
  'A patient reported 100% pain relief',
  '5 healers are available now',
];

const TESTIMONIALS = [
  {
    id: '1',
    quote: 'I was skeptical, but after one session my chronic shoulder pain dropped from an 8 to a 2. I still can\'t believe it.',
    name: 'Sarah M.',
    condition: 'Chronic shoulder pain',
  },
  {
    id: '2',
    quote: 'The measurement aspect is what sold me. Real data, real results. My migraines have decreased by 70% over three sessions.',
    name: 'James K.',
    condition: 'Migraines',
  },
  {
    id: '3',
    quote: 'I\'ve tried everything for my back pain. Ennie was the first thing that actually showed measurable improvement.',
    name: 'Maria L.',
    condition: 'Lower back pain',
  },
];

export default function LandingScreen({ navigation }) {
  const [tickerIndex, setTickerIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero gradient header */}
        <LinearGradient
          colors={[T.accent, '#6A1FD6', '#4A0FA6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <SafeAreaView edges={['top']} style={styles.heroInner}>
            <Logo size={48} color="#FFFFFF" />
            <Text style={styles.tagline}>
              Measured energy healing{'\n'}by Charlie Goldsmith
            </Text>
            <Text style={styles.subtitle}>
              Feel it. Measure it. Believe it.
            </Text>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>23,400+</Text>
                <Text style={styles.statLabel}>sessions</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>74%</Text>
                <Text style={styles.statLabel}>avg improvement</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>UCI</Text>
                <Text style={styles.statLabel}>validated</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* CTA section */}
        <View style={styles.ctaSection}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('SignUp')}
            style={styles.getStartedBtn}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>
              I already have an account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Social proof */}
        <View style={styles.proofSection}>
          <Text style={styles.proofTitle}>What patients are saying</Text>
          {TESTIMONIALS.map((t) => (
            <View key={t.id} style={styles.testimonialCard}>
              <Text style={styles.quoteText}>"{t.quote}"</Text>
              <View style={styles.quoteMeta}>
                <Text style={styles.quoteName}>{t.name}</Text>
                <Text style={styles.quoteCondition}>{t.condition}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Live activity ticker */}
      <SafeAreaView edges={['bottom']} style={styles.tickerContainer}>
        <View style={styles.ticker}>
          <View style={styles.tickerDot} />
          <Animated.Text
            style={[styles.tickerText, { opacity: fadeAnim }]}
            numberOfLines={1}
          >
            {TICKER_MESSAGES[tickerIndex]}
          </Animated.Text>
        </View>
      </SafeAreaView>
    </View>
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
    paddingBottom: 80,
  },
  hero: {
    paddingBottom: 40,
  },
  heroInner: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  tagline: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: '#FFFFFF',
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  getStartedBtn: {
    width: '100%',
  },
  loginLink: {
    marginTop: 16,
    paddingVertical: 8,
  },
  loginLinkText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.accent,
  },
  proofSection: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  proofTitle: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: T.text,
    marginBottom: 16,
  },
  testimonialCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 12,
  },
  quoteText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  quoteMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quoteName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: T.text,
  },
  quoteCondition: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
  },
  tickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: T.bg,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  ticker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
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
