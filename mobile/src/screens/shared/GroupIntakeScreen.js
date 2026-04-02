import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const { width } = Dimensions.get('window');

const CONDITIONS = [
  'Headache / Migraine',
  'Back Pain',
  'Neck / Shoulder',
  'Joint Pain',
  'Stomach / Digestive',
  'Anxiety / Stress',
  'Chronic Fatigue',
  'Emotional Pain',
  'Other',
];

const DURATIONS = [
  'Just started',
  'Days',
  'Weeks',
  'Months',
  'Years',
];

const BODY_REGIONS = [
  { id: 'head', label: 'Head', top: '5%', left: '42%' },
  { id: 'neck', label: 'Neck', top: '15%', left: '42%' },
  { id: 'shoulder_l', label: 'L Shoulder', top: '20%', left: '22%' },
  { id: 'shoulder_r', label: 'R Shoulder', top: '20%', left: '62%' },
  { id: 'chest', label: 'Chest', top: '28%', left: '42%' },
  { id: 'abdomen', label: 'Abdomen', top: '40%', left: '42%' },
  { id: 'back', label: 'Back', top: '35%', left: '42%' },
  { id: 'hip_l', label: 'L Hip', top: '50%', left: '28%' },
  { id: 'hip_r', label: 'R Hip', top: '50%', left: '56%' },
  { id: 'knee_l', label: 'L Knee', top: '68%', left: '32%' },
  { id: 'knee_r', label: 'R Knee', top: '68%', left: '52%' },
  { id: 'foot_l', label: 'L Foot', top: '88%', left: '32%' },
  { id: 'foot_r', label: 'R Foot', top: '88%', left: '52%' },
];

export default function GroupIntakeScreen({ navigation, route }) {
  const session = route?.params?.session;
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState(null);

  const toggleRegion = (id) => {
    setSelectedRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const canContinue = selectedCondition && duration;

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

        <Text style={styles.title}>Quick Symptom Check</Text>
        <Text style={styles.subtitle}>
          Help your healer focus on what matters most.
        </Text>

        {/* Body map */}
        <Text style={styles.sectionTitle}>Where do you feel it?</Text>
        <View style={styles.bodyMapContainer}>
          {/* Simple body outline */}
          <View style={styles.bodyOutline}>
            <View style={styles.bodyHead} />
            <View style={styles.bodyTorso} />
            <View style={styles.bodyLegL} />
            <View style={styles.bodyLegR} />
            <View style={styles.bodyArmL} />
            <View style={styles.bodyArmR} />
          </View>

          {/* Tappable regions */}
          {BODY_REGIONS.map((region) => (
            <TouchableOpacity
              key={region.id}
              style={[
                styles.regionDot,
                { top: region.top, left: region.left },
                selectedRegions.includes(region.id) && styles.regionDotActive,
              ]}
              onPress={() => toggleRegion(region.id)}
            >
              <View
                style={[
                  styles.regionInner,
                  selectedRegions.includes(region.id) &&
                    styles.regionInnerActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
        {selectedRegions.length > 0 && (
          <View style={styles.selectedRegions}>
            {selectedRegions.map((id) => {
              const region = BODY_REGIONS.find((r) => r.id === id);
              return (
                <View key={id} style={styles.regionChip}>
                  <Text style={styles.regionChipText}>{region?.label}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Condition selector */}
        <Text style={styles.sectionTitle}>What's your main issue?</Text>
        <View style={styles.conditionGrid}>
          {CONDITIONS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.conditionBtn,
                selectedCondition === c && styles.conditionBtnActive,
              ]}
              onPress={() => setSelectedCondition(c)}
            >
              <Text
                style={[
                  styles.conditionText,
                  selectedCondition === c && styles.conditionTextActive,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Severity slider */}
        <Text style={styles.sectionTitle}>
          Severity: {severity}/10
        </Text>
        <View style={styles.severityRow}>
          {Array.from({ length: 11 }, (_, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.severityDot,
                severity === i && styles.severityDotActive,
                i <= 3 && { backgroundColor: severity === i ? T.green : T.greenDim },
                i >= 4 && i <= 6 && { backgroundColor: severity === i ? T.warm : T.warmDim },
                i >= 7 && { backgroundColor: severity === i ? T.danger : T.dangerDim },
              ]}
              onPress={() => setSeverity(i)}
            >
              <Text
                style={[
                  styles.severityNum,
                  severity === i && styles.severityNumActive,
                ]}
              >
                {i}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.severityLabels}>
          <Text style={styles.severityLabel}>No pain</Text>
          <Text style={styles.severityLabel}>Worst pain</Text>
        </View>

        {/* Duration */}
        <Text style={styles.sectionTitle}>How long have you had this?</Text>
        <View style={styles.durationRow}>
          {DURATIONS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.durationBtn,
                duration === d && styles.durationBtnActive,
              ]}
              onPress={() => setDuration(d)}
            >
              <Text
                style={[
                  styles.durationText,
                  duration === d && styles.durationTextActive,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.continueBtn, !canContinue && styles.continueBtnDisabled]}
          activeOpacity={0.8}
          disabled={!canContinue}
          onPress={() =>
            navigation.navigate('GroupSession', {
              session,
              intake: {
                regions: selectedRegions,
                condition: selectedCondition,
                severity,
                duration,
              },
            })
          }
        >
          <Text style={styles.continueBtnText}>Continue</Text>
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
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: T.text,
    marginBottom: 12,
    marginTop: 8,
  },
  bodyMapContainer: {
    width: '100%',
    height: width * 0.9,
    backgroundColor: T.accentDim,
    borderRadius: 20,
    position: 'relative',
    marginBottom: 12,
    overflow: 'hidden',
  },
  bodyOutline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: T.border,
    position: 'absolute',
    top: '8%',
  },
  bodyTorso: {
    width: 60,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: T.border,
    position: 'absolute',
    top: '22%',
  },
  bodyLegL: {
    width: 24,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: T.border,
    position: 'absolute',
    top: '55%',
    left: '38%',
  },
  bodyLegR: {
    width: 24,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: T.border,
    position: 'absolute',
    top: '55%',
    right: '38%',
  },
  bodyArmL: {
    width: 20,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: T.border,
    position: 'absolute',
    top: '24%',
    left: '25%',
    transform: [{ rotate: '10deg' }],
  },
  bodyArmR: {
    width: 20,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: T.border,
    position: 'absolute',
    top: '24%',
    right: '25%',
    transform: [{ rotate: '-10deg' }],
  },
  regionDot: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -15,
    marginTop: -15,
  },
  regionDotActive: {
    backgroundColor: 'rgba(139,63,255,0.15)',
  },
  regionInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: T.border,
  },
  regionInnerActive: {
    backgroundColor: T.accent,
  },
  selectedRegions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  regionChip: {
    backgroundColor: T.accentDim,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  regionChipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.accent,
  },
  conditionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  conditionBtn: {
    backgroundColor: T.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  conditionBtnActive: {
    backgroundColor: T.accentDim,
    borderColor: T.accent,
  },
  conditionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.text,
  },
  conditionTextActive: {
    color: T.accent,
  },
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  severityDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityDotActive: {
    transform: [{ scale: 1.15 }],
  },
  severityNum: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: T.textMuted,
  },
  severityNumActive: {
    color: '#FFFFFF',
    fontFamily: fonts.bodyBold,
  },
  severityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  severityLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
  },
  durationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  durationBtn: {
    backgroundColor: T.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  durationBtnActive: {
    backgroundColor: T.accentDim,
    borderColor: T.accent,
  },
  durationText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.text,
  },
  durationTextActive: {
    color: T.accent,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: T.border,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  continueBtn: {
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnDisabled: {
    opacity: 0.4,
  },
  continueBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
