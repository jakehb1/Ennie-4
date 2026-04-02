import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';
import { useApp } from '../../context/AppContext';
import BodyMap from '../../components/shared/BodyMap';
import Slider from '../../components/shared/Slider';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';

const STATUS_OPTIONS = ['Still better', 'Back to baseline', 'Worse'];

export default function FollowUpScreen({ navigation }) {
  const { finalPins, pins, updatePin } = useApp();
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleSubmit = () => {
    Alert.alert(
      'Thank you',
      'Your follow-up has been recorded. This data helps improve healing outcomes for everyone.',
      [{ text: 'OK', onPress: () => navigation.navigate('PatientTabs') }],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>24-Hour Follow-Up</Text>
        <Text style={styles.subtitle}>
          How are your symptoms now? This helps us track lasting improvement.
        </Text>

        {/* Body map */}
        <View style={styles.bodyMapSection}>
          <BodyMap pins={pins.length > 0 ? pins : finalPins} side="front" interactive={false} />
        </View>

        {/* Severity per pin */}
        <Text style={styles.sectionTitle}>Rate your current symptoms</Text>
        {(pins.length > 0 ? pins : finalPins).map((pin) => (
          <Card key={pin.id} style={styles.pinCard}>
            <View style={styles.pinHeader}>
              <Text style={styles.pinLabel}>
                {pin.label || pin.area || `Area ${pin.id}`}
              </Text>
              <Text style={styles.pinSeverity}>
                {pin.severity || 5}/10
              </Text>
            </View>
            <Slider
              value={pin.severity || 5}
              onValueChange={(val) =>
                updatePin(pin.id, { severity: Math.round(val) })
              }
              minimumValue={0}
              maximumValue={10}
              step={1}
            />
          </Card>
        ))}

        {/* Comparison status */}
        <Text style={styles.sectionTitle}>
          Compared to right after your session...
        </Text>
        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.statusBtn,
                selectedStatus === opt && styles.statusBtnActive,
                opt === 'Still better' &&
                  selectedStatus === opt && { backgroundColor: T.greenDim, borderColor: T.green },
                opt === 'Back to baseline' &&
                  selectedStatus === opt && { backgroundColor: T.warmDim, borderColor: T.warm },
                opt === 'Worse' &&
                  selectedStatus === opt && { backgroundColor: T.dangerDim, borderColor: T.danger },
              ]}
              onPress={() => setSelectedStatus(opt)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.statusText,
                  selectedStatus === opt && styles.statusTextActive,
                  opt === 'Still better' &&
                    selectedStatus === opt && { color: T.green },
                  opt === 'Back to baseline' &&
                    selectedStatus === opt && { color: T.warm },
                  opt === 'Worse' &&
                    selectedStatus === opt && { color: T.danger },
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Submit Follow-Up"
          onPress={handleSubmit}
          style={styles.submitBtn}
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
  bodyMapSection: {
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
    marginBottom: 14,
  },
  pinCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 10,
  },
  pinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pinLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.text,
  },
  pinSeverity: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.accent,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: 'center',
  },
  statusBtnActive: {
    borderColor: T.accent,
    backgroundColor: T.accentDim,
  },
  statusText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.textMuted,
    textAlign: 'center',
  },
  statusTextActive: {
    color: T.accent,
  },
  submitBtn: {},
});
