import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const CONDITIONS = [
  { id: 'arthritis', name: 'Arthritis', icon: '\u{1F9B4}', demand: 'High', avgSuccess: 71 },
  { id: 'migraine', name: 'Migraine', icon: '\u{1F4A0}', demand: 'Very High', avgSuccess: 68 },
  { id: 'chronic_back', name: 'Chronic Back Pain', icon: '\u{1F3CB}', demand: 'Very High', avgSuccess: 65 },
  { id: 'fibromyalgia', name: 'Fibromyalgia', icon: '\u{2728}', demand: 'High', avgSuccess: 58 },
  { id: 'neuropathy', name: 'Neuropathy', icon: '\u{26A1}', demand: 'Medium', avgSuccess: 52 },
  { id: 'anxiety', name: 'Anxiety', icon: '\u{1F9E0}', demand: 'Very High', avgSuccess: 72 },
  { id: 'emotional_trauma', name: 'Emotional Trauma', icon: '\u{1F49C}', demand: 'High', avgSuccess: 63 },
  { id: 'chronic_pain', name: 'Chronic Pain', icon: '\u{1F525}', demand: 'Very High', avgSuccess: 60 },
];

export default function SkillBuildScreen({ navigation }) {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (condition) => {
    setSelected(condition);
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    navigation.navigate('HealerHome');
  };

  const getDemandColor = (demand) => {
    if (demand === 'Very High') return T.green;
    if (demand === 'High') return T.warm;
    return T.textMuted;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Choose a Condition to Specialize In</Text>
        <Text style={styles.subtitle}>
          Build expertise in a specific condition to earn verification and higher match priority
        </Text>

        <View style={styles.grid}>
          {CONDITIONS.map((condition) => (
            <TouchableOpacity
              key={condition.id}
              style={styles.conditionCard}
              onPress={() => handleSelect(condition)}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconWrap}>
                <Text style={styles.cardIcon}>{condition.icon}</Text>
              </View>
              <Text style={styles.cardName}>{condition.name}</Text>
              <View style={styles.cardMeta}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Demand</Text>
                  <Text style={[styles.metaValue, { color: getDemandColor(condition.demand) }]}>
                    {condition.demand}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Avg Success</Text>
                  <Text style={styles.metaValue}>{condition.avgSuccess}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Confirm Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconWrap}>
              <Text style={styles.modalIcon}>{selected?.icon}</Text>
            </View>
            <Text style={styles.modalTitle}>{selected?.name}</Text>
            <Text style={styles.modalBody}>
              You'll need 50+ sessions with 75%+ success rate to earn verification in this condition.
            </Text>
            <View style={styles.modalStats}>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatValue}>50+</Text>
                <Text style={styles.modalStatLabel}>sessions needed</Text>
              </View>
              <View style={styles.modalStatDivider} />
              <View style={styles.modalStat}>
                <Text style={styles.modalStatValue}>75%+</Text>
                <Text style={styles.modalStatLabel}>success rate</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalConfirm}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.modalConfirmText}>Start Building This Skill</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  conditionCard: {
    width: '48%',
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 18,
    alignItems: 'center',
  },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardMeta: {
    width: '100%',
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: T.textDim,
  },
  metaValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: T.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: T.bg,
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalIcon: {
    fontSize: 30,
  },
  modalTitle: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: T.text,
    marginBottom: 8,
  },
  modalBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  modalStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 24,
    width: '100%',
  },
  modalStat: {
    flex: 1,
    alignItems: 'center',
  },
  modalStatValue: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: T.accent,
  },
  modalStatLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
  },
  modalStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: T.border,
  },
  modalConfirm: {
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalConfirmText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalCancel: {
    paddingVertical: 10,
  },
  modalCancelText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.textMuted,
  },
});
