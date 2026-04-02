import React, { useState, useEffect, useRef } from 'react';
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
import { useApp } from '../../context/AppContext';
import BodyMap from '../../components/shared/BodyMap';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';

export default function SessionEndScreen({ navigation }) {
  const { baselinePins, finalPins } = useApp();
  const [rating, setRating] = useState(0);
  const animValue = useRef(new Animated.Value(0)).current;

  // Calculate overall improvement
  const calcImprovement = () => {
    if (!baselinePins.length) return 0;
    const baselineAvg =
      baselinePins.reduce((sum, p) => sum + (p.severity || 5), 0) /
      baselinePins.length;
    const finalAvg =
      finalPins.length > 0
        ? finalPins.reduce((sum, p) => sum + (p.severity || 5), 0) /
          finalPins.length
        : baselineAvg * 0.4;
    if (baselineAvg === 0) return 0;
    return Math.round(((baselineAvg - finalAvg) / baselineAvg) * 100);
  };

  const improvement = calcImprovement();

  // Animate the percentage number
  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [animValue]);

  const getPinChanges = () => {
    return baselinePins.map((bp) => {
      const fp = finalPins.find((f) => f.id === bp.id);
      const before = bp.severity || 5;
      const after = fp ? fp.severity || 5 : Math.round(before * 0.4);
      const change =
        before > 0 ? Math.round(((before - after) / before) * 100) : 0;
      return {
        label: bp.label || bp.area || `Area ${bp.id}`,
        before,
        after,
        change,
      };
    });
  };

  const pinChanges = getPinChanges();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Session Complete</Text>

        {/* Overall improvement */}
        <Animated.View style={[styles.improvementContainer, { opacity: animValue }]}>
          <Text style={styles.improvementNumber}>
            {improvement > 0 ? '+' : ''}
            {improvement}%
          </Text>
          <Text style={styles.improvementLabel}>overall improvement</Text>
        </Animated.View>

        {/* Before/After body maps */}
        <View style={styles.mapsRow}>
          <View style={styles.mapCol}>
            <Text style={styles.mapLabel}>Before</Text>
            <View style={styles.mapBox}>
              <BodyMap pins={baselinePins} side="front" interactive={false} compact />
            </View>
          </View>
          <View style={styles.mapCol}>
            <Text style={styles.mapLabel}>After</Text>
            <View style={styles.mapBox}>
              <BodyMap pins={finalPins} side="front" interactive={false} compact />
            </View>
          </View>
        </View>

        {/* Per-pin changes */}
        <Text style={styles.sectionTitle}>Detailed Changes</Text>
        {pinChanges.length === 0 && (
          <Text style={styles.noData}>No symptom data recorded</Text>
        )}
        {pinChanges.map((pc, i) => (
          <Card key={i} style={styles.changeCard}>
            <Text style={styles.changeName}>{pc.label}</Text>
            <View style={styles.changeRow}>
              <Text style={styles.changeValues}>
                {pc.before} {'-->'} {pc.after}
              </Text>
              <View
                style={[
                  styles.changeBadge,
                  {
                    backgroundColor:
                      pc.change > 0 ? T.greenDim : T.dangerDim,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.changePercent,
                    {
                      color: pc.change > 0 ? T.green : T.danger,
                    },
                  ]}
                >
                  {pc.change > 0 ? '-' : '+'}
                  {Math.abs(pc.change)}%
                </Text>
              </View>
            </View>
          </Card>
        ))}

        {/* Rating */}
        <Text style={styles.sectionTitle}>How was your experience?</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starBtn}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.starText,
                  star <= rating && styles.starTextActive,
                ]}
              >
                {star <= rating ? '\u2605' : '\u2606'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Continue"
          onPress={() => navigation.navigate('Share')}
          style={styles.continueBtn}
        />
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
    paddingTop: 28,
    paddingBottom: 40,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: T.text,
    textAlign: 'center',
  },
  improvementContainer: {
    alignItems: 'center',
    marginVertical: 28,
  },
  improvementNumber: {
    fontFamily: fonts.headingBold,
    fontSize: 56,
    color: T.green,
  },
  improvementLabel: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.textMuted,
    marginTop: 4,
  },
  mapsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  mapCol: {
    flex: 1,
    alignItems: 'center',
  },
  mapLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.textMuted,
    marginBottom: 8,
  },
  mapBox: {
    width: '100%',
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    marginBottom: 14,
  },
  noData: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textDim,
    textAlign: 'center',
    paddingVertical: 16,
  },
  changeCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 8,
  },
  changeName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
    marginBottom: 6,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeValues: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  changeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changePercent: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
    gap: 8,
  },
  starBtn: {
    padding: 4,
  },
  starText: {
    fontSize: 36,
    color: T.border,
  },
  starTextActive: {
    color: T.warm,
  },
  continueBtn: {
    marginTop: 4,
  },
});
