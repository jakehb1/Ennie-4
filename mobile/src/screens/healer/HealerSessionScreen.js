import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const SESSION_DURATION = 30 * 60; // 30 minutes in seconds
const TECHNIQUES = ['Scanning', 'Energy Work', 'Focus', 'Release', 'Grounding'];
const PHASES = ['Warm-up', 'Active', 'Wind-down'];

const BODY_PINS = [
  { id: 'head', label: 'Head', top: '8%', left: '50%', severity: 7 },
  { id: 'neck', label: 'Neck', top: '16%', left: '50%', severity: 4 },
];

const MOCK_MESSAGES = [
  { id: '1', from: 'patient', text: 'I can feel the pressure in my temples.', time: '0:45' },
  { id: '2', from: 'healer', text: 'Focus on that area. Let me know if it shifts.', time: '1:10' },
];

export default function HealerSessionScreen({ navigation, route }) {
  const patient = route?.params?.patient || { condition: 'Migraine', severity: '7/10' };

  const [elapsed, setElapsed] = useState(0);
  const [activeTechnique, setActiveTechnique] = useState(null);
  const [techniqueTimer, setTechniqueTimer] = useState(0);
  const [currentSeverity, setCurrentSeverity] = useState(7);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [micOn, setMicOn] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        // Phase transitions
        if (next >= SESSION_DURATION * 0.7) setCurrentPhase(2);
        else if (next >= SESSION_DURATION * 0.15) setCurrentPhase(1);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Technique timer
  useEffect(() => {
    if (!activeTechnique) {
      setTechniqueTimer(0);
      return;
    }
    const timer = setInterval(() => {
      setTechniqueTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTechnique]);

  // Timer ring pulse
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const remainingTime = Math.max(0, SESSION_DURATION - elapsed);
  const progressPct = (elapsed / SESSION_DURATION) * 100;

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        from: 'healer',
        text: inputText.trim(),
        time: formatTime(elapsed),
      },
    ]);
    setInputText('');
  };

  const handleTechniquePress = (technique) => {
    if (activeTechnique === technique) {
      setActiveTechnique(null);
    } else {
      setActiveTechnique(technique);
      setTechniqueTimer(0);
    }
  };

  const handleReassess = () => {
    // Simulate patient re-rating
    setTimeout(() => {
      const newSeverity = Math.max(1, currentSeverity - Math.floor(Math.random() * 3));
      setCurrentSeverity(newSeverity);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          from: 'patient',
          text: `Re-assessed: my pain is now ${newSeverity}/10`,
          time: formatTime(elapsed),
        },
      ]);
    }, 2000);
  };

  const handleEndSession = () => {
    navigation.navigate('HealerPost', {
      patient,
      elapsed,
      severityBefore: 7,
      severityAfter: currentSeverity,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Animated.View style={[styles.timerRing, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
            <Text style={styles.timerLabel}>remaining</Text>
          </Animated.View>
          <View style={styles.headerInfo}>
            <Text style={styles.patientLabel}>Patient #{Math.floor(Math.random() * 9000 + 1000)}</Text>
            <Text style={styles.conditionLabel}>{patient.condition}</Text>
            <View style={styles.severityRow}>
              <Text style={styles.severityLabel}>Current severity:</Text>
              <View style={styles.severityBadge}>
                <Text style={styles.severityValue}>{currentSeverity}/10</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.micButton, micOn && styles.micButtonOn]}
            onPress={() => setMicOn(!micOn)}
            activeOpacity={0.7}
          >
            <Text style={[styles.micIcon, micOn && styles.micIconOn]}>
              {micOn ? '\u{1F3A4}' : '\u{1F507}'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Session Progress & Phase */}
        <View style={styles.phaseBar}>
          {PHASES.map((phase, i) => (
            <View
              key={phase}
              style={[styles.phaseSegment, currentPhase === i && styles.phaseSegmentActive]}
            >
              <Text style={[styles.phaseText, currentPhase === i && styles.phaseTextActive]}>
                {phase}
              </Text>
            </View>
          ))}
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Body Map */}
          <View style={styles.bodyMapCard}>
            <Text style={styles.sectionTitle}>Patient Body Map</Text>
            <View style={styles.bodyMap}>
              <View style={styles.bodyOutline}>
                {BODY_PINS.map((pin) => (
                  <View
                    key={pin.id}
                    style={[
                      styles.bodyPin,
                      { top: pin.top, left: pin.left },
                    ]}
                  >
                    <View style={styles.pinDot}>
                      <Text style={styles.pinSeverity}>{pin.severity}</Text>
                    </View>
                    <Text style={styles.pinLabel}>{pin.label}</Text>
                  </View>
                ))}
                {/* Simple body silhouette */}
                <View style={styles.bodyHead} />
                <View style={styles.bodyTorso} />
                <View style={styles.bodyLegs}>
                  <View style={styles.bodyLeg} />
                  <View style={styles.bodyLeg} />
                </View>
              </View>
            </View>
          </View>

          {/* Technique Tracker */}
          <View style={styles.techniqueCard}>
            <Text style={styles.sectionTitle}>Technique Tracker</Text>
            {activeTechnique && (
              <View style={styles.activeTechDisplay}>
                <View style={styles.activeTechDot} />
                <Text style={styles.activeTechName}>{activeTechnique}</Text>
                <Text style={styles.activeTechTimer}>{formatTime(techniqueTimer)}</Text>
              </View>
            )}
            <View style={styles.techniqueRow}>
              {TECHNIQUES.map((tech) => {
                const isActive = activeTechnique === tech;
                return (
                  <TouchableOpacity
                    key={tech}
                    style={[styles.techButton, isActive && styles.techButtonActive]}
                    onPress={() => handleTechniquePress(tech)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.techButtonText, isActive && styles.techButtonTextActive]}>
                      {tech}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Re-assess Button */}
          <TouchableOpacity
            style={styles.reassessButton}
            onPress={handleReassess}
            activeOpacity={0.7}
          >
            <Text style={styles.reassessText}>Request Re-assessment</Text>
          </TouchableOpacity>

          {/* Chat */}
          <View style={styles.chatCard}>
            <Text style={styles.sectionTitle}>Chat</Text>
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.chatBubble,
                  msg.from === 'healer' ? styles.chatBubbleHealer : styles.chatBubblePatient,
                ]}
              >
                <Text style={styles.chatBubbleText}>{msg.text}</Text>
                <Text style={styles.chatBubbleTime}>{msg.time}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Chat Input */}
        <View style={styles.chatInput}>
          <TextInput
            style={styles.chatTextInput}
            placeholder="Send a message..."
            placeholderTextColor={T.textDim}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.7}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* End Session */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.endButton}
            onPress={handleEndSession}
            activeOpacity={0.8}
          >
            <Text style={styles.endButtonText}>End Session</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    gap: 12,
  },
  timerRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontFamily: fonts.headingBold,
    fontSize: 16,
    color: T.accent,
  },
  timerLabel: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: T.textDim,
    marginTop: -2,
  },
  headerInfo: {
    flex: 1,
  },
  patientLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.textMuted,
  },
  conditionLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
    marginTop: 1,
  },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  severityLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
  },
  severityBadge: {
    backgroundColor: T.warmDim,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  severityValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: T.warm,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonOn: {
    backgroundColor: T.greenDim,
    borderColor: T.green,
  },
  micIcon: {
    fontSize: 20,
  },
  micIconOn: {
    fontSize: 20,
  },
  phaseBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  phaseSegment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
  },
  phaseSegmentActive: {
    backgroundColor: T.accentDim,
    borderColor: T.accent,
  },
  phaseText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: T.textDim,
  },
  phaseTextActive: {
    color: T.accent,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bodyMapCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 18,
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: T.text,
    marginBottom: 12,
  },
  bodyMap: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  bodyOutline: {
    width: 120,
    height: 200,
    position: 'relative',
    alignItems: 'center',
  },
  bodyHead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: T.border,
    marginTop: 4,
  },
  bodyTorso: {
    width: 48,
    height: 70,
    borderWidth: 2,
    borderColor: T.border,
    borderRadius: 8,
    marginTop: 4,
  },
  bodyLegs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  bodyLeg: {
    width: 18,
    height: 60,
    borderWidth: 2,
    borderColor: T.border,
    borderRadius: 6,
  },
  bodyPin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  pinDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.warm,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -14,
  },
  pinSeverity: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  pinLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: T.textMuted,
    marginTop: 2,
  },
  techniqueCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 18,
    marginBottom: 12,
  },
  activeTechDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.accentDim,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
    gap: 8,
  },
  activeTechDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.accent,
  },
  activeTechName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.accent,
    flex: 1,
  },
  activeTechTimer: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.accent,
  },
  techniqueRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  },
  techButtonActive: {
    backgroundColor: T.accent,
    borderColor: T.accent,
  },
  techButtonText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: T.text,
  },
  techButtonTextActive: {
    color: '#FFFFFF',
  },
  reassessButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.warm,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  reassessText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.warm,
  },
  chatCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 18,
    marginBottom: 12,
  },
  chatBubble: {
    maxWidth: '80%',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  chatBubblePatient: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    alignSelf: 'flex-start',
  },
  chatBubbleHealer: {
    backgroundColor: T.accentDim,
    alignSelf: 'flex-end',
  },
  chatBubbleText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    lineHeight: 20,
  },
  chatBubbleTime: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: T.textDim,
    marginTop: 4,
    textAlign: 'right',
  },
  chatInput: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: T.border,
    gap: 8,
  },
  chatTextInput: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 14,
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
  },
  sendButton: {
    backgroundColor: T.accent,
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  sendButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  endButton: {
    backgroundColor: T.danger,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  endButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});
