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
import Button from '../../components/shared/Button';

export default function ConsentScreen({ navigation }) {
  const [consented, setConsented] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Research Consent</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Study</Text>
          <Text style={styles.bodyText}>
            Your session is part of an ongoing study with UC Irvine (UCI) to
            evaluate the effectiveness of energy healing. By participating, you
            help advance our understanding of this emerging field.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Privacy</Text>
          <Text style={styles.bodyText}>
            Your data is anonymized and stored securely. No personally
            identifiable information will be shared with researchers. All
            session data is encrypted in transit and at rest.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voluntary Participation</Text>
          <Text style={styles.bodyText}>
            You may withdraw at any time without penalty. If you choose to
            withdraw, your data will be removed from the study. You can
            continue using Ennie even if you decline to participate in
            research.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Measured Outcomes</Text>
          <Text style={styles.bodyText}>
            Sessions are measured, not placebo -- real outcomes. We track your
            symptom severity before, during, and after each session to provide
            transparent, evidence-based results. You will see your own data
            in real time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IRB Approval</Text>
          <Text style={styles.bodyText}>
            This study has been reviewed and approved by the University of
            California, Irvine Institutional Review Board (IRB). Protocol
            #HS-2024-0847. If you have questions about your rights as a
            research participant, contact UCI's IRB at (949) 824-0665.
          </Text>
        </View>
      </ScrollView>

      {/* Consent checkbox + button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setConsented(!consented)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              consented && styles.checkboxChecked,
            ]}
          >
            {consented && <Text style={styles.checkmark}>{'  '}</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I consent to participate in this research study
          </Text>
        </TouchableOpacity>

        <Button
          title="Continue"
          onPress={() => navigation.navigate('Intake')}
          disabled={!consented}
          style={styles.continueBtn}
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
  headerRow: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: T.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
    marginBottom: 8,
  },
  bodyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: T.border,
    backgroundColor: T.bg,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: T.accent,
    borderColor: T.accent,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.text,
  },
  continueBtn: {},
});
