import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';
import { useApp } from '../../context/AppContext';
import BodyMap from '../../components/shared/BodyMap';
import Slider from '../../components/shared/Slider';
import TimerRing from '../../components/shared/TimerRing';

const SESSION_DURATION = 30 * 60; // 30 minutes in seconds

const PHASES = [
  { name: 'Warm-up', start: 0, end: 5 * 60, color: T.warm },
  { name: 'Active Healing', start: 5 * 60, end: 25 * 60, color: T.accent },
  { name: 'Wind-down', start: 25 * 60, end: 30 * 60, color: T.green },
];

const PROMPT_INTERVAL = 5 * 60; // every 5 min

export default function LiveSessionScreen({ navigation }) {
  const { pins, updatePin, captureFinal } = useApp();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [messages, setMessages] = useState([
    { text: 'Session started. Welcome! Your healer is connecting...', isSystem: true },
  ]);
  const [inputText, setInputText] = useState('');
  const [micOn, setMicOn] = useState(false);
  const [showSeverityPrompt, setShowSeverityPrompt] = useState(false);
  const [currentSeverity, setCurrentSeverity] = useState(5);
  const chatRef = useRef(null);
  const lastPromptRef = useRef(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => {
        const next = prev + 1;
        if (next >= SESSION_DURATION) {
          clearInterval(timer);
          captureFinal();
          navigation.replace('SessionEnd');
          return SESSION_DURATION;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigation, captureFinal]);

  // Periodic severity prompts
  useEffect(() => {
    if (
      secondsElapsed > 0 &&
      secondsElapsed % PROMPT_INTERVAL === 0 &&
      secondsElapsed !== lastPromptRef.current
    ) {
      lastPromptRef.current = secondsElapsed;
      setShowSeverityPrompt(true);
      setMessages((prev) => [
        ...prev,
        { text: 'How are you feeling now? Please rate your current severity.', isSystem: true },
      ]);
    }
  }, [secondsElapsed]);

  const timeLeft = SESSION_DURATION - secondsElapsed;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const currentPhase = PHASES.find(
    (p) => secondsElapsed >= p.start && secondsElapsed < p.end,
  ) || PHASES[2];

  const progress = secondsElapsed / SESSION_DURATION;

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      { text: inputText.trim(), isUser: true },
    ]);
    setInputText('');
    setTimeout(() => {
      chatRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSafetyStop = () => {
    Alert.alert(
      'Safety Stop',
      'Are you sure you want to end this session early? Your progress will be saved.',
      [
        { text: 'Continue Session', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            captureFinal();
            navigation.replace('SessionEnd');
          },
        },
      ],
    );
  };

  const handleSeveritySubmit = () => {
    setShowSeverityPrompt(false);
    setMessages((prev) => [
      ...prev,
      { text: `Current severity: ${currentSeverity}/10`, isUser: true },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {/* Phase indicator */}
        <View style={[styles.phaseBadge, { backgroundColor: currentPhase.color + '18' }]}>
          <View style={[styles.phaseDot, { backgroundColor: currentPhase.color }]} />
          <Text style={[styles.phaseText, { color: currentPhase.color }]}>
            {currentPhase.name}
          </Text>
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <TimerRing progress={progress} size={56} strokeWidth={4} color={T.accent} />
          <View style={styles.timerOverlay}>
            <Text style={styles.timerText}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </Text>
          </View>
        </View>

        {/* Healer info */}
        <View style={styles.healerInfo}>
          <Text style={styles.healerName}>Healer #247</Text>
          <Text style={styles.healerSub}>Verified</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={chatRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Body map */}
          <View style={styles.bodyMapSection}>
            <BodyMap
              pins={pins}
              side="front"
              interactive={false}
              compact
            />
          </View>

          {/* Chat messages */}
          {messages.map((msg, i) => (
            <View
              key={i}
              style={[
                styles.msgBubble,
                msg.isUser
                  ? styles.msgUser
                  : msg.isSystem
                  ? styles.msgSystem
                  : styles.msgHealer,
              ]}
            >
              <Text
                style={[
                  styles.msgText,
                  msg.isUser && styles.msgTextUser,
                ]}
              >
                {msg.text}
              </Text>
            </View>
          ))}

          {/* Severity prompt */}
          {showSeverityPrompt && (
            <View style={styles.severityPrompt}>
              <Text style={styles.severityLabel}>
                Severity: {currentSeverity}/10
              </Text>
              <Slider
                value={currentSeverity}
                onValueChange={setCurrentSeverity}
                minimumValue={0}
                maximumValue={10}
                step={1}
              />
              <TouchableOpacity
                style={styles.severityBtn}
                onPress={handleSeveritySubmit}
              >
                <Text style={styles.severityBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputBar}>
          {/* Mic toggle */}
          <TouchableOpacity
            style={[styles.micBtn, micOn && styles.micBtnOn]}
            onPress={() => setMicOn(!micOn)}
          >
            <Text style={[styles.micIcon, micOn && styles.micIconOn]}>
              {micOn ? 'MIC' : 'MIC'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Send a message..."
            placeholderTextColor={T.textDim}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />

          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Safety stop */}
        <TouchableOpacity
          style={styles.safetyBtn}
          onPress={handleSafetyStop}
          activeOpacity={0.7}
        >
          <Text style={styles.safetyBtnText}>Safety Stop</Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  phaseText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  timerContainer: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontFamily: fonts.headingBold,
    fontSize: 14,
    color: T.text,
  },
  healerInfo: {
    alignItems: 'flex-end',
  },
  healerName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: T.text,
  },
  healerSub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: T.green,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  bodyMapSection: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
  },
  msgBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 8,
  },
  msgUser: {
    alignSelf: 'flex-end',
    backgroundColor: T.accent,
    borderBottomRightRadius: 4,
  },
  msgHealer: {
    alignSelf: 'flex-start',
    backgroundColor: T.accentDim,
    borderBottomLeftRadius: 4,
  },
  msgSystem: {
    alignSelf: 'center',
    backgroundColor: T.warmDim,
    borderRadius: 12,
    maxWidth: '90%',
  },
  msgText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    lineHeight: 20,
  },
  msgTextUser: {
    color: '#FFFFFF',
  },
  severityPrompt: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 8,
  },
  severityLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  severityBtn: {
    backgroundColor: T.accent,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  severityBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  micBtnOn: {
    backgroundColor: T.dangerDim,
    borderColor: T.danger,
  },
  micIcon: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 9,
    color: T.textMuted,
  },
  micIconOn: {
    color: T.danger,
  },
  textInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    backgroundColor: T.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: T.accent,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  safetyBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 20,
  },
  safetyBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: T.danger,
  },
});
