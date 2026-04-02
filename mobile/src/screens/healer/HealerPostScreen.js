import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const TECHNIQUE_TAGS = [
  'Scanning', 'Energy Work', 'Focus', 'Release', 'Grounding',
  'Chakra Balancing', 'Aura Cleansing', 'Visualization', 'Breathwork',
];

const DIFFICULTY_LABELS = ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult'];

export default function HealerPostScreen({ navigation, route }) {
  const severityBefore = route?.params?.severityBefore || 7;
  const severityAfter = route?.params?.severityAfter || 3;
  const elapsed = route?.params?.elapsed || 1800;

  const improvement = Math.round(((severityBefore - severityAfter) / severityBefore) * 100);

  const [selectedTechniques, setSelectedTechniques] = useState([]);
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState(null);
  const [concerns, setConcerns] = useState('');

  const sessionEarnings = 30;

  const toggleTechnique = (tech) => {
    setSelectedTechniques((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    return `${m} min`;
  };

  const getImprovementColor = () => {
    if (improvement >= 50) return T.green;
    if (improvement >= 25) return T.warm;
    return T.danger;
  };

  const handleSubmit = () => {
    navigation.navigate('HealerHome');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Session Summary</Text>

        {/* Outcome Card */}
        <View style={styles.outcomeCard}>
          <View style={styles.outcomeRow}>
            <View style={styles.outcomeItem}>
              <Text style={styles.outcomeLabel}>Before</Text>
              <View style={[styles.outcomeBadge, { backgroundColor: T.dangerDim }]}>
                <Text style={[styles.outcomeBadgeText, { color: T.danger }]}>
                  {severityBefore}/10
                </Text>
              </View>
            </View>
            <View style={styles.outcomeArrow}>
              <Text style={styles.outcomeArrowText}>&#8594;</Text>
            </View>
            <View style={styles.outcomeItem}>
              <Text style={styles.outcomeLabel}>After</Text>
              <View style={[styles.outcomeBadge, { backgroundColor: T.greenDim }]}>
                <Text style={[styles.outcomeBadgeText, { color: T.green }]}>
                  {severityAfter}/10
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.improvementDisplay}>
            <Text style={[styles.improvementPct, { color: getImprovementColor() }]}>
              {improvement}%
            </Text>
            <Text style={styles.improvementLabel}>improvement</Text>
          </View>

          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Session duration</Text>
            <Text style={styles.durationValue}>{formatDuration(elapsed)}</Text>
          </View>
        </View>

        {/* Techniques Used */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What techniques did you use?</Text>
          <View style={styles.tagGrid}>
            {TECHNIQUE_TAGS.map((tech) => {
              const selected = selectedTechniques.includes(tech);
              return (
                <TouchableOpacity
                  key={tech}
                  style={[styles.tag, selected && styles.tagSelected]}
                  onPress={() => toggleTechnique(tech)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
                    {tech}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Session Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Notes</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe what happened during the session..."
            placeholderTextColor={T.textDim}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        {/* Difficulty Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty Level</Text>
          <View style={styles.difficultyRow}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.difficultyItem,
                  difficulty === level && styles.difficultyItemSelected,
                ]}
                onPress={() => setDifficulty(level)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.difficultyNum,
                    difficulty === level && styles.difficultyNumSelected,
                  ]}
                >
                  {level}
                </Text>
                <Text
                  style={[
                    styles.difficultyLabel,
                    difficulty === level && styles.difficultyLabelSelected,
                  ]}
                >
                  {DIFFICULTY_LABELS[level - 1]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Concerns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Any Concerns?</Text>
          <Text style={styles.sectionSubtitle}>Optional</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Note anything unusual or concerning..."
            placeholderTextColor={T.textDim}
            multiline
            numberOfLines={3}
            value={concerns}
            onChangeText={setConcerns}
            textAlignVertical="top"
          />
        </View>

        {/* Earnings */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Earnings for this session</Text>
          <Text style={styles.earningsValue}>${sessionEarnings}.00</Text>
          <Text style={styles.earningsMeta}>
            Based on session completion and patient outcome
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
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
    marginBottom: 20,
  },
  outcomeCard: {
    backgroundColor: T.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  outcomeItem: {
    alignItems: 'center',
    gap: 8,
  },
  outcomeLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.textMuted,
  },
  outcomeBadge: {
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  outcomeBadgeText: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
  },
  outcomeArrow: {
    marginTop: 20,
  },
  outcomeArrowText: {
    fontSize: 24,
    color: T.textDim,
  },
  improvementDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  improvementPct: {
    fontFamily: fonts.headingBold,
    fontSize: 48,
  },
  improvementLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: -4,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  durationLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  durationValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: T.text,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
    marginTop: -8,
    marginBottom: 12,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: T.surface,
  },
  tagSelected: {
    backgroundColor: T.accentDim,
    borderColor: T.accent,
  },
  tagText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.textMuted,
  },
  tagTextSelected: {
    color: T.accent,
  },
  textArea: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    minHeight: 100,
    backgroundColor: T.surface,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyItem: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: T.surface,
  },
  difficultyItemSelected: {
    backgroundColor: T.accentDim,
    borderColor: T.accent,
  },
  difficultyNum: {
    fontFamily: fonts.headingBold,
    fontSize: 18,
    color: T.text,
  },
  difficultyNumSelected: {
    color: T.accent,
  },
  difficultyLabel: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: T.textDim,
    marginTop: 2,
    textAlign: 'center',
  },
  difficultyLabelSelected: {
    color: T.accent,
  },
  earningsCard: {
    backgroundColor: T.greenDim,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  earningsLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  earningsValue: {
    fontFamily: fonts.headingBold,
    fontSize: 40,
    color: T.green,
    marginVertical: 4,
  },
  earningsMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  submitButton: {
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
