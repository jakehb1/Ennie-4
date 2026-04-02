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

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_BLOCKS = ['Morning', 'Afternoon', 'Evening'];

export default function HealerPingScreen({ navigation }) {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [schedule, setSchedule] = useState(() => {
    const init = {};
    DAYS.forEach((day) => {
      init[day] = { Morning: false, Afternoon: false, Evening: false };
    });
    return init;
  });

  const toggleBlock = (day, block) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [block]: !prev[day][block],
      },
    }));
  };

  const adjustHours = (delta) => {
    setHoursPerWeek((prev) => Math.max(1, Math.min(40, prev + delta)));
  };

  const activeBlocksCount = Object.values(schedule).reduce(
    (sum, day) => sum + Object.values(day).filter(Boolean).length,
    0
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Set Your Availability</Text>
        <Text style={styles.subtitle}>
          Tell us when you can heal. More hours = more matches = more earnings.
        </Text>

        {/* Hours Slider */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hours Per Week</Text>
          <View style={styles.sliderRow}>
            <TouchableOpacity
              style={styles.sliderBtn}
              onPress={() => adjustHours(-1)}
              activeOpacity={0.7}
            >
              <Text style={styles.sliderBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderValue}>
              <Text style={styles.sliderValueText}>{hoursPerWeek}</Text>
              <Text style={styles.sliderValueUnit}>hrs/week</Text>
            </View>
            <TouchableOpacity
              style={styles.sliderBtn}
              onPress={() => adjustHours(1)}
              activeOpacity={0.7}
            >
              <Text style={styles.sliderBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sliderTrack}>
            <View
              style={[styles.sliderFill, { width: `${(hoursPerWeek / 40) * 100}%` }]}
            />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1 hr</Text>
            <Text style={styles.sliderLabel}>40 hrs</Text>
          </View>
        </View>

        {/* Schedule Grid */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Schedule Blocks</Text>
          <Text style={styles.cardSubtitle}>
            Tap to toggle your availability
          </Text>

          {/* Header row */}
          <View style={styles.scheduleHeader}>
            <View style={styles.scheduleCorner} />
            {TIME_BLOCKS.map((block) => (
              <View key={block} style={styles.scheduleColHeader}>
                <Text style={styles.scheduleColLabel}>{block.slice(0, 3)}</Text>
              </View>
            ))}
          </View>

          {/* Day rows */}
          {DAYS.map((day) => (
            <View key={day} style={styles.scheduleRow}>
              <View style={styles.scheduleDayLabel}>
                <Text style={styles.scheduleDayText}>{day}</Text>
              </View>
              {TIME_BLOCKS.map((block) => {
                const active = schedule[day][block];
                return (
                  <TouchableOpacity
                    key={block}
                    style={[styles.scheduleCell, active && styles.scheduleCellActive]}
                    onPress={() => toggleBlock(day, block)}
                    activeOpacity={0.7}
                  >
                    {active && <Text style={styles.scheduleCellCheck}>&#10003;</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          <Text style={styles.blocksCount}>
            {activeBlocksCount} blocks selected
          </Text>
        </View>

        {/* How It Works */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>
          <View style={styles.infoStep}>
            <View style={styles.infoStepDot}>
              <Text style={styles.infoStepNum}>1</Text>
            </View>
            <Text style={styles.infoStepText}>Commit your available hours</Text>
          </View>
          <View style={styles.infoStep}>
            <View style={styles.infoStepDot}>
              <Text style={styles.infoStepNum}>2</Text>
            </View>
            <Text style={styles.infoStepText}>Get matched with patients automatically</Text>
          </View>
          <View style={styles.infoStep}>
            <View style={styles.infoStepDot}>
              <Text style={styles.infoStepNum}>3</Text>
            </View>
            <Text style={styles.infoStepText}>Earn per session based on outcomes</Text>
          </View>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() =>
            navigation.navigate('HealerCommitted', { hoursPerWeek, schedule })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start</Text>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: T.text,
    paddingTop: 16,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: T.text,
  },
  cardSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 24,
  },
  sliderBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderBtnText: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: T.accent,
  },
  sliderValue: {
    alignItems: 'center',
  },
  sliderValueText: {
    fontFamily: fonts.headingBold,
    fontSize: 40,
    color: T.accent,
  },
  sliderValueUnit: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    marginTop: -4,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: T.border,
    borderRadius: 3,
    marginTop: 20,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: T.accent,
    borderRadius: 3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  sliderLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: T.textDim,
  },
  scheduleHeader: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  scheduleCorner: {
    width: 48,
  },
  scheduleColHeader: {
    flex: 1,
    alignItems: 'center',
  },
  scheduleColLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: T.textMuted,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  scheduleDayLabel: {
    width: 48,
  },
  scheduleDayText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.text,
  },
  scheduleCell: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  scheduleCellActive: {
    backgroundColor: T.accentDim,
    borderColor: T.accent,
  },
  scheduleCellCheck: {
    fontSize: 14,
    color: T.accent,
    fontWeight: '700',
  },
  blocksCount: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
    marginTop: 12,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: T.accentDim,
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: T.accent,
    marginBottom: 16,
  },
  infoStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  infoStepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoStepNum: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  infoStepText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  startButton: {
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
