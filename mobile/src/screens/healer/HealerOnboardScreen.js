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

const LANGUAGES = ['English', 'Spanish', 'Mandarin', 'Hindi', 'French', 'Arabic', 'Portuguese', 'Japanese'];
const MODALITIES = ['Energy Healing', 'Reiki', 'Pranic', 'Intuitive', 'Other'];
const TIMEZONES = [
  'US/Eastern (ET)',
  'US/Central (CT)',
  'US/Mountain (MT)',
  'US/Pacific (PT)',
  'Europe/London (GMT)',
  'Europe/Paris (CET)',
  'Asia/Tokyo (JST)',
  'Australia/Sydney (AEST)',
];
const EXPERIENCE_LEVELS = ['New', '1-3 years', '3-10 years', '10+ years'];

const SCENARIO_QUESTION = 'A patient reports migraine pain at 7/10. What do you do?';
const SCENARIO_OPTIONS = [
  {
    id: 'a',
    text: 'Immediately tell them you can cure it',
    correct: false,
  },
  {
    id: 'b',
    text: 'Acknowledge their pain, begin a scanning technique, and ask them to report any changes',
    correct: true,
  },
  {
    id: 'c',
    text: 'Recommend they see a doctor instead',
    correct: false,
  },
  {
    id: 'd',
    text: 'Skip assessment and jump to energy work',
    correct: false,
  },
];

const STEP_TITLES = [
  'Languages',
  'Modality',
  'Timezone',
  'Experience',
  'Training',
];

export default function HealerOnboardScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedModality, setSelectedModality] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [scenarioAnswer, setScenarioAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const totalSteps = 5;

  const toggleLanguage = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0: return selectedLanguages.length > 0;
      case 1: return selectedModality !== null;
      case 2: return selectedTimezone !== null;
      case 3: return selectedExperience !== null;
      case 4: return scenarioAnswer !== null;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 4) {
      if (!showExplanation) {
        setShowExplanation(true);
        return;
      }
      navigation.navigate('HealerHome');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    setShowExplanation(false);
    setStep((prev) => prev - 1);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((step + 1) / totalSteps) * 100}%` },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        Step {step + 1} of {totalSteps}: {STEP_TITLES[step]}
      </Text>
    </View>
  );

  const renderStep0 = () => (
    <View>
      <Text style={styles.stepTitle}>What languages do you speak?</Text>
      <Text style={styles.stepSubtitle}>Select all that apply</Text>
      <View style={styles.optionGrid}>
        {LANGUAGES.map((lang) => {
          const selected = selectedLanguages.includes(lang);
          return (
            <TouchableOpacity
              key={lang}
              style={[styles.checkbox, selected && styles.checkboxSelected]}
              onPress={() => toggleLanguage(lang)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkboxIcon, selected && styles.checkboxIconSelected]}>
                {selected && <Text style={styles.checkboxCheck}>&#10003;</Text>}
              </View>
              <Text style={[styles.checkboxLabel, selected && styles.checkboxLabelSelected]}>
                {lang}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>What is your healing modality?</Text>
      <Text style={styles.stepSubtitle}>Select your primary practice</Text>
      {MODALITIES.map((mod) => (
        <TouchableOpacity
          key={mod}
          style={[styles.radioOption, selectedModality === mod && styles.radioOptionSelected]}
          onPress={() => setSelectedModality(mod)}
          activeOpacity={0.7}
        >
          <View style={[styles.radioCircle, selectedModality === mod && styles.radioCircleSelected]}>
            {selectedModality === mod && <View style={styles.radioDot} />}
          </View>
          <Text style={[styles.radioLabel, selectedModality === mod && styles.radioLabelSelected]}>
            {mod}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>What is your timezone?</Text>
      <Text style={styles.stepSubtitle}>This helps us match you with patients</Text>
      {TIMEZONES.map((tz) => (
        <TouchableOpacity
          key={tz}
          style={[styles.radioOption, selectedTimezone === tz && styles.radioOptionSelected]}
          onPress={() => setSelectedTimezone(tz)}
          activeOpacity={0.7}
        >
          <View style={[styles.radioCircle, selectedTimezone === tz && styles.radioCircleSelected]}>
            {selectedTimezone === tz && <View style={styles.radioDot} />}
          </View>
          <Text style={[styles.radioLabel, selectedTimezone === tz && styles.radioLabelSelected]}>
            {tz}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Your experience level</Text>
      <Text style={styles.stepSubtitle}>How long have you been practicing?</Text>
      {EXPERIENCE_LEVELS.map((level) => (
        <TouchableOpacity
          key={level}
          style={[styles.radioOption, selectedExperience === level && styles.radioOptionSelected]}
          onPress={() => setSelectedExperience(level)}
          activeOpacity={0.7}
        >
          <View style={[styles.radioCircle, selectedExperience === level && styles.radioCircleSelected]}>
            {selectedExperience === level && <View style={styles.radioDot} />}
          </View>
          <Text style={[styles.radioLabel, selectedExperience === level && styles.radioLabelSelected]}>
            {level}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.stepTitle}>Training Scenario</Text>
      <Text style={styles.stepSubtitle}>Let's see how you'd handle a real session</Text>
      <View style={styles.scenarioCard}>
        <Text style={styles.scenarioQuestion}>{SCENARIO_QUESTION}</Text>
      </View>
      {SCENARIO_OPTIONS.map((opt) => {
        const isSelected = scenarioAnswer === opt.id;
        const showResult = showExplanation;
        const isCorrect = opt.correct;
        return (
          <TouchableOpacity
            key={opt.id}
            style={[
              styles.scenarioOption,
              isSelected && styles.scenarioOptionSelected,
              showResult && isSelected && isCorrect && styles.scenarioOptionCorrect,
              showResult && isSelected && !isCorrect && styles.scenarioOptionWrong,
              showResult && !isSelected && isCorrect && styles.scenarioOptionCorrect,
            ]}
            onPress={() => {
              if (!showExplanation) {
                setScenarioAnswer(opt.id);
              }
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.scenarioOptionText,
                isSelected && styles.scenarioOptionTextSelected,
              ]}
            >
              {opt.id.toUpperCase()}. {opt.text}
            </Text>
          </TouchableOpacity>
        );
      })}
      {showExplanation && (
        <View style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>What Ennie Expects</Text>
          <Text style={styles.explanationBody}>
            At Ennie, healers acknowledge the patient's reported pain level, begin with
            a scanning technique, and continuously ask the patient to report changes.
            We measure everything — your effectiveness is tracked by real patient outcomes.
            Never make promises, and always work within the measurement framework.
          </Text>
        </View>
      )}
    </View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 0: return renderStep0();
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {renderProgressBar()}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>
      <View style={styles.footer}>
        {step > 0 ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {step === 4 && showExplanation ? 'Finish' : step === 4 ? 'Submit' : 'Next'}
          </Text>
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: T.accent,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: T.textMuted,
    marginTop: 8,
  },
  stepTitle: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: T.text,
    marginTop: 24,
  },
  stepSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 6,
    marginBottom: 24,
  },
  optionGrid: {
    gap: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
  },
  checkboxSelected: {
    borderColor: T.accent,
    backgroundColor: T.accentDim,
  },
  checkboxIcon: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxIconSelected: {
    borderColor: T.accent,
    backgroundColor: T.accent,
  },
  checkboxCheck: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  checkboxLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.text,
  },
  checkboxLabelSelected: {
    color: T.accent,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 10,
  },
  radioOptionSelected: {
    borderColor: T.accent,
    backgroundColor: T.accentDim,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: T.accent,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: T.accent,
  },
  radioLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.text,
  },
  radioLabelSelected: {
    color: T.accent,
  },
  scenarioCard: {
    backgroundColor: T.accentDim,
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
  },
  scenarioQuestion: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
    lineHeight: 24,
  },
  scenarioOption: {
    backgroundColor: T.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 10,
  },
  scenarioOptionSelected: {
    borderColor: T.accent,
    backgroundColor: T.accentDim,
  },
  scenarioOptionCorrect: {
    borderColor: T.green,
    backgroundColor: T.greenDim,
  },
  scenarioOptionWrong: {
    borderColor: T.danger,
    backgroundColor: T.dangerDim,
  },
  scenarioOptionText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    lineHeight: 20,
  },
  scenarioOptionTextSelected: {
    fontFamily: fonts.bodyMedium,
  },
  explanationCard: {
    backgroundColor: T.greenDim,
    borderRadius: 14,
    padding: 20,
    marginTop: 8,
  },
  explanationTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: T.green,
    marginBottom: 8,
  },
  explanationBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    lineHeight: 21,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
    gap: 12,
  },
  backButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.textMuted,
  },
  backPlaceholder: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
    backgroundColor: T.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});
