import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';
import { useApp } from '../../context/AppContext';
import BodyMap from '../../components/shared/BodyMap';
import Slider from '../../components/shared/Slider';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';

const CONFIRM_SECONDS = 200; // 3:20

export default function SymptomConfirmScreen({ navigation }) {
  const { pins, updatePin, captureBaseline } = useApp();
  const [timeLeft, setTimeLeft] = useState(CONFIRM_SECONDS);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          Alert.alert(
            'Time expired',
            'You did not confirm in time. Returning to queue.',
            [{ text: 'OK', onPress: () => navigation.navigate('Queue') }],
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [navigation]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    clearInterval(timerRef.current);
    captureBaseline();
    navigation.navigate('Connecting');
  };

  const isUrgent = timeLeft < 60;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Confirm Your Symptoms</Text>
        <View
          style={[
            styles.timerBadge,
            isUrgent && styles.timerBadgeUrgent,
          ]}
        >
          <Text
            style={[
              styles.timerText,
              isUrgent && styles.timerTextUrgent,
            ]}
          >
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Warning text */}
        <Card style={styles.warningCard}>
          <Text style={styles.warningText}>
            Please confirm your symptoms before your session starts. If you
            don't confirm in time, you'll return to the queue.
          </Text>
        </Card>

        {/* Body map */}
        <View style={styles.bodyMapSection}>
          <Text style={styles.sectionTitle}>Your symptom locations</Text>
          <BodyMap pins={pins} side="front" interactive={false} />
        </View>

        {/* Symptom list with adjustable severity */}
        <Text style={styles.sectionTitle}>Adjust severity if needed</Text>
        {pins.length === 0 && (
          <Text style={styles.noPins}>No symptoms marked</Text>
        )}
        {pins.map((pin) => (
          <Card key={pin.id} style={styles.symptomCard}>
            <View style={styles.symptomRow}>
              <Text style={styles.symptomLabel}>
                {pin.label || pin.area || `Area ${pin.id}`}
              </Text>
              <Text style={styles.symptomSeverity}>
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
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Confirm & Start Session"
          onPress={handleConfirm}
        />
      </View>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: T.text,
    flex: 1,
  },
  timerBadge: {
    backgroundColor: T.accentDim,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  timerBadgeUrgent: {
    backgroundColor: T.dangerDim,
  },
  timerText: {
    fontFamily: fonts.headingBold,
    fontSize: 18,
    color: T.accent,
  },
  timerTextUrgent: {
    color: T.danger,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },
  warningCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.warm,
    backgroundColor: T.warmDim,
    marginBottom: 20,
  },
  warningText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    lineHeight: 20,
  },
  bodyMapSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
    marginBottom: 12,
  },
  noPins: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textDim,
    textAlign: 'center',
    paddingVertical: 20,
  },
  symptomCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 10,
  },
  symptomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  symptomLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.text,
  },
  symptomSeverity: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.accent,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 16,
    backgroundColor: T.bg,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
});
