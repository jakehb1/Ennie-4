import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';

export default function AgeGateScreen({ navigation }) {
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const validateAge = () => {
    setError('');

    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    const y = parseInt(year, 10);

    if (!m || !d || !y || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2026) {
      setError('Please enter a valid date of birth');
      return;
    }

    const dob = new Date(y, m - 1, d);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 13) {
      setError('You must be at least 13 years old to use Ennie. Please ask a parent or guardian for help.');
      return;
    }

    navigation.navigate('Consent');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Before we begin</Text>
          <Text style={styles.subtitle}>
            Please enter your date of birth. You must be at least 13 years
            old to use Ennie.
          </Text>

          <View style={styles.dobRow}>
            <View style={styles.dobField}>
              <Input
                label="Month"
                placeholder="MM"
                value={month}
                onChangeText={(t) => setMonth(t.replace(/[^0-9]/g, '').slice(0, 2))}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
            <View style={styles.dobField}>
              <Input
                label="Day"
                placeholder="DD"
                value={day}
                onChangeText={(t) => setDay(t.replace(/[^0-9]/g, '').slice(0, 2))}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
            <View style={styles.dobFieldYear}>
              <Input
                label="Year"
                placeholder="YYYY"
                value={year}
                onChangeText={(t) => setYear(t.replace(/[^0-9]/g, '').slice(0, 4))}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button
            title="Continue"
            onPress={validateAge}
            style={styles.continueBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 28,
    color: T.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.textMuted,
    marginTop: 8,
    marginBottom: 32,
    lineHeight: 22,
  },
  dobRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dobField: {
    flex: 1,
  },
  dobFieldYear: {
    flex: 1.4,
  },
  errorBox: {
    backgroundColor: T.dangerDim,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.danger,
    lineHeight: 20,
  },
  continueBtn: {
    marginTop: 32,
  },
});
